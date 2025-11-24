import api from './api';
import { Categoria, ApiResponse } from '../types';

export const categoriaService = {
  async obtenerCategorias() {
    const response = await api.get<ApiResponse<Categoria[]>>('/categorias');
    return response.data;
  },

  async obtenerCategoriaPorId(id: string) {
    const response = await api.get<ApiResponse<Categoria>>(`/categorias/${id}`);
    return response.data;
  },

  async crearCategoria(categoria: Omit<Categoria, 'id'>) {
    const response = await api.post<ApiResponse<Categoria>>('/categorias', categoria);
    return response.data;
  },

  async editarCategoria(id: string, categoria: Partial<Categoria>) {
    const response = await api.put<ApiResponse<Categoria>>(`/categorias/${id}`, categoria);
    return response.data;
  },

  async eliminarCategoria(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/categorias/${id}`);
    return response.data;
  },
};

