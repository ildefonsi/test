package com.gestionusuarios.gestionusuarios.repository;

import com.gestionusuarios.gestionusuarios.entity.Perfil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {

    Optional<Perfil> findByNombre(String nombre);
    
    Boolean existsByNombre(String nombre);
    
    @Query("SELECT p FROM Perfil p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Perfil> searchPerfiles(@Param("searchTerm") String searchTerm, Pageable pageable);
}