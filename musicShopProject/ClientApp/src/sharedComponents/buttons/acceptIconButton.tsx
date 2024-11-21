import { IconButton, SxProps } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

interface IProps {
    onClick: () => void
    disabled?: boolean
    sx?: SxProps
    title?: string
}

export function AcceptIconButton(props: IProps) {
    
    return (
        <IconButton onClick={props.onClick} sx={{ ...props.sx }} title={props.title}>
            <CheckIcon/>
        </IconButton>
    );
}