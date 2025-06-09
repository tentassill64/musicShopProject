import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";


export function HomePage() {

    return (
        <Box mt={2}>
            <Box margin={'auto 0'}>
            <Typography fontFamily={"monospace"} fontSize={40} align="center"> 
                Добро пожаловать в систему Владислав Михеев!
            </Typography>
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