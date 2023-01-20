import { AlertColor } from "@mui/material/Alert/Alert";

interface Task{
    id:string;
    timeOpen:Date;
    timeClose?:Date;
    title:string;
    tags?:string;
}

interface AlertConfig{
    title: string,
    message: string,
    severity: AlertColor,
    color: AlertColor,
    duration:number
}

interface INotif{
    alert:(params: AlertConfig) => void;
    window: (params: number) => void
    finishPomodoro: (params: ICardPomodoroHist) => void

}

interface ICardPomodoroHist{
    id:string;
    startTimestamp:Date;
    endTimestamp:Date;
  }


export type {
    Task,AlertConfig, INotif, ICardPomodoroHist
}