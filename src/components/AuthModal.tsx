import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, AlertCircle, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { BarrioBahia } from '../types/mascota';
import { authModalStyles } from '../stylePg/authModal';

interface AuthModalProps {
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

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, registro } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Campos Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campos Registro
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regBarrio, setRegBarrio] = useState<BarrioBahia>('Centro');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login({ email: loginEmail, password: loginPassword });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('¡Bienvenido de nuevo!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message || 'Error al iniciar sesión.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regNombre.trim()) {
      setErrorMsg('Por favor ingresá tu nombre completo.');
      return;
    }
    if (!regTelefono.trim()) {
      setErrorMsg('Por favor ingresá un número de teléfono de contacto.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const res = await registro({
      nombre: regNombre.trim(),
      email: regEmail.trim(),
      telefono: regTelefono.trim(),
      barrio: regBarrio,
      password: regPassword
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('¡Cuenta registrada exitosamente!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } else {
      setErrorMsg(res.message || 'Error al crear la cuenta.');
    }
  };

  return (
    <div className={authModalStyles.overlay}>
      <div className={authModalStyles.modalCard}>
        
        {/* Encabezado con Gradiente */}
        <div className={authModalStyles.headerBanner}>
          <button
            onClick={onClose}
            className={authModalStyles.closeButton}
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className={authModalStyles.headerBadge}>
            <Sparkles className={authModalStyles.headerBadgeIcon} />
            <span className={authModalStyles.headerBadgeText}>Vecinos Conectados</span>
          </div>
          <h2 className={authModalStyles.headerTitle}>
            {isRegistering ? 'Crear tu Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className={authModalStyles.headerSubtitle}>
            {isRegistering 
              ? 'Sumate a la comunidad de Bahía Blanca y Punta Alta para reportar y buscar mascotas.'
              : 'Accedé a tu perfil de vecino para gestionar tus alertas y publicaciones.'
            }
          </p>
        </div>

        {/* Formulario / Tabs */}
        <div className={authModalStyles.bodyContent}>
          {/* Alertas de error o éxito */}
          {errorMsg && (
            <div className={authModalStyles.errorAlert}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className={authModalStyles.successAlert}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isRegistering ? (
            /* FORMULARIO LOGIN */
            <form onSubmit={handleLoginSubmit} className={authModalStyles.formGroup}>
              <div>
                <label className={authModalStyles.label}>
                  Correo Electrónico
                </label>
                <div className={authModalStyles.inputWrapper}>
                  <Mail className={authModalStyles.inputIcon} />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ejemplo@bahia.gob.ar"
                    className={authModalStyles.inputField}
                  />
                </div>
              </div>

              <div>
                <label className={authModalStyles.label}>
                  Contraseña
                </label>
                <div className={authModalStyles.inputWrapper}>
                  <Lock className={authModalStyles.inputIcon} />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className={authModalStyles.inputField}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={authModalStyles.submitButton}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ingresar'}
              </button>

              <div className={authModalStyles.footerToggle}>
                <span className={authModalStyles.footerText}>¿No tenés una cuenta? </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg(null);
                  }}
                  className={authModalStyles.toggleButton}
                >
                  Registrarme ahora
                </button>
              </div>
            </form>
          ) : (
            /* FORMULARIO REGISTRO */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className={authModalStyles.label}>
                  Nombre Completo
                </label>
                <div className={authModalStyles.inputWrapper}>
                  <User className={authModalStyles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={regNombre}
                    onChange={(e) => setRegNombre(e.target.value)}
                    placeholder="Ej: María Fernández"
                    className={authModalStyles.inputField}
                  />
                </div>
              </div>

              <div>
                <label className={authModalStyles.label}>
                  Correo Electrónico
                </label>
                <div className={authModalStyles.inputWrapper}>
                  <Mail className={authModalStyles.inputIcon} />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="maria@ejemplo.com"
                    className={authModalStyles.inputField}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={authModalStyles.label}>
                    Teléfono Contacto
                  </label>
                  <div className={authModalStyles.inputWrapper}>
                    <Phone className={authModalStyles.selectIcon} />
                    <input
                      type="tel"
                      required
                      value={regTelefono}
                      onChange={(e) => setRegTelefono(e.target.value)}
                      placeholder="2915551234"
                      className={authModalStyles.selectField}
                    />
                  </div>
                </div>

                <div>
                  <label className={authModalStyles.label}>
                    Barrio / Zona
                  </label>
                  <div className={authModalStyles.inputWrapper}>
                    <MapPin className={authModalStyles.selectIcon} />
                    <select
                      value={regBarrio}
                      onChange={(e) => setRegBarrio(e.target.value as BarrioBahia)}
                      className={authModalStyles.selectField}
                    >
                      {BARRIOS_DISPONIBLES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className={authModalStyles.label}>
                  Crear Contraseña (mínimo 6 caracteres)
                </label>
                <div className={authModalStyles.inputWrapper}>
                  <Lock className={authModalStyles.inputIcon} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className={authModalStyles.inputField}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={authModalStyles.submitButton}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Cuenta'}
              </button>

              <div className={authModalStyles.footerToggle}>
                <span className={authModalStyles.footerText}>¿Ya tenés una cuenta? </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg(null);
                  }}
                  className={authModalStyles.toggleButton}
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
