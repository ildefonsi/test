package com.gestionusuarios.gestionusuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerfilDTO {

    private Long id;

    @NotBlank(message = "El nombre del perfil es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre del perfil debe tener entre 3 y 50 caracteres")
    private String nombre;

    @Size(max = 255, message = "La descripción no puede exceder 255 caracteres")
    private String descripcion;

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
}