import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { OrderProvider } from '../../domain/orders/orderProvider';
import { Order } from '../../domain/orders/order';
import { useAuth } from '../../hooks/authContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { OrderState } from '../../domain/orders/enum/orderState';
import { useNavigate } from 'react-router-dom';

export const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const userOrders = await OrderProvider.getOrderByUser(user.id);
        console.log(userOrders);
        setOrders(userOrders);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getOrderStatusColor = (state: number) => {
    switch(state) {
      case 0: return 'default'; // Новый
      case 1: return 'primary'; // В обработке
      case 2: return 'secondary'; // В пути
      case 3: return 'success'; // Доставлен
      case 4: return 'error'; // Отменен
      default: return 'default';
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Не завершен';
    return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: ru });
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Пожалуйста, войдите в систему</Typography>
      </Container>
    );
  }

const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
   <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Информация о пользователе */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
              {user.phoneNumber[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                Профиль пользователя
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user.phoneNumber}
              </Typography>
            </Box>
          </Box>
          
          {/* Кнопка выхода */}
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleLogout}
            sx={{ alignSelf: 'flex-start' }}
          >
            Выйти
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Контактная информация
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Телефон: {user.phoneNumber}
            </Typography>
            {user.email && (
              <Typography variant="body1">
                Email: {user.email}
              </Typography>
            )}
          </Box>

          {user.birthDate && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Личная информация
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Дата рождения: {format(new Date(user.birthDate), 'dd MMMM yyyy', { locale: ru })}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Таблица заказов */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        История заказов
      </Typography>

      {loading ? (
        <Typography>Загрузка заказов...</Typography>
      ) : orders.length === 0 ? (
        <Typography>У вас пока нет заказов</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№ Заказа</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell>#{order.orderNumber}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdDateTimeUtc), 'dd.MM.yyyy')}
                    </TableCell>
                    <TableCell>
                      {order.price.toLocaleString('ru-RU')} ₽
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={OrderState.getDisplayName(order.state)} 
                        color={getOrderStatusColor(order.state)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrder === order.id ? 'Скрыть' : 'Подробнее'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedOrder === order.id && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ backgroundColor: 'action.hover' }}>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Детали заказа #{order.orderNumber}
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Адрес доставки:
                            </Typography>
                            <Typography variant="body1">
                              {order.address.city}, {order.address.street}, д.{order.address.home}, кв.{order.address.apartment}
                            </Typography>
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Товары:
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Товар</TableCell>
                                <TableCell>Цена</TableCell>
                                <TableCell>Количество</TableCell>
                                <TableCell>Сумма</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.orderItems.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.product.name}</TableCell>
                                  <TableCell>{item.productPrice.toLocaleString('ru-RU')} ₽</TableCell>
                                  <TableCell>1</TableCell>
                                  <TableCell>{item.productPrice.toLocaleString('ru-RU')} ₽</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="body2">
                              <strong>Дата создания:</strong> {formatDate(order.createdDateTimeUtc)}
                            </Typography>
                            {order.completedDateTimeUtc && (
                              <Typography variant="body2">
                                <strong>Дата завершения:</strong> {formatDate(order.completedDateTimeUtc)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

