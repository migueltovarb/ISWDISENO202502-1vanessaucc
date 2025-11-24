package com.gastos.control_gastos_personales.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "reportes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reporte {
    
    @Id
    private String id;
    
    private String idUsuario;
    
    private Date fechaGeneracion;
    
    private Date periodoInicio;
    
    private Date periodoFin;
    
    private Double totalIngresos;
    
    private Double totalGastos;
    
    private Double balance;
}


