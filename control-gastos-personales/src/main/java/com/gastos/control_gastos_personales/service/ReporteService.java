package com.gastos.control_gastos_personales.service;

import com.gastos.control_gastos_personales.dto.BalanceDTO;
import com.gastos.control_gastos_personales.dto.ReporteDTO;
import com.gastos.control_gastos_personales.model.Reporte;
import com.gastos.control_gastos_personales.model.TipoTransaccion;
import com.gastos.control_gastos_personales.model.Transaccion;
import com.gastos.control_gastos_personales.repository.ReporteRepository;
import com.gastos.control_gastos_personales.repository.TransaccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {
    
    private final ReporteRepository reporteRepository;
    private final TransaccionRepository transaccionRepository;
    
    public ReporteDTO generarReporteMensual(String idUsuario, Date periodoInicio, Date periodoFin) {
        List<Transaccion> transacciones = transaccionRepository.findByIdUsuarioAndFechaBetween(
            idUsuario, periodoInicio, periodoFin
        );
        
        Double totalIngresos = transacciones.stream()
            .filter(t -> t.getTipo() == TipoTransaccion.INGRESO)
            .mapToDouble(Transaccion::getMonto)
            .sum();
        
        Double totalGastos = transacciones.stream()
            .filter(t -> t.getTipo() == TipoTransaccion.EGRESO)
            .mapToDouble(Transaccion::getMonto)
            .sum();
        
        Double balance = totalIngresos - totalGastos;
        
        Reporte reporte = new Reporte();
        reporte.setIdUsuario(idUsuario);
        reporte.setFechaGeneracion(new Date());
        reporte.setPeriodoInicio(periodoInicio);
        reporte.setPeriodoFin(periodoFin);
        reporte.setTotalIngresos(totalIngresos);
        reporte.setTotalGastos(totalGastos);
        reporte.setBalance(balance);
        
        Reporte reporteGuardado = reporteRepository.save(reporte);
        
        return convertirADTO(reporteGuardado);
    }
    
    public BalanceDTO obtenerBalance(String idUsuario) {
        List<Transaccion> transacciones = transaccionRepository.findByIdUsuario(idUsuario);
        
        Double totalIngresos = transacciones.stream()
            .filter(t -> t.getTipo() == TipoTransaccion.INGRESO)
            .mapToDouble(Transaccion::getMonto)
            .sum();
        
        Double totalGastos = transacciones.stream()
            .filter(t -> t.getTipo() == TipoTransaccion.EGRESO)
            .mapToDouble(Transaccion::getMonto)
            .sum();
        
        Double balance = totalIngresos - totalGastos;
        
        // Gastos por categoría
        Map<String, Double> gastosPorCategoria = transacciones.stream()
            .filter(t -> t.getTipo() == TipoTransaccion.EGRESO)
            .collect(Collectors.groupingBy(
                Transaccion::getIdCategoria,
                Collectors.summingDouble(Transaccion::getMonto)
            ));
        
        List<Map<String, Object>> gastosPorCategoriaList = gastosPorCategoria.entrySet().stream()
            .map(entry -> {
                Map<String, Object> item = new HashMap<>();
                item.put("idCategoria", entry.getKey());
                item.put("total", entry.getValue());
                return item;
            })
            .collect(Collectors.toList());
        
        // Ingresos por categoría
        Map<String, Double> ingresosPorCategoria = transacciones.stream()
            .filter(t -> t.getTipo() == TipoTransaccion.INGRESO)
            .collect(Collectors.groupingBy(
                Transaccion::getIdCategoria,
                Collectors.summingDouble(Transaccion::getMonto)
            ));
        
        List<Map<String, Object>> ingresosPorCategoriaList = ingresosPorCategoria.entrySet().stream()
            .map(entry -> {
                Map<String, Object> item = new HashMap<>();
                item.put("idCategoria", entry.getKey());
                item.put("total", entry.getValue());
                return item;
            })
            .collect(Collectors.toList());
        
        // Transacciones por mes
        Calendar cal = Calendar.getInstance();
        Map<String, Map<String, Double>> transaccionesPorMes = new HashMap<>();
        
        for (Transaccion t : transacciones) {
            cal.setTime(t.getFecha());
            String mesAnio = String.format("%04d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1);
            
            transaccionesPorMes.putIfAbsent(mesAnio, new HashMap<>());
            Map<String, Double> mesData = transaccionesPorMes.get(mesAnio);
            
            String tipo = t.getTipo().toString();
            mesData.put(tipo, mesData.getOrDefault(tipo, 0.0) + t.getMonto());
        }
        
        List<Map<String, Object>> transaccionesPorMesList = transaccionesPorMes.entrySet().stream()
            .map(entry -> {
                Map<String, Object> item = new HashMap<>();
                item.put("mes", entry.getKey());
                item.put("ingresos", entry.getValue().getOrDefault("INGRESO", 0.0));
                item.put("gastos", entry.getValue().getOrDefault("EGRESO", 0.0));
                return item;
            })
            .collect(Collectors.toList());
        
        BalanceDTO balanceDTO = new BalanceDTO();
        balanceDTO.setTotalIngresos(totalIngresos);
        balanceDTO.setTotalGastos(totalGastos);
        balanceDTO.setBalance(balance);
        balanceDTO.setGastosPorCategoria(gastosPorCategoriaList);
        balanceDTO.setIngresosPorCategoria(ingresosPorCategoriaList);
        balanceDTO.setTransaccionesPorMes(transaccionesPorMesList);
        
        return balanceDTO;
    }
    
    public List<ReporteDTO> obtenerReportesPorUsuario(String idUsuario) {
        return reporteRepository.findByIdUsuarioOrderByFechaGeneracionDesc(idUsuario)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    public ReporteDTO obtenerReportePorId(String id, String idUsuario) {
        Reporte reporte = reporteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
        
        if (!reporte.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permiso para acceder a este reporte");
        }
        
        return convertirADTO(reporte);
    }
    
    private ReporteDTO convertirADTO(Reporte reporte) {
        ReporteDTO dto = new ReporteDTO();
        dto.setId(reporte.getId());
        dto.setFechaGeneracion(reporte.getFechaGeneracion());
        dto.setPeriodoInicio(reporte.getPeriodoInicio());
        dto.setPeriodoFin(reporte.getPeriodoFin());
        dto.setTotalIngresos(reporte.getTotalIngresos());
        dto.setTotalGastos(reporte.getTotalGastos());
        dto.setBalance(reporte.getBalance());
        return dto;
    }
}


