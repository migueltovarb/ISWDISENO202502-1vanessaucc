export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  fechaRegistro: string;
  imagenPerfil?: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export type TipoTransaccion = 'EGRESO' | 'INGRESO';

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  idCategoria: string;
  descripcion: string;
  fecha: string;
  monto: number;
}

export interface Reporte {
  id: string;
  fechaGeneracion: string;
  periodoInicio: string;
  periodoFin: string;
  totalIngresos: number;
  totalGastos: number;
  balance: number;
}

export interface Balance {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  gastosPorCategoria: Array<{ idCategoria: string; total: number }>;
  ingresosPorCategoria: Array<{ idCategoria: string; total: number }>;
  transaccionesPorMes: Array<{ mes: string; ingresos: number; gastos: number }>;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: string;
  nombre: string;
  email: string;
}

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

export interface FiltroTransaccion {
  tipo?: TipoTransaccion;
  idCategoria?: string;
  fechaInicio?: string;
  fechaFin?: string;
  montoMinimo?: number;
  montoMaximo?: number;
}

