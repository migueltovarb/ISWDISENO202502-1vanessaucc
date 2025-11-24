package com.gastos.control_gastos_personales.controller;

import com.gastos.control_gastos_personales.dto.ActualizarPerfilDTO;
import com.gastos.control_gastos_personales.dto.MensajeResponseDTO;
import com.gastos.control_gastos_personales.model.Usuario;
import com.gastos.control_gastos_personales.security.UserPrincipal;
import com.gastos.control_gastos_personales.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    
    private final UsuarioService usuarioService;
    
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            Usuario usuario = usuarioService.obtenerUsuarioPorId(userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Perfil obtenido exitosamente", usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ActualizarPerfilDTO actualizarDTO) {
        try {
            Usuario usuario = usuarioService.actualizarPerfil(userPrincipal.getId(), actualizarDTO);
            return ResponseEntity.ok(new MensajeResponseDTO("Perfil actualizado exitosamente", usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/cuenta")
    public ResponseEntity<?> eliminarCuenta(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            usuarioService.eliminarCuenta(userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Cuenta eliminada exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
}


