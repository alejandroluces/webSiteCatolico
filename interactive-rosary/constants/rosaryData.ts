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
    { name: "Primer Misterio Gozoso", announcement: "La encarnación del Hijo de Dios.\n\n «Al sexto mes el ángel Gabriel fue enviado por Dios a una ciudad de Galilea, llamada Nazaret, a una virgen desposada con un hombre llamado José, de la estirpe de David; el nombre de la virgen era María» (Lc 1,26-27)." },
    { name: "Segundo Misterio Gozoso", announcement: "La visitación de Nuestra Señora a su prima Santa Isabel.\n\n «En aquellos días María se puso en camino y fue aprisa a la región montañosa, a una ciudad de Judá; entró en casa de Zacarías y saludó a Isabel. Y sucedió que, en cuanto Isabel oyó el saludo de María, saltó de gozo el niño en su seno, e Isabel quedó llena de Espíritu Santo; y exclamando a voz en grito, dijo: Bendita tú entre las mujeres y bendito el fruto de tu seno» (Lc 1, 39-42)" },
    { name: "Tercer Misterio Gozoso", announcement: "El nacimiento del Hijo de Dios. \n\n «Sucedió que por aquellos días salió un edicto de César Augusto ordenando que se empadronase todo el mundo. Este primer empadronamiento tuvo lugar siendo Cirino gobernador de Siria. Iban todos a empadronarse, cada uno a su ciudad. Subió también José desde Galilea, de la ciudad de Nazaret, a Judea, a la ciudad de David, que se llama Belén, por ser él de la casa y familia de David, para empadronarse con María, su esposa, que estaba encinta. Y sucedió que, mientras ellos estaban allí, se le cumplieron los días del alumbramiento, y dio a luz a su hijo primogénito, le envolvió en pañales y le acostó en un pesebre, porque no tenían sitio en el alojamiento» (Lc 2,1-7)." },
    { name: "Cuarto Misterio Gozoso", announcement: "La Presentación de Jesús en el templo. \n\n «Cuando se cumplieron los ocho días para circuncidarle, se le dio el nombre de Jesús, como lo había llamado el ángel antes de ser concebido en el seno. Cuando se cumplieron los días de la purificación de ellos, según la Ley de Moisés, llevaron a Jesús a Jerusalén para presentarle al Señor, como está escrito en la Ley del Señor: Todo varón primogénito será consagrado al Señor y para ofrecer en sacrificio un par de tórtolas o dos pichones, conforme a lo que se dice en la Ley del Señor» (Lc 2, 21-24)." },
    { name: "Quinto Misterio Gozoso", announcement: "El Niño Jesús perdido y hallado en el templo. \n\n «Sus padres iban todos los años a Jerusalén a la fiesta de la Pascua. Cuando tuvo doce años, subieron ellos como de costumbre a la fiesta y, al volverse, pasados los días, el niño Jesús se quedó en Jerusalén, sin saberlo sus padres... Y sucedió que al cabo de tres días, le encontraron en el Templo sentado en medio de los maestros, escuchándoles y preguntándoles; todos los que le oían, estaban estupefactos por su inteligencia y sus respuestas» (Lc 2, 41-47)" },
  ],
  [MysteryTypeEnum.Luminous]: [
    { name: "Primer Misterio Luminoso", announcement: "El Bautismo de Jesús en el Jordán. \n\n «Bautizado Jesús, salió luego del agua; y en esto se abrieron los cielos y vio al Espíritu de Dios que bajaba en forma de paloma y venía sobre él. Y una voz que salía de los cielos decía: Este es mi Hijo amado, en quien me complazco». (Mt 3,16-17)" },
    { name: "Segundo Misterio Luminoso", announcement: "La autorrevelación de Jesús en las bodas de Caná. \n\n «Tres días después se celebraba una boda en Caná de Galilea y estaba allí la madre de Jesús. Fue invitado también a la boda Jesús con sus discípulos. Y, como faltara vino, porque se había acabado el vino de la boda, le dice a Jesús su madre: No tienen vino. Jesús le responde: ¿Qué tengo yo contigo, mujer? Todavía no ha llegado mi hora. Dice su madre a los sirvientes: Haced lo que él os diga». (Jn 2, 1-5).  " },
    { name: "Tercer Misterio Luminoso", announcement: "El anuncio del Reino de Dios invitando a la conversión. \n\n  El tiempo se ha cumplido y el Reino de Dios está cerca; convertíos y creed en el Evangelio. (Mc 1, 15)" },
    { name: "Cuarto Misterio Luminoso", announcement: "La Transfiguración. \n\n «Seis días después, Jesús tomó consigo a Pedro, a Santiago y a su hermano Juan, y los llevó aparte, a un monte alto. Y se transfiguró delante de ellos: su rostro se puso brillante como el sol y sus vestidos se volvieron blancos como la luz» (Mt 17, 1-2)." },
    { name: "Quinto Misterio Luminoso", announcement: "La Institución de la Eucaristía. \n\n «Mientras estaban comiendo, tomó Jesús pan y lo bendijo, lo partió y, dándoselo a sus discípulos, dijo: Tomad, comed, éste es mi cuerpo» (Mt 26, 26). " },
  ],
  [MysteryTypeEnum.Sorrowful]: [
    { name: "Primer Misterio Doloroso", announcement: "La Oración de Jesús en el Huerto. \n\n «Entonces Jesús fue con ellos a un huerto, llamado Getsemaní, y dijo a sus discípulos: Sentaos aquí mientras voy a orar. Y tomando consigo a Pedro y a los dos hijos de Zebedeo, comenzó a sentir tristeza y angustia. Entonces les dijo: Mi alma está triste hasta el punto de morir; quedaos aquí y velad conmigo. Y adelantándose un poco, cayó rostro en tierra, y suplicaba así: Padre mío, si es posible, que pase de mí esta copa, pero no sea como yo quiero, sino como quieras tú» (Mt 26, 36-39)." },
    { name: "Segundo Misterio Doloroso", announcement: "La Flagelación del Señor. \n\n «Pilato puso en libertad a Barrabás; y a Jesús, después de haberlo hecho azotar, lo entregó para que fuera crucificado» (Mt 27, 26)." },
    { name: "Tercer Misterio Doloroso", announcement: "La Coronación de espinas. \n\n «Entonces los soldados del procurador llevaron consigo a Jesús al pretorio y reunieron alrededor de él a toda la cohorte. Lo desnudaron y le echaron encima un manto de púrpura y, trenzando una corona de espinas, se la pusieron sobre la cabeza, y en su mano derecha una caña, y doblando la rodilla delante de él, le hacían burla diciendo: Salve, Rey de los judíos». (Mt 27, 27-29)" },
    { name: "Cuarto Misterio Doloroso", announcement: "Jesús con la Cruz a cuestas camino del Calvario. \n\n «Y obligaron a uno que pasaba, a Simón de Cirene, que volvía del campo, el padre de Alejandro y de Rufo, a que llevara su cruz. Lo condujeron al lugar del Gólgota, que quiere decir de la Calavera» (Mc 15, 21-22)." },
    { name: "Quinto Misterio Doloroso", announcement: "La Crucifixión y Muerte de Nuestro Señor. \n\n «Llegados al lugar llamado La Calavera, le crucificaron allí a él y a los dos malhechores, uno a la derecha y otro a la izquierda. Jesús decía: Padre, perdónales, porque no saben lo que hacen... Era ya eso de mediodía cuando, al eclipsarse el sol, hubo oscuridad sobre toda la tierra hasta la media tarde. El velo del Santuario se rasgó por medio y Jesús, dando un fuerte grito dijo: Padre, en tus manos pongo mi espíritu y, dicho esto, expiró» (Lc  23, 33-46)." },
  ],
  [MysteryTypeEnum.Glorious]: [
    { name: "Primer Misterio Glorioso", announcement: "La Resurrección del Hijo de Dios. \n\n «El primer día de la semana, muy de mañana, fueron al sepulcro llevando los aromas que habían preparado. Pero encontraron que la piedra había sido retirada del sepulcro, y entraron, pero no hallaron el cuerpo del Señor Jesús. No sabían qué pensar de esto, cuando se presentaron ante ellas dos hombres con vestidos resplandecientes. Ellas, despavoridas, miraban al suelo, y ellos les dijeron: ¿Por qué buscáis entre los muertos al que está vivo? No está aquí, ha resucitado» (Lc 24, 1-6). " },
    { name: "Segundo Misterio Glorioso", announcement: "La Ascensión del Señor a los Cielos. \n\n «El Señor Jesús, después de hablarles, ascendió al cielo y se sentó a la derecha de Dios» (Mc 16, 19). " },
    { name: "Tercer Misterio Glorioso", announcement: "La Venida del Espíritu Santo sobre los Apóstoles. \n\n «Al llegar el día de Pentecostés, estaban todos reunidos en un mismo lugar. De repente vino del cielo un ruido como el de una ráfaga de viento impetuoso, que llenó toda la casa en la que se encontraban. Se les aparecieron unas lenguas como de fuego que se repartieron y se posaron sobre cada uno de ellos; quedaron todos llenos del Espíritu Santo y se pusieron a hablar en otras lenguas, según el Espíritu les concedía expresarse» (Hch 2, 1-4). " },
    { name: "Cuarto Misterio Glorioso", announcement: "La Asunción de Nuestra Señora a los Cielos. \n\n «Todas las generaciones me llamarán bienaventurada porque el Señor ha hecho obras grandes en mí» (Lc 1, 48-49). " },
    { name: "Quinto Misterio Glorioso", announcement: "La Coronación de la Santísima Virgen como Reina de Cielos y Tierra. \n\n «Una gran señal apareció en el cielo: una mujer, vestida de sol, con la luna bajo sus pies, y una corona de doce estrellas sobre su cabeza» (Ap 12, 1). " },
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
  ...conclusion, // 2 prayers
];
// Total prayers: 6 + 5 * 14 + 2 = 78
