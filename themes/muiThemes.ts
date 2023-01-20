import { ThemeProviderProps } from '@emotion/react';
import colors from '@mui/joy/colors';
import { Theme, ThemedProps } from '@mui/material';
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles';


export const muiTheme: any = extendMuiTheme({

  cssVarPrefix: 'joy',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "rgb(255, 121, 43)",
        },
        secondary: {
          main: "rgb(191, 43, 21)"
        },
        grey: colors.grey,
        error: {
          main: colors.red[500],
        },
        info: {
          main: '#09090D',
          contrastText:'#FFF',
        },
        success: {
          main: colors.green[500],
        },
        warning: {
          main: colors.yellow[200],
        },
        common: {
          white: '#FFF',
          black: '#09090D',

        },
        divider: colors.grey[200],
        text: {
          primary: colors.grey[100],
          secondary: colors.grey[300],
        },
      },
      
    },
    dark: {
      palette: {
        primary: {
          main: '#09090D',
        },
        secondary: {
          main: "rgb(191, 43, 21)"
        },
        grey: colors.grey,
        error: {
          main: colors.red[600],
        },
        info: {
          main: '#09090D',
          contrastText:'#09090D',

        },

        success: {
          main: colors.green[600],
        },
        warning: {
          main: colors.yellow[300],
        },
        common: {
          white: '#FFF',
          black: '#09090D',
        },
        divider: colors.grey[800],
        text: {
          primary: colors.grey[100],
          secondary: colors.grey[300],
        },
      },
    },
  },
  
  components:{
    MuiCircularProgress:{
      styleOverrides:{
        colorPrimary:"red"
      }
    }
  }
});