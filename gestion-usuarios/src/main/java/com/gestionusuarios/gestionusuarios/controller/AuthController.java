package com.gestionusuarios.gestionusuarios.controller;

import com.gestionusuarios.gestionusuarios.dto.JwtResponse;
import com.gestionusuarios.gestionusuarios.dto.LoginRequest;
import com.gestionusuarios.gestionusuarios.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "API para autenticación de usuarios")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/signin")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y genera un token JWT")
    @ApiResponse(responseCode = "200", description = "Autenticación exitosa")
    @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generarToken(authentication);
        
        // Aquí deberías obtener los detalles del usuario desde el servicio
        // Por simplicidad, estoy usando los datos del loginRequest
        JwtResponse jwtResponse = new JwtResponse(jwt, 1L, loginRequest.getUsername(), 
                "user@example.com", java.util.List.of("USER"));
        
        return ResponseEntity.ok(jwtResponse);
    }
}