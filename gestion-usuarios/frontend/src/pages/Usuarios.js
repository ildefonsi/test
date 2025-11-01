import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Refresh,
  Person,
  Email,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { usuarioService } from '../services/usuarioService';
import { perfilService } from '../services/perfilService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Usuarios = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  // Formulario
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  // Obtener usuarios
  const { data: usuariosData, isLoading: loadingUsuarios } = useQuery(
    ['usuarios', page, rowsPerPage, searchTerm],
    () => {
      if (searchTerm) {
        return usuarioService.buscarUsuarios(searchTerm, page, rowsPerPage);
      }
      return usuarioService.getUsuarios(page, rowsPerPage);
    },
    {
      keepPreviousData: true,
    }
  );

  // Obtener perfiles para el formulario
  const { data: perfilesData } = useQuery(['perfiles'], () => perfilService.getPerfiles(0, 50));

  // Mutaciones
  const crearUsuarioMutation = useMutation(usuarioService.crearUsuario, {
    onSuccess: () => {
      queryClient.invalidateQueries('usuarios');
      toast.success('Usuario creado exitosamente');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    },
  });

  const actualizarUsuarioMutation = useMutation(
    ({ id, data }) => usuarioService.actualizarUsuario(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('usuarios');
        toast.success('Usuario actualizado exitosamente');
        handleCloseDialog();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error al actualizar usuario');
      },
    }
  );

  const eliminarUsuarioMutation = useMutation(usuarioService.eliminarUsuario, {
    onSuccess: () => {
      queryClient.invalidateQueries('usuarios');
      toast.success('Usuario eliminado exitosamente');
      handleCloseDeleteDialog();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar usuario');
    },
  });

  const cambiarEstadoMutation = useMutation(
    ({ id, activo }) => usuarioService.cambiarEstadoUsuario(id, activo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('usuarios');
        toast.success('Estado del usuario actualizado');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error al cambiar estado');
      },
    }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (usuario = null) => {
    setSelectedUsuario(usuario);
    if (usuario) {
      reset({
        username: usuario.username,
        email: usuario.email,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        activo: usuario.activo,
        perfiles: usuario.perfiles || [],
      });
    } else {
      reset({
        username: '',
        email: '',
        nombre: '',
        apellidos: '',
        password: '',
        activo: true,
        perfiles: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUsuario(null);
    reset();
  };

  const handleOpenDeleteDialog = (usuario) => {
    setUsuarioToDelete(usuario);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUsuarioToDelete(null);
  };

  const onSubmit = (data) => {
    if (selectedUsuario) {
      actualizarUsuarioMutation.mutate({
        id: selectedUsuario.id,
        data: { ...selectedUsuario, ...data },
      });
    } else {
      crearUsuarioMutation.mutate(data);
    }
  };

  const handleEstadoChange = (usuarioId, activo) => {
    cambiarEstadoMutation.mutate({ id: usuarioId, activo });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra los usuarios del sistema, sus perfiles y estados.
        </Typography>
      </Box>

      {/* Barra de herramientas */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar usuarios..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1, minWidth: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ minWidth: 150 }}
        >
          Nuevo Usuario
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => queryClient.invalidateQueries('usuarios')}
        >
          Actualizar
        </Button>
      </Box>

      {/* Tabla de usuarios */}
      <Card sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Perfiles</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosData?.content?.map((usuario) => (
                  <TableRow key={usuario.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {usuario.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2">{usuario.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {usuario.nombre} {usuario.apellidos}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {usuario.perfiles?.map((perfil) => (
                          <Chip
                            key={perfil}
                            label={perfil}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={usuario.activo}
                        onChange={(e) => handleEstadoChange(usuario.id, e.target.checked)}
                        color="success"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(usuario)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteDialog(usuario)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={usuariosData?.totalElements || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: '1px solid #334155' }}
          />
        </CardContent>
      </Card>

      {/* Diálogo de formulario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: 'Username es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      disabled={!!selectedUsuario}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ 
                    required: 'Email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="nombre"
                  control={control}
                  rules={{ required: 'Nombre es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre"
                      fullWidth
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="apellidos"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Apellidos"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              {!selectedUsuario && (
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ 
                      required: 'Contraseña es requerida',
                      minLength: {
                        value: 6,
                        message: 'Mínimo 6 caracteres'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contraseña"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Perfiles</InputLabel>
                  <Controller
                    name="perfiles"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        multiple
                        input={<OutlinedInput label="Perfiles" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {perfilesData?.content?.map((perfil) => (
                          <MenuItem key={perfil.id} value={perfil.nombre}>
                            <Checkbox checked={field.value?.includes(perfil.nombre) || false} />
                            <ListItemText primary={perfil.nombre} />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="activo"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        color="success"
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Usuario activo
                      </Typography>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={crearUsuarioMutation.isLoading || actualizarUsuarioMutation.isLoading}
            >
              {selectedUsuario ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el usuario "{usuarioToDelete?.username}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={() => eliminarUsuarioMutation.mutate(usuarioToDelete.id)}
            color="error"
            variant="contained"
            disabled={eliminarUsuarioMutation.isLoading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Usuarios;