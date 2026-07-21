import React from 'react';
import type { TipoAnimal } from '../../types/mascota';

interface ItemDistribucion {
  tipo: TipoAnimal;
  etiqueta: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

interface DoughnutChartProps {
  items: ItemDistribucion[];
  total: number;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ items, total }) => {
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let acumulado = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl glass-panel border border-white/40 dark:border-slate-800/60 shadow-sm">
      {/* Gráfico SVG Anular */}
      <div className="relative w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200 dark:text-slate-800"
          />
          {total > 0 &&
            items.map((item) => {
              const dashArray = (item.porcentaje / 100) * circumference;
              const dashOffset = -((acumulado / 100) * circumference);
              acumulado += item.porcentaje;

              return (
                <circle
                  key={item.tipo}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              );
            })}
        </svg>

        {/* Texto Central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
            {total}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Total
          </span>
        </div>
      </div>

      {/* Leyenda Detallada */}
      <div className="flex flex-col space-y-3 w-full">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Distribución por Especie
        </h4>
        {items.map((item) => (
          <div key={item.tipo} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {item.etiqueta}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {item.cantidad}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                ({item.porcentaje}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
