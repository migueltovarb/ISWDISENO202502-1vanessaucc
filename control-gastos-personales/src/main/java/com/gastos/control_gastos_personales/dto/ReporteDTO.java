package com.gastos.control_gastos_personales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteDTO {
    
    private String id;
    
    private Date fechaGeneracion;
    
    private Date periodoInicio;
    
    private Date periodoFin;
    
    private Double totalIngresos;
    
    private Double totalGastos;
    
    private Double balance;
}


