import * as React from 'react';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import { Task } from '../interfaces/globals';
import { Button, Checkbox, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTheme } from '@mui/material/styles';
import { Box, CardOverflow } from '@mui/joy';
import moment from 'moment';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CloseIcon from '@mui/icons-material/Close';


interface ICardTask extends Task {
    onDelete: (id: string) => void;
}



export default function CardTask(props: ICardTask) {
    const theme = useTheme();
    const [state, setState] = React.useState(props.timeClose != undefined);
    const [closedTimestamp, setClosedTimestamp] = React.useState(new Date());

    const [timeSpended, setTimeSpended] = React.useState(moment(closedTimestamp).diff(moment(props.timeOpen), 'minutes'));
    const [timeOpen, setTimeOpen] = React.useState(moment(props.timeOpen).fromNow());

    React.useEffect(()=>{
        setTimeSpended(moment(closedTimestamp).diff(moment(props.timeOpen), 'minutes'))
        setTimeOpen(moment(props.timeOpen).fromNow());
    })

    return (
        <Box sx={{mb:2}}>
            <CardOverflow
                variant="soft"
                sx={{
                    display: 'flex',
                    p: 1,
                    bgcolor: theme.palette.primary.main,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    gap: 1
                }}
            >
                {
                    state ?
                        <Box style={{ display: "flex", gap: 5, width: "100%", marginTop: 5 }}>
                            <WatchLaterIcon sx={{ color: "white" }} />
                            <Typography level="body3" sx={{ fontWeight: 'md', color: theme.palette.common.white }}>
                                {timeSpended} minutes spent
                            </Typography>
                        </Box>
                        :
                        <React.Fragment />
                }

                <Divider orientation="vertical" color='white' flexItem sx={{ borderRightWidth: 3 }} />

                <Box style={{ display: "flex", gap: 5, marginTop: 5, width: "100%" }}
                >
                    <HourglassBottomIcon sx={{ color: "white" }} />
                    <Typography level="body3" sx={{ fontWeight: 'md', color: theme.palette.common.white }}>
                        {timeOpen}
                    </Typography>
                </Box>
                <Divider orientation="vertical" color='white' flexItem sx={{ borderRightWidth: 3 }} />

                <Button startIcon={<CloseIcon />} sx={{ color: "white" }} 
                                    onClick={()=>props.onDelete(props.id)}

                >
                    <Typography level="body5" sx={{ color: theme.palette.common.white }}>
                        Close
                    </Typography>
                </Button>

            </CardOverflow>
            <Card
                variant="outlined"
                row
                sx={{
                    width: "100%",
                    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                    bgcolor: state ? theme.palette.secondary.main : theme.palette.info.contrastText,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0
                }}
            >

                <Checkbox
                    size='medium'
                    icon={<CheckCircleOutlineIcon sx={{ fontSize: 40 }} />}
                    checkedIcon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                        setState(!state)
                        if (checked === true) setClosedTimestamp(new Date())
                    }}
                />
                <div>
                    <Typography sx={{ color: theme.palette.primary.contrastText }} style={{ wordBreak: "break-word" }} >
                        {props.title}
                    </Typography>


                    {props.tags && props.tags.length > 0 ?
                        <Chip
                            variant="solid"
                            size="sm"
                            sx={{ pointerEvents: 'none', bgcolor: theme.palette.primary.main }}
                        >
                            {props.tags}
                        </Chip>
                        :
                        <></>
                    }

                </div>
            </Card>
        </Box>

    );
}