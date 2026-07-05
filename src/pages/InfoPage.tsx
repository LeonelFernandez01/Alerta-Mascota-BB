import React from 'react';
import { infoStyles } from '../stylePg/infoPage';

export const InfoPage: React.FC = () => {
  return (
    <main className={infoStyles.container}>
      <div className={infoStyles.header}>
        <img src="/logo.svg" alt="Alerta Mascota BB Logo" className={infoStyles.logo} />
        <h2 className={infoStyles.title}>Alerta Mascota BB</h2>
        <p className={infoStyles.subtitle}>Bahía Blanca • Punta Alta • Solidaridad</p>
      </div>

      <div className={infoStyles.contentBox}>
        <h3 className={infoStyles.sectionTitle}>¿Cómo funciona la red?</h3>
        <p>
          Alerta Mascota BB es una plataforma digital móvil-first y responsiva creada por y para los vecinos de Bahía Blanca. Nuestro objetivo es reducir drásticamente el tiempo de reencuentro de los animales perdidos.
        </p>
        <p>
          La aplicación funciona de forma completamente abierta: no requiere registros molestos. Cualquier vecino que pierda o encuentre un animal puede cargar una alerta especificando calle, barrio y teléfono de contacto. Las personas interesadas se conectan de manera directa enviando un mensaje automático por WhatsApp con un solo clic.
        </p>
        
        <h3 className={infoStyles.sectionTitleWithMargin}>Normas de Uso y Convivencia</h3>
        <ul className={infoStyles.list}>
          <li>Por favor, sube únicamente fotos nítidas del animal en cuestión.</li>
          <li>Describe rasgos específicos de comportamiento (si es asustadizo, si muerde, si lleva collar) para facilitar la búsqueda.</li>
          <li>Una vez que recuperes a tu mascota o encuentres a sus dueños, por favor comunícalo o dale de baja si la app se conecta en el futuro a una base de datos.</li>
        </ul>

        <div className={infoStyles.footerBox}>
          <p className={infoStyles.versionText}>Desarrollo Frontend MVP 1.0.0 • Bahía Blanca, Argentina</p>
        </div>
      </div>
    </main>
  );
};
