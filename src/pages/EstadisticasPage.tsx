import React, { useMemo } from 'react';
import { BarChart3, AlertCircle, CheckCircle2, HeartHandshake, TrendingUp, ShieldAlert } from 'lucide-react';
import { useMascotas } from '../hooks/useMascotas';
import { calcularEstadisticasMascotas } from '../services/statsService';
import { KpiCard } from '../components/stats/KpiCard';
import { DoughnutChart } from '../components/stats/DoughnutChart';
import { BarChart } from '../components/stats/BarChart';
import { estadisticasStyles } from '../stylePg/estadisticasPage';

export const EstadisticasPage: React.FC = () => {
  const { rawMascotas } = useMascotas();

  const stats = useMemo(() => {
    return calcularEstadisticasMascotas(rawMascotas);
  }, [rawMascotas]);

  return (
    <div className={estadisticasStyles.container}>
      {/* Encabezado */}
      <div className={estadisticasStyles.header}>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[10px] tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Analíticas e Impacto Local</span>
        </div>
        <h2 className={estadisticasStyles.title}>
          Métricas de la Comunidad 📊
        </h2>
        <p className={estadisticasStyles.subtitle}>
          Visualización de datos en tiempo real sobre las alertas reportadas en Bahía Blanca y Punta Alta para ayudar a zoonosis y agrupaciones proteccionistas a identificar zonas prioritarias.
        </p>
      </div>

      {/* Grid de KPIs */}
      <div className={estadisticasStyles.kpiGrid}>
        <KpiCard
          titulo="Total de Alertas"
          valor={stats.totalReportes}
          subtitulo="Reportes registrados"
          icon={AlertCircle}
          colorClase="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          bgGradiente="from-indigo-50/50 dark:from-indigo-950/20 to-transparent"
        />
        <KpiCard
          titulo="Mascotas Perdidas"
          valor={stats.totalPerdidos}
          subtitulo="Busquedas activas"
          icon={ShieldAlert}
          colorClase="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          bgGradiente="from-rose-50/50 dark:from-rose-950/20 to-transparent"
        />
        <KpiCard
          titulo="Mascotas Encontradas"
          valor={stats.totalEncontrados}
          subtitulo="Resguardadas o devueltas"
          icon={CheckCircle2}
          colorClase="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          bgGradiente="from-emerald-50/50 dark:from-emerald-950/20 to-transparent"
        />
        <KpiCard
          titulo="Tasa de Reencuentro"
          valor={`${stats.tasaReencuentroPorcentaje}%`}
          subtitulo="Efectividad comunitaria"
          icon={TrendingUp}
          colorClase="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          bgGradiente="from-purple-50/50 dark:from-purple-950/20 to-transparent"
        />
      </div>

      {/* Secciones de Gráficos */}
      <div className={estadisticasStyles.chartsGrid}>
        <DoughnutChart items={stats.distribucionTipo} total={stats.totalReportes} />
        <BarChart items={stats.topBarrios} />
      </div>

      {/* Banner Informativo / Call to Action */}
      <div className={estadisticasStyles.bannerContainer}>
        <div>
          <h3 className={estadisticasStyles.bannerTitle}>
            ¿Sabías que la rapidez en el reporte aumenta un 80% los reencuentros?
          </h3>
          <p className={estadisticasStyles.bannerDesc}>
            Si ves un animal desorientado o perdiste a tu mascota, genera la alerta inmediatamente. Toda la red de vecinos de Bahía Blanca y Punta Alta se moviliza en minutos.
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-xs">
            <HeartHandshake className="w-4 h-4" />
            Red Solidaria BB
          </span>
        </div>
      </div>
    </div>
  );
};
