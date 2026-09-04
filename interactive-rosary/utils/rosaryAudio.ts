import { MysteryType } from '../types';

export const ROSARY_AUDIO_SLUGS: Record<MysteryType, string> = {
  [MysteryType.Joyful]: 'gozosos',
  [MysteryType.Luminous]: 'luminosos',
  [MysteryType.Sorrowful]: 'dolorosos',
  [MysteryType.Glorious]: 'gloriosos',
};

export const getRosaryAudioUrl = (
  mysteryType: MysteryType,
  prayerIndex: number,
) => {
  const slug = ROSARY_AUDIO_SLUGS[mysteryType];
  const segment = String(prayerIndex + 1).padStart(2, '0');

  return `/audio/rosary/${slug}/${segment}.mp3`;
};

