import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid, Chip, Divider } from "@mui/material";
import { OrderProvider } from "../../domain/orders/orderProvider";
import { Order } from "../../domain/orders/order";
import { CPagination } from "../../sharedComponents/pagination/cPagination";
import { OrderState } from "../../domain/orders/enum/orderState";
import { format } from "date-fns";
import { CancelIconButton } from "../../sharedComponents/buttons/cancelIconButton";
import { AcceptIconButton } from "../../sharedComponents/buttons/acceptIconButton";
import { DeliveryIconButton } from "../../sharedComponents/buttons/deliveryIconButton";
import { useNotifications } from "@toolpad/core";
import useAsyncModal from "../../sharedComponents/modal/asyncModal/asyncModal";
import { OrderDetailsModal, OrderDetailsModalProps } from "./modal/orderDetailsModal";
import { InfoIconButton } from "../../sharedComponents/buttons/infoIconButton";

export function OrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(15);
    const [totalRows, setTotalRows] = useState<number>(0);

    const notification = useNotifications();

    const showOrderDetailModal = useAsyncModal<OrderDetailsModalProps>(OrderDetailsModal);

    useEffect(() => {
        loadOrders(page, pageSize);
    }, []);

    async function loadOrders(page: number, pageSize: number) {
        const pagedResult = await OrderProvider.getOrderPage(page, pageSize);

        const orders = pagedResult.values;
        const totalRows = pagedResult.totalRows;
        
        setOrders(orders);
        setTotalRows(totalRows);
    }

    function getDisplayChip(state: OrderState) {
        switch(state) {
            case OrderState.Ordered: return <Chip label={OrderState.getDisplayName(state)} color="primary"/>
            case OrderState.Canceled: return <Chip label={OrderState.getDisplayName(state)} color="error"/>
            case OrderState.OnDelivery: return <Chip label={OrderState.getDisplayName(state)} color="default"/>
            case OrderState.Completed: return <Chip label={OrderState.getDisplayName(state)} color="success"/>
        }
    }

    function changePageSize(newPageSize: number) {
        if(newPageSize == pageSize) return;

        setPageSize(newPageSize);

        loadOrders(1, newPageSize);
    }

    async function deliveryOrder(orderId: string) {
        const response = await OrderProvider.changeState(OrderState.Completed, orderId);

        if(response.isSuccess) {
            notification.show("Успешно", {
            severity: 'success'
        });
        }

        else {
            notification.show(response.errorsString, {
            severity: 'success'
        });
        }
        
        loadOrders(page, pageSize);
    }

    function renderOrderButtons(state: OrderState, order: Order) {
        switch(state) {
            case OrderState.Ordered: return (
                <Box>
                    <InfoIconButton title="Информация" onClick={async () => await showOrderDetailModal({order})}/>
                    <CancelIconButton title="Отменить заказ" onClick={() => cancelOrder(order.id)}/>
                    <AcceptIconButton title="Подтвердить заказ" onClick={() => acceptOrder(order.id)}/>
                </Box>
            );
            case OrderState.Canceled: return (<Box>
                <InfoIconButton title="Информация" onClick={async () => await showOrderDetailModal({order})}/>
                </Box>)
            case OrderState.OnDelivery: return (<Box>
                <InfoIconButton title="Информация" onClick={async () => await showOrderDetailModal({order})}/>
                <DeliveryIconButton title="Доставить заказ" onClick={() => deliveryOrder(order.id)}/>
            </Box>)
            case OrderState.Completed: return (<Box>
                <InfoIconButton title="Информация" onClick={async () => await showOrderDetailModal({order})}/>
            </Box>)
        }
    }

    function changePage(newPage: number) {
        if(newPage == pageSize) return;

        setPage(newPage);

        loadOrders(newPage, pageSize);
    }

    async function acceptOrder(orderId: string) {
        const response = await OrderProvider.changeState(OrderState.OnDelivery, orderId);

        if(response.isSuccess) {
            notification.show("Успешно", {
            severity: 'success'
        });
        }

        else {
            notification.show(response.errorsString, {
            severity: 'success'
        });
        }
        
        loadOrders(page, pageSize);
    }

    async function cancelOrder(orderId: string) {
        const response = await OrderProvider.changeState(OrderState.Canceled, orderId);

        if(response.isSuccess) {
            notification.show("Успешно", {
            severity: 'success'
        });
        }

        else {
            notification.show(response.errorsString, {
            severity: 'success'
        });
        }
        
        loadOrders(page, pageSize);

    }

    return (
        <Box>
            <Typography variant="h4" ml={2} mt={2}>
                Заказы
            </Typography>
            <Divider/>
            <Box>
            <CPagination pageSizeOptions={[15,50,100]}
                         pageSize={pageSize}
                         page={page}
                         totalRows={totalRows}
                         onChangePageSize={changePageSize}
                         showTotalRows
                         onChange={changePage}/>
            </Box>
        <Box>

           {orders.length > 0 && <Grid container spacing={2}>
                {orders.map((order) => (
                    <Grid item xs={12} sm={6} md={4} key={order.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{display: 'flex'}} justifyContent={'space-between'}>
                                    <Typography variant="h5" component="div">
                                        № Заказа: {order.orderNumber}
                                    </Typography>
                                    {renderOrderButtons(order.state, order)}
                                </Box>
                                <Typography variant="body2">
                                    Стоимость заказа: {order.price} ₽
                                </Typography>
                                <Typography variant="body2">
                                    Номер телефона клиента: {order.clientPhoneNumber}
                                </Typography>
                                <Typography variant="body2">
                                    Эл. почта клиента: {order.client.email}
                                </Typography>
                                <Typography variant="body2">
                                    Адрес доставки: {order.address.city}, {order.address.street}, {order.address.home}, {order.address.apartment}
                                </Typography>
                                <Typography variant="body2">
                                    Время заказа: {format(order.createdDateTimeUtc, "dd.MM.yyyy")}
                                </Typography>
                                <Typography variant="body2">
                                    Статус заказа: {getDisplayChip(order.state)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid> }

            {orders.length == 0 && <Box>
                <Typography variant="h5">
                    Заказов еще нет
                </Typography>
             </Box>}
        </Box>
        </Box>
    );
}
