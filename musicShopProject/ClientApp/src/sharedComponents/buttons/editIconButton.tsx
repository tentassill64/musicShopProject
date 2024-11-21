import { IconButton, SxProps } from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Edit } from "@mui/icons-material";

interface IProps {
    onClick: () => void
    disabled?: boolean
    sx?: SxProps
    title?: string
}

export function EditIconButton(props: IProps) {
    
    return (
        <IconButton onClick={props.onClick} sx={{ ...props.sx }} title={props.title}>
            <Edit/>
        </IconButton>
    );
}