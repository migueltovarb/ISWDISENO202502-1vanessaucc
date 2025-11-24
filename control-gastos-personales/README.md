# 💰 Control de Gastos Personales

Sistema completo de gestión de gastos personales con backend en Spring Boot y frontend en React + TypeScript.

## 🔐 Credenciales de Prueba

Para probar la aplicación, puedes usar estas credenciales o crear una cuenta nueva:

**Usuario de prueba:**
- **Email:** `juan@example.com`
- **Contraseña:** `password123`

O registra un nuevo usuario desde la página de registro.

---

## 🚀 Inicio Rápido

### Backend (Spring Boot)
```bash
# Ejecutar el backend
./mvnw spring-boot:run
```
El backend estará disponible en `http://localhost:8080`

### Frontend (React)
```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```
El frontend estará disponible en `http://localhost:3000`

---

## 📋 Requisitos

- **Java 17+**
- **Maven 3.6+**
- **MongoDB** (local o Atlas)
- **Node.js 18+** y npm

---

## ✨ Funcionalidades Implementadas

### Historias de Usuario Completadas

✅ **HU001** - Registro de usuario  
✅ **HU002** - Inicio de sesión  
✅ **HU003** - Edición de perfil  
✅ **HU004** - Registrar gasto/ingreso  
✅ **HU005** - Editar y eliminar gasto  
✅ **HU006** - Filtrar gastos  
✅ **HU007** - Ver balance con gráficos  
✅ **HU008** - Generar informe mensual  
✅ **HU009** - Exportar Excel/PDF (preparado para implementar)  
✅ **HU010** - Autenticación con JWT  
✅ **HU011** - Evitar acceso no autorizado  
✅ **HU013** - Sistema modular  
✅ **HU014** - Migración a la nube (preparado)  
✅ **HU015** - Recuperación ante fallos

---

## 🏗️ Arquitectura del Proyecto

```
control-gastos-personales/
├── src/main/java/com/gastos/control_gastos_personales/
│   ├── config/          # Configuración (JWT, CORS, MongoDB)
│   ├── controller/      # Controladores REST
│   ├── dto/             # Data Transfer Objects
│   ├── exception/       # Manejo de excepciones
│   ├── model/           # Modelos de datos (MongoDB)
│   ├── repository/      # Repositorios (MongoDB)
│   ├── security/        # Seguridad (JWT, filtros)
│   └── service/         # Lógica de negocio
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── context/     # Context API (Auth)
│   │   ├── pages/       # Páginas principales
│   │   ├── services/    # Servicios API
│   │   └── types/       # Tipos TypeScript
└── pom.xml              # Dependencias Maven
```

---

## 🔌 API Endpoints

Consulta la documentación completa de endpoints en: [ENDPOINTS_POSTMAN.md](ENDPOINTS_POSTMAN.md)

**Principales endpoints:**
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/usuarios/perfil` - Obtener perfil
- `GET /api/categorias` - Listar categorías
- `POST /api/transacciones` - Crear transacción
- `GET /api/reportes/balance` - Ver balance

---

## 🗄️ Base de Datos

El proyecto usa **MongoDB** con las siguientes colecciones:

- `usuarios` - Información de usuarios
- `categorias` - Categorías de gastos/ingresos
- `transacciones` - Registro de gastos e ingresos
- `reportes` - Reportes mensuales generados

---

## 🔐 Seguridad

- Autenticación con JWT (JSON Web Tokens)
- Contraseñas encriptadas con BCrypt
- Validación de acceso por usuario
- CORS configurado para desarrollo
- Tokens con expiración de 24 horas

---

## 📊 Frontend

El frontend incluye:
- Dashboard con gráficos interactivos (Recharts)
- Gestión completa de categorías y transacciones
- Filtros avanzados de transacciones
- Reportes y balance financiero
- Diseño responsive con Tailwind CSS
- Notificaciones con React Hot Toast

Más información en: [frontend/README.md](frontend/README.md)

---

## 🛠️ Configuración

### application.properties
```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/control_gastos

# JWT
jwt.secret=tu-clave-secreta-muy-segura
jwt.expiration=86400000

# Puerto
server.port=8080
```

---

## 📝 Documentación Adicional

- [ENDPOINTS_POSTMAN.md](ENDPOINTS_POSTMAN.md) - Documentación completa de la API
- [FRONTEND_COMPLETO.md](FRONTEND_COMPLETO.md) - Detalles del frontend
- [frontend/README.md](frontend/README.md) - Guía del frontend
- [HELP.md](HELP.md) - Información de Spring Boot

---

## 🤝 Contribuir

1. Clona el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión eficiente de gastos personales.
