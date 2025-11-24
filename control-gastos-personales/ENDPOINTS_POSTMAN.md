# Documentación de Endpoints - Control de Gastos Personales

## Base URL
```
http://localhost:8080
```

## Autenticación
Todos los endpoints (excepto `/api/auth/**`) requieren un token JWT en el header:
```
Authorization: Bearer {token}
```

---

## 1. AUTENTICACIÓN

### HU001 - Registro de Usuario
**POST** `/api/auth/registro`

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contrasena": "password123"
}
```

**Response (201):**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

### HU002 - Inicio de Sesión
**POST** `/api/auth/login`

**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "contrasena": "password123"
}
```

**Response (200):**
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

## 2. GESTIÓN DE PERFIL

### HU003 - Obtener Perfil
**GET** `/api/usuarios/perfil`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Perfil obtenido exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "fechaRegistro": "2024-01-15T10:30:00.000Z",
    "imagenPerfil": null
  }
}
```

---

### HU003 - Actualizar Perfil
**PUT** `/api/usuarios/perfil`

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "nombre": "Juan Carlos Pérez",
  "email": "juancarlos@example.com",
  "contrasena": "nuevapassword123",
  "imagenPerfil": "https://example.com/imagen.jpg"
}
```

**Nota:** Todos los campos son opcionales. Solo incluye los que quieres actualizar.

**Response (200):**
```json
{
  "mensaje": "Perfil actualizado exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Carlos Pérez",
    "email": "juancarlos@example.com",
    "fechaRegistro": "2024-01-15T10:30:00.000Z",
    "imagenPerfil": "https://example.com/imagen.jpg"
  }
}
```

---

### Eliminar Cuenta
**DELETE** `/api/usuarios/cuenta`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Cuenta eliminada exitosamente",
  "data": null
}
```

---

## 3. GESTIÓN DE CATEGORÍAS

### Crear Categoría
**POST** `/api/categorias`

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "nombre": "Alimentación",
  "descripcion": "Gastos en comida y restaurantes"
}
```

**Response (201):**
```json
{
  "mensaje": "Categoría creada exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "nombre": "Alimentación",
    "descripcion": "Gastos en comida y restaurantes"
  }
}
```

---

### Obtener Todas las Categorías
**GET** `/api/categorias`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "nombre": "Alimentación",
      "descripcion": "Gastos en comida y restaurantes"
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "nombre": "Transporte",
      "descripcion": "Gastos en transporte"
    }
  ]
}
```

---

### Obtener Categoría por ID
**GET** `/api/categorias/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Categoría obtenida exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "nombre": "Alimentación",
    "descripcion": "Gastos en comida y restaurantes"
  }
}
```

---

### Editar Categoría
**PUT** `/api/categorias/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "nombre": "Comida y Bebidas",
  "descripcion": "Gastos en comida, restaurantes y bebidas"
}
```

**Response (200):**
```json
{
  "mensaje": "Categoría actualizada exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "nombre": "Comida y Bebidas",
    "descripcion": "Gastos en comida, restaurantes y bebidas"
  }
}
```

---

### Eliminar Categoría
**DELETE** `/api/categorias/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Categoría eliminada exitosamente",
  "data": null
}
```

---

## 4. GESTIÓN DE TRANSACCIONES

### HU004 - Registrar Gasto/Ingreso
**POST** `/api/transacciones`

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "tipo": "EGRESO",
  "idCategoria": "507f1f77bcf86cd799439012",
  "descripcion": "Compra en supermercado",
  "fecha": "2024-01-20T10:30:00.000Z",
  "monto": 150.50
}
```

**Tipos:** `EGRESO` o `INGRESO`

**Nota:** Si no envías `fecha`, se usará la fecha actual.

**Response (201):**
```json
{
  "mensaje": "Transacción creada exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "tipo": "EGRESO",
    "idCategoria": "507f1f77bcf86cd799439012",
    "descripcion": "Compra en supermercado",
    "fecha": "2024-01-20T10:30:00.000Z",
    "monto": 150.50
  }
}
```

---

### HU005 - Obtener Todas las Transacciones
**GET** `/api/transacciones`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Transacciones obtenidas exitosamente",
  "data": [
    {
      "id": "507f1f77bcf86cd799439014",
      "tipo": "EGRESO",
      "idCategoria": "507f1f77bcf86cd799439012",
      "descripcion": "Compra en supermercado",
      "fecha": "2024-01-20T10:30:00.000Z",
      "monto": 150.50
    }
  ]
}
```

---

### HU006 - Filtrar Transacciones (Query Parameters)
**GET** `/api/transacciones?tipo=EGRESO&fechaInicio=2024-01-01&fechaFin=2024-01-31`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `tipo`: `EGRESO` o `INGRESO` (opcional)
- `idCategoria`: ID de la categoría (opcional)
- `fechaInicio`: Fecha inicio (formato: YYYY-MM-DD) (opcional)
- `fechaFin`: Fecha fin (formato: YYYY-MM-DD) (opcional)

**Ejemplo:**
```
GET /api/transacciones?tipo=EGRESO&idCategoria=507f1f77bcf86cd799439012
```

**Response (200):**
```json
{
  "mensaje": "Transacciones obtenidas exitosamente",
  "data": [...]
}
```

---

### HU006 - Filtrar Transacciones (Body)
**POST** `/api/transacciones/filtrar`

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "tipo": "EGRESO",
  "idCategoria": "507f1f77bcf86cd799439012",
  "fechaInicio": "2024-01-01T00:00:00.000Z",
  "fechaFin": "2024-01-31T23:59:59.000Z",
  "montoMinimo": 50.0,
  "montoMaximo": 500.0
}
```

