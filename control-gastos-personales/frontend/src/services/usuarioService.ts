import api from './api';
import { Usuario, ApiResponse } from '../types';

export const usuarioService = {
  async obtenerPerfil() {
    const response = await api.get<ApiResponse<Usuario>>('/usuarios/perfil');
    return response.data;
  },

  async actualizarPerfil(data: Partial<Usuario>) {
    const response = await api.put<ApiResponse<Usuario>>('/usuarios/perfil', data);
    return response.data;
  },

  async eliminarCuenta() {
    const response = await api.delete<ApiResponse<null>>('/usuarios/cuenta');
    return response.data;
  },
};

