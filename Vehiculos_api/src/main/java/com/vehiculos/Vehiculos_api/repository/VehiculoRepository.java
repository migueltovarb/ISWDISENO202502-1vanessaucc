package com.vehiculos.Vehiculos_api.repository;

import com.vehiculos.Vehiculos_api.model.Vehiculo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculoRepository extends MongoRepository<Vehiculo, String> {
    
    Optional<Vehiculo> findByPlaca(String placa);
    
    List<Vehiculo> findByMarca(String marca);
    
    List<Vehiculo> findByTipo(String tipo);
    
    List<Vehiculo> findByDisponible(Boolean disponible);
    
    boolean existsByPlaca(String placa);
}

