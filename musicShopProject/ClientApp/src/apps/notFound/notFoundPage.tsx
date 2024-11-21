import { Box, Typography } from "@mui/material";
import { BackButton } from "../../sharedComponents/buttons/backButton";


export function NotFoundPage() {
    return (
        <Box fontFamily={"monospace"} textAlign={'center'}>
          <Typography fontSize={32} component={'h1'} >404 - Страница не найдена</Typography>
          <p>Страница, которую вы ищете, не существует.</p>
          <BackButton/>
        </Box>
      );
}