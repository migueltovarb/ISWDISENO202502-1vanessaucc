import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reporteService } from '../services/reporteService';
import { transaccionService } from '../services/transaccionService';
import { categoriaService } from '../services/categoriaService';
import { Balance, Transaccion, Categoria } from '../types';
import { format } from 'date-fns';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { balanceDemo, transaccionesDemo, categoriasDemo } from '../data/datosDemo';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [usandoDatosDemo, setUsandoDatosDemo] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [balanceRes, transaccionesRes, categoriasRes] = await Promise.all([
          reporteService.obtenerBalance(),
          transaccionService.obtenerTransacciones(),
          categoriaService.obtenerCategorias(),
        ]);
        
        // Si no hay datos reales, usar datos de demostración
        if (transaccionesRes.data.length === 0) {
          setBalance(balanceDemo);
          setTransacciones(transaccionesDemo.slice(0, 5));
          setCategorias(categoriasDemo);
          setUsandoDatosDemo(true);
        } else {
          setBalance(balanceRes.data);
          setTransacciones(transaccionesRes.data.slice(0, 5));
          setCategorias(categoriasRes.data);
          setUsandoDatosDemo(false);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
        // En caso de error, mostrar datos de demostración
        setBalance(balanceDemo);
        setTransacciones(transaccionesDemo.slice(0, 5));
        setCategorias(categoriasDemo);
        setUsandoDatosDemo(true);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Resumen de tus finanzas personales</p>
      </div>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Ingresos</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${balance?.totalIngresos.toLocaleString('es-CO', { minimumFractionDigits: 2 }) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownIcon className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Gastos</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${balance?.totalGastos.toLocaleString('es-CO', { minimumFractionDigits: 2 }) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Balance</dt>
                  <dd
                    className={`text-lg font-medium ${
                      (balance?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ${balance?.balance.toLocaleString('es-CO', { minimumFractionDigits: 2 }) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Categorías</dt>
                  <dd className="text-lg font-medium text-gray-900">{categorias.length}</dd>
                </dl>
              </div>
            </div>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gastosPorCategoriaData.map((entry, index) => (
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

      {/* Últimas Transacciones */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Últimas Transacciones</h3>
          <Link
            to="/transacciones"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacciones.length > 0 ? (
                transacciones.map((transaccion) => (
                  <tr key={transaccion.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaccion.tipo === 'INGRESO'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaccion.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaccion.descripcion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transaccion.fecha), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaccion.monto.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay transacciones registradas
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

export default Dashboard;

