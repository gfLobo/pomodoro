import { Box, Typography } from "@mui/material";
import * as React from "react";
import { ICardPomodoroHist } from "../../interfaces/globals";
import CardPomodoroHistory from "./PomodorosHistory/CardPomodoroHistory";

interface ListHistPomodoros{
    list:Array<ICardPomodoroHist>
}


export default function PomodorosList(props:ListHistPomodoros) {
    return (
        <Box sx={{
            mt: 3,
            visibility: { sm: props.list.length > 0 ? "visible" : "hidden", xs: "hidden" },
            height:{ sm: "auto", xs: 0 },
        }}>
            <Typography sx={{ textAlign: "center", mb:1, mt:3 }} variant="h6">Last Sessions</Typography>
            {props.list.map(({endTimestamp, startTimestamp, id}:ICardPomodoroHist, index:number)=>{
                return (
                    <CardPomodoroHistory startTimestamp={startTimestamp} endTimestamp={endTimestamp} key={index} id={id} />
                )
            })}
        </Box>
    )
}