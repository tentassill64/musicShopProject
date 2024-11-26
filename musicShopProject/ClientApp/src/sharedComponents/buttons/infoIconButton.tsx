import { IconButton, SxProps } from "@mui/material";
import { Info } from "@mui/icons-material";

interface IProps {
    onClick: () => void
    disabled?: boolean
    sx?: SxProps
    title?: string
}

export function InfoIconButton(props: IProps) {
    
    return (
        <IconButton onClick={props.onClick} sx={{ ...props.sx }} title={props.title}>
            <Info/>
        </IconButton>
    );
}