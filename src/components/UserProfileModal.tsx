import React, { useState } from 'react';
import { X, Phone, MapPin, Mail, LogOut, Calendar, Edit2, Check, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMascotas } from '../hooks/useMascotas';
import type { BarrioBahia, MascotaReportada } from '../types/mascota';
import { MascotaCard } from './MascotaCard';
import { MascotaDetailModal } from './MascotaDetailModal';
import { userProfileStyles } from '../stylePg/userProfileModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BARRIOS_DISPONIBLES: BarrioBahia[] = [
  'Centro',
  'Villa Mitre',
  'Universitario',
  'Patagonia',
  'Palihue',
  'Harding Green',
  'Noroeste',
  'Grumbein',
  'Punta Alta'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateUser } = useAuth();
  const { rawMascotas } = useMascotas();
  const [activeTab, setActiveTab] = useState<'perfil' | 'publicaciones'>('perfil');
  const [isEditing, setIsEditing] = useState(false);

  // Form de edición
  const [editNombre, setEditNombre] = useState(user?.nombre || '');
  const [editTelefono, setEditTelefono] = useState(user?.telefono || '');
  const [editBarrio, setEditBarrio] = useState<BarrioBahia>(user?.barrio || 'Centro');

  const [selectedMascota, setSelectedMascota] = useState<MascotaReportada | null>(null);

  if (!isOpen || !user) return null;

  // Filtrar publicaciones de este usuario
  const misPublicaciones = rawMascotas.filter(
    m => m.telefonoContacto === user.telefono || m.nombreContacto.toLowerCase() === user.nombre.toLowerCase()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      nombre: editNombre.trim(),
      telefono: editTelefono.trim(),
      barrio: editBarrio
    });
    setIsEditing(false);
  };

  const fechaFormateada = new Date(user.fechaRegistro).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={userProfileStyles.overlay}>
      <div className={userProfileStyles.modalCard}>
        
        {/* Cabecera con banner de perfil */}
        <div className={userProfileStyles.headerBanner}>
          <button
            onClick={onClose}
            className={userProfileStyles.closeButton}
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.nombre)}`}
              alt={user.nombre}
              className={userProfileStyles.avatarImage}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className={userProfileStyles.userName}>{user.nombre}</h2>
                <span className={userProfileStyles.verifiedBadge}>
                  <ShieldCheck className="w-3 h-3" /> Vecino Verificado
                </span>
              </div>
              <p className={userProfileStyles.userSubtitle}>
                <MapPin className="w-3.5 h-3.5 text-indigo-300" /> Barrio {user.barrio} • Bahía Blanca / Zona
              </p>
            </div>
          </div>

          {/* Navegación por Pestañas dentro del perfil */}
          <div className={userProfileStyles.tabsWrapper}>
            <button
              onClick={() => setActiveTab('perfil')}
              className={activeTab === 'perfil' ? userProfileStyles.tabButtonActive : userProfileStyles.tabButtonInactive}
            >
              Mi Datos
            </button>
            <button
              onClick={() => setActiveTab('publicaciones')}
              className={activeTab === 'publicaciones' ? userProfileStyles.tabButtonActive : userProfileStyles.tabButtonInactive}
            >
              Mis Publicaciones
              <span className={userProfileStyles.badgeCount}>
                {misPublicaciones.length}
              </span>
            </button>
          </div>
        </div>

        {/* CUBIERTA DEL CONTENIDO */}
        <div className={userProfileStyles.contentContainer}>
          {activeTab === 'perfil' && (
            <div>
              {!isEditing ? (
                <div className="space-y-4">
                  <div className={userProfileStyles.dataGrid}>
                    <div className={userProfileStyles.infoCard}>
                      <div className={userProfileStyles.infoLabel}>
                        <Mail className="w-4 h-4 text-indigo-500" /> Correo Electrónico
                      </div>
                      <p className={userProfileStyles.infoValue}>{user.email}</p>
                    </div>

                    <div className={userProfileStyles.infoCard}>
                      <div className={userProfileStyles.infoLabel}>
                        <Phone className="w-4 h-4 text-indigo-500" /> Teléfono de Contacto
                      </div>
                      <p className={userProfileStyles.infoValue}>+{user.telefono}</p>
                    </div>

                    <div className={userProfileStyles.infoCard}>
                      <div className={userProfileStyles.infoLabel}>
                        <MapPin className="w-4 h-4 text-indigo-500" /> Barrio Registrado
                      </div>
                      <p className={userProfileStyles.infoValue}>{user.barrio}</p>
                    </div>

                    <div className={userProfileStyles.infoCard}>
                      <div className={userProfileStyles.infoLabel}>
                        <Calendar className="w-4 h-4 text-indigo-500" /> Miembro desde
                      </div>
                      <p className={userProfileStyles.infoValue}>{fechaFormateada}</p>
                    </div>
                  </div>

                  <div className={userProfileStyles.actionRow}>
                    <button
                      onClick={() => {
                        setEditNombre(user.nombre);
                        setEditTelefono(user.telefono);
                        setEditBarrio(user.barrio);
                        setIsEditing(true);
                      }}
                      className={userProfileStyles.editButton}
                    >
                      <Edit2 className="w-4 h-4" /> Editar Datos de Perfil
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className={userProfileStyles.logoutButton}
                    >
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                /* FORMULARIO EDICIÓN */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    Actualizar información de perfil
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      required
                      value={editTelefono}
                      onChange={(e) => setEditTelefono(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Barrio / Zona
                    </label>
                    <select
                      value={editBarrio}
                      onChange={(e) => setEditBarrio(e.target.value as BarrioBahia)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      {BARRIOS_DISPONIBLES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Guardar Cambios
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'publicaciones' && (
            <div>
              {misPublicaciones.length === 0 ? (
                <div className={userProfileStyles.emptyContainer}>
                  <Heart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className={userProfileStyles.emptyTitle}>
                    Aún no publicaste ninguna alerta.
                  </p>
                  <p className={userProfileStyles.emptyText}>
                    Cuando reportes una mascota perdida o encontrada, figurará en esta sección.
                  </p>
                </div>
              ) : (
                <div className={userProfileStyles.publicationsGrid}>
                  {misPublicaciones.map(mascota => (
                    <MascotaCard 
                      key={mascota.id} 
                      mascota={mascota} 
                      onClick={() => setSelectedMascota(mascota)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedMascota && (
          <MascotaDetailModal
            mascota={selectedMascota}
            onClose={() => setSelectedMascota(null)}
          />
        )}

      </div>
    </div>
  );
};
