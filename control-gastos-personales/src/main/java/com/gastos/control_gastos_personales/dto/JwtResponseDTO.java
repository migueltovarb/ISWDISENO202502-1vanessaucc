package com.gastos.control_gastos_personales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDTO {
    
    private String token;
    
    private String type = "Bearer";
    
    private String id;
    
    private String nombre;
    
    private String email;
}


