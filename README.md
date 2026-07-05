# Alerta Mascota BB 🐾
### Comunidad Virtual de Alertas de Mascotas en Bahía Blanca & Punta Alta

Este es un **MVP (Mínimo Producto Viable)** móvil-first y totalmente responsivo desarrollado con **React, TypeScript y Tailwind CSS v4**. Está pensado para conectar de forma solidaria a vecinos que pierden o encuentran mascotas, permitiendo el contacto directo a través de WhatsApp.

---

## 🎯 Arquitectura del Proyecto (Clean Modular Architecture)

El proyecto está diseñado bajo principios de modularidad y bajo acoplamiento. La separación en componentes de presentación, servicios de acceso a datos y proveedores globales de estado hace que sea **extremadamente sencillo migrar a una base de datos real (como Firebase, Supabase o un backend propio)** sin alterar las interfaces visuales.

```
src/
├── types/              # Contratos de datos y tipados estrictos de dominio
│   └── mascota.ts          # Tipos (BarrioBahia, TipoAnimal, MascotaReportada)
├── services/           # Acceso a datos (Mock Services y bases locales)
│   ├── mockMascotas.ts     # Datos iniciales realistas de Bahía Blanca
│   └── mockService.ts      # Simulación de llamadas de API con lag y localStorage
├── contexts/           # Estado Global (React Context Providers)
│   └── MascotasContext.tsx # Suministra el estado de reportes, carga y filtros
├── hooks/              # Custom hooks reutilizables (Consumidores de contextos)
│   ├── useMascotas.ts      # Hook consumidor del contexto de alertas
│   └── useDarkMode.ts      # Hook para alternar y persistir el modo oscuro/claro
├── components/         # UI Reutilizable (Componentes de presentación)
│   ├── MascotaCard.tsx     # Tarjeta individual (Soporta Grid y Lista)
│   ├── FilterBar.tsx       # Buscador e inputs por scroll lateral en celular
│   ├── ReportModal.tsx     # Formulario de reportes con subida Base64
│   └── MascotaDetailModal.tsx # Detalle ampliado y traslúcido de mascota
├── pages/              # Pantallas lógicas modulares
│   ├── FeedPage.tsx        # Feed principal de alertas de mascotas
│   ├── RecursosPage.tsx    # Listado de Zoonosis y Refugios útiles
│   └── InfoPage.tsx        # Pantalla informativa de normas y uso
├── stylePg/            # Estilos de página en TypeScript (Tailwind configs)
│   ├── feedPage.ts         # Clases Tailwind del feed de alertas
│   ├── recursosPage.ts     # Clases Tailwind de Zoonosis
│   └── infoPage.ts         # Clases Tailwind de Ayuda / Info
├── styles/             # CSS global modularizado
│   ├── theme.css           # Soporte de Modo Oscuro Tailwind v4 y tipografías
│   ├── animations.css      # Keyframes y transiciones de entrada
│   └── utilities.css       # Utilidades especiales de scrollbar y degradados
├── App.tsx             # Layout general (Tabs, Header, Providers)
└── main.tsx            # Punto de acceso principal
```

---

## ✨ Características Principales y UX/UI Optimizado

1. **Modo Claro y Oscuro Nativo**:
   - Persistente en `localStorage`.
   - Implementado en Tailwind CSS v4 mediante `@custom-variant dark (&:where(.dark, .dark *))` para un cambio de tema impecable.
2. **Visualización de Lista Compacta (Scrolling Inteligente)**:
   - Para evitar la fatiga por scroll infinito en dispositivos móviles, el usuario puede alternar de vista desde el Header. La vista de lista contrae el alto de cada tarjeta a filas delgadas (~100px) en celulares. En pantallas grandes (PC), esta vista se ensancha a `max-w-4xl` mostrando un resumen de la descripción y un botón de WhatsApp con texto. La preferencia de vista se almacena de forma persistente en `localStorage`.
3. **Carga Progresiva ("Cargar Más")**:
   - Solo se renderizan las primeras **4 alertas** inicialmente. Un botón permite cargar 4 adicionales sucesivamente. Al realizar búsquedas o filtrar por barrio, el límite se reinicia a 4 de forma inteligente.
4. **Botón Flotante "Volver Arriba" (Back to Top)**:
   - Un botón circular aparece automáticamente cuando se baja más de 350px de scroll, devolviendo al usuario al principio de forma suave.
5. **Carga Local de Archivos de Imagen**:
   - Utiliza la **API FileReader de HTML5** para convertir fotos en URLs Base64. Esto permite subir imágenes reales desde la galería o la cámara del celular. Valida y limita archivos a un máximo de 2MB para evitar saturar el `localStorage`.
6. **Previsualización de Imagen sin Recortes (Blurred Backdrop)**:
   - En las vistas previas de detalles y de carga, las imágenes se renderizan de forma completa sin cortes (`object-contain`), centradas sobre un fondo estético difuminado del mismo archivo (`object-cover blur-md`). Esto garantiza que los usuarios puedan ver todas las señas particulares del animal (patas, orejas, collar, cola) sin deformaciones ni recortes arbitrarios.
7. **Búsqueda Insensible a Acentos y Mayúsculas**:
   - Un algoritmo normaliza caracteres unicode (ej: buscar "bahia" mostrará resultados de "Bahía").

---

## 🚀 Plan de Escalado a Producción Real (Firebase / Supabase)

El MVP está preparado para crecer. Para convertir este prototipo local en una red conectada a nivel nacional o regional con base de datos en la nube y usuarios registrados, se deben seguir estos pasos:

### 1. Autenticación y Perfil de Usuario
* **Firebase Auth / Supabase Auth**: Habilitar el inicio de sesión con correo/contraseña o Google.
* **Flujo**: Modificar el botón "Crear Alerta" para que exija estar registrado. Al crear una alerta, el `nombreContacto` y `telefonoContacto` se obtienen del perfil del usuario registrado.

### 2. Base de Datos en Tiempo Real
* **Firestore o Supabase Tables**: Crear una colección/tabla llamada `mascotas` con el esquema definido en `src/types/mascota.ts`.
* **Migración en Código**:
  - En `src/contexts/MascotasContext.tsx`, reemplazar las llamadas a `mockService` por llamadas a la API de Firebase/Supabase.
  - Como el hook `useMascotas` y los componentes consumen el mismo contexto global, **ningún archivo de la interfaz visual (UI) requerirá modificaciones**.

### 3. Almacenamiento de Archivos (Storage)
* **Firebase Storage o Supabase Buckets**:
  - Se sube la foto binaria al Bucket.
  - Se almacena la URL de descarga del bucket en el campo `fotoUrl` del registro en la base de datos, optimizando el consumo de espacio de datos.

---

## 🛠️ Instalación y Configuración Local

1. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Ejecutar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
3. Construir la versión de producción:
   ```bash
   npm run build
   ```
