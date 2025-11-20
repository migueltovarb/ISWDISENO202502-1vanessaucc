package com.vehiculos.Vehiculos_api.service;

import com.vehiculos.Vehiculos_api.model.Vehiculo;
import com.vehiculos.Vehiculos_api.repository.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehiculoService {
    
    private final VehiculoRepository vehiculoRepository;
    
    public List<Vehiculo> obtenerTodos() {
        return vehiculoRepository.findAll();
    }
    
    public Optional<Vehiculo> obtenerPorId(String id) {
        return vehiculoRepository.findById(id);
    }
    
    public Vehiculo crear(Vehiculo vehiculo) {
        // Validar que la placa no exista
        if (vehiculo.getPlaca() != null && vehiculoRepository.existsByPlaca(vehiculo.getPlaca())) {
            throw new RuntimeException("Ya existe un vehículo con la placa: " + vehiculo.getPlaca());
        }
        
        vehiculo.setFechaCreacion(LocalDateTime.now());
        vehiculo.setFechaActualizacion(LocalDateTime.now());
        
        // Si no se especifica, el vehículo está disponible por defecto
        if (vehiculo.getDisponible() == null) {
            vehiculo.setDisponible(true);
        }
        
        return vehiculoRepository.save(vehiculo);
    }
    
    public Vehiculo actualizar(String id, Vehiculo vehiculoActualizado) {
        return vehiculoRepository.findById(id)
                .map(vehiculo -> {
                    // Validar que si se cambia la placa, no exista otra con la misma placa
                    if (vehiculoActualizado.getPlaca() != null && 
                        !vehiculoActualizado.getPlaca().equals(vehiculo.getPlaca()) &&
                        vehiculoRepository.existsByPlaca(vehiculoActualizado.getPlaca())) {
                        throw new RuntimeException("Ya existe un vehículo con la placa: " + vehiculoActualizado.getPlaca());
                    }
                    
                    vehiculo.setMarca(vehiculoActualizado.getMarca());
                    vehiculo.setModelo(vehiculoActualizado.getModelo());
                    vehiculo.setAño(vehiculoActualizado.getAño());
                    vehiculo.setColor(vehiculoActualizado.getColor());
                    vehiculo.setPlaca(vehiculoActualizado.getPlaca());
                    vehiculo.setTipo(vehiculoActualizado.getTipo());
                    vehiculo.setPrecio(vehiculoActualizado.getPrecio());
                    vehiculo.setDisponible(vehiculoActualizado.getDisponible());
                    vehiculo.setFechaActualizacion(LocalDateTime.now());
                    
                    return vehiculoRepository.save(vehiculo);
                })
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado con id: " + id));
    }
    
    public void eliminar(String id) {
        if (!vehiculoRepository.existsById(id)) {
            throw new RuntimeException("Vehículo no encontrado con id: " + id);
        }
        vehiculoRepository.deleteById(id);
    }
    
    public List<Vehiculo> obtenerPorMarca(String marca) {
        return vehiculoRepository.findByMarca(marca);
    }
    
    public List<Vehiculo> obtenerPorTipo(String tipo) {
        return vehiculoRepository.findByTipo(tipo);
    }
    
    public List<Vehiculo> obtenerPorDisponibilidad(Boolean disponible) {
        return vehiculoRepository.findByDisponible(disponible);
    }
    
    public Optional<Vehiculo> obtenerPorPlaca(String placa) {
        return vehiculoRepository.findByPlaca(placa);
    }
}