**Nota:** Todos los campos del filtro son opcionales.

**Response (200):**
```json
{
  "mensaje": "Transacciones filtradas exitosamente",
  "data": [...]
}
```

---

### HU005 - Obtener Transacción por ID
**GET** `/api/transacciones/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Transacción obtenida exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "tipo": "EGRESO",
    "idCategoria": "507f1f77bcf86cd799439012",
    "descripcion": "Compra en supermercado",
    "fecha": "2024-01-20T10:30:00.000Z",
    "monto": 150.50
  }
}
```

---

### HU005 - Editar Transacción
**PUT** `/api/transacciones/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "tipo": "EGRESO",
  "idCategoria": "507f1f77bcf86cd799439012",
  "descripcion": "Compra en supermercado actualizada",
  "fecha": "2024-01-21T10:30:00.000Z",
  "monto": 175.00
}
```

**Nota:** Todos los campos son opcionales. Solo incluye los que quieres actualizar.

**Response (200):**
```json
{
  "mensaje": "Transacción actualizada exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "tipo": "EGRESO",
    "idCategoria": "507f1f77bcf86cd799439012",
    "descripcion": "Compra en supermercado actualizada",
    "fecha": "2024-01-21T10:30:00.000Z",
    "monto": 175.00
  }
}
```

---

### HU005 - Eliminar Transacción
**DELETE** `/api/transacciones/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Transacción eliminada exitosamente",
  "data": null
}
```

---

## 5. REPORTES Y BALANCE

### HU007 - Ver Balance con Gráficos
**GET** `/api/reportes/balance`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Balance obtenido exitosamente",
  "data": {
    "totalIngresos": 5000.00,
    "totalGastos": 3200.50,
    "balance": 1799.50,
    "gastosPorCategoria": [
      {
        "idCategoria": "507f1f77bcf86cd799439012",
        "total": 1500.00
      },
      {
        "idCategoria": "507f1f77bcf86cd799439013",
        "total": 800.50
      }
    ],
    "ingresosPorCategoria": [
      {
        "idCategoria": "507f1f77bcf86cd799439014",
        "total": 5000.00
      }
    ],
    "transaccionesPorMes": [
      {
        "mes": "2024-01",
        "ingresos": 5000.00,
        "gastos": 3200.50
      }
    ]
  }
}
```

---

### HU008 - Generar Reporte Mensual
**POST** `/api/reportes/mensual?periodoInicio=2024-01-01&periodoFin=2024-01-31`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `periodoInicio`: Fecha inicio (formato: YYYY-MM-DD)
- `periodoFin`: Fecha fin (formato: YYYY-MM-DD)

**Ejemplo:**
```
POST /api/reportes/mensual?periodoInicio=2024-01-01&periodoFin=2024-01-31
```

**Response (201):**
```json
{
  "mensaje": "Reporte mensual generado exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439015",
    "fechaGeneracion": "2024-01-31T23:59:59.000Z",
    "periodoInicio": "2024-01-01T00:00:00.000Z",
    "periodoFin": "2024-01-31T23:59:59.000Z",
    "totalIngresos": 5000.00,
    "totalGastos": 3200.50,
    "balance": 1799.50
  }
}
```

---

### Obtener Todos los Reportes
**GET** `/api/reportes`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Reportes obtenidos exitosamente",
  "data": [
    {
      "id": "507f1f77bcf86cd799439015",
      "fechaGeneracion": "2024-01-31T23:59:59.000Z",
      "periodoInicio": "2024-01-01T00:00:00.000Z",
      "periodoFin": "2024-01-31T23:59:59.000Z",
      "totalIngresos": 5000.00,
      "totalGastos": 3200.50,
      "balance": 1799.50
    }
  ]
}
```

---

### Obtener Reporte por ID
**GET** `/api/reportes/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensaje": "Reporte obtenido exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439015",
    "fechaGeneracion": "2024-01-31T23:59:59.000Z",
    "periodoInicio": "2024-01-01T00:00:00.000Z",
    "periodoFin": "2024-01-31T23:59:59.000Z",
    "totalIngresos": 5000.00,
    "totalGastos": 3200.50,
    "balance": 1799.50
  }
}
```

---

## FLUJO DE TRABAJO RECOMENDADO

1. **Registrar Usuario** → `POST /api/auth/registro`
2. **Iniciar Sesión** → `POST /api/auth/login` (guarda el token)
3. **Crear Categorías** → `POST /api/categorias` (crea al menos 2-3 categorías)
4. **Registrar Transacciones** → `POST /api/transacciones` (crea ingresos y gastos)
5. **Ver Balance** → `GET /api/reportes/balance`
6. **Generar Reporte Mensual** → `POST /api/reportes/mensual`
7. **Filtrar Transacciones** → `GET /api/transacciones?tipo=EGRESO`

---

## NOTAS IMPORTANTES

- **Todos los endpoints requieren autenticación JWT** (excepto `/api/auth/**`)
- El token JWT tiene una validez de 24 horas (configurable en `application.properties`)
- Las fechas deben estar en formato ISO 8601 o usar el formato especificado
- Los montos deben ser números positivos
- Cada usuario solo puede acceder a sus propios datos (validación automática)
- Todas las acciones se registran en la tabla de auditoría

---

## CÓDIGOS DE RESPUESTA

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error en los datos enviados
- **401 Unauthorized**: Token inválido o ausente
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor


