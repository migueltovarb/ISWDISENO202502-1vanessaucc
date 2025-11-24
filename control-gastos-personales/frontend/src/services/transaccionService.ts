import api from './api';
import { Transaccion, FiltroTransaccion, ApiResponse } from '../types';

export const transaccionService = {
  async obtenerTransacciones(filtros?: FiltroTransaccion) {
    const params = new URLSearchParams();
    if (filtros?.tipo) params.append('tipo', filtros.tipo);
    if (filtros?.idCategoria) params.append('idCategoria', filtros.idCategoria);
    if (filtros?.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros?.fechaFin) params.append('fechaFin', filtros.fechaFin);

    const url = params.toString() ? `/transacciones?${params.toString()}` : '/transacciones';
    const response = await api.get<ApiResponse<Transaccion[]>>(url);
    return response.data;
  },

  async filtrarTransacciones(filtro: FiltroTransaccion) {
    const response = await api.post<ApiResponse<Transaccion[]>>('/transacciones/filtrar', filtro);
    return response.data;
  },

  async obtenerTransaccionPorId(id: string) {
    const response = await api.get<ApiResponse<Transaccion>>(`/transacciones/${id}`);
    return response.data;
  },

  async crearTransaccion(transaccion: Omit<Transaccion, 'id'>) {
    const response = await api.post<ApiResponse<Transaccion>>('/transacciones', transaccion);
    return response.data;
  },

  async editarTransaccion(id: string, transaccion: Partial<Transaccion>) {
    const response = await api.put<ApiResponse<Transaccion>>(`/transacciones/${id}`, transaccion);
    return response.data;
  },

  async eliminarTransaccion(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/transacciones/${id}`);
    return response.data;
  },
};

