package com.gestionusuarios.gestionusuarios.security;

import com.gestionusuarios.gestionusuarios.entity.Usuario;
import com.gestionusuarios.gestionusuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con username: " + username));

        List<GrantedAuthority> authorities = usuario.getPerfiles().stream()
                .map(perfil -> new SimpleGrantedAuthority("ROLE_" + perfil.getNombre().toUpperCase()))
                .collect(Collectors.toList());

        return UserPrincipal.create(usuario, authorities);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con id: " + id));

        List<GrantedAuthority> authorities = usuario.getPerfiles().stream()
                .map(perfil -> new SimpleGrantedAuthority("ROLE_" + perfil.getNombre().toUpperCase()))
                .collect(Collectors.toList());

        return UserPrincipal.create(usuario, authorities);
    }
}