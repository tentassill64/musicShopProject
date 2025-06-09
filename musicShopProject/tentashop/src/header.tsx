import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Typography,
  Button,
  Badge,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  CircularProgress,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { ProductProvider } from './domain/products/productProvider';
import { Product } from './domain/products/product';

import logo from '../src/assets/android-chrome-512x512.png';
import { useCart } from './hooks/cartContextType';
import { useAuth } from './hooks/authContext';
import { UserProvider } from './domain/user/userProvider';
import { UserBlank } from './domain/user/userBlank';

interface HeaderProps {
  siteName?: string;
  logoUrl?: string;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Header: React.FC<HeaderProps> = ({ siteName = "TentaShop", logoUrl = "/logo.png" }) => {
 const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    login,
    logout,
    loading: authLoading
  } = useAuth();

  
  // Используем контекст корзины
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice
  } = useCart();

  const isCartOpen = Boolean(cartAnchorEl);

  const handleSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    
    if (trimmedQuery === '') {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const results = await ProductProvider.getProductsBySearchText(trimmedQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (path: string) => {
    navigate(`/products/${path}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleCartClick = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleCheckout = () => {
    handleCartClose();
    navigate('/checkout');
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
  
  return (
    <>
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar>
          {/* Логотип и название сайта */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: 2,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <img 
              src={logo} 
              alt="Логотип" 
              style={{ 
                height: 40, 
                width: 40, 
                marginRight: 8,
                borderRadius: '50%'
              }} 
            />
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {siteName}
            </Typography>
          </Box>

          {/* Поиск */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Search sx={{ width: { xs: '100%', md: '60%' } }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Поиск по сайту…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            </Search>

            {isSearchOpen && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: 56,
                  left: 0,
                  right: 0,
                  zIndex: 1200,
                  mx: 'auto',
                  width: { xs: '70%', md: '40%' },
                  maxHeight: 400,
                  overflow: 'auto',
                  boxShadow: 3,
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : searchResults.length > 0 ? (
                  <List>
                    {searchResults.map((product) => (
                      <ListItem
                        key={product.id}
                        component="button"
                        onClick={() => handleResultClick(product.id)}
                        sx={{
                          textAlign: 'left',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          py: 2
                        }}
                      >
                        {product.images?.length > 0 && (
                          <Box
                            component="img"
                            src={product.images[0]}
                            alt={product.name}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                        )}
                        <Box sx={{ flexGrow: 1 }}>
                          <ListItemText 
                            primary={product.name}
                            primaryTypographyProps={{
                              fontWeight: 'medium',
                              noWrap: true
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Ничего не найдено
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}
          </Box>

          {/* Кнопки пользователя и корзины */}
               <Box sx={{ display: 'flex' }}>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    },
                    p: 0.5,
                    ml: 1
                  }}
                  onClick={() => navigate('/profile')}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: 'secondary.main',
                      fontSize: '1rem',
                      mr: 1
                    }}
                  >
                  </Avatar>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      display: { xs: 'none', md: 'block' },
                      maxWidth: '100px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                  >
                    {user?.phoneNumber}
                  </Typography>
                </Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    ml: 1,
                    display: { xs: 'none', md: 'block' },
                    maxWidth: '100px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                </Typography>
          
              </Box>
            ) : (
              <Button
                color="inherit"
                startIcon={<PersonIcon />}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                onClick={handleAuthModalOpen}
              >
                Войти
              </Button>
            )}

            <IconButton 
              color="inherit" 
              onClick={handleCartClick}
              aria-describedby="cart-popover"
            >
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
{/* Модалка авторизации/регистрации */}
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

      {/* Уведомления */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Выпадающее окно корзины */}
<Popover
  id="cart-popover"
  open={isCartOpen}
  anchorEl={cartAnchorEl}
  onClose={handleCartClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  sx={{
    mt: 1,
    '& .MuiPaper-root': {
      width: { xs: '95vw', sm: '500px' },
      maxWidth: '500px',
      maxHeight: 'calc(100vh - 100px)',
    }
  }}
>
  <Paper sx={{ 
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }}>
    {/* Заголовок и кнопка закрытия - сдвинута левее */}
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
      position: 'relative'
    }}>
      <Typography variant="h6">Корзина</Typography>
      <IconButton 
        onClick={handleCartClose}
        sx={{
          position: 'absolute',
          right: 8,  // Уменьшил с 0 до 8
          top: 0
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>

    {cartItems.length === 0 ? (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1">Ваша корзина пуста</Typography>
      </Box>
    ) : (
      <>
        {/* Список товаров */}
        <List sx={{ 
          maxHeight: '50vh',
          overflow: 'auto',
          pr: 1,
          '& .MuiListItem-root': {
            pr: '80px'
          }
        }}>
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ 
                      width: 60, 
                      height: 60, 
                      marginRight: 16, 
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />
                )}
                <ListItemText
                  primary={item.name}
                  secondary={`${item.price.toLocaleString('ru-RU')} ₽`}
                />
                <Box sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    inputProps={{ 
                      min: 1, 
                      style: { 
                        width: '50px', 
                        textAlign: 'center' 
                      } 
                    }}
                    sx={{ width: '70px' }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => removeFromCart(item.id)}
                    color="error"
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        {/* Блок с итого и кнопкой - сдвинут левее */}
        <Box sx={{
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          width: 'calc(100% - 16px)', // Уменьшил отступ с 32px до 16px
          mx: 'auto'
        }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            px: 1  // Добавил горизонтальный padding
          }}>
            <Typography variant="h6">
              Итого:
            </Typography>
            <Typography variant="h6">
              {totalPrice.toLocaleString('ru-RU')} ₽
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleCheckout}
            fullWidth
            sx={{
              px: 1  // Добавил горизонтальный padding
            }}
          >
            Оформить заказ
          </Button>
        </Box>
      </>
    )}
  </Paper>
</Popover>
    </>
  );
};

export default Header;