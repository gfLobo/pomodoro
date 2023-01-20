import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Theme, useTheme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Task } from '../interfaces/globals';
import { v4 as uuidv4 } from 'uuid';
import { Chip } from '@mui/joy';





interface FormTask {
    editNewTask: (task: Task) => void;
}



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}




export default function FormSetupPomodoro(propsTask: FormTask) {

    const [optionTags, setOptionTags] = React.useState([
        { title: "Work" },
        { title: "Study" },
        { title: "Writing" }
    ]);
    const [inputValueTags, setInputValueTags] = React.useState("");

    const [task, setTask] = React.useState<Task>({
        id: uuidv4(),
        timeOpen: new Date(),
        title: '',
        tags: inputValueTags
    });
    const [validate, setValidate] = React.useState(false)








    React.useEffect(() => setTask({ ...task, "id": uuidv4() }), [])

    React.useEffect(() => {
        setTask({ ...task, "id": uuidv4() })
        propsTask.editNewTask(task);
    }, [task])


    React.useEffect(()=>{
        setTask({...task, tags: inputValueTags})
    },[inputValueTags])



    return (
        <Grid container alignContent="end" direction={"column"}
        >
            <TextField
                required
                id="title-field"
                label="Title"
                style={{ width: "100%" }}
                variant={"filled"}
                multiline
                rows={4}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                    setTask({ ...task, "title": event.target.value })
                    setValidate(event.target.value.length === 0)
                }}
                error={validate}
                helperText="Please provide a title."
            />
            <Autocomplete
                options={optionTags}
                noOptionsText="Enter to create a new tag"
                getOptionLabel={(option) => option.title}
                sx={{width:"70%", mt:2}}
                onInputChange={(_:React.SyntheticEvent<Element, Event>, newValue:string) => {
                    setInputValueTags(newValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select"
                        variant="outlined"
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                optionTags.findIndex((o) => o.title === inputValueTags) === -1
                            ) {
                                setOptionTags((o) => o.concat({ title: inputValueTags }));
                            }
                        }}
                    />
                )}
            />


        </Grid>

    );
}