package com.gastos.control_gastos_personales.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDTO {
    
    private String id;
    
    @NotBlank(message = "El nombre de la categoría es obligatorio")
    private String nombre;
    
    private String descripcion;
}


