package com.gestionusuarios.gestionusuarios.controller;

import com.gestionusuarios.gestionusuarios.dto.PerfilDTO;
import com.gestionusuarios.gestionusuarios.service.PerfilService;
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
@RequestMapping("/api/perfiles")
@Tag(name = "Gestión de Perfiles", description = "API para la gestión de perfiles del sistema")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @PostMapping
    @Operation(summary = "Crear nuevo perfil", description = "Crea un nuevo perfil en el sistema")
    @ApiResponse(responseCode = "201", description = "Perfil creado exitosamente")
    @ApiResponse(responseCode = "409", description = "El perfil ya existe")
    public ResponseEntity<PerfilDTO> crearPerfil(@Valid @RequestBody PerfilDTO perfilDTO) {
        PerfilDTO nuevoPerfil = perfilService.crearPerfil(perfilDTO);
        return new ResponseEntity<>(nuevoPerfil, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener perfil por ID", description = "Obtiene un perfil específico por su ID")
    @ApiResponse(responseCode = "200", description = "Perfil encontrado")
    @ApiResponse(responseCode = "404", description = "Perfil no encontrado")
    public ResponseEntity<PerfilDTO> obtenerPerfilPorId(@PathVariable Long id) {
        PerfilDTO perfil = perfilService.obtenerPerfilPorId(id);
        return ResponseEntity.ok(perfil);
    }

    @GetMapping("/nombre/{nombre}")
    @Operation(summary = "Obtener perfil por nombre", description = "Obtiene un perfil específico por su nombre")
    @ApiResponse(responseCode = "200", description = "Perfil encontrado")
    @ApiResponse(responseCode = "404", description = "Perfil no encontrado")
    public ResponseEntity<PerfilDTO> obtenerPerfilPorNombre(@PathVariable String nombre) {
        PerfilDTO perfil = perfilService.obtenerPerfilPorNombre(nombre);
        return ResponseEntity.ok(perfil);
    }

    @GetMapping
    @Operation(summary = "Obtener todos los perfiles", description = "Obtiene una lista paginada de todos los perfiles")
    @ApiResponse(responseCode = "200", description = "Lista de perfiles obtenida exitosamente")
    public ResponseEntity<Page<PerfilDTO>> obtenerTodosLosPerfiles(
            @PageableDefault(size = 10, sort = "fechaCreacion") Pageable pageable) {
        Page<PerfilDTO> perfiles = perfilService.obtenerTodosLosPerfiles(pageable);
        return ResponseEntity.ok(perfiles);
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar perfiles", description = "Busca perfiles por término de búsqueda")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    public ResponseEntity<Page<PerfilDTO>> buscarPerfiles(
            @Parameter(description = "Término de búsqueda") @RequestParam String searchTerm,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<PerfilDTO> perfiles = perfilService.buscarPerfiles(searchTerm, pageable);
        return ResponseEntity.ok(perfiles);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar perfil", description = "Actualiza los datos de un perfil existente")
    @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Perfil no encontrado")
    @ApiResponse(responseCode = "409", description = "El nombre del perfil ya existe")
    public ResponseEntity<PerfilDTO> actualizarPerfil(
            @PathVariable Long id,
            @Valid @RequestBody PerfilDTO perfilDTO) {
        PerfilDTO perfilActualizado = perfilService.actualizarPerfil(id, perfilDTO);
        return ResponseEntity.ok(perfilActualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar perfil", description = "Elimina un perfil del sistema")
    @ApiResponse(responseCode = "204", description = "Perfil eliminado exitosamente")
    @ApiResponse(responseCode = "404", description = "Perfil no encontrado")
    @ApiResponse(responseCode = "409", description = "El perfil tiene usuarios asociados")
    public ResponseEntity<Void> eliminarPerfil(@PathVariable Long id) {
        perfilService.eliminarPerfil(id);
        return ResponseEntity.noContent().build();
    }
}