import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  titulo: string;
  valor: string | number;
  subtitulo: string;
  icon: LucideIcon;
  colorClase: string;
  bgGradiente: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  titulo,
  valor,
  subtitulo,
  icon: Icon,
  colorClase,
  bgGradiente,
}) => {
  return (
    <div className={`p-5 rounded-3xl border border-white/40 dark:border-slate-800/60 glass-panel shadow-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md ${bgGradiente}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {titulo}
        </span>
        <div className={`p-2.5 rounded-2xl ${colorClase}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
          {valor}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {subtitulo}
        </p>
      </div>
    </div>
  );
};
