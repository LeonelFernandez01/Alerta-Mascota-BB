import React, { useState } from 'react';
import { PhoneCall, MapPin, Shield, Filter } from 'lucide-react';
import { recursosStyles } from '../stylePg/recursosPage';

type TipoRecurso = 'municipal' | 'protectora' | 'emergencia';

interface RecursoLocal {
  nombre: string;
  contacto: string;
  contactoLink: string;
  horario?: string;
  ubicacion: string;
  descripcion: string;
  tipo: TipoRecurso;
}

const RECURSOS_BAHIA: RecursoLocal[] = [
  {
    nombre: 'Zoonosis Municipal Bahía Blanca',
    contacto: '0291 456-0139',
    contactoLink: 'tel:02914560139',
    horario: 'Lunes a Viernes de 7:30 a 15:00 hs',
    ubicacion: 'Parque de Mayo (Ingreso por calle Florida)',
    descripcion: 'Vacunación antirrábica gratuita sin turno, castraciones con turno previo, atención primaria y tratamiento contra la sarna.',
    tipo: 'municipal'
  },
  {
    nombre: 'Móviles de Castración Municipal BB',
    contacto: '0291 455-0383',
    contactoLink: 'tel:02914550383',
    horario: 'Turnos telefónicos de Lunes a Viernes de 8:00 a 14:00 hs',
    ubicacion: 'Quirófanos móviles rotativos por barrios de Bahía Blanca',
    descripcion: 'Servicio gratuito de esterilización quirúrgica para perros y gatos en sociedades de fomento y delegaciones barriales.',
    tipo: 'municipal'
  },
  {
    nombre: 'Zoonosis Coronel Rosales (Punta Alta)',
    contacto: '02932 42-1830',
    contactoLink: 'tel:02932421830',
    horario: 'Lunes a Viernes de 7:00 a 13:00 hs',
    ubicacion: 'Humberto I 658, Punta Alta',
    descripcion: 'Atención municipal para mascotas en Punta Alta y zonas linderas. Castraciones, control antirrábico y registro de animales.',
    tipo: 'municipal'
  },
  {
    nombre: 'Protectora de Animales Bahía Blanca',
    contacto: '2914420311',
    contactoLink: 'https://wa.me/5492914420311?text=Hola,%20me%20contacto%20desde%20Alerta%20Mascota%20BB',
    ubicacion: 'Bahía Blanca (Red de Hogares de Tránsito)',
    descripcion: 'Asociación civil sin fines de lucro. Campañas de adopción responsable, auxilio a animales en calle y asesoramiento por maltrato.',
    tipo: 'protectora'
  },
  {
    nombre: 'Denuncias por Maltrato Animal (Ley 14.346)',
    contacto: '911 / Fiscalía BB',
    contactoLink: 'tel:911',
    horario: 'Atención las 24 horas',
    ubicacion: 'Comisarías de Bahía Blanca / UFIJ en turno (Moreno 25)',
    descripcion: 'El maltrato y abandono animal es un delito penal (Ley Nacional 14.346). La policía tiene obligación de tomar la denuncia en cualquier comisaría.',
    tipo: 'emergencia'
  }
];

export const RecursosPage: React.FC = () => {
  const [filtroTipo, setFiltroTipo] = useState<TipoRecurso | 'todos'>('todos');

  const recursosFiltrados = RECURSOS_BAHIA.filter(
    (r) => filtroTipo === 'todos' || r.tipo === filtroTipo
  );

  const obtenerEtiquetaTipo = (tipo: TipoRecurso) => {
    if (tipo === 'municipal') return 'Municipal';
    if (tipo === 'protectora') return 'ONG / Red';
    return 'Emergencia 24h';
  };

  return (
    <main className={recursosStyles.container}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className={recursosStyles.title}>Zoonosis y Refugios Locales</h2>
          <p className={recursosStyles.subtitle}>Contactos útiles y servicios públicos de emergencia para mascotas en Bahía Blanca y cercanías.</p>
        </div>

        {/* Filtros por categoría */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
          </span>
          {(['todos', 'municipal', 'protectora', 'emergencia'] as const).map((cat) => {
            const isSel = filtroTipo === cat;
            return (
              <button
                key={cat}
                onClick={() => setFiltroTipo(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer capitalize ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat === 'todos' ? 'Todos' : cat === 'protectora' ? 'ONGs' : cat === 'emergencia' ? 'Denuncias' : 'Municipales'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {recursosFiltrados.map((recurso, i) => (
          <div key={i} className={recursosStyles.card}>
            <div className={recursosStyles.cardHeader}>
              <h3 className={recursosStyles.cardTitle}>{recurso.nombre}</h3>
              <span className={`${recursosStyles.badgeCommon} ${
                recurso.tipo === 'municipal' 
                  ? recursosStyles.badgeMunicipal
                  : recursosStyles.badgeProtectora
              }`}>
                {obtenerEtiquetaTipo(recurso.tipo)}
              </span>
            </div>

            <p className={recursosStyles.description}>{recurso.descripcion}</p>

            <div className={recursosStyles.metaList}>
              {recurso.horario && (
                <div className={recursosStyles.metaItem}>
                  <span className={recursosStyles.metaBullet} />
                  <span>Horario: {recurso.horario}</span>
                </div>
              )}
              <div className={recursosStyles.metaItem}>
                <MapPin className={recursosStyles.metaIcon} />
                <span>{recurso.ubicacion}</span>
              </div>
            </div>

            <div className={recursosStyles.divider} />

            <a
              href={recurso.contactoLink}
              target={recurso.contactoLink.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className={recursosStyles.contactButton}
            >
              <PhoneCall className="w-4 h-4" />
              Contactar: {recurso.contacto}
            </a>
          </div>
        ))}
      </div>

      {/* Consejos Rápidos */}
      <div className={recursosStyles.tipsContainer}>
        <h4 className={recursosStyles.tipsTitle}>
          <Shield className={recursosStyles.tipsIcon} />
          Guía de Primeros Auxilios y Denuncias
        </h4>
        <ul className={recursosStyles.tipsList}>
          <li>Si encuentras un perro o gato herido gravemente en la vía pública, Zoonosis Municipal puede proveer asistencia.</li>
          <li>Si quieres denunciar maltrato animal en Bahía Blanca, puedes dirigirte a las oficinas de la Policía Local o contactar a la Protectora de Animales para orientación jurídica.</li>
          <li>Asegúrate de tomar fotos o videos que sirvan de evidencia legal para las denuncias de maltrato.</li>
        </ul>
      </div>
    </main>
  );
};
