import { IconButton, SxProps } from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface IProps {
    onClick: () => void
    disabled?: boolean
    sx?: SxProps
    title?: string
}

export function DeliveryIconButton(props: IProps) {
    
    return (
        <IconButton onClick={props.onClick} sx={{ ...props.sx }} title={props.title}>
            <LocalShippingIcon/>
        </IconButton>
    );
}