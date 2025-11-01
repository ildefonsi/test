package com.gestionusuarios.gestionusuarios.controller;

import com.gestionusuarios.gestionusuarios.dto.UsuarioDTO;
import com.gestionusuarios.gestionusuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Gestión de Usuarios", description = "API para la gestión de usuarios del sistema")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    @Operation(summary = "Crear nuevo usuario", description = "Crea un nuevo usuario en el sistema")
    @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente")
    @ApiResponse(responseCode = "409", description = "El usuario ya existe")
    public ResponseEntity<UsuarioDTO> crearUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO nuevoUsuario = usuarioService.crearUsuario(usuarioDTO);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene un usuario específico por su ID")
    @ApiResponse(responseCode = "200", description = "Usuario encontrado")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<UsuarioDTO> obtenerUsuarioPorId(@PathVariable Long id) {
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/username/{username}")
    @Operation(summary = "Obtener usuario por username", description = "Obtiene un usuario específico por su nombre de usuario")
    @ApiResponse(responseCode = "200", description = "Usuario encontrado")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<UsuarioDTO> obtenerUsuarioPorUsername(@PathVariable String username) {
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorUsername(username);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    @Operation(summary = "Obtener todos los usuarios", description = "Obtiene una lista paginada de todos los usuarios")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<Page<UsuarioDTO>> obtenerTodosLosUsuarios(
            @PageableDefault(size = 10, sort = "fechaCreacion") Pageable pageable) {
        Page<UsuarioDTO> usuarios = usuarioService.obtenerTodosLosUsuarios(pageable);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar usuarios", description = "Busca usuarios por término de búsqueda en múltiples campos")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    public ResponseEntity<Page<UsuarioDTO>> buscarUsuarios(
            @Parameter(description = "Término de búsqueda") @RequestParam String searchTerm,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<UsuarioDTO> usuarios = usuarioService.buscarUsuarios(searchTerm, pageable);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/perfil/{perfilNombre}")
    @Operation(summary = "Obtener usuarios por perfil", description = "Obtiene todos los usuarios que tienen un perfil específico")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<Page<UsuarioDTO>> obtenerUsuariosPorPerfil(
            @PathVariable String perfilNombre,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<UsuarioDTO> usuarios = usuarioService.obtenerUsuariosPorPerfil(perfilNombre, pageable);
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente")
    @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @ApiResponse(responseCode = "409", description = "El nombre de usuario o email ya existe")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema")
    @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado del usuario", description = "Activa o desactiva un usuario")
    @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<Void> cambiarEstadoUsuario(
            @PathVariable Long id,
            @RequestParam boolean activo) {
        usuarioService.cambiarEstadoUsuario(id, activo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{usuarioId}/perfiles/{perfilId}")
    @Operation(summary = "Asignar perfil a usuario", description = "Asigna un perfil específico a un usuario")
    @ApiResponse(responseCode = "200", description = "Perfil asignado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario o perfil no encontrado")
    public ResponseEntity<Void> asignarPerfilAUsuario(
            @PathVariable Long usuarioId,
            @PathVariable Long perfilId) {
        usuarioService.asignarPerfilAUsuario(usuarioId, perfilId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{usuarioId}/perfiles/{perfilId}")
    @Operation(summary = "Remover perfil de usuario", description = "Remueve un perfil específico de un usuario")
    @ApiResponse(responseCode = "200", description = "Perfil removido exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario o perfil no encontrado")
    public ResponseEntity<Void> removerPerfilDeUsuario(
            @PathVariable Long usuarioId,
            @PathVariable Long perfilId) {
        usuarioService.removerPerfilDeUsuario(usuarioId, perfilId);
        return ResponseEntity.ok().build();
    }
}