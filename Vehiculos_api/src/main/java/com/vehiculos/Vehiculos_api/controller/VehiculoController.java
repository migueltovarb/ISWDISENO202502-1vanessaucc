package com.vehiculos.Vehiculos_api.controller;

import com.vehiculos.Vehiculos_api.model.Vehiculo;
import com.vehiculos.Vehiculos_api.service.VehiculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehiculos")
@RequiredArgsConstructor
public class VehiculoController {
    
    private final VehiculoService vehiculoService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodos() {
        try {
            List<Vehiculo> vehiculos = vehiculoService.obtenerTodos();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehículos obtenidos exitosamente");
            response.put("data", vehiculos);
            response.put("total", vehiculos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al obtener vehículos: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPorId(@PathVariable String id) {
        try {
            Optional<Vehiculo> vehiculo = vehiculoService.obtenerPorId(id);
            if (vehiculo.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Vehículo obtenido exitosamente");
                response.put("data", vehiculo.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(crearRespuestaError("Vehículo no encontrado con id: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al obtener vehículo: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@RequestBody Vehiculo vehiculo) {
        try {
            Vehiculo vehiculoCreado = vehiculoService.crear(vehiculo);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehículo creado exitosamente");
            response.put("data", vehiculoCreado);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(crearRespuestaError(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al crear vehículo: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(@PathVariable String id, @RequestBody Vehiculo vehiculo) {
        try {
            Vehiculo vehiculoActualizado = vehiculoService.actualizar(id, vehiculo);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehículo actualizado exitosamente");
            response.put("data", vehiculoActualizado);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(crearRespuestaError(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al actualizar vehículo: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable String id) {
        try {
            vehiculoService.eliminar(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehículo eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(crearRespuestaError(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al eliminar vehículo: " + e.getMessage()));
        }
    }
    
    @GetMapping("/marca/{marca}")
    public ResponseEntity<Map<String, Object>> obtenerPorMarca(@PathVariable String marca) {
        try {
            List<Vehiculo> vehiculos = vehiculoService.obtenerPorMarca(marca);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehículos obtenidos por marca exitosamente");
            response.put("data", vehiculos);
            response.put("total", vehiculos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al obtener vehículos por marca: " + e.getMessage()));
        }
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<Map<String, Object>> obtenerPorTipo(@PathVariable String tipo) {
        try {
            List<Vehiculo> vehiculos = vehiculoService.obtenerPorTipo(tipo);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehículos obtenidos por tipo exitosamente");
            response.put("data", vehiculos);
            response.put("total", vehiculos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al obtener vehículos por tipo: " + e.getMessage()));
        }
    }
    
    @GetMapping("/disponible/{disponible}")
    public ResponseEntity<Map<String, Object>> obtenerPorDisponibilidad(@PathVariable Boolean disponible) {
        try {
            List<Vehiculo> vehiculos = vehiculoService.obtenerPorDisponibilidad(disponible);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehículos obtenidos por disponibilidad exitosamente");
            response.put("data", vehiculos);
            response.put("total", vehiculos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al obtener vehículos por disponibilidad: " + e.getMessage()));
        }
    }
    
    @GetMapping("/placa/{placa}")
    public ResponseEntity<Map<String, Object>> obtenerPorPlaca(@PathVariable String placa) {
        try {
            Optional<Vehiculo> vehiculo = vehiculoService.obtenerPorPlaca(placa);
            if (vehiculo.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Vehículo obtenido por placa exitosamente");
                response.put("data", vehiculo.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(crearRespuestaError("Vehículo no encontrado con placa: " + placa));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al obtener vehículo por placa: " + e.getMessage()));
        }
    }
    
    private Map<String, Object> crearRespuestaError(String mensaje) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", mensaje);
        return response;
    }
}

