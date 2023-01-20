import Head from 'next/head'
import * as React from 'react';
import CssBaseline from '@mui/joy/CssBaseline';
import { deepmerge } from '@mui/utils';
import {
  extendTheme as extendJoyTheme,
  CssVarsProvider,
} from '@mui/joy/styles';
import DrawerX from '../components/Drawer';
import { muiTheme } from '../themes/muiThemes';
import { AlertConfig, ICardPomodoroHist } from '../interfaces/globals';
import { Snackbar, Alert, AlertTitle } from '@mui/material';



const joyTheme = extendJoyTheme();

// You can use your own `deepmerge` function.
// joyTheme will deeply merge to muiTheme.
const theme = deepmerge(muiTheme, joyTheme);








export default function Home() {
  const [openSnack, setOpenSnack] = React.useState(false);
  const [currentMinutes, setCurrentMinutes] = React.useState(0);

  const [alertNotif, setAlertNotif] = React.useState<AlertConfig>({
    title: 'Info',
    message: 'Loading...',
    severity: 'info',
    color: 'info',
    duration:6000 // default 1 minute of rest

  });
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    } else {
      setOpenSnack(!openSnack);
    }
  };
  return (
    <React.Fragment>
      <Head>
        <title>({currentMinutes}m) - Pomodoro</title>
        <meta name="description" content="Pomodoro is a scheduling app for organize your time, notes and ideas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/flaticon.png" />
      </Head>

      <CssVarsProvider disableTransitionOnChange theme={theme}>
        <CssBaseline />
        <main>

          <DrawerX alert={function (params: AlertConfig): void {
            setAlertNotif(params);
            setOpenSnack(true);
          } } window={function (params: number): void {
            setCurrentMinutes(params);
          } } finishPomodoro={function (params: ICardPomodoroHist): void {
            
          } } />
          <Snackbar
            autoHideDuration={alertNotif.duration}
            onClose={handleClose}
            open={openSnack}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Alert variant="filled" severity={alertNotif.severity} color={alertNotif.color}>
              <AlertTitle>{alertNotif.title}</AlertTitle>
              {alertNotif.message}
            </Alert>
          </Snackbar>
        </main>

      </CssVarsProvider>

    </React.Fragment>
  )
}
