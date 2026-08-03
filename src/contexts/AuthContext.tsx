import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Usuario, CredencialesLogin, DatosRegistro } from '../types/user';

export interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credenciales: CredencialesLogin) => Promise<{ success: boolean; message?: string }>;
  registro: (datos: DatosRegistro) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (datos: Partial<Usuario>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'alerta_mascota_bb_usuario_actual';
const USERS_DB_KEY = 'alerta_mascota_bb_usuarios_registrados';

// Usuario demo por defecto para facilitar pruebas iniciales
const USUARIOS_MOCK_INICIALES: (Usuario & { password?: string })[] = [
  {
    id: 'user-demo-1',
    nombre: 'Gonzalo Pérez',
    email: 'gonzalo@bahia.gob.ar',
    telefono: '5492915551234',
    barrio: 'Centro',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    fechaRegistro: new Date().toISOString(),
    password: 'password123'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar usuario en sesión al iniciar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      // Inicializar base simulada de usuarios en localStorage si no existe
      if (!localStorage.getItem(USERS_DB_KEY)) {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(USUARIOS_MOCK_INICIALES));
      }
    } catch (e) {
      console.error('Error al cargar sesión local:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credenciales: CredencialesLogin) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simular latencia de red

    try {
      const dbStr = localStorage.getItem(USERS_DB_KEY) || '[]';
      const usuarios = JSON.parse(dbStr) as (Usuario & { password?: string })[];

      const usuarioEncontrado = usuarios.find(
        u => u.email.toLowerCase() === credenciales.email.toLowerCase()
      );

      if (!usuarioEncontrado) {
        return { success: false, message: 'No existe una cuenta registrada con este correo electrónico.' };
      }

      if (usuarioEncontrado.password && usuarioEncontrado.password !== credenciales.password) {
        return { success: false, message: 'La contraseña ingresada es incorrecta.' };
      }

      // Remover password del objeto en estado
      const { password, ...usuarioSinPass } = usuarioEncontrado;
      setUser(usuarioSinPass);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usuarioSinPass));

      return { success: true };
    } catch (err) {
      return { success: false, message: 'Error inesperado al iniciar sesión.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const registro = useCallback(async (datos: DatosRegistro) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simular latencia de red

    try {
      const dbStr = localStorage.getItem(USERS_DB_KEY) || '[]';
      const usuarios = JSON.parse(dbStr) as (Usuario & { password?: string })[];

      const yaExiste = usuarios.some(
        u => u.email.toLowerCase() === datos.email.toLowerCase()
      );

      if (yaExiste) {
        return { success: false, message: 'Este correo ya se encuentra registrado.' };
      }

      const nuevoUsuario: Usuario & { password?: string } = {
        id: `user-${Date.now()}`,
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        barrio: datos.barrio,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(datos.nombre)}`,
        fechaRegistro: new Date().toISOString(),
        password: datos.password
      };

      usuarios.push(nuevoUsuario);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usuarios));

      const { password, ...usuarioSinPass } = nuevoUsuario;
      setUser(usuarioSinPass);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usuarioSinPass));

      return { success: true };
    } catch (err) {
      return { success: false, message: 'Error inesperado al registrar la cuenta.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  const updateUser = useCallback((datos: Partial<Usuario>) => {
    setUser(prev => {
      if (!prev) return null;
      const actualizado = { ...prev, ...datos };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(actualizado));

      // Actualizar también en la DB local simulada
      try {
        const dbStr = localStorage.getItem(USERS_DB_KEY) || '[]';
        const usuarios = JSON.parse(dbStr);
        const index = usuarios.findIndex((u: Usuario) => u.id === prev.id);
        if (index !== -1) {
          usuarios[index] = { ...usuarios[index], ...datos };
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(usuarios));
        }
      } catch (e) {
        console.error('Error al actualizar base de datos local:', e);
      }

      return actualizado;
    });
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    registro,
    logout,
    updateUser
  }), [user, loading, login, registro, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
