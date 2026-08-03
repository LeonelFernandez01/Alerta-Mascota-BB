import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import type { MascotaReportada } from '../types/mascota';
import type { Usuario } from '../types/user';
import { mockService } from './mockService';

const MASCOTAS_COLLECTION = 'mascotas';
const USUARIOS_COLLECTION = 'usuarios';

export const backendService = {
  isRealtimeActive: (): boolean => {
    return isFirebaseConfigured && db !== null;
  },

  // Escuchar alertas de mascotas en tiempo real (Suscripción Firestore onSnapshot)
  subscribeMascotas: (
    onUpdate: (mascotas: MascotaReportada[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    if (!isFirebaseConfigured || !db) {
      // Fallback: Si no hay Firebase activo, se cargan los datos mock una vez
      mockService.getMascotas().then(onUpdate).catch(err => {
        if (onError) onError(err instanceof Error ? err : new Error(String(err)));
      });
      return () => {}; // Unsubscribe noop
    }

    try {
      const q = query(
        collection(db, MASCOTAS_COLLECTION),
        orderBy('fecha', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const mascotasData: MascotaReportada[] = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              tipo: data.tipo,
              estado: data.estado,
              barrio: data.barrio,
              zonaEspecifica: data.zonaEspecifica,
              fecha: data.fecha || new Date().toISOString(),
              fotoUrl: data.fotoUrl,
              descripcion: data.descripcion,
              señasParticulares: data.señasParticulares,
              telefonoContacto: data.telefonoContacto,
              nombreContacto: data.nombreContacto
            };
          });

          onUpdate(mascotasData);
        },
        (error) => {
          console.error('Error en listener de Firestore:', error);
          if (onError) onError(error);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error al iniciar suscripción a Firestore:', err);
      if (onError) onError(err instanceof Error ? err : new Error(String(err)));
      return () => {};
    }
  },

  // Agregar una nueva alerta de mascota a la nube
  addMascota: async (
    nuevoReporte: Omit<MascotaReportada, 'id' | 'fecha'>
  ): Promise<MascotaReportada> => {
    if (!isFirebaseConfigured || !db) {
      // Fallback a almacenamiento local simulado
      return await mockService.addMascota(nuevoReporte);
    }

    const docData = {
      ...nuevoReporte,
      fecha: new Date().toISOString(),
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, MASCOTAS_COLLECTION), docData);

    return {
      id: docRef.id,
      ...nuevoReporte,
      fecha: docData.fecha
    };
  },

  // Guardar o actualizar perfil de usuario en Firestore
  saveUsuario: async (usuario: Usuario): Promise<void> => {
    if (!isFirebaseConfigured || !db) return;

    try {
      const userRef = doc(db, USUARIOS_COLLECTION, usuario.id);
      await setDoc(userRef, {
        ...usuario,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Error al guardar usuario en Firestore:', err);
    }
  },

  // Obtener perfil de usuario desde Firestore
  getUsuario: async (userId: string): Promise<Usuario | null> => {
    if (!isFirebaseConfigured || !db) return null;

    try {
      const userRef = doc(db, USUARIOS_COLLECTION, userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data() as Usuario;
      }
      return null;
    } catch (err) {
      console.error('Error al obtener usuario de Firestore:', err);
      return null;
    }
  }
};
