import React from 'react';
import type { BarrioBahia } from '../../types/mascota';

interface ItemBarrio {
  barrio: BarrioBahia;
  cantidad: number;
  porcentaje: number;
}

interface BarChartProps {
  items: ItemBarrio[];
}

export const BarChart: React.FC<BarChartProps> = ({ items }) => {
  const maxCantidad = items.length > 0 ? Math.max(...items.map((i) => i.cantidad)) : 1;

  return (
    <div className="p-6 rounded-3xl glass-panel border border-white/40 dark:border-slate-800/60 shadow-sm flex flex-col space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Barrios con Mayor Cantidad de Alertas
      </h4>

      {items.length === 0 ? (
        <p className="text-xs text-slate-400 py-4">No hay datos disponibles.</p>
      ) : (
        <div className="space-y-3.5">
          {items.map((item) => {
            const widthPorcentaje = Math.round((item.cantidad / maxCantidad) * 100);

            return (
              <div key={item.barrio} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">
                    {item.barrio}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {item.cantidad} {item.cantidad === 1 ? 'alerta' : 'alertas'}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${widthPorcentaje}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
