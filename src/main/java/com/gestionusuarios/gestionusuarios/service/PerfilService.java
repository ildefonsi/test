package com.gestionusuarios.gestionusuarios.service;

import com.gestionusuarios.gestionusuarios.dto.PerfilDTO;
import com.gestionusuarios.gestionusuarios.entity.Perfil;
import com.gestionusuarios.gestionusuarios.exception.ResourceNotFoundException;
import com.gestionusuarios.gestionusuarios.exception.ProfileAlreadyExistsException;
import com.gestionusuarios.gestionusuarios.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PerfilService {

    @Autowired
    private PerfilRepository perfilRepository;

    public PerfilDTO crearPerfil(PerfilDTO perfilDTO) {
        // Validar que el perfil no existe
        if (perfilRepository.existsByNombre(perfilDTO.getNombre())) {
            throw new ProfileAlreadyExistsException("El perfil ya existe: " + perfilDTO.getNombre());
        }

        // Crear nuevo perfil
        Perfil perfil = new Perfil();
        perfil.setNombre(perfilDTO.getNombre());
        perfil.setDescripcion(perfilDTO.getDescripcion());

        Perfil perfilGuardado = perfilRepository.save(perfil);
        return convertirADTO(perfilGuardado);
    }

    public PerfilDTO obtenerPerfilPorId(Long id) {
        Perfil perfil = perfilRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado con id: " + id));
        return convertirADTO(perfil);
    }

    public PerfilDTO obtenerPerfilPorNombre(String nombre) {
        Perfil perfil = perfilRepository.findByNombre(nombre)
            .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado con nombre: " + nombre));
        return convertirADTO(perfil);
    }

    public Page<PerfilDTO> obtenerTodosLosPerfiles(Pageable pageable) {
        Page<Perfil> perfiles = perfilRepository.findAll(pageable);
        return perfiles.map(this::convertirADTO);
    }

    public Page<PerfilDTO> buscarPerfiles(String searchTerm, Pageable pageable) {
        Page<Perfil> perfiles = perfilRepository.searchPerfiles(searchTerm, pageable);
        return perfiles.map(this::convertirADTO);
    }

    public PerfilDTO actualizarPerfil(Long id, PerfilDTO perfilDTO) {
        Perfil perfil = perfilRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado con id: " + id));

        // Validar que el nuevo nombre no existe (si es diferente)
        if (!perfil.getNombre().equals(perfilDTO.getNombre()) && 
            perfilRepository.existsByNombre(perfilDTO.getNombre())) {
            throw new ProfileAlreadyExistsException("El perfil ya existe: " + perfilDTO.getNombre());
        }

        // Actualizar campos
        perfil.setNombre(perfilDTO.getNombre());
        perfil.setDescripcion(perfilDTO.getDescripcion());

        Perfil perfilActualizado = perfilRepository.save(perfil);
        return convertirADTO(perfilActualizado);
    }

    public void eliminarPerfil(Long id) {
        Perfil perfil = perfilRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado con id: " + id));
        
        // Verificar si hay usuarios asociados a este perfil
        if (!perfil.getUsuarios().isEmpty()) {
            throw new IllegalStateException("No se puede eliminar el perfil porque tiene usuarios asociados");
        }
        
        perfilRepository.delete(perfil);
    }

    private PerfilDTO convertirADTO(Perfil perfil) {
        PerfilDTO dto = new PerfilDTO();
        dto.setId(perfil.getId());
        dto.setNombre(perfil.getNombre());
        dto.setDescripcion(perfil.getDescripcion());
        dto.setFechaCreacion(perfil.getFechaCreacion());
        dto.setFechaModificacion(perfil.getFechaModificacion());
        return dto;
    }
}