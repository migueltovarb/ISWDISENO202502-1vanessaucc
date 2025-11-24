package com.gastos.control_gastos_personales.service;

import com.gastos.control_gastos_personales.dto.FiltroTransaccionDTO;
import com.gastos.control_gastos_personales.dto.TransaccionDTO;
import com.gastos.control_gastos_personales.model.Transaccion;
import com.gastos.control_gastos_personales.repository.CategoriaRepository;
import com.gastos.control_gastos_personales.repository.TransaccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransaccionService {
    
    private final TransaccionRepository transaccionRepository;
    private final CategoriaRepository categoriaRepository;
    
    public TransaccionDTO crearTransaccion(String idUsuario, TransaccionDTO transaccionDTO) {
        // Validar que la categoría existe y pertenece al usuario
        if (!categoriaRepository.existsByIdAndIdUsuario(transaccionDTO.getIdCategoria(), idUsuario)) {
            throw new RuntimeException("Categoría no encontrada o no pertenece al usuario");
        }
        
        Transaccion transaccion = new Transaccion();
        transaccion.setTipo(transaccionDTO.getTipo());
        transaccion.setIdCategoria(transaccionDTO.getIdCategoria());
        transaccion.setIdUsuario(idUsuario);
        transaccion.setDescripcion(transaccionDTO.getDescripcion());
        transaccion.setFecha(transaccionDTO.getFecha() != null ? transaccionDTO.getFecha() : new Date());
        transaccion.setMonto(transaccionDTO.getMonto());
        transaccion.setFechaCreacion(new Date());
        transaccion.setFechaModificacion(new Date());
        
        Transaccion transaccionGuardada = transaccionRepository.save(transaccion);
        
        return convertirADTO(transaccionGuardada);
    }
    
    public List<TransaccionDTO> obtenerTransaccionesPorUsuario(String idUsuario) {
        return transaccionRepository.findByIdUsuario(idUsuario)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    public List<TransaccionDTO> filtrarTransacciones(String idUsuario, FiltroTransaccionDTO filtro) {
        List<Transaccion> transacciones;
        
        if (filtro.getTipo() != null && filtro.getFechaInicio() != null && filtro.getFechaFin() != null) {
            transacciones = transaccionRepository.findByIdUsuarioAndTipoAndFechaBetween(
                idUsuario, filtro.getTipo(), filtro.getFechaInicio(), filtro.getFechaFin()
            );
        } else if (filtro.getTipo() != null) {
            transacciones = transaccionRepository.findByIdUsuarioAndTipo(idUsuario, filtro.getTipo());
        } else if (filtro.getIdCategoria() != null) {
            transacciones = transaccionRepository.findByIdUsuarioAndIdCategoria(idUsuario, filtro.getIdCategoria());
        } else if (filtro.getFechaInicio() != null && filtro.getFechaFin() != null) {
            if (filtro.getMontoMinimo() != null && filtro.getMontoMaximo() != null) {
                transacciones = transaccionRepository.findByIdUsuarioAndFechaBetweenAndMontoBetween(
                    idUsuario, filtro.getFechaInicio(), filtro.getFechaFin(),
                    filtro.getMontoMinimo(), filtro.getMontoMaximo()
                );
            } else {
                transacciones = transaccionRepository.findByIdUsuarioAndFechaBetween(
                    idUsuario, filtro.getFechaInicio(), filtro.getFechaFin()
                );
            }
        } else {
            transacciones = transaccionRepository.findByIdUsuario(idUsuario);
        }
        
        return transacciones.stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    public TransaccionDTO obtenerTransaccionPorId(String id, String idUsuario) {
        Transaccion transaccion = transaccionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        
        if (!transaccion.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permiso para acceder a esta transacción");
        }
        
        return convertirADTO(transaccion);
    }
    
    public TransaccionDTO editarTransaccion(String id, String idUsuario, TransaccionDTO transaccionDTO) {
        Transaccion transaccion = transaccionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        
        if (!transaccion.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permiso para editar esta transacción");
        }
        
        // Validar categoría si se cambia
        if (transaccionDTO.getIdCategoria() != null && 
            !transaccionDTO.getIdCategoria().equals(transaccion.getIdCategoria())) {
            if (!categoriaRepository.existsByIdAndIdUsuario(transaccionDTO.getIdCategoria(), idUsuario)) {
                throw new RuntimeException("Categoría no encontrada o no pertenece al usuario");
            }
        }
        
        if (transaccionDTO.getTipo() != null) {
            transaccion.setTipo(transaccionDTO.getTipo());
        }
        if (transaccionDTO.getIdCategoria() != null) {
            transaccion.setIdCategoria(transaccionDTO.getIdCategoria());
        }
        if (transaccionDTO.getDescripcion() != null) {
            transaccion.setDescripcion(transaccionDTO.getDescripcion());
        }
        if (transaccionDTO.getFecha() != null) {
            transaccion.setFecha(transaccionDTO.getFecha());
        }
        if (transaccionDTO.getMonto() != null) {
            transaccion.setMonto(transaccionDTO.getMonto());
        }
        transaccion.setFechaModificacion(new Date());
        
        Transaccion transaccionActualizada = transaccionRepository.save(transaccion);
        
        return convertirADTO(transaccionActualizada);
    }
    
    public void eliminarTransaccion(String id, String idUsuario) {
        Transaccion transaccion = transaccionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        
        if (!transaccion.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permiso para eliminar esta transacción");
        }
        
        transaccionRepository.delete(transaccion);
    }
    
    private TransaccionDTO convertirADTO(Transaccion transaccion) {
        TransaccionDTO dto = new TransaccionDTO();
        dto.setId(transaccion.getId());
        dto.setTipo(transaccion.getTipo());
        dto.setIdCategoria(transaccion.getIdCategoria());
        dto.setDescripcion(transaccion.getDescripcion());
        dto.setFecha(transaccion.getFecha());
        dto.setMonto(transaccion.getMonto());
        return dto;
    }
}


