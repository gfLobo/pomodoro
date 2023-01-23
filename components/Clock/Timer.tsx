import { CircularProgress, FormLabel, Input, Typography } from '@mui/joy';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { TimerSettings, useTimer } from 'react-timer-hook';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/joy/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AspectRatio from '@mui/joy/AspectRatio';
import CardCover from '@mui/joy/CardCover';
import RestoreIcon from '@mui/icons-material/Restore';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Slider } from '@mui/material';
import { AlertConfig, ICardPomodoroHist, INotif } from '../../interfaces/globals';
import { v4 as uuidv4 } from 'uuid';


interface ITimer {
    expiryTimestamp: TimerSettings;
    notif: (params: AlertConfig) => void
    window: (params: number) => void
    finishPomodoro: (params: ICardPomodoroHist) => void
}





export default function Timer(notif: INotif) {

    const time = new Date();
    const timerConfig = 1500;// 25 minutes timer default
    const expiryTimestampConfig = {
        autoStart: false,
        expiryTimestamp: time,
        onExpire: () => { }
    };

    time.setSeconds(time.getSeconds() + timerConfig);
    return (
        <div >
            <MyTimer expiryTimestamp={expiryTimestampConfig} notif={function (params: AlertConfig) {
                notif.alert(params);
            }} window={function (params: number): void {
                notif.window(params);
            }} finishPomodoro={function (params: ICardPomodoroHist): void {
                notif.finishPomodoro(params)
            }} />
        </div>
    );
}








