package com.gastos.control_gastos_personales.controller;

import com.gastos.control_gastos_personales.dto.FiltroTransaccionDTO;
import com.gastos.control_gastos_personales.dto.MensajeResponseDTO;
import com.gastos.control_gastos_personales.dto.TransaccionDTO;
import com.gastos.control_gastos_personales.security.UserPrincipal;
import com.gastos.control_gastos_personales.service.TransaccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
@RequiredArgsConstructor
public class TransaccionController {
    
    private final TransaccionService transaccionService;
    
    @PostMapping
    public ResponseEntity<?> crearTransaccion(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody TransaccionDTO transaccionDTO) {
        try {
            TransaccionDTO transaccion = transaccionService.crearTransaccion(userPrincipal.getId(), transaccionDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponseDTO("Transacción creada exitosamente", transaccion));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> obtenerTransacciones(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String idCategoria,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaFin) {
        try {
            List<TransaccionDTO> transacciones;
            
            if (tipo != null || idCategoria != null || fechaInicio != null || fechaFin != null) {
                FiltroTransaccionDTO filtro = new FiltroTransaccionDTO();
                if (tipo != null) {
                    filtro.setTipo(com.gastos.control_gastos_personales.model.TipoTransaccion.valueOf(tipo));
                }
                filtro.setIdCategoria(idCategoria);
                filtro.setFechaInicio(fechaInicio);
                filtro.setFechaFin(fechaFin);
                transacciones = transaccionService.filtrarTransacciones(userPrincipal.getId(), filtro);
            } else {
                transacciones = transaccionService.obtenerTransaccionesPorUsuario(userPrincipal.getId());
            }
            
            return ResponseEntity.ok(new MensajeResponseDTO("Transacciones obtenidas exitosamente", transacciones));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MensajeResponseDTO("Error al obtener transacciones: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/filtrar")
    public ResponseEntity<?> filtrarTransacciones(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody FiltroTransaccionDTO filtro) {
        try {
            List<TransaccionDTO> transacciones = transaccionService.filtrarTransacciones(userPrincipal.getId(), filtro);
            return ResponseEntity.ok(new MensajeResponseDTO("Transacciones filtradas exitosamente", transacciones));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MensajeResponseDTO("Error al filtrar transacciones: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerTransaccionPorId(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        try {
            TransaccionDTO transaccion = transaccionService.obtenerTransaccionPorId(id, userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Transacción obtenida exitosamente", transaccion));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> editarTransaccion(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id,
            @Valid @RequestBody TransaccionDTO transaccionDTO) {
        try {
            TransaccionDTO transaccion = transaccionService.editarTransaccion(id, userPrincipal.getId(), transaccionDTO);
            return ResponseEntity.ok(new MensajeResponseDTO("Transacción actualizada exitosamente", transaccion));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTransaccion(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        try {
            transaccionService.eliminarTransaccion(id, userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Transacción eliminada exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
}

