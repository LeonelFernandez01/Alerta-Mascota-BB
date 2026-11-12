import React, { useState } from 'react';
import { X, Phone, MapPin, Mail, LogOut, Calendar, Edit2, Check, ShieldCheck, Heart, CheckCircle2, Trash2, RotateCcw } from 'lucide-react';
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
  const { rawMascotas, cambiarEstadoMascota, eliminarMascota } = useMascotas();
  const [activeTab, setActiveTab] = useState<'perfil' | 'publicaciones'>('perfil');
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
                    <div key={mascota.id} className="flex flex-col gap-2">
                      <MascotaCard 
                        mascota={mascota} 
                        onClick={() => setSelectedMascota(mascota)}
                      />
                      {/* Controles de gestión rápida del propietario */}
                      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60">
                        <button
                          type="button"
                          onClick={() => cambiarEstadoMascota(mascota.id, mascota.estado === 'perdido' ? 'encontrado' : 'perdido')}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                            mascota.estado === 'perdido'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {mascota.estado === 'perdido' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              ¡Marcar como Encontrado!
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              Volver a Perdido
                            </>
                          )}
                        </button>

                        {confirmDeleteId === mascota.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={async () => {
                                await eliminarMascota(mascota.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer active:scale-95"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(mascota.id)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40 transition-colors cursor-pointer active:scale-95"
                            title="Eliminar publicación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
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
