import api from './api';

export const perfilService = {
  // Obtener todos los perfiles con paginación
  getPerfiles: async (page = 0, size = 10) => {
    const response = await api.get(`/perfiles?page=${page}&size=${size}`);
    return response.data;
  },

  // Buscar perfiles
  buscarPerfiles: async (searchTerm, page = 0, size = 10) => {
    const response = await api.get(`/perfiles/search?searchTerm=${searchTerm}&page=${page}&size=${size}`);
    return response.data;
  },

  // Obtener perfil por ID
  getPerfilById: async (id) => {
    const response = await api.get(`/perfiles/${id}`);
    return response.data;
  },

  // Obtener perfil por nombre
  getPerfilByNombre: async (nombre) => {
    const response = await api.get(`/perfiles/nombre/${nombre}`);
    return response.data;
  },

  // Crear nuevo perfil
  crearPerfil: async (perfilData) => {
    const response = await api.post('/perfiles', perfilData);
    return response.data;
  },

  // Actualizar perfil
  actualizarPerfil: async (id, perfilData) => {
    const response = await api.put(`/perfiles/${id}`, perfilData);
    return response.data;
  },

  // Eliminar perfil
  eliminarPerfil: async (id) => {
    const response = await api.delete(`/perfiles/${id}`);
    return response.data;
  },
};