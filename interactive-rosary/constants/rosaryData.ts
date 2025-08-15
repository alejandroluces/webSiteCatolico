import type { Prayer, Mystery, RosaryBead, MysteryType, PrayerKey } from '../types';
import { MysteryType as MysteryTypeEnum } from '../types';


export const PRAYERS: Record<PrayerKey, Prayer> = {
  sign_of_cross: {
    name: "Señal de la Cruz y Credo",
    text: "Por la señal de la Santa Cruz, de nuestros enemigos, líbranos Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.\n\nCreo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.",
  },
  apostles_creed: {
    name: "Credo de los Apóstoles",
    text: "Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.",
  },
  our_father: {
    name: "Padrenuestro",
    text: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad, en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.",
  },
  hail_mary: {
    name: "Avemaría",
    text: "Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.",
  },
  glory_be: {
    name: "Gloria",
    text: "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
  },
  fatima_prayer: {
    name: "Jaculatoria de Fátima",
    text: "Oh, Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.",
  },
  hail_holy_queen: {
    name: "La Salve",
    text: "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra. Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clementísima, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.",
  },
  final_prayer: {
    name: "Oración Final",
    text: "Bajo tu amparo nos acogemos, Santa Madre de Dios; no desprecies las súplicas que te dirigimos en nuestras necesidades, antes bien, líbranos de todos los peligros, ¡oh Virgen gloriosa y bendita! Amén.",
  }
};

export const MYSTERIES: Record<MysteryType, Mystery[]> = {
  [MysteryTypeEnum.Joyful]: [
    { name: "Primer Misterio Gozoso", announcement: "La Anunciación del Ángel a María." },
    { name: "Segundo Misterio Gozoso", announcement: "La Visitación de María a su prima Isabel." },
    { name: "Tercer Misterio Gozoso", announcement: "El Nacimiento del Niño Jesús en Belén." },
    { name: "Cuarto Misterio Gozoso", announcement: "La Presentación de Jesús en el Templo." },
    { name: "Quinto Misterio Gozoso", announcement: "El Niño Jesús perdido y hallado en el Templo." },
  ],
  [MysteryTypeEnum.Luminous]: [
    { name: "Primer Misterio Luminoso", announcement: "El Bautismo de Jesús en el Jordán." },
    { name: "Segundo Misterio Luminoso", announcement: "La autorrevelación de Jesús en las bodas de Caná." },
    { name: "Tercer Misterio Luminoso", announcement: "El anuncio del Reino de Dios invitando a la conversión." },
    { name: "Cuarto Misterio Luminoso", announcement: "La Transfiguración de Jesús." },
    { name: "Quinto Misterio Luminoso", announcement: "La Institución de la Eucaristía." },
  ],
  [MysteryTypeEnum.Sorrowful]: [
    { name: "Primer Misterio Doloroso", announcement: "La Oración de Jesús en el Huerto de Getsemaní." },
    { name: "Segundo Misterio Doloroso", announcement: "La Flagelación de Jesús atado a la columna." },
    { name: "Tercer Misterio Doloroso", announcement: "La Coronación de espinas." },
    { name: "Cuarto Misterio Doloroso", announcement: "Jesús con la Cruz a cuestas camino del Calvario." },
    { name: "Quinto Misterio Doloroso", announcement: "La Crucifixión y Muerte de Nuestro Señor." },
  ],
  [MysteryTypeEnum.Glorious]: [
    { name: "Primer Misterio Glorioso", announcement: "La Resurrección del Señor." },
    { name: "Segundo Misterio Glorioso", announcement: "La Ascensión del Señor a los Cielos." },
    { name: "Tercer Misterio Glorioso", announcement: "La Venida del Espíritu Santo sobre los Apóstoles." },
    { name: "Cuarto Misterio Glorioso", announcement: "La Asunción de Nuestra Señora a los Cielos." },
    { name: "Quinto Misterio Glorioso", announcement: "La Coronación de María como Reina de Cielos y Tierra." },
  ],
};

const intro: RosaryBead[] = [
    { prayerKey: 'sign_of_cross' }, // This now includes the creed text
    // apostles_creed is removed from sequence as it's merged with sign_of_cross
    { prayerKey: 'our_father' },
    { prayerKey: 'hail_mary' },
    { prayerKey: 'hail_mary' },
    { prayerKey: 'hail_mary' },
    { prayerKey: 'glory_be' },
];

const createDecade = (mysteryIndex: number): RosaryBead[] => [
    { prayerKey: 'mystery_announcement', mysteryIndex },
    { prayerKey: 'our_father', mysteryIndex },
    ...Array<RosaryBead>(10).fill({ prayerKey: 'hail_mary', mysteryIndex }),
    { prayerKey: 'glory_be', mysteryIndex },
    { prayerKey: 'fatima_prayer', mysteryIndex },
];

const conclusion: RosaryBead[] = [
    { prayerKey: 'hail_holy_queen' },
    { prayerKey: 'final_prayer' },
    { prayerKey: 'sign_of_cross' },
];

const fullIntro: RosaryBead[] = [
    { prayerKey: 'sign_of_cross' }, // Prayer 0
    // Merged apostles_creed, so we remove one step here
    { prayerKey: 'our_father' }, // Prayer 1
    { prayerKey: 'hail_mary' }, // Prayer 2
    { prayerKey: 'hail_mary' }, // Prayer 3
    { prayerKey: 'hail_mary' }, // Prayer 4
    { prayerKey: 'glory_be' }, // Prayer 5
];


export const ROSARY_SEQUENCE: RosaryBead[] = [
  ...fullIntro, // 6 prayers
  ...createDecade(0), // 14 prayers
  ...createDecade(1), // 14 prayers
  ...createDecade(2), // 14 prayers
  ...createDecade(3), // 14 prayers
  ...createDecade(4), // 14 prayers
  ...conclusion, // 3 prayers
];
// Total prayers: 6 + 5 * 14 + 3 = 79
