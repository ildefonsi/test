import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { Lock, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 3,
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Lock sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 600, color: '#f8fafc' }}>
            Sistema de Gestión
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
            Ingrese sus credenciales para continuar
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de Usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={credentials.username}
            onChange={handleChange}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: '#94a3b8' }} />,
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: '#94a3b8' }} />,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Iniciar Sesión'
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              ¿Olvidó su contraseña?{' '}
              <Link to="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Recupérela aquí
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              Credenciales de prueba:
              <br />
              Username: admin | Password: admin123
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;