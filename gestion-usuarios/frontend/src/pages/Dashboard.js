import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  People,
  AdminPanelSettings,
  TrendingUp,
  CheckCircle,
  Cancel,
  Group,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { usuarioService } from '../services/usuarioService';
import { perfilService } from '../services/perfilService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Obtener estadísticas de usuarios
  const { data: usuariosData, isLoading: loadingUsuarios } = useQuery(
    ['usuarios', 0, 100],
    () => usuarioService.getUsuarios(0, 100),
    {
      staleTime: 5 * 60 * 1000, // 5 minutos
    }
  );

  // Obtener estadísticas de perfiles
  const { data: perfilesData, isLoading: loadingPerfiles } = useQuery(
    ['perfiles', 0, 100],
    () => perfilService.getPerfiles(0, 100),
    {
      staleTime: 5 * 60 * 1000, // 5 minutos
    }
  );

  // Calcular estadísticas
  const totalUsuarios = usuariosData?.totalElements || 0;
  const totalPerfiles = perfilesData?.totalElements || 0;
  const usuariosActivos = usuariosData?.content?.filter(u => u.activo).length || 0;
  const usuariosInactivos = totalUsuarios - usuariosActivos;

  // Datos para gráficos
  const usuariosPorEstado = [
    { name: 'Activos', value: usuariosActivos, color: '#10b981' },
    { name: 'Inactivos', value: usuariosInactivos, color: '#ef4444' },
  ];

  const usuariosPorPagina = usuariosData?.content?.slice(0, 5).map((usuario, index) => ({
    name: usuario.username,
    perfiles: usuario.perfiles?.length || 0,
  })) || [];

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="h6" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loadingUsuarios || loadingPerfiles) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#f8fafc' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido al Sistema de Gestión de Usuarios. Aquí puedes ver las estadísticas generales del sistema.
        </Typography>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Usuarios"
            value={totalUsuarios}
            icon={<People sx={{ fontSize: 48 }} />}
            color="#3b82f6"
            subtitle={`${usuariosActivos} activos, ${usuariosInactivos} inactivos`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Perfiles"
            value={totalPerfiles}
            icon={<AdminPanelSettings sx={{ fontSize: 48 }} />}
            color="#10b981"
            subtitle="Perfiles de sistema"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios Activos"
            value={usuariosActivos}
            icon={<CheckCircle sx={{ fontSize: 48 }} />}
            color="#10b981"
            subtitle={`${((usuariosActivos / totalUsuarios) * 100).toFixed(1)}% del total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios Inactivos"
            value={usuariosInactivos}
            icon={<Cancel sx={{ fontSize: 48 }} />}
            color="#ef4444"
            subtitle={`${((usuariosInactivos / totalUsuarios) * 100).toFixed(1)}% del total`}
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Distribución de Usuarios por Estado
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usuariosPorEstado}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {usuariosPorEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Usuarios y sus Perfiles
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usuariosPorPagina}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="perfiles" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de usuarios recientes */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Usuarios Recientes
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      Usuario
                    </th>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      Email
                    </th>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      Estado
                    </th>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      Perfiles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosData?.content?.slice(0, 5).map((usuario) => (
                    <tr key={usuario.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                        {usuario.username}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                        {usuario.email}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: usuario.activo ? '#10b981' : '#ef4444',
                            color: 'white',
                          }}
                        >
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                        {usuario.perfiles?.join(', ') || 'Sin perfiles'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;