function MyTimer(expiryTimestamp: ITimer) {
    const theme = useTheme();
    var {
        minutes,
        pause,
        resume,
        restart,
    } = useTimer(expiryTimestamp.expiryTimestamp);

    const [isPaused, setPaused] = React.useState(true);
    const [bgTimer, setBgTimer] = React.useState<Array<string>>([
        "/icon.png",
        "https://images.unsplash.com/photo-1624821588855-a3ffb0b050ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1635843130996-68824252660d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1607863680051-d7a0dbaec74a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    ])
    const [currentBg, setCurrentBg] = React.useState<number>(0);
    const [Nrecord, setNRecord] = React.useState(0);
    const [Mrecord, setMRecord] = React.useState(0);
    const [NvalueSec, setNvalueSec] = React.useState(0);
    const [intervals, setIntervals] = React.useState(1);
    const [pomodoro, setPomodoro] = React.useState(4 + 1);
    const [nextInterv, setNextIntrv] = React.useState(0);
    const [NPomodoro, setNPomodoro] = React.useState<ICardPomodoroHist>({
        id: uuidv4(),
        startTimestamp: new Date(),
        endTimestamp: new Date()
    });


    const Mbreak: number = (Nrecord * pomodoro) * 0.042 < 1 ?
        1
        :
        `${(Nrecord * pomodoro) * 0.042}`.includes(".") ?
            parseFloat(((Nrecord * pomodoro) * 0.042).toFixed(1))
            : (Nrecord * pomodoro) * 0.042;
    const MSBreak = (Math.round(Mbreak) + 1) * 60000;


    const MBigBreakLoop: number = (Nrecord * pomodoro) * 0.25 < 2 ?
        2
        :
        `${(Nrecord * pomodoro) * 0.25}`.includes(".") ?
            parseFloat(((Nrecord * pomodoro) * 0.25).toFixed(1))
            : (Nrecord * pomodoro) * 0.25;
    const MSBigBreakLoop = (MBigBreakLoop > 2 ? MBigBreakLoop + 5 : MBigBreakLoop) * 60000;


    let intervalID: any;









    //functions
    function slideBg(dir: string) {
        if (dir === "back") {
            if (currentBg <= 0) {
                setCurrentBg(bgTimer.length - 1)
            } else {
                setCurrentBg(currentBg - 1)
            }
        } else {
            if (currentBg + 1 >= bgTimer.length) {
                setCurrentBg(0)
            } else {
                setCurrentBg(currentBg + 1)
            }
        }
    }


    function restartLoop() {
        const time = new Date();
        time.setSeconds(time.getSeconds() + (NvalueSec * 60));
        restart(time)
        pause()
        setPaused(true)
    }


    const handleImagePic = (e: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setBgTimer([...bgTimer, reader.result as string]);
                setCurrentBg(bgTimer.length)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    function mapTimeIntervals() {

        expiryTimestamp.window(minutes)
        setNRecord(minutes)
        setMRecord(minutes)

        

        if (minutes === 0 && !isPaused) {

           

            if (pomodoro > 1) {
                setPomodoro(pomodoro - 1)

            }else{
                expiryTimestamp.notif({
                    title: "A session has been completed!",
                    color: "success",
                    message: `Take a long break about ${(MBigBreakLoop > 2 ? MBigBreakLoop + 5 : MBigBreakLoop)} minutes`,
                    severity: "success",
                    duration: MSBigBreakLoop
                })
                restartLoop()
                expiryTimestamp.finishPomodoro(NPomodoro)
    
            }
        }


        if (nextInterv - 1 != 0) {
            setNextIntrv(parseInt((Math.round(nextInterv - 1)).toFixed(0)))
        } else if (pomodoro - 1 != 0) {
            pause();
            expiryTimestamp.notif({
                title: "Taking a break",
                color: "warning",
                message: `A small break for ${MSBreak / 60000} minutes`,
                severity: "info",
                duration: MSBreak
            })
            if (minutes != 0 && Nrecord + 1 <= minutes) {
                setNextIntrv(Nrecord + 1)

            } else {
                restartLoop();
            }

            intervalID = setInterval(() => {
                setPaused(false)
                resume();
                clearInterval(intervalID);
            }, MSBreak);
        } 


    }


    React.useEffect(mapTimeIntervals, [minutes])

    React.useEffect(() => {
        const time = new Date();

        if (isPaused) {
            time.setSeconds(time.getSeconds() + (NvalueSec * 60));
            restart(time)
            pause()

        } else {
            const Mtime = new Date()
            Mtime.setMinutes(time.getMinutes() + minutes)
            setNPomodoro({ ...NPomodoro, endTimestamp: Mtime })

        }
        setNRecord(minutes)
        setNextIntrv(minutes / intervals)
    }, [isPaused])

    React.useEffect(() => {
        resume();
        pause();
    }, []);

    return (
        <Card
            sx={{
                width: "100%",
                bgcolor: 'initial',
                boxShadow: 'none',

                '&:hover, &:focus-within': {
                    boxShadow: '0px 0px 10px 8px rgba(0,0,0,0.2)',
                },
                '--Card-padding': '0px',
                borderRadius: 5,

            }}
        >



            <Box sx={{ position: 'relative' }}>
                <AspectRatio ratio="5/2" >
                    <figure >

                        <CircularProgress
                            determinate
                            value={Math.round((100 / 59) * Nrecord)}
                            sx={{
                                "--CircularProgress-size": { sm: "15rem", xs: '7rem' },
                                "--CircularProgress-track-thickness": "8px",
                                "--CircularProgress-progress-thickness": { sm: "12px", xs: '0.5rem' },
                                "--CircularProgress-progress-color": theme.palette.secondary.main,
                                "--CircularProgress-track-color": "transparent",
                                display: "flex",
                                bgcolor: "rgba(0, 0, 0, 0.3)",
                                background: "rgba(255, 255, 255, 0.18)",
                                borderRadius: "100%",
                                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                                textShadow: "0px 0px 9px rgba(0,0,0,0.5)",
                                backdropFilter: "blur(8px)",
                                "WebkitBackdropFilter": " blur(8px)",
                            }}
                        >
                            <Box
                                sx={{ typography: { sm: 'h1', xs: 'h3' } }}
                                style={{ color: theme.palette.secondary.main }}
                            >
                                {Nrecord}m
                                <Typography
                                    sx={{ typography: { sm: 'body1', xs: 'caption' } }}
                                    style={{ color: theme.palette.info.main }}
                                >
                                    Break in {parseFloat((nextInterv).toFixed(0).replace("-", ""))}m
                                </Typography>
                            </Box>

                        </CircularProgress>
                    </figure>
                    <img
                        src={bgTimer[currentBg]}
                        srcSet={bgTimer[currentBg]}
                        loading="lazy"
                        alt=""
                        style={{ width: "100%" }}
                    />
                </AspectRatio>
                <CardCover
                    className="gradient-cover"
                    sx={{
                        '&:hover, &:focus-within': {
                            opacity: 1,
                        },
                        opacity: 0,
                        transition: '0.1s ease-in',
                        background:
                            'linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)',
                    }}
                >
                    <Box>

                        <Box sx={{ ml: 2 }}>
                            <FormLabel>Pomodoros</FormLabel>
                            <Input
                                startDecorator={<RestartAltIcon />}
                                type="number"
                                defaultValue={pomodoro}
                                value={pomodoro}
                                slotProps={{
                                    input: {
                                        min: 1,
                                    },
                                }}
                                sx={{ width: 80 }}
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                    setPomodoro(event.target.value as unknown as number)

                                }}
                            />
                            <FormLabel>Intervals</FormLabel>
                            <Input
                                startDecorator={<TimelapseIcon />}
                                type="number"
                                defaultValue={1}
                                slotProps={{
                                    input: {
                                        min: 1,
                                        max: 6,
                                    },
                                }}
                                sx={{ width: 80 }}
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                    setIntervals(event.target.value as unknown as number)
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                flexGrow: 1,
                                alignSelf: 'flex-end',
                            }}
                        >

                            <IconButton size="sm" color="neutral" sx={{ ml: 'auto' }} onClick={() => {
                                setNPomodoro({ ...NPomodoro, id: uuidv4() })

                                if (isPaused) {
                                    resume();
                                    setNPomodoro({ ...NPomodoro, startTimestamp: new Date() })

                                } else {
                                    pause();
                                }
                                setPaused(!isPaused)

                            }}>
                                {isPaused ? <PlayCircleIcon sx={{ fontSize: "150%" }} /> : <PauseIcon sx={{ fontSize: "150%" }} />}
                            </IconButton>
                            <IconButton size="sm" color="neutral" onClick={restartLoop}>
                                <RestoreIcon sx={{ fontSize: "150%" }} />
                            </IconButton>
                        </Box>
                    </Box>
                </CardCover>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, alignItems: 'center', p: 2 }}>
                <Box sx={{ width: "80%" }}>
                    <Slider
                        aria-label="set-minutes"
                        defaultValue={minutes}
                        valueLabelDisplay="auto"
                        max={59}
                        min={1}
                        sx={{
                            color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main,
                        }}
                        onChange={(event, value: any, active) => {
                            const time = new Date();
                            time.setSeconds(time.getSeconds() + value * 60);
                            restart(time)
                            pause()
                            setPaused(true)
                            setNextIntrv(Mrecord / intervals)
                            setNvalueSec(value)
                            setMRecord(minutes)
                        }}
                    />
                </Box>
                <IconButton variant="solid"
                    sx={{
                        fontWeight: 'md',
                        ml: 'auto',
                        bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main,
                        ":hover": {
                            bgcolor: theme.palette.mode === 'light' ? theme.palette.secondary.main : theme.palette.primary.main,
                        }
                    }}
                    onClick={() => slideBg("back")}
                >
                    <NavigateBeforeIcon />
                </IconButton>
                <IconButton variant="solid"
                    sx={{
                        fontWeight: 'md',
                        bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main,
                        ":hover": {
                            bgcolor: theme.palette.mode === 'light' ? theme.palette.secondary.main : theme.palette.primary.main,
                        }
                    }}
                    component="label"
                >
                    <AddAPhotoIcon />
                    <input hidden accept="image/*" multiple type="file" onChange={handleImagePic} />

                </IconButton>
                <IconButton variant="solid"
                    sx={{
                        fontWeight: 'md',
                        bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main,
                        ":hover": {
                            bgcolor: theme.palette.mode === 'light' ? theme.palette.secondary.main : theme.palette.primary.main,
                        }
                    }}

                    onClick={() => slideBg("next")}
                >
                    <NavigateNextIcon />
                </IconButton>
            </Box>
        </Card >
    );
}