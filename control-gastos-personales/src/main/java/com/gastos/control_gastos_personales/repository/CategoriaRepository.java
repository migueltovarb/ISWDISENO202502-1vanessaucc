package com.gastos.control_gastos_personales.repository;

import com.gastos.control_gastos_personales.model.Categoria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends MongoRepository<Categoria, String> {
    
    List<Categoria> findByIdUsuario(String idUsuario);
    
    boolean existsByIdAndIdUsuario(String id, String idUsuario);
}


