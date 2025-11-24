package com.gastos.control_gastos_personales.controller;

import com.gastos.control_gastos_personales.dto.JwtResponseDTO;
import com.gastos.control_gastos_personales.dto.LoginDTO;
import com.gastos.control_gastos_personales.dto.MensajeResponseDTO;
import com.gastos.control_gastos_personales.dto.RegistroUsuarioDTO;
import com.gastos.control_gastos_personales.security.JwtTokenProvider;
import com.gastos.control_gastos_personales.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UsuarioService usuarioService;
    
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody RegistroUsuarioDTO registroDTO) {
        try {
            JwtResponseDTO jwtResponse = usuarioService.registrarUsuario(registroDTO);
            String token = tokenProvider.generateTokenFromUserId(jwtResponse.getId());
            jwtResponse.setToken(token);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponseDTO("Usuario registrado exitosamente", jwtResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> iniciarSesion(@Valid @RequestBody LoginDTO loginDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginDTO.getEmail(),
                    loginDTO.getContrasena()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(authentication);
            
            com.gastos.control_gastos_personales.model.Usuario usuario = usuarioService.obtenerUsuarioPorEmail(loginDTO.getEmail());
            
            JwtResponseDTO jwtResponse = new JwtResponseDTO(
                token,
                "Bearer",
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail()
            );
            
            return ResponseEntity.ok(new MensajeResponseDTO("Inicio de sesión exitoso", jwtResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MensajeResponseDTO("Email o contraseña incorrectos", null));
        }
    }
}


