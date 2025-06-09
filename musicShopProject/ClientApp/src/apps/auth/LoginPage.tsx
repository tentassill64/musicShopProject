import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  TextField, 
  Typography, 
  Link, 
  Grid,
  Alert,
  Dialog,
  DialogContent,
  Backdrop
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '../../hooks/useAuth';
import { EmployeeProvider } from '../../domain/employee/EmployeeProvider';

const defaultTheme = createTheme();

interface LoginModalProps {
  onLoginSuccess: () => void;
}

export function LoginModal({onLoginSuccess}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth');
    if (isAuth === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setLoading(true);
  setError('');

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = await EmployeeProvider.employeeLogin(email, password);
    console.log(result);

    if(result.isSuccess) {
      const employee = await EmployeeProvider.getEmployee(email, password);
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("id", employee.id);
      localStorage.setItem("email", employee.email);
      
      login();
      onLoginSuccess();
      
    }
  } catch (err) {
    setError('Неверный email или пароль');
    console.error('Login error:', err);
  } finally {
    setLoading(false);
    setError('Неверный email или пароль');
  }
};

  return (
    <ThemeProvider theme={defaultTheme}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <Dialog
          open={true}
          onClose={(event, reason) => {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
              return;
            }
          }}
          fullWidth
          maxWidth="sm"
          hideBackdrop={false}
          disableEscapeKeyDown
        >
          <DialogContent>
            <Container component="main" maxWidth="xs">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2
                }}
              >
                <Typography component="h1" variant="h5">
                  Вход в систему
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                  {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading ? 'Вход...' : 'Войти'}
                  </Button>
                </Box>
              </Box>
            </Container>
          </DialogContent>
        </Dialog>
      </Backdrop>
    </ThemeProvider>
  );
}