import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import FlagIcon from '@mui/icons-material/Flag';
import moment from 'moment';
import { ICardPomodoroHist } from '../../../interfaces/globals';




export default function CardPomodoroHistory(props: ICardPomodoroHist) {
  const theme = useTheme();

  return (
    <Card sx={{mb:2}}>
      <CardContent sx={{ display: 'flex', alignItems:"center", alignContent:"center"  }}>
        <Box sx={{ display: 'flex' }} >
          <PlayCircleFilledIcon sx={{mr:2, color: theme.palette.mode === "light" ? theme.palette.primary.main : theme.palette.secondary.main}}/>
          <Typography variant="caption">
            Started at {props.startTimestamp.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', ml: 10 }} >
          <FlagIcon sx={{mr:2, color: theme.palette.mode === "light" ? theme.palette.primary.main : theme.palette.secondary.main}}/>
          <Typography variant="caption" >
            Ended at  {props.endTimestamp.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}