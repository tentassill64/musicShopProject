import { IconButton, SxProps } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

interface IProps {
    onClick: () => void
    disabled?: boolean
    sx?: SxProps
    title?: string
}

export function CancelIconButton(props: IProps) {
    
    return (
        <IconButton onClick={props.onClick} sx={{ ...props.sx }} title={props.title}>
            <CancelIcon/>
        </IconButton>
    );
}