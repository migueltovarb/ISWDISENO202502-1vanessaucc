import { useEffect, useState } from 'react';
import { usuarioService } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';
import { Usuario } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const Perfil = () => {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    imagenPerfil: '',
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const response = await usuarioService.obtenerPerfil();
      setUser(response.data);
      setFormData({
        nombre: response.data.nombre,
        email: response.data.email,
        contrasena: '',
        imagenPerfil: response.data.imagenPerfil || '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToUpdate: any = {};
      if (formData.nombre !== user?.nombre) dataToUpdate.nombre = formData.nombre;
      if (formData.email !== user?.email) dataToUpdate.email = formData.email;
      if (formData.contrasena) dataToUpdate.contrasena = formData.contrasena;
      if (formData.imagenPerfil !== user?.imagenPerfil) dataToUpdate.imagenPerfil = formData.imagenPerfil;

      if (Object.keys(dataToUpdate).length > 0) {
        const response = await usuarioService.actualizarPerfil(dataToUpdate);
        setUser(response.data);
        setEditing(false);
        toast.success('Perfil actualizado exitosamente');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al actualizar perfil');
    }
  };

  const handleEliminarCuenta = async () => {
    if (!window.confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await usuarioService.eliminarCuenta();
      toast.success('Cuenta eliminada exitosamente');
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al eliminar cuenta');
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona tu información personal</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {!editing ? (
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {user?.imagenPerfil ? (
                  <img
                    className="h-24 w-24 rounded-full object-cover"
                    src={user.imagenPerfil}
                    alt={user.nombre}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-primary-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user?.nombre}</h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    {user?.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Miembro desde{' '}
                    {user?.fechaRegistro
                      ? format(new Date(user.fechaRegistro), 'dd MMMM yyyy')
                      : 'N/A'}
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
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
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nueva Contraseña (dejar vacío para no cambiar)
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL de Imagen de Perfil</label>
                <input
                  type="url"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.imagenPerfil}
                  onChange={(e) => setFormData({ ...formData, imagenPerfil: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    nombre: user?.nombre || '',
                    email: user?.email || '',
                    contrasena: '',
                    imagenPerfil: user?.imagenPerfil || '',
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Zona de Peligro */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-900 mb-2">Zona de Peligro</h3>
        <p className="text-sm text-red-700 mb-4">
          Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
        </p>
        <button
          onClick={handleEliminarCuenta}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
};

export default Perfil;

