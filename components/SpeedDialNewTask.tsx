import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
import FormSetupPomodoro from './FormSetupPomodoro';
import { Collapse, Grid, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Task } from '../interfaces/globals';
import CardTask from './CardTask';
import { useTheme } from '@mui/material/styles';




interface ITask {
    searchTask: string
}




export default function SpeedDialNewTask(searchTask: ITask) {
    const [open, setOpen] = React.useState(false);
    const [toDoTasks, setToDoTasks] = React.useState<Array<Task>>([])
    const handleOpen = () => setOpen(!open);
    const theme = useTheme();
    const [Ntask, setNTask] = React.useState<Task>({
        id: '',
        timeOpen: new Date(),
        title: '',
        tags: undefined
    });


    function openNewTask() {
        if (Ntask.title.length > 0)
            setToDoTasks([...toDoTasks, Ntask])
    }


    const actions = [
        { icon: <CloseIcon sx={{ color: "white", fontSize: 28 }} />, name: 'Close', action: handleOpen, color: "white" },
        { icon: <SaveIcon sx={{ color: "white", fontSize: 28 }} />, name: 'Save', action: openNewTask, color: 'lightgreen' },
    ];

    function removeTask(taskID: string) {
        setToDoTasks(toDoTasks.filter((task: Task) => task.id != taskID))
    }

    return (
        <React.Fragment>

            <Box sx={{ transform: 'translateZ(0px)', mb: open ? 15 : 5 }}>

                <Collapse in={open} >
                    <FormSetupPomodoro editNewTask={(task: Task) => {
                        setNTask({ ...task, timeOpen: new Date() })
                    }} />
                </Collapse>
                <Grid
                    container
                    justifyContent="flex-end"
                >
                    <Grid item>
                        <Tooltip title={open ? '' : 'New Pomodoro'}>
                            <SpeedDial
                                aria-label="New Task" onClick={!open ? handleOpen : () => { }}
                                open={open} ariaLabel={'btn-new-task'}
                                icon={<AddIcon sx={{ color: "white", fontSize: 50 }} />}
                                direction={"left"}
                                hidden={open}
                                sx={{
                                    "& .MuiButtonBase-root": {
                                        bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main,
                                        ":hover":{
                                            bgcolor: theme.palette.mode === 'light' ? theme.palette.secondary.main : theme.palette.primary.main,

                                        }
                                    },
                                }}

                            >
                                {actions.map((action) => (
                                    <SpeedDialAction
                                        key={action.name}
                                        icon={action.icon}
                                        tooltipTitle={action.name}
                                        onClick={action.action}
                                    />
                                ))}
                            </SpeedDial>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Box>
            <Box >
                {searchTask.searchTask === '' || searchTask.searchTask === 'All tasks' ? toDoTasks.map((task: Task) => {
                    return (
                        <CardTask
                            onDelete={removeTask}
                            id={task.id} timeOpen={task.timeOpen}
                            title={task.title}
                            tags={task.tags}
                            key={task.id}
                        />
                    );
                })
                    :
                    toDoTasks.filter((task: Task) =>
                        task.tags?.toLowerCase()?.match(searchTask.searchTask.toLowerCase()) || task.title?.toLowerCase()?.match(searchTask.searchTask.toLowerCase())
                    ).map((task: Task) => {
                        return (
                            <CardTask
                                onDelete={removeTask}
                                id={task.id} timeOpen={task.timeOpen}
                                title={task.title}
                                tags={task.tags}
                                key={task.id}
                            />
                        );
                    })
                }
            </Box>

        </React.Fragment>
    );
}