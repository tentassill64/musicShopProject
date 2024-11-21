import { Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";

export function BackButton() {

    const navigate = useNavigate();

    return (
        <Button title="Назад"
        color="error" 
        endIcon={<ArrowBackIcon/>} 
        variant="contained"
        onClick={() => navigate("/home")}>Назад</Button>
    );

}