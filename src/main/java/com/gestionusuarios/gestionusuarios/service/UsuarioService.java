package com.gestionusuarios.gestionusuarios.service;

import com.gestionusuarios.gestionusuarios.dto.UsuarioDTO;
import com.gestionusuarios.gestionusuarios.entity.Perfil;
import com.gestionusuarios.gestionusuarios.entity.Usuario;
import com.gestionusuarios.gestionusuarios.exception.ResourceNotFoundException;
import com.gestionusuarios.gestionusuarios.exception.UserAlreadyExistsException;
import com.gestionusuarios.gestionusuarios.repository.PerfilRepository;
import com.gestionusuarios.gestionusuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioDTO crearUsuario(UsuarioDTO usuarioDTO) {
        // Validar que el usuario no existe
        if (usuarioRepository.existsByUsername(usuarioDTO.getUsername())) {
            throw new UserAlreadyExistsException("El nombre de usuario ya existe: " + usuarioDTO.getUsername());
        }
        
        if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new UserAlreadyExistsException("El email ya existe: " + usuarioDTO.getEmail());
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(usuarioDTO.getUsername());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellidos(usuarioDTO.getApellidos());
        usuario.setActivo(usuarioDTO.getActivo());

        // Asignar perfiles
        if (usuarioDTO.getPerfiles() != null && !usuarioDTO.getPerfiles().isEmpty()) {
            Set<Perfil> perfiles = new HashSet<>();
            for (String perfilNombre : usuarioDTO.getPerfiles()) {
                Perfil perfil = perfilRepository.findByNombre(perfilNombre)
                    .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado: " + perfilNombre));
                perfiles.add(perfil);
            }
            usuario.setPerfiles(perfiles);
        }

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioGuardado);
    }

    public UsuarioDTO obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        return convertirADTO(usuario);
    }

    public UsuarioDTO obtenerUsuarioPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con username: " + username));
        return convertirADTO(usuario);
    }

    public Page<UsuarioDTO> obtenerTodosLosUsuarios(Pageable pageable) {
        Page<Usuario> usuarios = usuarioRepository.findAll(pageable);
        return usuarios.map(this::convertirADTO);
    }

    public Page<UsuarioDTO> buscarUsuarios(String searchTerm, Pageable pageable) {
        Page<Usuario> usuarios = usuarioRepository.searchUsuarios(searchTerm, pageable);
        return usuarios.map(this::convertirADTO);
    }

    public Page<UsuarioDTO> obtenerUsuariosPorPerfil(String perfilNombre, Pageable pageable) {
        Page<Usuario> usuarios = usuarioRepository.findByPerfilNombre(perfilNombre, pageable);
        return usuarios.map(this::convertirADTO);
    }

    public UsuarioDTO actualizarUsuario(Long id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        // Validar que el nuevo username no existe (si es diferente)
        if (!usuario.getUsername().equals(usuarioDTO.getUsername()) && 
            usuarioRepository.existsByUsername(usuarioDTO.getUsername())) {
            throw new UserAlreadyExistsException("El nombre de usuario ya existe: " + usuarioDTO.getUsername());
        }

        // Validar que el nuevo email no existe (si es diferente)
        if (!usuario.getEmail().equals(usuarioDTO.getEmail()) && 
            usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new UserAlreadyExistsException("El email ya existe: " + usuarioDTO.getEmail());
        }

        // Actualizar campos
        usuario.setUsername(usuarioDTO.getUsername());
        usuario.setEmail(usuarioDTO.getEmail());
        
        // Solo actualizar la contraseña si se proporciona una nueva
        if (usuarioDTO.getPassword() != null && !usuarioDTO.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));
        }
        
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellidos(usuarioDTO.getApellidos());
        usuario.setActivo(usuarioDTO.getActivo());

        // Actualizar perfiles
        if (usuarioDTO.getPerfiles() != null) {
            Set<Perfil> perfiles = new HashSet<>();
            for (String perfilNombre : usuarioDTO.getPerfiles()) {
                Perfil perfil = perfilRepository.findByNombre(perfilNombre)
                    .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado: " + perfilNombre));
                perfiles.add(perfil);
            }
            usuario.setPerfiles(perfiles);
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioActualizado);
    }

    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public void cambiarEstadoUsuario(Long id, boolean activo) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
    }

    public void asignarPerfilAUsuario(Long usuarioId, Long perfilId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId));
        
        Perfil perfil = perfilRepository.findById(perfilId)
            .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado con id: " + perfilId));
        
        usuario.getPerfiles().add(perfil);
        usuarioRepository.save(usuario);
    }

    public void removerPerfilDeUsuario(Long usuarioId, Long perfilId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId));
        
        Perfil perfil = perfilRepository.findById(perfilId)
            .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado con id: " + perfilId));
        
        usuario.getPerfiles().remove(perfil);
        usuarioRepository.save(usuario);
    }

    private UsuarioDTO convertirADTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setNombre(usuario.getNombre());
        dto.setApellidos(usuario.getApellidos());
        dto.setActivo(usuario.getActivo());
        dto.setFechaCreacion(usuario.getFechaCreacion());
        dto.setFechaModificacion(usuario.getFechaModificacion());
        
        if (usuario.getPerfiles() != null) {
            Set<String> perfilesNombres = usuario.getPerfiles().stream()
                .map(Perfil::getNombre)
                .collect(Collectors.toSet());
            dto.setPerfiles(perfilesNombres);
        }
        
        return dto;
    }
}