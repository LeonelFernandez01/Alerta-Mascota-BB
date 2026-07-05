import { useContext } from 'react';
import { MascotasContext } from '../contexts/MascotasContext';
import type { MascotasContextType } from '../contexts/MascotasContext';



export const useMascotas = (): MascotasContextType => {
  const context = useContext(MascotasContext);
  if (context === undefined) {
    throw new Error('useMascotas debe ser utilizado dentro de un MascotasProvider');
  }
  return context;
};
