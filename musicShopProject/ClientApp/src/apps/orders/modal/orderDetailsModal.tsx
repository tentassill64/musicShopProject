import { Box, Modal, Typography, Grid, Chip } from "@mui/material";
import { Order } from "../../../domain/orders/order";
import { AsyncModalProps } from "../../../sharedComponents/modal/asyncModal/asyncModal";
import { OrderState } from "../../../domain/orders/enum/orderState";

export interface OrderDetailsModalProps {
    order: Order
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    color: 'black',
    p: 4,
};

export function OrderDetailsModal(props: OrderDetailsModalProps & AsyncModalProps) {
    const { order } = props;

    function getDisplayChip(state: OrderState) {
        switch(state) {
            case OrderState.Ordered: return <Chip label={OrderState.getDisplayName(state)} color="primary"/>
            case OrderState.Canceled: return <Chip label={OrderState.getDisplayName(state)} color="error"/>
            case OrderState.OnDelivery: return <Chip label={OrderState.getDisplayName(state)} color="default"/>
            case OrderState.Completed: return <Chip label={OrderState.getDisplayName(state)} color="success"/>
        }
    }

    return (
        <Modal open
               onClose={() => props.onClose()}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Заказ № {order.orderNumber}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Статус: {getDisplayChip(order.state)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Дата создания: {order.createdDateTimeUtc.toLocaleString()}</Typography>
                    </Grid>
                    {order.completedDateTimeUtc && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Дата завершения: {order.completedDateTimeUtc.toLocaleString()}</Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Цена: {order.price}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Телефон клиента: {order.clientPhoneNumber}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Товары в заказе:</Typography>
                        {order.orderItems.map(item => (
                            <Box key={item.id} sx={{ mb: 2 }}>
                                <Typography variant="body1">{item.product.name}</Typography>
                                <Typography variant="body2">Цена: {item.productPrice}</Typography>
                                <Typography variant="body2">Количество: {item.product.quantity}</Typography>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}
