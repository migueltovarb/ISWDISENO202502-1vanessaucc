import api from './api';
import { Balance, Reporte, ApiResponse } from '../types';

export const reporteService = {
  async obtenerBalance() {
    const response = await api.get<ApiResponse<Balance>>('/reportes/balance');
    return response.data;
  },

  async generarReporteMensual(periodoInicio: string, periodoFin: string) {
    const response = await api.post<ApiResponse<Reporte>>(
      `/reportes/mensual?periodoInicio=${periodoInicio}&periodoFin=${periodoFin}`
    );
    return response.data;
  },

  async obtenerReportes() {
    const response = await api.get<ApiResponse<Reporte[]>>('/reportes');
    return response.data;
  },

  async obtenerReportePorId(id: string) {
    const response = await api.get<ApiResponse<Reporte>>(`/reportes/${id}`);
    return response.data;
  },
};

