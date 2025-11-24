package com.gastos.control_gastos_personales.repository;

import com.gastos.control_gastos_personales.model.Reporte;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteRepository extends MongoRepository<Reporte, String> {
    
    List<Reporte> findByIdUsuario(String idUsuario);
    
    List<Reporte> findByIdUsuarioOrderByFechaGeneracionDesc(String idUsuario);
}


