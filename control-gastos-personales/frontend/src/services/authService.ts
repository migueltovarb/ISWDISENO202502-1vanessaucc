import api from './api';
import { JwtResponse, ApiResponse } from '../types';

export const authService = {
  async registro(nombre: string, email: string, contrasena: string) {
    const response = await api.post<ApiResponse<JwtResponse>>('/auth/registro', {
      nombre,
      email,
      contrasena,
    });
    return response.data;
  },

  async login(email: string, contrasena: string) {
    const response = await api.post<ApiResponse<JwtResponse>>('/auth/login', {
      email,
      contrasena,
    });
    return response.data;
  },
};

