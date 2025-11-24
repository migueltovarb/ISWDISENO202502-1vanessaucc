package com.gastos.control_gastos_personales.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "transacciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaccion {
    
    @Id
    private String id;
    
    private TipoTransaccion tipo;
    
    private String idCategoria;
    
    private String idUsuario;
    
    private String descripcion;
    
    private Date fecha;
    
    private Double monto;
    
    private Date fechaCreacion;
    
    private Date fechaModificacion;
}


