import api from './api';

export const usuarioService = {
  // Obtener todos los usuarios con paginación
  getUsuarios: async (page = 0, size = 10) => {
    const response = await api.get(`/usuarios?page=${page}&size=${size}`);
    return response.data;
  },

  // Buscar usuarios
  buscarUsuarios: async (searchTerm, page = 0, size = 10) => {
    const response = await api.get(`/usuarios/search?searchTerm=${searchTerm}&page=${page}&size=${size}`);
    return response.data;
  },

  // Obtener usuarios por perfil
  getUsuariosPorPerfil: async (perfilNombre, page = 0, size = 10) => {
    const response = await api.get(`/usuarios/perfil/${perfilNombre}?page=${page}&size=${size}`);
    return response.data;
  },

  // Obtener usuario por ID
  getUsuarioById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Obtener usuario por username
  getUsuarioByUsername: async (username) => {
    const response = await api.get(`/usuarios/username/${username}`);
    return response.data;
  },

  // Crear nuevo usuario
  crearUsuario: async (usuarioData) => {
    const response = await api.post('/usuarios', usuarioData);
    return response.data;
  },

  // Actualizar usuario
  actualizarUsuario: async (id, usuarioData) => {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  },

  // Eliminar usuario
  eliminarUsuario: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  // Cambiar estado del usuario
  cambiarEstadoUsuario: async (id, activo) => {
    const response = await api.patch(`/usuarios/${id}/estado?activo=${activo}`);
    return response.data;
  },

  // Asignar perfil a usuario
  asignarPerfil: async (usuarioId, perfilId) => {
    const response = await api.post(`/usuarios/${usuarioId}/perfiles/${perfilId}`);
    return response.data;
  },

  // Remover perfil de usuario
  removerPerfil: async (usuarioId, perfilId) => {
    const response = await api.delete(`/usuarios/${usuarioId}/perfiles/${perfilId}`);
    return response.data;
  },
};