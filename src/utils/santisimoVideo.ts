export type DayKey =
  | 'domingo'
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado';

export const DAY_LABEL_ES: Record<DayKey, string> = {
  domingo: 'Domingo',
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
};

/**
 * Videos ubicados en: /public/images/videoDelSantisimo
 *
 * Nota: por ahora sólo está cargado el video del lunes.
 * Cuando agregues los otros días, completa este mapa.
 */
export const SANTISIMO_VIDEO_BY_DAY: Partial<Record<DayKey, string>> = {
  lunes: 'Adoración Eucarística Perpetua_Lunes.mp4',
  martes: 'Adoración Eucarística Perpetua_Martes.mp4',
  miercoles: 'Adoración Eucarística Perpetua_Miercoles.mp4',
  jueves: 'Adoración Eucarística Perpetua_Jueves.mp4',
  viernes: 'Adoración Eucarística Perpetua_Viernes.mp4',
  sabado: 'Adoración Eucarística Perpetua_Sábado.mp4',
  domingo: 'Adoración Eucarística Perpetua_Domingo.mp4',
};

export function getDayKey(date = new Date()): DayKey {
  const dayIndex = date.getDay();
  switch (dayIndex) {
    case 0:
      return 'domingo';
    case 1:
      return 'lunes';
    case 2:
      return 'martes';
    case 3:
      return 'miercoles';
    case 4:
      return 'jueves';
    case 5:
      return 'viernes';
    case 6:
      return 'sabado';
    default:
      return 'lunes';
  }
}

export function getSantisimoVideoForDate(date = new Date()): {
  dayKey: DayKey;
  dayLabel: string;
  filename: string;
  publicSrc: string;
  isFallback: boolean;
} {
  const dayKey = getDayKey(date);
  const dayLabel = DAY_LABEL_ES[dayKey];

  const filename = SANTISIMO_VIDEO_BY_DAY[dayKey] ?? '';
  const isFallback = false;

  // encodeURI es importante porque los nombres pueden tener espacios y tildes.
  const publicSrc = encodeURI(`/images/videoDelSantisimo/${filename}`);

  return {
    dayKey,
    dayLabel,
    filename,
    publicSrc,
    isFallback,
  };
}
