package com.gestionusuarios.gestionusuarios.repository;

import com.gestionusuarios.gestionusuarios.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);
    
    Optional<Usuario> findByEmail(String email);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.apellidos) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Usuario> searchUsuarios(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT u FROM Usuario u JOIN u.perfiles p WHERE p.nombre = :perfilNombre")
    Page<Usuario> findByPerfilNombre(@Param("perfilNombre") String perfilNombre, Pageable pageable);
}