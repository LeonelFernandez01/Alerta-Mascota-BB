import React from 'react';
import { PhoneCall, MapPin, Shield } from 'lucide-react';
import { recursosStyles } from '../stylePg/recursosPage';

interface RecursoLocal {
  nombre: string;
  contacto: string;
  contactoLink: string;
  horario?: string;
  ubicacion: string;
  descripcion: string;
  tipo: 'municipal' | 'protectora';
}

const RECURSOS_BAHIA: RecursoLocal[] = [
  {
    nombre: 'Zoonosis Municipal Bahía Blanca',
    contacto: '0291 456-0139',
    contactoLink: 'tel:02914560139',
    horario: 'Lunes a Viernes de 7:30 a 15:00 hs',
    ubicacion: 'Parque de Mayo (Ingreso por calle Florida)',
    descripcion: 'Vacunación antirrábica gratuita sin turno, castraciones con turno previo y tratamiento contra la sarna.',
    tipo: 'municipal'
  },
  {
    nombre: 'Zoonosis Coronel Rosales (Punta Alta)',
    contacto: '02932 42-1830',
    contactoLink: 'tel:02932421830',
    horario: 'Lunes a Viernes de 7:00 a 13:00 hs',
    ubicacion: 'Humberto I 658, Punta Alta',
    descripcion: 'Atención municipal para mascotas en Punta Alta y zonas linderas. Castraciones y vacunación antirrábica.',
    tipo: 'municipal'
  },
  {
    nombre: 'Protectora de Animales Bahía Blanca',
    contacto: '2914420311',
    contactoLink: 'https://wa.me/5492914420311?text=Hola,%20me%20contacto%20desde%20Alerta%20Mascota%20BB',
    ubicacion: 'Bahía Blanca (Virtual / Tránsito)',
    descripcion: 'Asociación civil sin fines de lucro. Campañas de adopción, auxilio a animales en situación de calle y recepción de denuncias por maltrato.',
    tipo: 'protectora'
  }
];

export const RecursosPage: React.FC = () => {
  return (
    <main className={recursosStyles.container}>
      <div>
        <h2 className={recursosStyles.title}>Zoonosis y Refugios Locales</h2>
        <p className={recursosStyles.subtitle}>Contactos útiles y servicios públicos de emergencia para mascotas en Bahía Blanca y cercanías.</p>
      </div>

      <div className="space-y-4">
        {RECURSOS_BAHIA.map((recurso, i) => (
          <div key={i} className={recursosStyles.card}>
            <div className={recursosStyles.cardHeader}>
              <h3 className={recursosStyles.cardTitle}>{recurso.nombre}</h3>
              <span className={`${recursosStyles.badgeCommon} ${
                recurso.tipo === 'municipal' 
                  ? recursosStyles.badgeMunicipal
                  : recursosStyles.badgeProtectora
              }`}>
                {recurso.tipo === 'municipal' ? 'Municipal' : 'ONG'}
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
