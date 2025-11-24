import { useEffect, useState } from 'react';
import { reporteService } from '../services/reporteService';
import { categoriaService } from '../services/categoriaService';
import { Reporte, Balance, Categoria } from '../types';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import {
  DocumentArrowDownIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { balanceDemo, categoriasDemo } from '../data/datosDemo';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Reportes = () => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodoInicio, setPeriodoInicio] = useState(
    format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')
  );
  const [periodoFin, setPeriodoFin] = useState(
    format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')
  );

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar balance
      const balanceRes = await reporteService.obtenerBalance();
      
      // Cargar reportes
      let reportesData: Reporte[] = [];
      try {
        const reportesRes = await reporteService.obtenerReportes();
        reportesData = reportesRes.data || [];
      } catch (err) {
        console.log('No hay reportes generados aún');
      }
      
      // Cargar categorías
      let categoriasData: Categoria[] = [];
      try {
        const categoriasRes = await categoriaService.obtenerCategorias();
        categoriasData = categoriasRes.data || [];
      } catch (err) {
        console.log('No hay categorías aún');
      }
      
      // Si no hay transacciones, usar datos de demostración
      if (balanceRes.data.totalIngresos === 0 && balanceRes.data.totalGastos === 0) {
        setBalance(balanceDemo);
        setCategorias(categoriasDemo);
      } else {
        setBalance(balanceRes.data);
        setCategorias(categoriasData);
      }
      setReportes(reportesData);
    } catch (error: any) {
      console.error('Error cargando datos de reportes:', error);
      // Si hay error, usar datos de demostración
      setBalance(balanceDemo);
      setCategorias(categoriasDemo);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const generarReporteMensual = async () => {
    try {
      await reporteService.generarReporteMensual(periodoInicio, periodoFin);
      toast.success('Reporte generado exitosamente');
      cargarDatos();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al generar reporte');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const gastosPorCategoriaData = balance?.gastosPorCategoria.map((item) => {
    const categoria = categorias.find((c) => c.id === item.idCategoria);
    return {
      name: categoria?.nombre || 'Sin categoría',
      value: item.total,
    };
  }) || [];

  const transaccionesPorMesData = balance?.transaccionesPorMes.map((item) => ({
    mes: item.mes,
    Ingresos: item.ingresos,
    Gastos: item.gastos,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="mt-1 text-sm text-gray-500">Visualiza y genera reportes de tus finanzas</p>
      </div>

      {/* Balance Actual */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Balance Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Ingresos</p>
            <p className="text-2xl font-bold text-green-600">
              ${balance?.totalIngresos.toLocaleString('es-CO', { minimumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Gastos</p>
            <p className="text-2xl font-bold text-red-600">
              ${balance?.totalGastos.toLocaleString('es-CO', { minimumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${(balance?.balance || 0) >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <p className="text-sm text-gray-600">Balance</p>
            <p className={`text-2xl font-bold ${(balance?.balance || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              ${balance?.balance.toLocaleString('es-CO', { minimumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gastos por Categoría</h3>
          {gastosPorCategoriaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gastosPorCategoriaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gastosPorCategoriaData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transacciones por Mes</h3>
          {transaccionesPorMesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transaccionesPorMesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ingresos" fill="#10b981" />
                <Bar dataKey="Gastos" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Generar Reporte Mensual */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generar Reporte Mensual</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-5 w-5 inline mr-2" />
              Fecha Inicio
            </label>
            <input
              type="date"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-5 w-5 inline mr-2" />
              Fecha Fin
            </label>
            <input
              type="date"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={periodoFin}
              onChange={(e) => setPeriodoFin(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generarReporteMensual}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Reportes */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reportes Generados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Generación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periodo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gastos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportes.length > 0 ? (
                reportes.map((reporte) => (
                  <tr key={reporte.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(reporte.fechaGeneracion), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(reporte.periodoInicio), 'dd MMM')} -{' '}
                      {format(new Date(reporte.periodoFin), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${reporte.totalIngresos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      ${reporte.totalGastos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        reporte.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                      }`}
                    >
                      ${reporte.balance.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay reportes generados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;

