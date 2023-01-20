import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { getInitColorSchemeScript, useTheme } from '@mui/joy/styles';
import ColorSchemeToggle from './ThemeButton';
import { Avatar, Grid } from '@mui/material';


interface ISearch{
    search:(input:string)=>void;
}




const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('lg')]: {
        width: 'auto',
    },
    marginLeft: 20
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function SearchAppBar(SearchInputValue:ISearch) {
    const theme = useTheme();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <nav >
                <Toolbar >
                    
                    <Grid container spacing={{ xs: 0, md: 2,  }} sx={{p:1}} >
                        <Grid item  key={"logo-icon"}>
                            <Avatar alt="logo" src='/icon.png'/>
                        </Grid>
                        <Grid item  key={"logo"}>
                            <Typography sx={{ mt: 1, fontWeight:400, color:theme.palette.common.white }} variant="h6" component="div">Pomodoro</Typography>
                        </Grid>
                    </Grid>
                    <ColorSchemeToggle />
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                SearchInputValue.search(event.target.value)
                            }}
                        />
                    </Search>
                </Toolbar>
            </nav>

        </Box>
    );
}