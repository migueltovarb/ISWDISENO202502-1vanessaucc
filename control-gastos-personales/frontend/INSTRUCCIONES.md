# 🚀 Instrucciones para Ejecutar el Frontend

## Pasos Rápidos

1. **Abre una terminal en la carpeta `frontend`**:
   ```bash
   cd frontend
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en**: `http://localhost:3000`

## ⚠️ Importante

- **Asegúrate de que el backend esté ejecutándose** en `http://localhost:8080`
- El frontend se conectará automáticamente al backend
- Si cambias el puerto del backend, actualiza el archivo `.env` o `vite.config.ts`

## 📝 Primera Vez

1. Ve a `/registro` para crear una cuenta
2. O usa `/login` si ya tienes una cuenta
3. Una vez autenticado, podrás acceder a todas las funcionalidades

## 🎯 Funcionalidades Disponibles

- ✅ **Dashboard**: Resumen financiero con gráficos
- ✅ **Categorías**: Crear, editar y eliminar categorías
- ✅ **Transacciones**: Registrar ingresos y gastos con filtros
- ✅ **Reportes**: Generar reportes mensuales y ver balance
- ✅ **Perfil**: Actualizar información personal

## 🐛 Problemas Comunes

### Error: Cannot find module '@heroicons/react'
```bash
npm install @heroicons/react
```

### Error: Cannot find module 'recharts'
```bash
npm install recharts
```

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en el puerto 8080
- Revisa la consola del navegador para ver errores de CORS
- Asegúrate de que la URL en `vite.config.ts` sea correcta

