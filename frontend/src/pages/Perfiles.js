import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Refresh,
  AdminPanelSettings,
  People,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { perfilService } from '../services/perfilService';

const Perfiles = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPerfil, setSelectedPerfil] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [perfilToDelete, setPerfilToDelete] = useState(null);

  // Formulario
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  // Obtener perfiles
  const { data: perfilesData, isLoading: loadingPerfiles } = useQuery(
    ['perfiles', page, rowsPerPage, searchTerm],
    () => {
      if (searchTerm) {
        return perfilService.buscarPerfiles(searchTerm, page, rowsPerPage);
      }
      return perfilService.getPerfiles(page, rowsPerPage);
    },
    {
      keepPreviousData: true,
    }
  );

  // Mutaciones
  const crearPerfilMutation = useMutation(perfilService.crearPerfil, {
    onSuccess: () => {
      queryClient.invalidateQueries('perfiles');
      toast.success('Perfil creado exitosamente');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear perfil');
    },
  });

  const actualizarPerfilMutation = useMutation(
    ({ id, data }) => perfilService.actualizarPerfil(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('perfiles');
        toast.success('Perfil actualizado exitosamente');
        handleCloseDialog();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error al actualizar perfil');
      },
    }
  );

  const eliminarPerfilMutation = useMutation(perfilService.eliminarPerfil, {
    onSuccess: () => {
      queryClient.invalidateQueries('perfiles');
      toast.success('Perfil eliminado exitosamente');
      handleCloseDeleteDialog();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar perfil');
    },
  });

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

  const handleOpenDialog = (perfil = null) => {
    setSelectedPerfil(perfil);
    if (perfil) {
      reset({
        nombre: perfil.nombre,
        descripcion: perfil.descripcion,
      });
    } else {
      reset({
        nombre: '',
        descripcion: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPerfil(null);
    reset();
  };

  const handleOpenDeleteDialog = (perfil) => {
    setPerfilToDelete(perfil);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPerfilToDelete(null);
  };

  const onSubmit = (data) => {
    if (selectedPerfil) {
      actualizarPerfilMutation.mutate({
        id: selectedPerfil.id,
        data: { ...selectedPerfil, ...data },
      });
    } else {
      crearPerfilMutation.mutate(data);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Gestión de Perfiles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra los perfiles del sistema y sus permisos.
        </Typography>
      </Box>

      {/* Barra de herramientas */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar perfiles..."
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
          Nuevo Perfil
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => queryClient.invalidateQueries('perfiles')}
        >
          Actualizar
        </Button>
      </Box>

      {/* Tabla de perfiles */}
      <Card sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Perfil</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha de Creación</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {perfilesData?.content?.map((perfil) => (
                  <TableRow key={perfil.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdminPanelSettings sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {perfil.nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {perfil.descripcion}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(perfil.fechaCreacion).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(perfil)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteDialog(perfil)}
                          color="error"
                          disabled={perfil.nombre === 'ADMIN'}
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
            count={perfilesData?.totalElements || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: '1px solid #334155' }}
          />
        </CardContent>
      </Card>

      {/* Diálogo de formulario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPerfil ? 'Editar Perfil' : 'Nuevo Perfil'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="nombre"
                control={control}
                rules={{ 
                  required: 'Nombre es requerido',
                  minLength: {
                    value: 3,
                    message: 'Mínimo 3 caracteres'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre del Perfil"
                    fullWidth
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    disabled={!!selectedPerfil && selectedPerfil.nombre === 'ADMIN'}
                  />
                )}
              />
              <Controller
                name="descripcion"
                control={control}
                rules={{ 
                  maxLength: {
                    value: 255,
                    message: 'Máximo 255 caracteres'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion?.message}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={crearPerfilMutation.isLoading || actualizarPerfilMutation.isLoading}
            >
              {selectedPerfil ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el perfil "{perfilToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
          {perfilToDelete?.nombre === 'ADMIN' && (
            <Typography color="error" sx={{ mt: 2 }}>
              ⚠️ No se puede eliminar el perfil ADMIN del sistema.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={() => eliminarPerfilMutation.mutate(perfilToDelete.id)}
            color="error"
            variant="contained"
            disabled={eliminarPerfilMutation.isLoading || perfilToDelete?.nombre === 'ADMIN'}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Perfiles;