// Las fechas del blog son fechas de calendario ("2026-10-28"): Astro las
// convierte en medianoche UTC. Formatearlas en UTC evita que el día se corra
// según la zona horaria de la máquina que compila (en UTC-5 se veía el día
// anterior) y que el resultado dependa del entorno.
const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
