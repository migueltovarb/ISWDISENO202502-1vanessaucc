import { useEffect, useState } from 'react';
import { transaccionService } from '../services/transaccionService';
import { categoriaService } from '../services/categoriaService';
import { Transaccion, Categoria, TipoTransaccion, FiltroTransaccion } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const Transacciones = () => {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFiltros, setShowFiltros] = useState(false);
  const [editing, setEditing] = useState<Transaccion | null>(null);
  const [filtros, setFiltros] = useState<FiltroTransaccion>({});
  const [formData, setFormData] = useState({
    tipo: 'EGRESO' as TipoTransaccion,
    idCategoria: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    monto: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      const [transaccionesRes, categoriasRes] = await Promise.all([
        transaccionService.obtenerTransacciones(),
        categoriaService.obtenerCategorias(),
      ]);
      setTransacciones(transaccionesRes.data);
      setCategorias(categoriasRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = async () => {
    try {
      const response = await transaccionService.filtrarTransacciones(filtros);
      setTransacciones(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al filtrar transacciones');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        monto: parseFloat(formData.monto),
        fecha: new Date(formData.fecha).toISOString(),
      };
      if (editing) {
        await transaccionService.editarTransaccion(editing.id, data);
        toast.success('Transacción actualizada exitosamente');
      } else {
        await transaccionService.crearTransaccion(data);
        toast.success('Transacción creada exitosamente');
      }
      setShowModal(false);
      setEditing(null);
      setFormData({
        tipo: 'EGRESO',
        idCategoria: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        monto: '',
      });
      aplicarFiltros();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al guardar transacción');
    }
  };

  const handleEdit = (transaccion: Transaccion) => {
    setEditing(transaccion);
    setFormData({
      tipo: transaccion.tipo,
      idCategoria: transaccion.idCategoria,
      descripcion: transaccion.descripcion,
      fecha: new Date(transaccion.fecha).toISOString().split('T')[0],
      monto: transaccion.monto.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta transacción?')) return;
    try {
      await transaccionService.eliminarTransaccion(id);
      toast.success('Transacción eliminada exitosamente');
      aplicarFiltros();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al eliminar transacción');
    }
  };

  const limpiarFiltros = () => {
    setFiltros({});
    cargarDatos();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona tus ingresos y gastos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFiltros(!showFiltros)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtros
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setFormData({
                tipo: 'EGRESO',
                idCategoria: '',
                descripcion: '',
                fecha: new Date().toISOString().split('T')[0],
                monto: '',
              });
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Transacción
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFiltros && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={filtros.tipo || ''}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as TipoTransaccion || undefined })}
              >
                <option value="">Todos</option>
                <option value="INGRESO">Ingreso</option>
                <option value="EGRESO">Gasto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={filtros.idCategoria || ''}
                onChange={(e) => setFiltros({ ...filtros, idCategoria: e.target.value || undefined })}
              >
                <option value="">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={filtros.fechaInicio || ''}
                onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value || undefined })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={filtros.fechaFin || ''}
                onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value || undefined })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Tabla de Transacciones */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacciones.length > 0 ? (
                transacciones.map((transaccion) => {
                  const categoria = categorias.find((c) => c.id === transaccion.idCategoria);
                  return (
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
                        {categoria?.nombre || 'Sin categoría'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(transaccion.fecha), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaccion.monto.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(transaccion)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaccion.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay transacciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editing ? 'Editar Transacción' : 'Nueva Transacción'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo</label>
                      <select
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoTransaccion })}
                      >
                        <option value="EGRESO">Gasto</option>
                        <option value="INGRESO">Ingreso</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoría</label>
                      <select
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={formData.idCategoria}
                        onChange={(e) => setFormData({ ...formData, idCategoria: e.target.value })}
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descripción</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha</label>
                        <input
                          type="date"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={formData.fecha}
                          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Monto</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={formData.monto}
                          onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editing ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditing(null);
                      setFormData({
                        tipo: 'EGRESO',
                        idCategoria: '',
                        descripcion: '',
                        fecha: new Date().toISOString().split('T')[0],
                        monto: '',
                      });
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transacciones;

