import type { MascotaReportada } from '../types/mascota';

export const MOCK_MASCOTAS: MascotaReportada[] = [
  {
    id: '1',
    tipo: 'perro',
    estado: 'perdido',
    barrio: 'Patagonia',
    zonaEspecifica: 'Lauquen y Pilmaiquén',
    fecha: new Date(Date.now() - 3 * 3600000).toISOString(), // Hace 3 horas
    fotoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Se escapó de nuestra quinta por el portón de atrás que quedó mal cerrado. Es un Golden Retriever muy dócil, de pelaje dorado claro. Responde al nombre de Rocco.',
    señasParticulares: 'Llevaba un collar de cuero rojo con una chapita en forma de hueso que tiene grabado su nombre y celular.',
    telefonoContacto: '5492915551234',
    nombreContacto: 'Martina Rossi'
  },
  {
    id: '2',
    tipo: 'gato',
    estado: 'encontrado',
    barrio: 'Universitario',
    zonaEspecifica: 'Avenida Alem y 12 de Octubre',
    fecha: new Date(Date.now() - 12 * 3600000).toISOString(), // Hace 12 horas
    fotoUrl: 'https://images.unsplash.com/photo-1513360309081-36f5e878fc9e?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Encontré este gatito siamés de ojos azules muy intensos llorando en el estacionamiento de la Universidad (UNS). Es súper mimoso y se nota que es de casa porque sabe usar las piedritas.',
    señasParticulares: 'No tiene collar, pero está castrado y muy bien cuidado. Tiene la punta de la oreja izquierda levemente marcada.',
    telefonoContacto: '5492915555678',
    nombreContacto: 'Esteban Altieri'
  },
  {
    id: '3',
    tipo: 'perro',
    estado: 'perdido',
    barrio: 'Villa Mitre',
    zonaEspecifica: 'Chiclana y Necochea',
    fecha: new Date(Date.now() - 24 * 3600000).toISOString(), // Hace 1 día
    fotoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Buscamos a Toby. Se asustó con una moto y salió corriendo en dirección a la plaza de Villa Mitre. Es un perrito mestizo mediano tricolor (marrón, negro y blanco). Es asustadizo pero no muerde.',
    señasParticulares: 'Tiene una mancha negra grande en forma de círculo en el lomo y la cola corta.',
    telefonoContacto: '5492915559876',
    nombreContacto: 'Juan Ignacio Gómez'
  },
  {
    id: '4',
    tipo: 'perro',
    estado: 'encontrado',
    barrio: 'Palihue',
    zonaEspecifica: 'Caronti al 800',
    fecha: new Date(Date.now() - 48 * 3600000).toISOString(), // Hace 2 días
    fotoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Pug beige encontrado deambulando cerca del club de golf de Palihue. Está muy cansado y sediento. Lo retengo temporalmente en mi patio trasero para evitar accidentes.',
    señasParticulares: 'Lleva pretal de paseo color negro de marca Hurtta, pero no tiene chapita identificatoria.',
    telefonoContacto: '5492915553421',
    nombreContacto: 'Sofía D\'Alessandro'
  },
  {
    id: '5',
    tipo: 'gato',
    estado: 'perdido',
    barrio: 'Centro',
    zonaEspecifica: 'Mitre y Rodríguez',
    fecha: new Date(Date.now() - 72 * 3600000).toISOString(), // Hace 3 días
    fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Se nos escapó Misha. Se cayó de un balcón del segundo piso. Está castrada y nunca salió a la calle, por lo que debe estar sumamente asustada y escondida en algún garaje u obra en construcción.',
    señasParticulares: 'Es una gata de pelaje atigrado gris y blanco. Tiene una marquita blanca en el hocico y las cuatro patitas parecen tener "medias blancas".',
    telefonoContacto: '5492915557788',
    nombreContacto: 'Paula Santillán'
  },
  {
    id: '6',
    tipo: 'otro',
    estado: 'perdido',
    barrio: 'Noroeste',
    zonaEspecifica: 'Donado al 1500',
    fecha: new Date(Date.now() - 96 * 3600000).toISOString(), // Hace 4 días
    fotoUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Buscamos a nuestro conejo mascota Copito. Se hizo un pozo bajo el alambrado del jardín y salió. Los chicos de la familia están muy tristes, por favor si alguien lo ve o lo retiene, avise.',
    señasParticulares: 'Conejo enano de color blanco puro, muy dócil. Ojos rosados claros.',
    telefonoContacto: '5492915550099',
    nombreContacto: 'Familia Domínguez'
  }
];
