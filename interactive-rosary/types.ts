
export enum MysteryType {
  Joyful = "Gozosos",
  Luminous = "Luminosos",
  Sorrowful = "Dolorosos",
  Glorious = "Gloriosos",
}

export interface Prayer {
  name: string;
  text: string;
}

export interface Mystery {
  name: string;
  announcement: string;
}

export type PrayerKey =
  | 'sign_of_cross'
  | 'apostles_creed'
  | 'our_father'
  | 'hail_mary'
  | 'glory_be'
  | 'fatima_prayer'
  | 'hail_holy_queen'
  | 'final_prayer';

export interface RosaryBead {
  prayerKey: PrayerKey | 'mystery_announcement';
  mysteryIndex?: number;
}
