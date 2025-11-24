package com.gastos.control_gastos_personales.controller;

import com.gastos.control_gastos_personales.dto.CategoriaDTO;
import com.gastos.control_gastos_personales.dto.MensajeResponseDTO;
import com.gastos.control_gastos_personales.security.UserPrincipal;
import com.gastos.control_gastos_personales.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {
    
    private final CategoriaService categoriaService;
    
    @PostMapping
    public ResponseEntity<?> crearCategoria(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CategoriaDTO categoriaDTO) {
        try {
            CategoriaDTO categoria = categoriaService.crearCategoria(userPrincipal.getId(), categoriaDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponseDTO("Categoría creada exitosamente", categoria));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> obtenerCategorias(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            List<CategoriaDTO> categorias = categoriaService.obtenerCategoriasPorUsuario(userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Categorías obtenidas exitosamente", categorias));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MensajeResponseDTO("Error al obtener categorías", null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCategoriaPorId(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        try {
            CategoriaDTO categoria = categoriaService.obtenerCategoriaPorId(id, userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Categoría obtenida exitosamente", categoria));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> editarCategoria(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id,
            @Valid @RequestBody CategoriaDTO categoriaDTO) {
        try {
            CategoriaDTO categoria = categoriaService.editarCategoria(id, userPrincipal.getId(), categoriaDTO);
            return ResponseEntity.ok(new MensajeResponseDTO("Categoría actualizada exitosamente", categoria));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        try {
            categoriaService.eliminarCategoria(id, userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Categoría eliminada exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
}


