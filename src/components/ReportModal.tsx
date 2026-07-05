import React, { useState } from 'react';
import { X, Dog, Cat, HelpCircle, FileText, MapPin, Phone, User, Image, PlusCircle, AlertTriangle } from 'lucide-react';
import type { BarrioBahia, EstadoMascota, TipoAnimal, MascotaReportada } from '../types/mascota';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nueva: Omit<MascotaReportada, 'id' | 'fecha'>) => Promise<boolean>;
}

const BARRIOS_LIST: BarrioBahia[] = [
  'Centro',
  'Universitario',
  'Villa Mitre',
  'Patagonia',
  'Palihue',
  'Noroeste',
  'Harding Green',
  'Grumbein',
  'Punta Alta'
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSave }) => {
  const [tipo, setTipo] = useState<TipoAnimal>('perro');
  const [estado, setEstado] = useState<EstadoMascota>('perdido');
  const [barrio, setBarrio] = useState<BarrioBahia>('Centro');
  const [zonaEspecifica, setZonaEspecifica] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [fotoBase64, setFotoBase64] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [señasParticulares, setSeñasParticulares] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [nombreContacto, setNombreContacto] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Manejar la carga local de archivo de imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (file) {
      // Limitar a 2MB para no saturar el almacenamiento de localStorage
      if (file.size > 2 * 1024 * 1024) {
        setValidationError('La foto es muy grande. Elige una menor a 2MB para poder guardarla localmente.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result as string);
        setFotoUrl(''); // Limpiar URL estática si se sube archivo
      };
      reader.onerror = () => {
        setValidationError('No se pudo leer la foto seleccionada.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Generador de imágenes aleatorias según el tipo si el usuario no pone una
  const obtenerFotoPredefinida = (animal: TipoAnimal): string => {
    const urls = {
      perro: [
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600'
      ],
      gato: [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600'
      ],
      otro: [
        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=600'
      ]
    };
    
    const array = urls[animal];
    const indexIndex = Math.floor(Math.random() * array.length);
    return array[indexIndex];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validar Campos Básicos
    if (!zonaEspecifica.trim()) {
      setValidationError('Por favor, indica una zona o calle de referencia.');
      return;
    }
    if (!descripcion.trim() || descripcion.length < 10) {
      setValidationError('Por favor, escribe una descripción detallada (mínimo 10 caracteres).');
      return;
    }
    if (!telefonoContacto.trim() || telefonoContacto.length < 8) {
      setValidationError('Por favor, indica un teléfono celular de contacto válido.');
      return;
    }
    if (!nombreContacto.trim()) {
      setValidationError('Por favor, indica tu nombre de contacto.');
      return;
    }

    setSubmitting(true);

    // Si hay archivo cargado en base64 lo priorizamos, si no usamos la URL o una predefinida
    const finalFotoUrl = fotoBase64 || (fotoUrl.trim() !== '' ? fotoUrl.trim() : obtenerFotoPredefinida(tipo));

    // Limpiar el teléfono para que solo tenga dígitos y código internacional
    let telLimpio = telefonoContacto.replace(/[^0-9]/g, '');
    if (!telLimpio.startsWith('54')) {
      if (telLimpio.startsWith('9')) {
        telLimpio = '54' + telLimpio;
      } else if (telLimpio.startsWith('291') || telLimpio.startsWith('11') || telLimpio.length >= 10) {
        telLimpio = '549' + telLimpio;
      } else {
        telLimpio = '549' + telLimpio;
      }
    }

    const payload = {
      tipo,
      estado,
      barrio,
      zonaEspecifica: zonaEspecifica.trim(),
      fotoUrl: finalFotoUrl,
      descripcion: descripcion.trim(),
      señasParticulares: señasParticulares.trim() || undefined,
      telefonoContacto: telLimpio,
      nombreContacto: nombreContacto.trim()
    };

    const success = await onSave(payload);
    
    setSubmitting(false);
    if (success) {
      setZonaEspecifica('');
      setFotoUrl('');
      setFotoBase64('');
      setDescripcion('');
      setSeñasParticulares('');
      setTelefonoContacto('');
      setNombreContacto('');
      onClose();
    } else {
      setValidationError('Hubo un error al procesar el reporte. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm transition-all duration-300">
      {/* Contenedor del Modal */}
      <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden transform transition-all duration-300 translate-y-0 transition-colors duration-300">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-colors duration-300">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Crear Alerta de Mascota</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Completa los datos para publicarlo en la comunidad</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-355 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Formulario con scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-grow bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
          {validationError && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Tipo de Mascota y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Tipo de Animal
              </label>
              <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
                {(['perro', 'gato', 'otro'] as TipoAnimal[]).map((animal) => {
                  const isSel = tipo === animal;
                  return (
                    <button
                      key={animal}
                      type="button"
                      onClick={() => setTipo(animal)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all capitalize cursor-pointer ${
                        isSel
                          ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50 font-bold'
                          : 'text-slate-505 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {animal === 'perro' && <Dog className="w-3.5 h-3.5" />}
                      {animal === 'gato' && <Cat className="w-3.5 h-3.5" />}
                      {animal === 'otro' && <HelpCircle className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{animal}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Estado del Reporte
              </label>
              <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
                {(['perdido', 'encontrado'] as EstadoMascota[]).map((est) => {
                  const isSel = estado === est;
                  let selectedStyles = 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50 font-bold';
                  
                  if (isSel && est === 'perdido') selectedStyles = 'bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 font-bold';
                  if (isSel && est === 'encontrado') selectedStyles = 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold';

                  return (
                    <button
                      key={est}
                      type="button"
                      onClick={() => setEstado(est)}
                      className={`flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all capitalize cursor-pointer ${
                        isSel ? selectedStyles : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${est === 'perdido' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      {est}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Barrio y Zona */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                Barrio
              </label>
              <select
                value={barrio}
                onChange={(e) => setBarrio(e.target.value as BarrioBahia)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200"
              >
                {BARRIOS_LIST.map((b) => (
                  <option key={b} value={b} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                Referencia de Zona
              </label>
              <input
                type="text"
                placeholder="Ej: Alem al 1200, Frente a Plaza"
                value={zonaEspecifica}
                onChange={(e) => setZonaEspecifica(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          {/* 3. Foto de la Mascota (Carga local / URL de internet) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              Foto de la Mascota
            </label>
            
            <div className="space-y-3">
              {fotoBase64 ? (
                /* Previsualización del archivo cargado */
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                  {/* Fondo difuminado para rellenar bordes */}
                  <img src={fotoBase64} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-105 pointer-events-none select-none" />
                  {/* Imagen original centrada sin recortar */}
                  <img src={fotoBase64} alt="Previsualización" className="relative z-10 max-w-full max-h-full object-contain pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setFotoBase64('')}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-all cursor-pointer shadow-md active:scale-95 z-20"
                    title="Remover imagen"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Dropzone / Botón de Carga */
                <label 
                  htmlFor="foto-upload"
                  className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-850/50 cursor-pointer transition-colors p-4 text-center group"
                >
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <PlusCircle className="w-8 h-8 text-indigo-500 dark:text-indigo-400 transition-transform group-hover:scale-105" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Subir imagen desde el dispositivo</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Haz una foto o selecciónala (Max. 2MB)</p>
                  </div>
                  <input 
                    id="foto-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
              )}

              {/* URL Alternativa */}
              {!fotoBase64 && (
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider block">O ingresa un enlace de internet</span>
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={fotoUrl}
                    onChange={(e) => {
                      setFotoUrl(e.target.value);
                      if (e.target.value) setFotoBase64('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 4. Descripción */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              Descripción de lo ocurrido
            </label>
            <textarea
              placeholder="Ej: Lo vimos cruzar asustado... Es muy amigable, tiene pelaje negro brillante..."
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200 resize-none leading-relaxed"
            />
          </div>

          {/* 5. Señas Particulares */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Señas Particulares <span className="text-[9px] text-slate-400 dark:text-slate-500 italic">(Opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Mancha blanca en la pata derecha, collar verde"
              value={señasParticulares}
              onChange={(e) => setSeñasParticulares(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200"
            />
          </div>

          {/* 6. Contacto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                Nombre de Contacto
              </label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombreContacto}
                onChange={(e) => setNombreContacto(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                WhatsApp (Celular)
              </label>
              <input
                type="tel"
                placeholder="Ej: 2914567890"
                value={telefonoContacto}
                onChange={(e) => setTelefonoContacto(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl text-xs transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Publicar Alerta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
