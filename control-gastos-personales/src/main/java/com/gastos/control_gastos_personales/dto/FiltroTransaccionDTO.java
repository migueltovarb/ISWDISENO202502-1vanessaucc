package com.gastos.control_gastos_personales.dto;

import com.gastos.control_gastos_personales.model.TipoTransaccion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FiltroTransaccionDTO {
    
    private TipoTransaccion tipo;
    
    private String idCategoria;
    
    private Date fechaInicio;
    
    private Date fechaFin;
    
    private Double montoMinimo;
    
    private Double montoMaximo;
}


