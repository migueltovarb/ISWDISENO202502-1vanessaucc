package com.gastos.control_gastos_personales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BalanceDTO {
    
    private Double totalIngresos;
    
    private Double totalGastos;
    
    private Double balance;
    
    private List<Map<String, Object>> gastosPorCategoria;
    
    private List<Map<String, Object>> ingresosPorCategoria;
    
    private List<Map<String, Object>> transaccionesPorMes;
}


