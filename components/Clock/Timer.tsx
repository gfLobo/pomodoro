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
    const [NvalueSec, setNvalueSec] = React.useState(0);
    const [intervals, setIntervals] = React.useState(1);
    const [loops, setLoops] = React.useState(1);
    const [nextInterv, setNextIntrv] = React.useState(0);
    const [NPomodoro, setNPomodoro] = React.useState<ICardPomodoroHist>({
        id: uuidv4(),
        startTimestamp: new Date(),
        endTimestamp: new Date()
    });


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


    function restartLoop(controlled: boolean) {
        const time = new Date();
        time.setSeconds(time.getSeconds() + (NvalueSec * 60));
        restart(time)
        if (controlled) {
            pause()
            setPaused(controlled)

        }


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


        const Mbreak: number = Nrecord * 0.042 < 1 ?
            1
            :
            `${Nrecord * 0.042}`.includes(".") ?
                parseFloat((Nrecord * 0.042).toFixed(1))
                : Nrecord * 0.042;
        const MSBreak = Mbreak * 6000;


        const MBigBreakLoop: number = Nrecord * 0.074 < 2 ?
            2
            :
            `${Nrecord * 0.074}`.includes(".") ?
                parseFloat((Nrecord * 0.074).toFixed(1))
                : Nrecord * 0.074;
        const MSBigBreakLoop = MBigBreakLoop * 12000;

        if (minutes === 0) {


            if (loops > 1) {
                expiryTimestamp.notif({
                    title: "Starting a new loop...",
                    color: "warning",
                    message: `Be prepared!`,
                    severity: "warning",
                    duration: MSBigBreakLoop
                })

                setLoops(loops - 1)
                restartLoop(false)



            } else if(!isPaused){

                expiryTimestamp.notif({
                    title: "A loop has been completed!",
                    color: "success",
                    message: `Take a long break about ${MBigBreakLoop} minutes`,
                    severity: "success",
                    duration: MSBigBreakLoop
                })
                expiryTimestamp.finishPomodoro(NPomodoro)

                pause();
                setPaused(true)
            }


        } else {
            if (parseInt((nextInterv - 1).toFixed(0)) === 0) {



                const delay = (delayInms: number) => {
                    return new Promise(resolve => setTimeout(resolve, delayInms));
                }

                const sample = async () => {
                    pause();
                    await delay(3000);
                    expiryTimestamp.notif({
                        title: `Recommended to a break about ${Mbreak} minutes`,
                        color: "info",
                        message: "Relax, hydrate and do some exercises",
                        severity: "info",
                        duration: MSBreak
                    })
                    resume();
                }
                sample();


            } else {
                setNextIntrv(parseInt((nextInterv - 1).toFixed(0)) )
            }
        }
        expiryTimestamp.window(minutes)
    }


    React.useEffect(mapTimeIntervals, [minutes])


    React.useEffect(() => {
        const time = new Date();

        if (isPaused) {
            time.setSeconds(time.getSeconds() + (NvalueSec * 60));
            restart(time)
            pause()

        }else{
            const Mtime = new Date()
            Mtime.setMinutes(time.getMinutes() + minutes)
            setNPomodoro({ ...NPomodoro,  endTimestamp:   Mtime})

        }
        setNRecord(minutes)
        setNextIntrv((minutes / intervals))
    }, [isPaused])

    React.useEffect(() => {
        pause()
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
                            value={Math.round((100 / 59) * minutes)}
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
                                {minutes}m
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
                            <FormLabel>Loops</FormLabel>
                            <Input
                                startDecorator={<RestartAltIcon />}
                                type="number"
                                defaultValue={loops}
                                value={loops}
                                slotProps={{
                                    input: {
                                        min: 1,
                                        max: 5,
                                    },
                                }}
                                sx={{ width: 80 }}
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                    setLoops(event.target.value as unknown as number)

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
                                        max: 5,
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
                            <IconButton size="sm" color="neutral" onClick={() => {
                                restartLoop(true)
                            }}>
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
                            setNextIntrv((minutes / intervals))
                            setNvalueSec(value)

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