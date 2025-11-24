import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JwtResponse, Usuario } from '../types';
import { authService } from '../services/authService';
import { usuarioService } from '../services/usuarioService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  registro: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verificar si el token sigue siendo válido
      usuarioService
        .obtenerPerfil()
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          logout();
        });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { data } = response;
      setToken(data.token);
      setUser({
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        fechaRegistro: new Date().toISOString(),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        fechaRegistro: new Date().toISOString(),
      }));
      toast.success('Inicio de sesión exitoso');
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al iniciar sesión');
      throw error;
    }
  };

  const registro = async (nombre: string, email: string, password: string) => {
    try {
      const response = await authService.registro(nombre, email, password);
      const { data } = response;
      setToken(data.token);
      setUser({
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        fechaRegistro: new Date().toISOString(),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        fechaRegistro: new Date().toISOString(),
      }));
      toast.success('Registro exitoso');
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al registrar usuario');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, registro, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

