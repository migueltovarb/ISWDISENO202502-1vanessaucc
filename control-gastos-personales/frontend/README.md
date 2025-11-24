# Frontend - Control de Gastos Personales

Frontend desarrollado en React + TypeScript para la aplicación de Control de Gastos Personales.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Gestión de Categorías
- ✅ Gestión de Transacciones (Ingresos y Gastos)
- ✅ Dashboard con gráficos interactivos
- ✅ Reportes y balance financiero
- ✅ Gestión de perfil de usuario
- ✅ Filtros avanzados de transacciones
- ✅ Diseño moderno y responsive

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Backend ejecutándose en `http://localhost:8080`

## 🛠️ Instalación

1. Navega a la carpeta del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

## ▶️ Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Construir para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── context/          # Context API (Auth)
│   ├── pages/            # Páginas principales
│   ├── services/          # Servicios API
│   ├── types/            # Tipos TypeScript
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Punto de entrada
├── public/               # Archivos estáticos
└── package.json          # Dependencias
```

## 🔌 Configuración de la API

Por defecto, el frontend se conecta a `http://localhost:8080/api`. 

Si necesitas cambiar la URL de la API, crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://tu-servidor:8080/api
```

## 📱 Páginas Disponibles

- **Login** (`/login`) - Inicio de sesión
- **Registro** (`/registro`) - Crear nueva cuenta
- **Dashboard** (`/`) - Resumen financiero con gráficos
- **Categorías** (`/categorias`) - Gestión de categorías
- **Transacciones** (`/transacciones`) - Gestión de ingresos y gastos
- **Reportes** (`/reportes`) - Reportes y análisis financiero
- **Perfil** (`/perfil`) - Gestión de perfil de usuario

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos
- **Tailwind CSS** - Estilos
- **React Hot Toast** - Notificaciones
- **Heroicons** - Iconos

## 🔐 Autenticación

El frontend maneja automáticamente:
- Almacenamiento del token JWT en localStorage
- Inclusión del token en todas las peticiones
- Redirección automática al login si el token expira
- Protección de rutas privadas

## 📊 Gráficos

El dashboard incluye:
- Gráfico de pastel para gastos por categoría
- Gráfico de barras para transacciones por mes
- Visualización de balance en tiempo real

## 🐛 Solución de Problemas

### Error de conexión con el backend
- Verifica que el backend esté ejecutándose en el puerto 8080
- Revisa la configuración de CORS en el backend
- Verifica la URL de la API en `.env`

### Error de autenticación
- Verifica que el token JWT sea válido
- Limpia el localStorage y vuelve a iniciar sesión
- Verifica que el backend esté configurado correctamente

## 📝 Notas

- El frontend está completamente separado del backend
- No modifica ningún archivo del backend
- Todas las peticiones se hacen a través de la API REST
- El diseño es responsive y funciona en móviles y tablets

