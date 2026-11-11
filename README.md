# Alerta Mascota BB 🐾
### Comunidad Virtual de Alertas de Mascotas en Bahía Blanca & Punta Alta

Aplicación web móvil-first y totalmente responsiva desarrollada con **React 19, TypeScript, Tailwind CSS v4, Leaflet y Firebase Firestore**. Está pensada para conectar de forma solidaria a vecinos que pierden o encuentran mascotas en Bahía Blanca y Punta Alta, permitiendo la difusión inmediata, geolocalización en mapa interactivo, generación de carteles con QR para imprimir y contacto directo por WhatsApp.

---

## 🎯 Arquitectura del Proyecto (Clean Modular Architecture)

El proyecto está diseñado bajo principios de modularidad y desacoplamiento, con soporte dual para **Firebase Firestore Realtime** en la nube y **fallback automático a persistencia local (`localStorage`)** para desarrollo sin configuración previa.

```text
src/
├── config/             # Inicialización y detección automática de credenciales
│   └── firebase.ts         # Configuración de Firebase Auth y Firestore
├── types/              # Contratos de datos y tipados estrictos de dominio
│   ├── mascota.ts          # Tipos (BarrioBahia, TipoAnimal, MascotaReportada)
│   └── user.ts             # Tipado de Vecino Verificado y sesión
├── services/           # Capa de acceso a datos y servicios de dominio
│   ├── backendService.ts   # Orquestador Realtime (Firestore + Fallback local)
│   ├── flyerGeneratorService.ts # Generador de afiches de búsqueda en HTML5 Canvas
│   ├── geoService.ts       # Geocodificación exacta de calles con Nominatim OSM
│   ├── statsService.ts     # Cálculo de métricas comunitarias y tasas de reencuentro
│   ├── mockMascotas.ts     # Datos iniciales realistas de Bahía Blanca
│   └── mockService.ts      # Persistencia simulada en localStorage
├── contexts/           # Estado Global (React Context Providers)
│   ├── AuthContext.tsx     # Sesión de usuario y perfil de vecino
│   └── MascotasContext.tsx # Estado de reportes, suscripción realtime, filtros y favoritos
├── hooks/              # Custom hooks reutilizables
│   ├── useAuth.ts          # Hook consumidor de autenticación
│   ├── useMascotas.ts      # Hook consumidor del contexto de alertas
│   └── useDarkMode.ts      # Hook para alternar y persistir el modo oscuro/claro
├── components/         # UI Reutilizable (Componentes de presentación)
│   ├── stats/              # Gráficos modulares (BarChart, DoughnutChart, KpiCard)
│   ├── AuthModal.tsx       # Registro e inicio de sesión de vecinos
│   ├── FilterBar.tsx       # Buscador y filtros por tipo, estado, guardados y barrio
│   ├── FlyerPreviewModal.tsx # Previsualización y descarga de cartel con QR
│   ├── MascotaCard.tsx     # Tarjeta con efecto 3D Tilt, vista lista/grid y guardado
│   ├── MascotaDetailModal.tsx # Detalle ampliado, compartir enlace y contacto WhatsApp
│   ├── ReportModal.tsx     # Formulario de reportes con autocompletado y subida Base64
│   └── UserProfileModal.tsx # Perfil del vecino y gestión de publicaciones propias
├── pages/              # Pantallas lógicas modulares
│   ├── FeedPage.tsx        # Feed principal de alertas y apertura por deep-link (?alerta=ID)
│   ├── MapaPage.tsx        # Mapa interactivo Leaflet con pines personalizados por calle
│   ├── EstadisticasPage.tsx # Dashboard de estadísticas por barrio y especie
│   ├── RecursosPage.tsx    # Listado de Zoonosis, guardia veterinaria y refugios
│   └── InfoPage.tsx        # Pantalla informativa de normas y uso
├── utils/              # Utilidades puras y helpers de Canvas / Mapas
│   ├── canvasHelpers.ts    # Primitivas de dibujo para Canvas 2D
│   ├── flyerDrawers.ts     # Capas de diseño del afiche descargable
│   ├── imageLoader.ts      # Carga segura de imágenes con CORS
│   ├── mapMarkerHelper.ts  # Generación de marcadores HTML para Leaflet
│   └── qrGenerator.ts      # Generación de código QR con fallback vectorial offline
├── stylePg/            # Estilos de página y componentes en TypeScript
└── styles/             # CSS global modularizado (theme, animations, utilities)
```

---

## ✨ Características Principales

1. **Sincronización Híbrida (Firebase Firestore Realtime + Local Fallback)**:
   - Escucha cambios en vivo mediante `onSnapshot` si las variables de entorno de Firebase están configuradas en `.env`, o funciona automáticamente en modo local (`localStorage`) sin requerir claves.
2. **Mapa Interactivo con Geocodificación por Calle (Leaflet + Nominatim)**:
   - Posiciona cada alerta en la calle o intersección indicada dentro de Bahía Blanca y Punta Alta, con caché local de coordenadas y marcadores diferenciados por estado.
3. **Generador de Afiches de Búsqueda con Código QR (HTML5 Canvas)**:
   - Crea carteles listos para imprimir o subir a historias de Instagram/WhatsApp en alta resolución, incluyendo un código QR que apunta directamente al enlace de la alerta (`/?alerta=ID`).
4. **Perfil del Vecino y Gestión de Publicaciones Propias**:
   - Registro rápido de vecinos con autocompletado de datos al reportar una emergencia.
   - Panel *"Mis Publicaciones"* para cambiar el estado de una alerta a **¡Encontrado!** o eliminarla cuando la mascota regresa a casa.
5. **Sistema de Alertas Guardadas (En Seguimiento) y Enlaces Directos**:
   - Permite guardar casos con un marcador para hacerles seguimiento desde la barra de filtros y compartir enlaces directos mediante **Web Share API** o portapapeles.
6. **Dashboard de Estadísticas Comunitarias**:
   - Visualización de KPIs, distribución por especie, balance de perdidos vs. encontrados y ranking de alertas por barrio.
7. **Experiencia Móvil-First y Modo Oscuro Nativo**:
   - Vista intercambiable entre cuadrícula con efecto 3D Tilt y lista compacta, carga progresiva y tema claro/oscuro persistente.

---

## 🛠️ Instalación y Configuración Local

1. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
2. *(Opcional)* Configurar Firebase Realtime copiando el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   *(Si no se configura `.env`, la aplicación funcionará automáticamente con persistencia local simulada).*
3. Ejecutar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
4. Construir y verificar la versión de producción:
   ```bash
   npm run build
   ```
