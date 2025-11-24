package com.gastos.control_gastos_personales.dto;

import com.gastos.control_gastos_personales.model.TipoTransaccion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionDTO {
    
    private String id;
    
    @NotNull(message = "El tipo de transacción es obligatorio")
    private TipoTransaccion tipo;
    
    @NotBlank(message = "La categoría es obligatoria")
    private String idCategoria;
    
    private String descripcion;
    
    private Date fecha;
    
    @NotNull(message = "El monto es obligatorio")
    @Positive(message = "El monto debe ser mayor a cero")
    private Double monto;
}


