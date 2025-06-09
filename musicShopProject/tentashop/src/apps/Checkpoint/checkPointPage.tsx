import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Paper,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle
} from '@mui/material';
import {
  Login as LoginIcon,
  HowToReg as RegisterIcon
} from '@mui/icons-material';
import { useCart } from '../../hooks/cartContextType';
import { useAuth } from '../../hooks/authContext';
import { OrderProvider } from '../../domain/orders/orderProvider';
import { OrderItemBlank } from '../../domain/orders/orderItemBLank';
import { OrderBlank } from '../../domain/orders/orderBLank';
import { AddressBlank } from '../../domain/address/addressBlank';
import { Address } from '../../domain/address/address';
import { v4 as uuidv4 } from 'uuid';
import { UserProvider } from '../../domain/user/userProvider';
import { UserBlank } from '../../domain/user/userBlank';

export const CheckoutPage = () => {
      const {
      user,
      isAuthenticated,
      login,
      logout,
      loading: authLoading
    } = useAuth();

  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // Контактные данные
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  
  // Адрес доставки (разделенный по полям)
  const [address, setAddress] = useState<AddressBlank>(AddressBlank.getEmpty(uuidv4()));

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [isAuthenticated, user]);

  const handleAddressChange = (field: keyof AddressBlank, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    const orderId = uuidv4();
    try {
      const orderItems: OrderItemBlank[] = cartItems.map(item => ({
        id: uuidv4(),
        OrderId: orderId,
        ProductId: item.id,
        ProductPrice: item.price,
        ProductCategoryId: item.categoryId || null
      }));

      

      const orderBlank: OrderBlank = {
        id: orderId,
        price: totalPrice,
        clientPhoneNumber: phoneNumber,
        ClientId: user?.id || uuidv4() ,
        AddressId: address.id, // Можно заменить на реальный ID адреса
        CompletedDateTimeUtc: new Date(),
        CreatedDateTimeUtc: new Date(),
        State: 1,
        OrderNumber: Math.floor(Math.random() * 1000000),
        OrderItems: orderItems
      };

      const result = await OrderProvider.saveOrder(orderBlank);
      
      if (result.isSuccess) {
        const result = await OrderProvider.saveAddress(address)
        clearCart();
        alert("Заказ успешно сохранен")
        navigate('/');
      } else {
        setError(result.errors?.join(', ') || 'Ошибка при оформлении заказа');
      }
    } catch (err) {
      setError('Произошла ошибка при оформлении заказа');
      console.error('Order error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
const handleAuthSubmit = async () => {
    if (!phoneNumber || !password) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      if (isLoginMode) {
        // Логин
        const result = await UserProvider.login(phoneNumber, password);
        if (result.result.isSuccess && result.data) {
          login(result.data);
          setSuccessMessage('Вы успешно вошли в систему');
          handleAuthModalClose();
        } else {
          if(result.result.errors){
           setError(result.result.errors[0] ?? 'Ошибка входа');
          }
        }
      } else {
        // Регистрация
        const userBlank: UserBlank = {
          id: null,
          phoneNumber,
          password,
          PasswordBeChanged: false
        };
        
        const result = await UserProvider.register(userBlank);
        if (result.isSuccess) {
          setSuccessMessage('Регистрация прошла успешно! Теперь вы можете войти.');
          setIsLoginMode(true);
          setPhoneNumber('');
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(result.errors?.join(', ') || 'Ошибка регистрации');
        }
      }
    } catch (err) {
      setError('Произошла ошибка. Пожалуйста, попробуйте позже.');
      console.error('Auth error:', err);
    }
  };
  
   const handleAuthModalOpen = () => {
    setAuthModalOpen(true);
    setIsLoginMode(true);
    setError('');
  };


  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleSwitchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };

  const validateForm = (): boolean => {
    if (!isAuthenticated && (!email || !phoneNumber)) {
      setError('Пожалуйста, заполните email и номер телефона');
      return false;
    }

    // Проверка всех полей адреса
    if (!address.city || !address.street || !address.home || !address.apartment) {
      setError('Пожалуйста, заполните все поля адреса');
      return false;
    }

    if (!paymentMethod) {
      setError('Пожалуйста, выберите способ оплаты');
      return false;
    }

    if (cartItems.length === 0) {
      setError('Корзина пуста');
      return false;
    }

    return true;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3 
      }}>
        {/* Левая часть - основная форма */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            Оформление заказа
          </Typography>

          {/* Блок 1: Контактные данные */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            {!isAuthenticated ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Войдите или зарегистрируйтесь, чтобы удобно отслеживать заказ
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mb: 2 }}
                  onClick={() => handleAuthModalOpen()}
                >
                  Войти / Зарегистрироваться
                </Button>
                <Typography variant="subtitle1" gutterBottom>
                  Или оформите заказ как гость:
                </Typography>
              </>
            ) : null}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Номер телефона"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required={!isAuthenticated}
                disabled={isAuthenticated}
              />
            </Box>
          </Paper>

          {/* Блок 2: Адрес доставки */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Адрес доставки
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gap: 2, 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } 
            }}>
              <TextField
                label="Город"
                value={address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                required
                fullWidth
              />
              
              <TextField
                label="Улица"
                value={address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                required
                fullWidth
              />
              
              <TextField
                label="Дом"
                value={address.home}
                onChange={(e) => handleAddressChange('home', e.target.value)}
                required
                fullWidth
              />
              
              <TextField
                label="Квартира/Офис"
                value={address.apartment}
                onChange={(e) => handleAddressChange('apartment', e.target.value)}
                required
                fullWidth
              />
            </Box>
          </Paper>

          {/* Блок 3: Товары */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Товары в заказе
            </Typography>
            <List>
              {cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: 60, height: 60, marginRight: 16, objectFit: 'cover' }} 
                      />
                    )}
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.quantity} × ${item.price.toLocaleString('ru-RU')} ₽`}
                    />
                    <Typography variant="body1">
                      {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Typography variant="h6">
                Итого: {totalPrice.toLocaleString('ru-RU')} ₽
              </Typography>
            </Box>
          </Paper>

          {/* Блок 4: Способ оплаты */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Способ оплаты
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel 
                  value="cash" 
                  control={<Radio />} 
                  label="Наличными при получении" 
                />
                <FormControlLabel 
                  value="card" 
                  control={<Radio />} 
                  label="Банковской картой при получении" 
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Box>

        {/* Правая часть - итоговая информация */}
        <Box sx={{ 
          width: { xs: '100%', md: 350 },
          position: { md: 'sticky' },
          top: { md: 16 },
          alignSelf: { md: 'flex-start' }
        }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ВАШ ЗАКАЗ
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Товары:</Typography>
              <Typography variant="body1">{cartItems.length} шт.</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Сумма:</Typography>
              <Typography variant="body1">{totalPrice.toLocaleString('ru-RU')} ₽</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Итого:</Typography>
              <Typography variant="h6">{totalPrice.toLocaleString('ru-RU')} ₽</Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || isSubmitting}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
            </Button>
          </Paper>
        </Box>
      </Box>

       <Dialog open={authModalOpen} onClose={handleAuthModalClose}>
        <DialogTitle>
          {isLoginMode ? 'Вход в систему' : 'Регистрация'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Номер телефона"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {!isLoginMode && (
              <TextField
                fullWidth
                label="Подтвердите пароль"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button 
            onClick={handleSwitchMode}
            startIcon={isLoginMode ? <RegisterIcon /> : <LoginIcon />}
          >
            {isLoginMode ? 'Регистрация' : 'Вход'}
          </Button>
          <Box>
            <Button onClick={handleAuthModalClose} sx={{ mr: 1 }}>
              Отмена
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAuthSubmit}
              startIcon={isLoginMode ? <LoginIcon /> : <RegisterIcon />}
              disabled={authLoading}
            >
              {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  );
};