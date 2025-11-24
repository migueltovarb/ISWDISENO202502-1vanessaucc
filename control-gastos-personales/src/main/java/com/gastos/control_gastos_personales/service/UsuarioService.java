package com.gastos.control_gastos_personales.service;

import com.gastos.control_gastos_personales.dto.*;
import com.gastos.control_gastos_personales.model.Usuario;
import com.gastos.control_gastos_personales.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    public JwtResponseDTO registrarUsuario(RegistroUsuarioDTO registroDTO) {
        if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNombre(registroDTO.getNombre());
        usuario.setEmail(registroDTO.getEmail());
        usuario.setContrasena(passwordEncoder.encode(registroDTO.getContrasena()));
        usuario.setFechaRegistro(new Date());
        
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        
        return new JwtResponseDTO(
            null, // El token se generará en el controller
            "Bearer",
            usuarioGuardado.getId(),
            usuarioGuardado.getNombre(),
            usuarioGuardado.getEmail()
        );
    }
    
    public Usuario obtenerUsuarioPorId(String id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    public Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    public Usuario actualizarPerfil(String idUsuario, ActualizarPerfilDTO actualizarDTO) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        
        boolean cambios = false;
        
        if (actualizarDTO.getNombre() != null && !actualizarDTO.getNombre().isEmpty()) {
            usuario.setNombre(actualizarDTO.getNombre());
            cambios = true;
        }
        
        if (actualizarDTO.getEmail() != null && !actualizarDTO.getEmail().isEmpty()) {
            if (!usuario.getEmail().equals(actualizarDTO.getEmail()) && 
                usuarioRepository.existsByEmail(actualizarDTO.getEmail())) {
                throw new RuntimeException("El email ya está en uso");
            }
            usuario.setEmail(actualizarDTO.getEmail());
            cambios = true;
        }
        
        if (actualizarDTO.getContrasena() != null && !actualizarDTO.getContrasena().isEmpty()) {
            usuario.setContrasena(passwordEncoder.encode(actualizarDTO.getContrasena()));
            cambios = true;
        }
        
        if (actualizarDTO.getImagenPerfil() != null) {
            usuario.setImagenPerfil(actualizarDTO.getImagenPerfil());
            cambios = true;
        }
        
        if (cambios) {
            return usuarioRepository.save(usuario);
        }
        
        return usuario;
    }
    
    public void eliminarCuenta(String idUsuario) {
        Usuario usuario = obtenerUsuarioPorId(idUsuario);
        usuarioRepository.delete(usuario);
    }
}


