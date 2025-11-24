package com.gastos.control_gastos_personales.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    private String id;
    
    private String nombre;
    
    @Indexed(unique = true)
    private String email;
    
    private String contrasena;
    
    private Date fechaRegistro;
    
    private String imagenPerfil;
}


