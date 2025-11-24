package com.gastos.control_gastos_personales.repository;

import com.gastos.control_gastos_personales.model.TipoTransaccion;
import com.gastos.control_gastos_personales.model.Transaccion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TransaccionRepository extends MongoRepository<Transaccion, String> {
    
    List<Transaccion> findByIdUsuario(String idUsuario);
    
    List<Transaccion> findByIdUsuarioAndTipo(String idUsuario, TipoTransaccion tipo);
    
    List<Transaccion> findByIdUsuarioAndIdCategoria(String idUsuario, String idCategoria);
    
    List<Transaccion> findByIdUsuarioAndFechaBetween(String idUsuario, Date fechaInicio, Date fechaFin);
    
    @Query("{ 'idUsuario': ?0, 'tipo': ?1, 'fecha': { $gte: ?2, $lte: ?3 } }")
    List<Transaccion> findByIdUsuarioAndTipoAndFechaBetween(String idUsuario, TipoTransaccion tipo, Date fechaInicio, Date fechaFin);
    
    @Query("{ 'idUsuario': ?0, 'fecha': { $gte: ?1, $lte: ?2 }, 'monto': { $gte: ?3, $lte: ?4 } }")
    List<Transaccion> findByIdUsuarioAndFechaBetweenAndMontoBetween(String idUsuario, Date fechaInicio, Date fechaFin, Double montoMinimo, Double montoMaximo);
    
    boolean existsByIdAndIdUsuario(String id, String idUsuario);
}


