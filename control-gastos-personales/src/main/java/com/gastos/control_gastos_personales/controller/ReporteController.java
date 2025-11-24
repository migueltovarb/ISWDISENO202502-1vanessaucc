package com.gastos.control_gastos_personales.controller;

import com.gastos.control_gastos_personales.dto.BalanceDTO;
import com.gastos.control_gastos_personales.dto.MensajeResponseDTO;
import com.gastos.control_gastos_personales.dto.ReporteDTO;
import com.gastos.control_gastos_personales.security.UserPrincipal;
import com.gastos.control_gastos_personales.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {
    
    private final ReporteService reporteService;
    
    @GetMapping("/balance")
    public ResponseEntity<?> obtenerBalance(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            BalanceDTO balance = reporteService.obtenerBalance(userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Balance obtenido exitosamente", balance));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MensajeResponseDTO("Error al obtener balance: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/mensual")
    public ResponseEntity<?> generarReporteMensual(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date periodoInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date periodoFin) {
        try {
            ReporteDTO reporte = reporteService.generarReporteMensual(
                userPrincipal.getId(), periodoInicio, periodoFin);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponseDTO("Reporte mensual generado exitosamente", reporte));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponseDTO("Error al generar reporte: " + e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> obtenerReportes(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            List<ReporteDTO> reportes = reporteService.obtenerReportesPorUsuario(userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Reportes obtenidos exitosamente", reportes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MensajeResponseDTO("Error al obtener reportes: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerReportePorId(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        try {
            ReporteDTO reporte = reporteService.obtenerReportePorId(id, userPrincipal.getId());
            return ResponseEntity.ok(new MensajeResponseDTO("Reporte obtenido exitosamente", reporte));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MensajeResponseDTO(e.getMessage(), null));
        }
    }
}


