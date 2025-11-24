import { useEffect, useState } from 'react';
import { categoriaService } from '../services/categoriaService';
import { Categoria } from '../types';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await categoriaService.obtenerCategorias();
      setCategorias(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoriaService.editarCategoria(editing.id, formData);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await categoriaService.crearCategoria(formData);
        toast.success('Categoría creada exitosamente');
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ nombre: '', descripcion: '' });
      cargarCategorias();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al guardar categoría');
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditing(categoria);
    setFormData({ nombre: categoria.nombre, descripcion: categoria.descripcion });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await categoriaService.eliminarCategoria(id);
      toast.success('Categoría eliminada exitosamente');
      cargarCategorias();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al eliminar categoría');
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona tus categorías de gastos e ingresos</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ nombre: '', descripcion: '' });
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">{categoria.nombre}</h3>
            <p className="mt-2 text-sm text-gray-500">{categoria.descripcion || 'Sin descripción'}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(categoria)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(categoria.id)}
                className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {categorias.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No hay categorías registradas</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Crear tu primera categoría
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editing ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descripción</label>
                      <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      />
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
                      setFormData({ nombre: '', descripcion: '' });
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

export default Categorias;

