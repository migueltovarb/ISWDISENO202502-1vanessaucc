package com.vehiculos.Vehiculos_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "vehiculos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {
    
    @Id
    private String id;
    
    private String marca;
    
    private String modelo;
    
    private Integer año;
    
    private String color;
    
    private String placa;
    
    private String tipo; // Sedán, SUV, Camioneta, etc.
    
    private Double precio;
    
    private Boolean disponible;
    
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaActualizacion;
}

