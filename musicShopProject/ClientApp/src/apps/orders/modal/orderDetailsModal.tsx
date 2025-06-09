import { 
  Box, 
  Modal, 
  Typography, 
  Grid, 
  Chip, 
  Tabs, 
  Tab, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider,
  Avatar,
  Stack,
  styled
} from "@mui/material";
import { Order } from "../../../domain/orders/order";
import { AsyncModalProps } from "../../../sharedComponents/modal/asyncModal/asyncModal";
import { OrderState } from "../../../domain/orders/enum/orderState";
import React from "react";
import { formatDate } from "date-fns";

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1200,
  maxHeight: '90vh',
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius,
  p: 4,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.4em'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#ffffff',
    borderRadius: '4px'
  }
}));

const ProductImage = styled(Avatar)({
  width: 60,
  height: 60,
  marginRight: 2,
  objectFit: 'cover'
});

const StatusChip = styled(Chip)({
  fontWeight: 'bold',
  fontSize: '0.875rem'
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `order-tab-${index}`,
    'aria-controls': `order-tabpanel-${index}`,
  };
}

export interface OrderDetailsModalProps {
  order: Order
}

export function OrderDetailsModal(props: OrderDetailsModalProps & AsyncModalProps) {
  const { order } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function getDisplayChip(state: OrderState) {
    switch(state) {
      case OrderState.Ordered: return <StatusChip label={OrderState.getDisplayName(state)} color="primary" variant="outlined"/>
      case OrderState.Canceled: return <StatusChip label={OrderState.getDisplayName(state)} color="error" variant="outlined"/>
      case OrderState.OnDelivery: return <StatusChip label={OrderState.getDisplayName(state)} color="warning" variant="outlined"/>
      case OrderState.Completed: return <StatusChip label={OrderState.getDisplayName(state)} color="success" variant="outlined"/>
      default: return <StatusChip label={OrderState.getDisplayName(state)} color="default" variant="outlined"/>
    }
  }

  return (
    <Modal
      open
      onClose={() => props.onClose()}
      aria-labelledby="order-details-modal"
    >
      <StyledModalBox sx={{backgroundColor: "white"}}>
        <Typography variant="h5" component="h2" gutterBottom>
          Заказ №{order.orderNumber}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              Дата создания: {formatDate(order.createdDateTimeUtc, "Pp")}
            </Typography>
            {order.completedDateTimeUtc && (
              <Typography variant="subtitle1" color="text.secondary">
                Дата завершения: {formatDate(order.completedDateTimeUtc, "Pp")}
              </Typography>
            )}
          </Box>
          <Box>
            {getDisplayChip(order.state)}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="order details tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Товары" {...a11yProps(0)} />
              <Tab label="Информация" {...a11yProps(1)} />
              <Tab label="Доставка" {...a11yProps(2)} />
              <Tab label="Клиент" {...a11yProps(3)} />
            </Tabs>
          </Box>
          
          <TabPanel value={value} index={0}>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell align="right">Цена</TableCell>
                    <TableCell align="right">Количество</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {item.product.images?.length > 0 ? (
                            <ProductImage 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              variant="rounded"
                            />
                          ) : (
                            <ProductImage variant="rounded">
                              {item.product.name.charAt(0)}
                            </ProductImage>
                          )}
                          <Box>
                            <Typography variant="body1">{item.product.name}</Typography>
                            {/* <Typography variant="body2" color="text.secondary">
                              {item.product.manufacturer}
                            </Typography> */}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{item.productPrice.toFixed(2)} ₽</TableCell>
                      <TableCell align="right">{item.product.quantity}</TableCell>
                      <TableCell align="right">{(item.productPrice * item.product.quantity).toFixed(2)} ₽</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle1">Итого:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {order.price.toFixed(2)} ₽
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={value} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Детали заказа</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Номер заказа:</Typography>
                    <Typography>{order.orderNumber}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Статус:</Typography>
                    {getDisplayChip(order.state)}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Дата создания:</Typography>
                    <Typography>{formatDate(order.createdDateTimeUtc, "Pp")}</Typography>
                  </Box>
                  {order.completedDateTimeUtc && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Дата завершения:</Typography>
                      <Typography>{formatDate(order.completedDateTimeUtc,"Pp")}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Общая сумма:</Typography>
                    <Typography fontWeight="bold">{order.price.toFixed(2)} ₽</Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Контактная информация</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Телефон:</Typography>
                    <Typography>{order.clientPhoneNumber}</Typography>
                  </Box>
                  {order.client.email && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Email:</Typography>
                      <Typography>{order.client.email}</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={value} index={2}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Адрес доставки</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography paragraph>
                {order.address.city}, {order.address.street}, д. {order.address.home}
                {order.address.apartment && `, кв. ${order.address.apartment}`}
              </Typography>
            </Paper>
          </TabPanel>
          
          <TabPanel value={value} index={3}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Информация о клиенте</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">ID:</Typography>
                <Typography>{order.client.id}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Телефон:</Typography>
                <Typography>{order.client.phoneNumber}</Typography>
              </Box>
              {order.client.email && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Email:</Typography>
                  <Typography>{order.client.email}</Typography>
                </Box>
              )}
            </Paper>
          </TabPanel>
        </Box>
      </StyledModalBox>
    </Modal>
  );
}