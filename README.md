# Alerta Mascota BB 🐾
### Comunidad Virtual de Alertas de Mascotas en Bahía Blanca & Punta Alta

Este es un **MVP (Mínimo Producto Viable)** móvil-first y totalmente responsivo desarrollado con **React, TypeScript y Tailwind CSS v4**. Está pensado para conectar de forma solidaria a vecinos que pierden o encuentran mascotas, permitiendo el contacto directo a través de WhatsApp.

---

## 🎯 Arquitectura del Proyecto (Clean Architecture Frontend)

El proyecto está diseñado bajo principios de arquitectura limpia. Esto permite separar las preocupaciones de datos de las interfaces de usuario (UI), haciendo que sea **extremadamente sencillo migrar de datos simulados a una base de datos real (como Firebase, Supabase o un backend propio)** sin alterar la interfaz de usuario.

```
src/
├── core/
│   └── types/
│       └── mascota.ts      # Tipos y tipados de dominio (BarrioBahia, MascotaReportada)
├── data/
│   ├── mockMascotas.ts     # Datos iniciales realistas de Bahía Blanca (Patagonia, Palihue, etc.)
│   └── mockService.ts      # Simulación de llamadas de API con retraso (latencia) y persistencia en localStorage
├── presentation/
│   ├── components/
│   │   ├── MascotaCard.tsx # Tarjeta adaptada para Grid y vista de Lista Compacta
│   │   ├── FilterBar.tsx   # Filtros de tipo, estado, barrio y barra de búsqueda
│   │   ├── ReportModal.tsx # Modal de reportes con soporte para carga de archivos Base64
│   │   └── MascotaDetailModal.tsx # Vista detallada flotante con efecto de vidrio esmerilado (Glassmorphism)
│   ├── hooks/
│   │   ├── useMascotas.ts  # Lógica de dominio, filtros insensibles a acentos y persistencia de datos
│   │   └── useDarkMode.ts  # Control y persistencia del estado de modo oscuro/claro
│   ├── pages/
│   │   └── FeedPage.tsx    # Pantalla principal contenedora con las distintas pestañas (Feed, Zoonosis, Info)
│   └── theme/
│       └── index.css       # Estilos globales y configuraciones de variantes de Tailwind CSS v4
├── App.tsx                 # Contenedor raíz adaptativo
└── main.tsx                # Punto de acceso principal
```

---

## ✨ Características Principales y UX/UI Optimizado

1. **Modo Claro y Oscuro Nativo**:
   - Persistente en `localStorage`.
   - Implementado en Tailwind CSS v4 mediante `@custom-variant dark (&:where(.dark, .dark *))` para un cambio de tema impecable.
2. **Visualización de Lista Compacta (Scrolling Inteligente)**:
   - Para evitar la fatiga por scroll infinito en dispositivos móviles, el usuario puede alternar de vista. La vista de lista contrae el alto de cada tarjeta a filas delgadas (~100px) mostrando una miniatura de la foto y los detalles principales. En pantallas grandes (PC), esta vista se ensancha a `max-w-4xl` mostrando un resumen de la descripción y un botón de WhatsApp completo.
3. **Carga Progresiva ("Cargar Más")**:
   - Por performance, solo se renderizan las primeras **4 alertas**. Un botón permite cargar 4 adicionales sucesivamente. Al realizar búsquedas o filtrar por barrio, el límite se reinicia a 4 de forma inteligente.
4. **Botón Flotante "Volver Arriba" (Back to Top)**:
   - Un botón circular con efecto traslúcido aparece automáticamente cuando se baja más de 350px de scroll, devolviendo al usuario al principio del feed de forma suave.
5. **Carga Local de Archivos de Imagen**:
   - Utiliza la **API FileReader de HTML5** para convertir fotos de la galería o de la cámara del celular en URLs Base64. Esto permite subir cualquier imagen de forma real, persistiéndola directamente en el storage local del navegador. Valida y limita archivos a un máximo de 2MB para evitar saturar el `localStorage`.
6. **Búsqueda Insensible a Acentos y Mayúsculas**:
   - Un algoritmo normaliza caracteres unicode (ej: buscar "bahia" mostrará resultados de "Bahía") para tolerar errores ortográficos normales al buscar.

---

## 🚀 Plan de Escalado a Producción Real (Firebase / Supabase)

El MVP está preparado para crecer. Para convertir este prototipo local en una red conectada a nivel nacional o regional con base de datos en la nube y usuarios registrados, se deben seguir estos pasos:

### 1. Autenticación y Perfil de Usuario
* **Firebase Auth / Supabase Auth**: Habilitar el inicio de sesión con correo/contraseña o Google.
* **Flujo**: Modificar el botón "Crear Alerta" para que exija estar registrado. Al crear una alerta, el `nombreContacto` y `telefonoContacto` se obtienen automáticamente del perfil del usuario registrado.

### 2. Base de Datos en Tiempo Real
* **Firestore o Supabase Tables**: Crear una colección/tabla llamada `mascotas` con el esquema definido en `src/core/types/mascota.ts`.
* **Migración en Código**:
  - En `src/presentation/hooks/useMascotas.ts`, reemplazar las llamadas a `mockService` por llamadas a Firebase/Supabase.
  - *Ejemplo en Supabase*:
    ```typescript
    // Para obtener mascotas
    const { data } = await supabase.from('mascotas').select('*').order('fecha', { ascending: false });
    
    // Para guardar
    const { error } = await supabase.from('mascotas').insert(nuevaMascota);
    ```
  - Como el hook `useMascotas` expone la misma interfaz (`mascotas`, `agregarReporte`), **ningún componente de la interfaz de usuario (UI) tendrá que modificarse**.

### 3. Almacenamiento de Archivos (Storage)
* **Firebase Storage o Supabase Buckets**:
  - En lugar de codificar la imagen subida en Base64 (que consume espacio valioso en la base de datos), se sube el archivo original binario al Bucket.
  - La API de Storage devuelve una URL pública estática (ej: `https://firebasestorage.googleapis.com/.../mascota.jpg`), la cual es la que finalmente se almacena en el campo `fotoUrl` del registro de la mascota.

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
3. Construir la versión de producción (compilador de producción Vite):
   ```bash
   npm run build
   ```
