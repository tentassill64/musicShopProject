import React, { PropsWithChildren } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, SxProps, Theme } from '@mui/material';
import { ShoppingCart, Menu } from '@mui/icons-material';
import icon from './assets/icon.png';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';

interface IProps {
    sx?: SxProps<Theme>
}

export function HeaderAndFooter(props: IProps & PropsWithChildren) {


    return (<Box>
        <AppBar sx={{backgroundColor: '#d84dff'}} position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>
                <Box
                    component="img"
                    src={icon}
                    sx={{ width: '50px', height: '50px', marginRight: '10px' }}
                    alt="icon"
                />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Интернет магазин "TentaMusicShop"
                </Typography>
                <IconButton color="inherit">
                    <ShoppingCart />
                </IconButton>
                <IconButton color="inherit">
                    <PersonIcon />
                </IconButton>
            </Toolbar>
        </AppBar>

        <Box>
        {props.children}
    </Box>

    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
            TentaMusicShop
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
            Ваш универсальный магазин для всех товаров, связанных с музыкой.
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                {'Copyright © '}
                <Link color="inherit" to={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}>
                    Tenta Music Shop
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    </Box>
    );
}