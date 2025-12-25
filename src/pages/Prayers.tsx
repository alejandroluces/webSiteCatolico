import React, { useState, Fragment, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Search, BookOpen, Users, Briefcase, Shield, Home, Cross, X, Star, Play, Pause } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

interface Prayer {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  audioUrl?: string;
}

const Prayers: React.FC = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'todas');
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const prayerCategories = [
    { id: 'todas', name: 'Todas las Oraciones', icon: BookOpen, color: 'text-marian-blue-600 dark:text-marian-blue-400' },
    { id: 'arcangeles', name: 'Arcángeles', icon: Shield, color: 'text-yellow-600 dark:text-yellow-400' },
    { id: 'familia', name: 'Familia', icon: Home, color: 'text-red-600 dark:text-red-400' },
    { id: 'salud', name: 'Salud', icon: Heart, color: 'text-green-600 dark:text-green-400' },
    { id: 'trabajo', name: 'Trabajo', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'proteccion', name: 'Protección', icon: Shield, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'vocaciones', name: 'Vocaciones', icon: Users, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'paz', name: 'Paz Interior', icon: Cross, color: 'text-sacred-gold-600 dark:text-sacred-gold-400' },
    { id: 'marianas', name: 'Oraciones Marianas', icon: Star, color: 'text-blue-400 dark:text-blue-200' },
  ];

  const prayers = [
    {
      id: 1,
      title: 'Oración por la Familia',
      category: 'familia',
      excerpt: 'Señor, bendice a nuestra familia y manténla unida en tu amor...',
      content: `Señor Jesús, tú que quisiste formar parte de una familia humana,
      
Te pedimos que bendigas a nuestra familia y la mantengas unida en tu amor.

Ayúdanos a ser pacientes unos con otros, a perdonarnos mutuamente y a crecer juntos en la fe.

Que nuestro hogar sea un lugar de paz, donde reine tu presencia y donde cada miembro se sienta amado y valorado.

Protege a nuestros hijos, guía sus pasos y ayúdanos a ser buenos ejemplos para ellos.

Concédenos la gracia de orar juntos, de compartir nuestras alegrías y tristezas, y de apoyarnos en los momentos difíciles.

María, Madre de la Sagrada Familia, intercede por nosotros.
San José, protector de las familias, ruega por nosotros.

Amén.`,
    },
    {
      id: 10,
      title: 'Oración a la Familia por San Juan Pablo II',
      category: 'familia',
      excerpt: 'Oh Dios, de quien procede toda paternidad en el cielo y en la tierra...',
      content: `Oh Dios, de quien procede toda paternidad en el cielo y en la tierra, Padre, que eres Amor y Vida, haz que en cada familia humana sobre la tierra se convierta, por medio de tu Hijo, Jesucristo, “nacido de Mujer”, y del Espíritu Santo, fuente de caridad divina, en verdadero santuario de la vida y del amor para las generaciones porque siempre se renuevan.
Haz que tu gracia guíe a los pensamientos y las obras de los esposos hacia el bien de sus familias y de todas las familias del mundo.
Haz que las jóvenes generaciones encuentren en la familia un fuerte apoyo para su humanidad y su crecimiento en la verdad y en el amor.
Haz que el amor, corroborado por la gracia del sacramento del matrimonio, se demuestre más fuerte que cualquier debilidad y cualquier crisis, por las que a veces pasan nuestras familias.
Haz finalmente, te lo pedimos por intercesión de la Sagrada Familia de Nazaret, que la Iglesia en todas las naciones de la tierra pueda cumplir fructíferamente su misión en la familia y por medio de la familia. Tú, que eres la Vida, la Verdad y El Amor, en la unidad del Hijo y del Espíritu santo.
Amen.`
    },
    {
      id: 11,
      title: 'Oración a San José, Protector de las familias',
      category: 'familia',
      excerpt: 'Glorioso San José, protector, modelo y guía de las familias cristianas...',
      content: `Glorioso San José, protector, modelo y guía de las familias cristianas: Te ruego, protejas a la mía. Haz reinar en ella el espíritu de fe y de religión, la fidelidad a los mandamientos de Dios y de la Iglesia, la paz y la unión de los hijos, el desprendimiento de los bienes temporales y el amor a los asuntos del cielo.
Dígnate velar sobre todos nuestros intereses. Ruega al Señor que bendiga nuestra casa. Otorga la paz a la familia, acierto a los hijos en la elección de estado. Concede a todos los miembros de nuestra familia y de todas las familias de la tierra, la gracia de vivir y morir en el amor de Jesús y de María.
Amén.`
    },
    {
      id: 12,
      title: 'Consagración al Castísimo Corazón de San José',
      category: 'familia',
      excerpt: 'San José, esposo de la Virgen María, consagramos a tu Castísimo Corazón...',
      content: `San José, esposo de la Virgen María, consagramos a tu Castísimo Corazón, nuestra familia, para que en todos reine el amor y la comprensión, que nuestros hogares sean un refugio del amor de Dios, donde se defienda la vida, pureza, dignidad, y castidad, donde florezcan todas las virtudes cristianas.
Amado San José, acepta esta consagración, que tú siempre seas nuestro custodio, padre y guía en el camino de la salvación. Obtennos una gran pureza de corazón y una ferviente devoción a la vida interior.
Concédeme que, siguiendo tu ejemplo, podamos dirigir todas nuestras acciones hacia la mayor gloria de Dios, en unión con el Sagrado Corazón de Jesús y el Inmaculado Corazón de María.
Oh San José, que fuiste bendecido por el Señor con la beatitud prometida a los puros de corazón, ya que durante tu vida terrena compartiste la vida de Jesús y viviste en Su presencia visible. Dígnate interceder por nosotros ante tu amado Hijo. Pídele que nos ayude, para que nuestra conciencia sea recta y veraz, y que nuestros corazones sean puros. Libérame del doblez y la malicia. Llena mi corazón de esperanza para que nunca dilate innecesariamente en mis pesares. Te pido con fe simple y ardiente para que pueda servir a mis hermanos y hermanas con un corazón generoso. De esta manera, como tú, me deleitaré en el profundo gozo y en la paz de la presencia misericordiosa de Dios.
Que con tu ayuda nuestra familia sea una fábrica de santos, donde broten vocaciones a la vida matrimonial, sacerdotal y religiosa, que cada uno según los designios de Dios como, podamos ser constructores eficaces de la civilización del amor. Para que todos los matrimonios católicos podamos dar testimonio de vida cristiana, llevando la buena nueva de salvación a los necesitados, con predicación, caridad y buen ejemplo. Moldeadnos según tu carácter, para que reinen en todas nuestras familias la paz de Cristo Jesús, Señor Nuestro. Amén`
    },
    {
      id: 13,
      title: 'Ángelus',
      category: 'familia',
      excerpt: 'El ángel del Señor anunció a María...',
      content: `Monitor: El ángel del Señor anunció a María.
Audiencia: Y ella concibió por obra y gracia del Espíritu Santo.
Dios te salve María, llena eres de gracia, el Señor es contigo; bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.
Monitor: He aquí la esclava del Señor.
Audiencia: Hágase en mí según tu palabra. Dios te salve María
… Santa María, Madre de Dios…
Monitor: Y el Verbo de Dios se hizo carne.
Audiencia: Y habitó entre nosotros. Dios te salve María,
… Santa María, Madre de Dios…
Monitor: Ruega por nosotros, Santa Madre de Dios.
Audiencia: Para que seamos dignos de alcanzar las promesas y gracias de Nuestro Señor Jesucristo. Amén.
Oración:
Infunde, Señor tu gracia en nuestros corazones para que cuantos, por el anuncio del ángel, hemos conocido la encarnación de tu Hijo Jesucristo, por su pasión y su cruz lleguemos a la gloria de su resurrección.
Por Jesucristo, Nuestro Señor. Amén.`
    },
    {
      id: 2,
      title: 'Oración por la Salud',
      category: 'salud',
      excerpt: 'Señor, tú que sanaste a los enfermos, escucha nuestra súplica...',
      content: `Señor Jesús, médico divino y sanador de cuerpos y almas,
      
Acudo a ti con fe, pidiendo por la salud de [nombre de la persona] y de todos los que sufren enfermedad.

Tú que durante tu vida terrena sanaste a los enfermos con tu palabra y tu toque amoroso, extiende tu mano sanadora sobre nosotros.

Concede la curación física si es tu voluntad, pero sobre todo, sana nuestros corazones y fortalece nuestra fe.

Ayúdanos a aceptar con paciencia y esperanza los sufrimientos, uniéndolos a tu Pasión redentora.

Bendice a los médicos, enfermeros y todos los que cuidan de los enfermos, para que sean instrumentos de tu misericordia.

María, Salud de los Enfermos, intercede por nosotros.
San Rafael Arcángel, patrono de la salud, ruega por nosotros.

Amén.`,
    },
    {
      id: 14,
      title: 'Oración pidiendo sanación',
      category: 'salud',
      excerpt: 'Padre santo y Padre bueno, gracias por tu bondad para con todos nosotros...',
      content: `Padre santo y Padre bueno, gracias por tu bondad para con todos nosotros. Gracias por todas las cosas buenas que nos has concedido a lo largo de nuestra vida. Me acerco a ti, Señor, para pedir que les concedas salud a aquellos que sufren alguna enfermedad en este momento. Señor, te pido que tu mano poderosa llegue hasta cada uno de ellos, concediéndoles alivio para sus dolores y ánimo para el espíritu.

Hay niños, jóvenes y adultos sufriendo ahora mismo por causa de enfermedades y dolencias fuertes. Muéstrales tu misericordia, Señor. Alivia el pesar y el dolor que sienten. Gracias, Señor, porque tú nos escuchas cuando clamamos a ti. Por favor, atiende el clamor interno de los que se sienten demasiado débiles por causa de la enfermedad. Dales nuevas fuerzas. Que ellos puedan sentir tu presencia y la paz incomparable que viene de ti.

Sobre todas las cosas te pido, Padre, que los enfermos puedan tener un encuentro contigo. Ayúdales a sentir tu presencia y tu mano sobre ellos. Que cada uno de ellos pueda tener contacto con personas que te aman y puedan escuchar el mensaje de salvación. Revela tu amor y tu cuidado a través de tus hijos. Que cada enfermo pueda escuchar sobre Jesús y su sacrificio de amor en la cruz. Que abran sus corazones a ti, Señor, mi Dios, para que reciban la sanidad del alma.

Muestra tu poder en medio de las enfermedades, Padre amado. Sabemos que tú puedes sanar cualquier enfermedad y en ti está puesta nuestra confianza. Queremos verte obrar en este día. En el nombre de Jesús, amén.`
    },
    {
      id: 15,
      title: 'Oración por un enfermo: toca su cuerpo y restaura su salud',
      category: 'salud',
      excerpt: 'Padre, tu Palabra nos anima a acercarnos con confianza al trono de la gracia...',
      content: `Padre, tu Palabra nos anima a acercarnos con confianza al trono de la gracia para recibir misericordia y hallar la gracia que nos ayude en el momento que más la necesitemos (Hebreos 4:16). Es con esa confianza que vengo ante ti en este día para presentarte a mi amigo. Ven, Espíritu Santo, y muestra tu poder en su vida. Solo tú puedes hacer un milagro en este momento. Toca su cuerpo y restaura su salud.

Te pido también que le des sabiduría a los médicos para que logren encontrar un tratamiento eficaz. Es una situación delicada, pero tú tienes el control y la última palabra. Nuestro deseo es verte obrar de forma poderosa, restaurando la salud de nuestro amigo. Tú puedes hacerlo ahora mismo y también puedes usar a los médicos. ¡En ti confiamos para su sanidad física!

Gracias porque podemos traer nuestras peticiones ante ti, confiando en tu amor, en tu poder y en tu fidelidad en todo momento, Señor. En el nombre de Jesús, amén.`
    },
    {
      id: 16,
      title: 'Oración por un enfermo hospitalizado',
      category: 'salud',
      excerpt: 'Señor, mi Dios, oro en este momento por mi amiga hospitalizada...',
      content: `Señor, mi Dios, oro en este momento por mi amiga hospitalizada. Acércate a ella allí en el hospital donde está. Que ella pueda sentir tu presencia y que no tenga ningún temor ni se sienta sola. Ayúdala a sentir tu paz, a estar tranquila y confiada porque tú estás con ella y tienes el control de la situación.

Padre, ayúdala a sentir tu presencia sanadora y tranquilizadora. Que ella no se desespere ante la incógnita de su enfermedad. Dale sabiduría a los médicos para que hagan las pruebas necesarias y puedan comenzar un tratamiento eficaz.

Señor, sabemos que tú puedes obrar y sanar su cuerpo en este mismo momento si es tu voluntad. ¡Eso sería maravilloso! Tú sí sabes lo que sucede en su cuerpo y tienes la solución. En ti está puesta toda nuestra fe. Nos gustaría ver su sanación de forma sobrenatural, pero eso está en tus manos.

Señor, auméntanos la fe para pedir la manifestación de tu poder en nuestros cuerpos y en todas las áreas de nuestra vida. Muestra tu poder en medio de lo que está pasando mi querida amiga en este momento. ¡Levántala, por favor! En el nombre de Jesús, amén.`
    },
    {
      id: 17,
      title: 'Oración por un enfermo: tu toque sanador',
      category: 'salud',
      excerpt: 'Padre celestial, me acerco a ti en esta oración para suplicarte por el bienestar...',
      content: `Padre celestial, me acerco a ti en esta oración para suplicarte por el bienestar de mi amigo que hoy se encuentra indispuesto. Te pido, Señor amado, que le permitas sentir de manera profunda tu presencia consoladora en su vida durante estos momentos difíciles y que pueda experimentar el poder sanador de tu amor. Alivia las molestias y el malestar que le aquejan, mi Dios y Redentor, y permite que comience a recuperar su salud y su ánimo el día de hoy. Te damos gracias porque sabemos que siempre escuchas nuestras súplicas y actúas en nuestro favor. Nuestra esperanza y confianza están puestas en ti, y te lo pedimos todo en el sagrado nombre de Jesús. Amén.`
    },
    {
      id: 18,
      title: 'Oración por los enfermos en casa',
      category: 'salud',
      excerpt: 'Señor, gracias, porque en todos los momentos, estés en la situación que estés...',
      content: `Señor, gracias, porque en todos los momentos, estés en la situación que estés, tú estás con nosotros y podemos hablar contigo. Gracias porque podemos ir ante tu presencia en cualquier hora y lugar para recibir tu toque sanador y tu paz.

Me acerco a ti hoy para pedirte que seas con aquellos que están en casa debido a alguna enfermedad. Ayúdales a saber que no están solos porque tú estás con ellos y no los abandonarás. Recuérdales que pueden acudir a ti, pues tú escuchas sus oraciones y tu amor está sobre ellos.

Padre, apoyo a mis hermanos con mis oraciones y con la confianza de que obrarás en sus vidas. Trae paz a sus corazones y alivio a sus síntomas. Que su salud se renueve para que puedan llevar a cabo todas las tareas que deben realizar. Fortalece sus cuerpos, haz que todo funcione bien y que recuperen su salud completamente.

Bendícenos también a los familiares y amigos de cada uno de ellos. Ayúdanos a ser de apoyo, de ánimo y bendición en estos momentos difíciles. Que seamos sensibles a sus necesidades y les ayudemos con las tareas que necesitan. Queremos ser tus manos, apoyarlos y facilitarles la vida. Señor, sé que obrarás en esta situación y eso me da paz. Amén.`
    },
    {
      id: 19,
      title: 'Oración antes de una cirugía',
      category: 'salud',
      excerpt: 'Padre amado, en este día en el que se llevará a cabo la cirugía de mi hermana...',
      content: `Padre amado, en este día en el que se llevará a cabo la cirugía de mi hermana, te pido que tú tomes todo el control. Dale paz a ella en este momento, que ella pueda sentir tu presencia a su lado y saber que todo irá bien. Señor, que tus ángeles la rodeen y la protejan de todo mal, por favor.

Señor, ayuda al anestesista, al cirujano y a todos los que estarán presentes durante la cirugía. Que estén concentrados y atentos en todo momento y den lo mejor de sí mismos. Señor, te ruego que todo salga bien, que no haya ningún tipo de complicación ni situación de emergencia. Unge las manos del cirujano para que haga todo de manera eficiente y sin contratiempos.

También te pido, Señor, por el tiempo de recuperación. Que mi hermana pueda despertar sin problema y que pueda recuperar la salud sin ningún tipo de infección, dolor excesivo o complicación. Pon tu mano sobre ella. Que su espíritu esté lleno de tu paz y de la certeza de que tú obrarás sanidad a través de esta cirugía. Amén.`
    },
    {
      id: 20,
      title: 'Oración por alguien con depresión',
      category: 'salud',
      excerpt: 'Padre Dios, tú nos conoces y sabes lo que sentimos antes de que nosotros lo digamos...',
      content: `Padre Dios, tú nos conoces y sabes lo que sentimos antes de que nosotros lo digamos. Gracias porque nos acompañas en todo momento, en tiempos de alegría y en tiempos de tristeza o enfermedad. ¡Tus hijos contamos con tu presencia y tu amor siempre! Podemos vivir con esa confianza. ¡Mil gracias!

Señor, tú conoces lo que siente mi hermano en este momento. Él se siente deprimido y desanimado, como si tuviera una gran nube oscura sobre él. Ayúdalo a ver tu luz, a escuchar al Espíritu Santo y a sentir tu presencia amorosa ahora mismo. Tú sabes cuál es la causa de su depresión. Por favor, trae claridad a su mente y a su corazón para que él sepa lo que debe hacer. Que él entienda que es valioso para ti y que tu mano está extendida en todo momento. ¡No tiene que caminar solo!

Tú tienes la solución para este sentimiento depresivo sobre él. Dale la valentía y el deseo de buscar ayuda médica y consejería pastoral. Que no se quede encerrado sintiéndose falto de esperanza, sino que salga en busca de ayuda. Ayúdalo a mantenerse firme en ti y a encontrar médicos y personas sabias que lo escuchen y lo acompañen en el proceso de restauración.

Gracias porque tú nos escuchas cuando clamamos a ti y podemos confiar en que obrarás. En el nombre de Jesús, amén.`
    },
    {
      id: 21,
      title: 'Oración para que un enfermo no sufra',
      category: 'salud',
      excerpt: 'Señor, tú conoces la larga temporada de grave enfermedad que ha pasado mi amiga...',
      content: `Señor, tú conoces la larga temporada de grave enfermedad que ha pasado mi amiga. Tú sabes todo lo que ha sufrido y cuán cansada está de toda esta situación. Te ruego que te acerques a ella y la llenes de tu paz, que traigas alivio a su cuerpo y a su alma.

Tú sabes que los médicos no dan mucha esperanza de recuperación, Señor. Es un tiempo triste y difícil para ella y para todos los que la amamos. Te suplico que derrames más de tu misericordia. Si tu voluntad es sanarla, por favor, hazlo lo más pronto posible. Pero si ya es el momento de que vaya ante tu presencia, te ruego que la ayudes a estar tranquila, a descansar en tus brazos y a sentir tu cuidado y tu amor.

Ayúdanos también a nosotros, los que estamos a su lado, a confiar en tu voluntad para su vida. Consuela nuestros corazones y ayúdanos a ser de ánimo y bendición para ella.

Te ruego que no sufra, que tus brazos de amor la rodeen y que la paz incomparable que viene de ti inunde su ser. Guarda su corazón. Que ella pueda mantenerse firme en ti y fiel, confiando en tus promesas de salvación y vida eterna. Ayúdala a experimentar destellos de tu presencia sin igual y a saber que en vida o cuando llegue el momento de su muerte física, tú estarás con ella, tus brazos la recibirán y tendrá gozo por toda la eternidad. En el nombre de Jesús, amén.`
    },
    {
      id: 22,
      title: 'Oración para que todo salga bien',
      category: 'salud',
      excerpt: 'Señor, tú conoces la situación de incertidumbre por la que estoy pasando...',
      content: `Señor, tú conoces la situación de incertidumbre por la que estoy pasando. Me siento bastante mal físicamente y, aunque me hacen muchas analíticas y pruebas, todavía no sé realmente lo que me sucede. Te ruego que le des sabiduría a los médicos, que ellos puedan encontrar lo que pasa en mi cuerpo y me puedan dar el tratamiento que necesito.

Te pido que me des paz en medio de todo, que yo pueda sentir tu presencia fortalecedora y me pueda aferrar a ti, entregándote mis miedos y temores. Quiero confiar en ti, quiero llenarme de esperanza sabiendo que todo saldrá bien. Obra Padre, en mi corazón y en mi cuerpo. Que esta experiencia me acerque a ti y me lleve a ser más como Cristo.

Y, Padre, si la causa es emocional, si hay algo en lo profundo de mi ser que me está llevando a sentirme mal físicamente y a tener estos síntomas, te ruego que me lo muestres. Quiero buscar la ayuda necesaria para experimentar completa libertad y sanidad. Quiero ser libre de toda enfermedad y seguir adelante, viviendo para ti.

Quiero confiar más en ti, quiero crecer en mi fe. Ayúdame a sentir tu amor y tu guía en medio de toda esta situación. Gracias porque yendo de tu mano, todo saldrá bien. En el nombre de Jesús, amén.`
    },
    {
      id: 23,
      title: 'Oración por un enfermo desahuciado',
      category: 'salud',
      excerpt: 'Padre Dios, para ti no hay nada imposible y esa es nuestra confianza...',
      content: `Padre Dios, para ti no hay nada imposible y esa es nuestra confianza. Cuando los médicos dicen que no hay esperanza, nos aferramos más a ti porque sabemos que tú todavía puedes obrar. No cesaremos de orar y pedir sanidad en el nombre de Jesús porque creemos en ti y en tu infinito poder. Por favor, obra en medio de esta enfermedad, Padre amado. Sana este cuerpo de una forma sobrenatural y milagrosa. ¡Tú puedes hacerlo ahora mismo si es tu voluntad!

En ti somos más que vencedores. ¡Gloria a ti, Señor! Gracias porque nosotros, tus hijos, tenemos la esperanza de la vida eterna. ¡Nada ni nadie, ninguna enfermedad o dolor nos separarán de ti ni de tu amor! Esa es nuestra seguridad hoy y por toda la eternidad. Amén.`
    },
    {
      id: 24,
      title: 'Oración para después de una cirugía',
      category: 'salud',
      excerpt: 'Señor mi Dios, gracias por tu cuidado por mi hermano durante la cirugía...',
      content: `Señor mi Dios, gracias por tu cuidado por mi hermano durante la cirugía. Gracias porque guiaste todo y ahora ya se encuentra en recuperación. Te ruego que alivies su dolor según pasa el efecto de la anestesia y que pueda sentir tu presencia y tu paz en todo momento.

Te pido que la cirugía sea todo un éxito, que de ahora en adelante pueda recuperarse sin ninguna complicación. Habla a su corazón en este momento, que pueda estar consciente de tu presencia y tu amor. Tú tienes el control y en ti confiamos. Ayúdale a recuperar sus fuerzas, libra su cuerpo de infecciones o reacciones adversas. Pon tu mano sanadora sobre su cuerpo y que pueda sentir el alivio que necesita en este momento.

Padre, te ruego que los resultados sean positivos, que se vea el buen efecto de la cirugía sobre su cuerpo y que de hoy en adelante se recupere bien. Derrama tu paz y tu misericordia sobre él y ayúdale a mantenerse optimista, sabiendo que tú lo amas y cuidas de él. En el nombre de Jesús, amén.`
    },
    {
      id: 25,
      title: 'Oración por los profesionales de la salud',
      category: 'salud',
      excerpt: 'Dios amado, muchas gracias por los médicos, las enfermeras, los terapeutas...',
      content: `Dios amado, muchas gracias por los médicos, las enfermeras, los terapeutas, los psicólogos y todos los profesionales de la salud que vigilan por nuestro bienestar físico. Muchas gracias por su dedicación y su deseo de ayudarnos a estar bien física y emocionalmente.

Señor, sabemos que muchos de ellos están agotados, pues trabajan muchas horas seguidas y a veces no tienen tiempo para dormir. Ayúdales a tener suficiente descanso para que puedan hacer su trabajo diario con ánimo, paciencia, fuerzas y de forma eficaz. Líbralos del estrés y la ansiedad ante la gravedad de los pacientes o la grandeza de sus tareas. Que puedan buscar la paz que viene de ti y ser transformados por ti.

También ayúdales, Señor, a identificarse con el dolor de los pacientes que atienden, a extender su mano con empatía. Que el trabajo no sea solo una rutina automática, sino que vean tu diseño en cada persona y tu amor por cada una de ellas.

Padre, te ruego que ellos se den cuenta de que su trabajo es un ministerio. Que busquen tu presencia y las fuerzas espirituales que tú les puedes dar para que puedan ayudar a las personas, no solo a superar sus necesidades físicas, sino que también puedan bendecirlas con tu presencia y tu amor. En el nombre de Jesús, amén.`
    },
    {
      id: 3,
      title: 'Oración por el Trabajo',
      category: 'trabajo',
      excerpt: 'Señor, bendice nuestro trabajo y ayúdanos a encontrar propósito...',
      content: `Señor Dios, creador de todas las cosas,
      
Tú nos has llamado a colaborar contigo a través de nuestro trabajo.

Te pedimos que bendigas nuestras labores diarias y nos ayudes a realizarlas con dedicación y honestidad.

Concédenos encontrar propósito y satisfacción en lo que hacemos, viendo en nuestro trabajo una forma de servir a los demás y glorificar tu nombre.

Ayúdanos a ser justos con nuestros compañeros, respetuosos con nuestros superiores y comprensivos con nuestros subordinados.

Cuando enfrentemos dificultades laborales, danos paciencia y sabiduría para resolverlas.

Protege a todos los trabajadores del mundo, especialmente a los desempleados, para que encuentren pronto una ocupación digna.

San José Obrero, patrono de los trabajadores, intercede por nosotros.

Amén.`,
    },
    {
      id: 26,
      title: 'Oración para que me vaya bien en el trabajo',
      category: 'trabajo',
      excerpt: 'Padre Dios, gracias porque puedo comenzar una nueva jornada laboral...',
      content: `Padre Dios, gracias porque puedo comenzar una nueva jornada laboral. Gracias por proveerme este trabajo y por darme las fuerzas y la salud necesarias para realizarlo. Pongo este nuevo día en tus manos para que me guíes y me ayudes a estar alerta, a usar bien mi tiempo y a hacer un buen manejo de los recursos que tú me das.
Ayúdame a ser eficiente en mi trabajo, a dar lo mejor de mí mismo, pensando que todo lo que hago es una ofrenda a ti. Quiero hacer cada labor como para ti y no para los hombres, enfocándome en tu amor constante y tu provisión. Dame la concentración necesaria, que yo no me distraiga con cosas que no son tan importantes o discusiones que no llevan a nada bueno.
Señor, concédeme las fuerzas físicas y emocionales para hacer un trabajo de buena calidad cada día. Acompáñame en todo momento, guía mis pasos para que yo ande por camino recto, sin desviarme del propósito de mis tareas.
Ayúdame a entender la importancia del trabajo que realizo, pues cada labor beneficia a alguien. Quiero entender que soy parte de una cadena de personas y que lo que hago, bendice, anima y ayuda a los demás. Llena mi corazón de gozo, sabiendo que soy productivo y contribuyo para el mejoramiento de la sociedad en la que vivo.
En el nombre de Jesús, amén.`
    },
    {
      id: 27,
      title: 'Oración por mi trabajo',
      category: 'trabajo',
      excerpt: 'Señor amado, muchísimas gracias por el trabajo que me has concedido...',
      content: `Señor amado, muchísimas gracias por el trabajo que me has concedido. Sé que es una bendición que ha venido de ti en el momento preciso. Gracias por tu provisión a mis necesidades a través de la empresa en la que estoy. Gracias por mis compañeros y por el trabajo que podemos hacer juntos.
Padre, te pido que bendigas nuestra empresa y el trabajo que realizamos. Ayúdanos a ser eficientes en el uso de nuestros recursos, a dar lo mejor de nosotros y a sentir satisfacción en el trabajo que realizamos.
Guíanos en todo momento, ayúdanos a aprovechar bien el tiempo y a usar nuestras fuerzas y recursos con sabiduría. Padre, bendice a mis jefes y a mis compañeros. Ayúdanos a llevarnos bien, a entendernos y a colaborar los unos con los otros. Que podamos resolver los desacuerdos y problemas con rapidez, con respeto y amor.
Danos nuevas ideas para que la empresa pueda avanzar y crecer. Ayúdanos a apoyarnos y a cuidarnos, a velar por el bienestar los unos de los otros. Que celebremos nuestros logros con gozo y venzamos las dificultades unidos, velando por el bienestar de todos.
Padre, ayúdame a trabajar con alegría y a ser de bendición para mis compañeros. Y ayúdame a crecer en este trabajo, a dar lo mejor de mí cada día y a buscar oportunidades para mostrar tu amor por los demás.
En el nombre de Jesús, amén.`
    },
    {
      id: 28,
      title: 'Oración de bendición para el trabajo',
      category: 'trabajo',
      excerpt: 'Señor mi Dios, gracias por el trabajo que me has dado...',
      content: `Señor mi Dios, gracias por el trabajo que me has dado, por esta empresa en la que me abriste puertas para que yo tenga un trabajo estable y suficiente sustento diario. Padre mío, te ruego que bendigas todo mi esfuerzo, que mi trabajo traiga alegría no solo a mi corazón, sino también a las personas que se benefician de él. Ayúdame a hacer bien todas las tareas y a aprovechar bien el tiempo, para poder ser más efectivo cada día.
Bendice a cada uno de mis compañeros de trabajo. Dales salud física, emocional y espiritual. Ayúdame a ser un buen testigo de tu amor. Quiero traer tu gozo a este lugar y reflejar tu luz y tu amor para así bendecir a mis compañeros. Ayúdame a estar atento a las necesidades que ellos tienen, a orar por ellos cuando veo que están enfermos, tristes, sin ánimo o enfrentando algún reto.
Te pido también que bendigas esta empresa que nos da trabajo. Te ruego que esta empresa pueda crecer, que siga estable para que podamos seguir trabajando aquí por muchos años. Danos satisfacción en el trabajo que hacemos, que veamos la importancia del trabajo que realizamos, cómo impacta, ayuda y bendice a los demás.
Padre, te ruego que bendigas a mis jefes. Ayúdalos a darse cuenta de que te necesitan, que rindan sus corazones a ti para que esta empresa pueda reflejar tus valores en esta sociedad tan necesitada de tu mover.
Gracias, Dios, porque tú me escuchas y me amas. En el nombre de Jesús, amén.`
    },
    {
      id: 29,
      title: 'Oración para tener éxito en el trabajo',
      category: 'trabajo',
      excerpt: 'Dios amado, alabo tu nombre en este día y te doy gracias por todas tus bondades...',
      content: `Dios amado, alabo tu nombre en este día y te doy gracias por todas tus bondades para conmigo. Gracias porque eres el Dios proveedor que me ayuda y guía en todo momento.
Señor, gracias porque tengo un trabajo en el cual me siento útil. Gracias por traerme a este trabajo, gracias por las habilidades que me has dado y que puedo usar aquí. Quiero dar lo mejor de mí, usar todo mi potencial para bendecir y ayudar a otros. Por favor, muéstrame cómo hacerlo.
Padre, ayúdame en la toma de decisiones y en la organización de mis días. Quiero dar prioridad a lo que es importante para ti y no perder tiempo en cosas menos relevantes. Ayúdame a enfocarme en mis tareas y a hacer bien el trabajo que se me encomienda. Señor, quiero tener sabiduría y entender tu perspectiva en medio de cada situación. Dirige mis tareas, que todo lo que yo haga sea hecho con excelencia, como ofrenda fragante para ti, mi Señor.
Señor mi Dios, quiero tener éxito, prospera mis esfuerzos. Multiplica mis fuerzas y ensancha mi territorio para que yo pueda tener suficiente trabajo y más clientes.
Pero, Padre, no quiero enfocarme solo en eso. Ayúdame a tener días balanceados en los que haga buen trabajo, pero también tome tiempo para cuidar de mí, de mi familia y buscar oportunidades para bendecir a mis compañeros de trabajo, los clientes y todos los que encuentro en mi camino.
El mayor éxito está en vivir dentro de tu voluntad: guía mi trabajo y mis relaciones con los demás en todo momento.
En el nombre de Jesús, amén.`
    },
    {
      id: 30,
      title: 'Oración para que el trabajo no sea penoso',
      category: 'trabajo',
      excerpt: 'Padre Dios todopoderoso, gracias por la bendición del trabajo...',
      content: `Padre Dios todopoderoso, gracias por la bendición del trabajo. Estoy feliz de poder trabajar, pero algunos días son un poco pesados y me siento algo ansioso. Ayúdame a ver mi trabajo con tus ojos, a ver mis compañeros y clientes como tú los ves, y dame tu corazón en todo momento. Quiero disfrutar de mi trabajo siempre sabiendo que es provisión tuya.
Señor, en los momentos en los que me siento agobiado, ayúdame a acudir a ti para recibir ánimo y nuevas fuerzas. Cuando las tareas se vuelvan aburridas, ayúdame a recordar que cada tarea tiene un propósito.
Guíame siempre para que yo tome las decisiones correctas y no pierda el tiempo en cosas poco productivas. Hazme efectivo en mi trabajo y ayúdame a disfrutar lo que hago.
Renueva mi satisfacción y mi gozo al hacer mi trabajo. Quiero dejarme guiar por ti cada día y permitir que tu Espíritu me llene y fluya a través de mí para que otros puedan sentir tu presencia. Que cuando los demás me vean, sepan que soy tu hijo y sientan tu amor.
En tus manos pongo este día de trabajo, Señor. Úsame para bendecir a otros.
En el nombre de Jesús, amén.`
    },
    {
      id: 31,
      title: 'Oración para conseguir trabajo',
      category: 'trabajo',
      excerpt: 'Padre, gracias porque tú conoces mis necesidades, mis aptitudes y mis anhelos...',
      content: `Padre, gracias porque tú conoces mis necesidades, mis aptitudes y mis anhelos. Gracias porque te he visto obrar y proveer en mi vida y sé que puedo confiar en tu ayuda. Tú eres siempre fiel.
Señor, tú sabes que ahora mismo necesito un trabajo para poder cubrir las necesidades de nuestra familia. Guíame y abre puertas.
Deseo conseguir un buen trabajo en el cual pueda usar mis talentos, conocimientos y habilidades, un lugar donde haya un buen ambiente en el que nos apoyemos mutuamente. Un trabajo en el que pueda avanzar en mi carrera y sentir que uso los dones que tú me has dado.
Padre amado, ayúdame a encontrar un buen puesto de trabajo en el que me sienta útil y satisfecho. Guíame a las entrevistas y empresas adecuadas para que yo pueda establecer buenos contactos y encontrar el lugar en el que encajo mejor.
Señor, quiero vivir dentro de tu voluntad. Por eso te pido que seas tú quien abra las puertas, que vayas delante de mí allanando el camino, que me guíes a la empresa adecuada. Ayúdame a explicar con claridad y humildad lo que yo puedo aportar a la empresa y a mostrar mi deseo de aprender y de servir a otros con alegría.
Dame valentía para ir a cada entrevista, perseverancia para no rendirme en medio del proceso y la confianza de que tú me has dado habilidades que pueden ser de ayuda y bendición a otros.
Gracias porque tú me acompañas y sé que obrarás concediéndome un buen trabajo. En el nombre de Jesús, amén.`
    },
    {
      id: 4,
      title: 'Oración de Protección',
      category: 'proteccion',
      excerpt: 'Ángel de la Guarda, protégenos de todo mal...',
      content: `Ángel de la Guarda, dulce compañía,
no me desampares ni de noche ni de día.

Señor Jesús, bajo tu manto sagrado me refugio.
Protégeme de todo mal, peligro y tentación.

Envía a tu Ángel de la Guarda para que me acompañe en todos mis caminos,
me proteja de los accidentes y me libre de las malas compañías.

Cubre con tu Sangre preciosa a mi familia, mi hogar y mis bienes.
Que tu luz divina ahuyente toda oscuridad de nuestras vidas.

San Miguel Arcángel, defiéndenos en la batalla contra las fuerzas del mal.
Con tu espada de fuego, protégenos de todo enemigo visible e invisible.

María Santísima, Madre protectora, extiende tu manto sobre nosotros.
Que bajo tu amparo encontremos siempre refugio y consuelo.

Amén.`,
    },
    {
      id: 32,
      title: 'Oración de protección contra las fuerzas del mal',
      category: 'proteccion',
      excerpt: 'Señor, Dios Eterno todopoderoso, Dios nuestro misericordioso y omnipotente...',
      content: `Señor, Dios Eterno todopoderoso, Dios nuestro misericordioso y omnipotente, Padre, Hijo y Espíritu Santo, oh Dios, principio y fin de todas las cosas, soberano de los siglos que solo tú eres grande, por la intercesión y con la ayuda de los arcángeles san Miguel, san Rafael y san Gabriel, nosotros, tus hijos, humildemente te rogamos que nos libres eficazmente de todo mal y adversidad, de todo enemigo y mala persona; revístenos con tu armadura, envíanos tu luz llénanos de bendiciones y danos tu protección para poder gozar siempre de tu paz.
Yo (tu nombre) pido tu auxilio y socorro, cúbreme con tus brazos altísimos y poderosos, purifica mi mente, corazón, cuerpo, alma y espíritu, y no permitas que nada perjudicial penetre en mí.
Señor Dios Uno y Trino, junto con María reinen sobre mí y los míos, hoy y por toda la eternidad y no permitas que nada ni nadie pueda causarme mal.
Señor a ti clamo, creo en Ti, en tu poder y en tu gloria, creo en tu palabra, que es la única que puede alumbrarme; pido perdón por todos mis pecados y faltas, y en el nombre de Jesús y por el poder de su Sangre, te ruego seas magnánimo conmigo, te pido disipes todo lo que me atormenta y lastima, aleja de mi vida y hogar todas las sombras tenebrosas, sálvame de todo mal que venga contra mi  y rompe en pedazos las cadenas que me aprisionan, para que pueda cumplir tu santa voluntad sin impedimentos físicos ni espirituales. Amén.`
    },
    {
      id: 33,
      title: 'Oración al Ángel de la guarda por la protección diaria',
      category: 'proteccion',
      excerpt: 'Ángel de mi guarda, mi dulce compañía, no me desampares...',
      content: `Ángel de mi guarda, mi dulce compañía, no me desampares, ni de noche ni de día, hasta que me entregues en los brazos de Jesús, José y María. Con tus alas me persigno y me abrazo a la cruz, y en mi corazón me llevo al dulcísimo Jesús. Con Dios me acuesto, con Dios me levanto, con la Virgen María y el Espíritu Santo. Amén.`
    },
    {
      id: 34,
      title: 'Oración de protección y liberación a San Miguel',
      category: 'proteccion',
      excerpt: '¡Oh príncipe supremo de la milicia celestial!, te imploro de alma, mente y corazón...',
      content: `¡Oh príncipe supremo de la milicia celestial!, te imploro de alma, mente y corazón, que tu gloriosa y poderosa intercesión se cumpla en mí. Por el poder que Dios te ha dado, San Miguel Arcángel, destierra de mi ser todos los espíritus impuros. Que la protección misericordiosa de tus alas, me envuelvan día y noche. Que tu espada de luz celestial corte y expulse los sentimientos malignos. Que el amor de tu piadosísimo corazón me eleve espiritualmente y que en tus sagrados brazos de Padre y protector, yo ascienda en gloria y redención al reino de Dios, Emmanuel. ¡Oh Padre y protector durante las batallas! Guíame para que pueda cumplir el propósito, retira de mis entrañas las células del mal y así como una vez te dignaste guiar a Jesucristo hasta los pies de la cruz del amor, dígnate, Padre mío, a guiarme por el camino de la humildad y de la entrega. Sagrado arcángel Miguel, que todas tus huestes universales, las que alaban perpetuamente al Padre supremo, desciendan ahora hacia el reino de este mundo, el que fue creado por la voluntad de Adonai; úneme a tu reino de amor y protección, para que como tu hijo consagrado, yo cumpla con la promesa de preparar la venida gloriosa de Cristo. Cúbreme con tu luz, amado príncipe Miguel. Amén.`
    },
    {
      id: 35,
      title: 'Poderosa oración de protección a la Santa Cruz de Jesucristo',
      category: 'proteccion',
      excerpt: 'Dios Todopoderoso, que sufriste la muerte en madera sagrada por todos nuestros pecados...',
      content: `Dios Todopoderoso, que sufriste la muerte en madera sagrada por todos nuestros pecados, sé conmigo, santa cruz de Jesucristo, ten piedad de nosotros, santa cruz de Jesucristo, ten piedad de mí, santa cruz de Jesucristo, sé mi esperanza.
Santa cruz de Jesucristo, quítame todas las armas blancas, santa cruz de Jesucristo, derrama toda tu bondad sobre mí. Santa cruz de Jesucristo, aparta de mí todo mal. Santa cruz de Jesucristo, haz que siga el camino de la salvación.
Santa cruz de Jesucristo, líbrame de los accidentes corporales. Santa cruz de Jesucristo, te adoro por siempre. Santa cruz de Jesucristo, haz que el espíritu maligno e infalible se aleje de mí. Jesús me condujo a la vida eterna. Amén.`
    },
    {
      id: 36,
      title: 'Oración de protección con el Salmo 91',
      category: 'proteccion',
      excerpt: 'Tú que vives al amparo del Altísimo y resides a la sombra del Todopoderoso...',
      content: `Tú que vives al amparo del Altísimo y resides a la sombra del Todopoderoso, di al Señor: «Mi refugio y mi baluarte, mi Dios, en quien confío». El te librará de la red del cazador y de la peste perniciosa;  te cubrirá con sus plumas, y hallarás un refugio bajo sus alas. No temerás los terrores de la noche, ni la flecha que vuela de día, ni la peste que acecha en las tinieblas, ni la plaga que devasta a pleno sol. Aunque caigan mil a tu izquierda y diez mil a tu derecha, tú no serás alcanzado: su brazo es escudo y coraza. Con solo dirigir una mirada, verás el castigo de los malos, porque hiciste del Señor tu refugio y pusiste como defensa al Altísimo. No te alcanzará ningún mal, ninguna plaga se acercará a tu carpa, porque hiciste del Señor tu refugio y pusiste como defensa al Altísimo. Ellos te llevarán en sus manos para que no tropieces contra ninguna piedra; caminarás sobre leones y víboras, pisotearás cachorros de león y serpientes. «Él se entregó a mí, por eso, yo lo glorificaré; lo protegeré, porque conoce mi Nombre; me invocará, y yo le responderé. Estaré con él en el peligro, lo defenderé y lo glorificaré; le haré gozar de una larga vida y le haré ver mi salvación».`
    },
    {
      id: 37,
      title: 'Oración a San Benito para alejar los enemigos y las envidias',
      category: 'proteccion',
      excerpt: 'Oh glorioso San Benito, modelo sublime de todas las virtudes, vaso puro de la gracia de Dios...',
      content: `Oh glorioso San Benito, modelo sublime de todas las virtudes, vaso puro de la gracia de Dios.
Heme aquí, humildemente postrado ante ti. Imploro tu corazón lleno de amor para que intercedas por mí ante el trono divino de Dios.
A ti recurro en todos los peligros que a diario me rodean.
Protégeme contra mis enemigos, contra el maligno enemigo en todas sus formas e inspírame a imitarte en todas las cosas
Que tu bendición esté conmigo siempre, de modo que pueda huir de todo lo que no es agradable a Dios y evitar así las ocasiones de pecado.
Dulcemente te pido, que me consigas de Dios los favores y gracias de las cuales yo estoy tan necesitado, en las pruebas, en las miserias y en las aflicciones de la vida.
Tu corazón siempre estuvo tan lleno de amor, compasión y misericordia hacia los que estaban afligidos o con problemas de cualquier tipo.
Tú nunca has despedido sin consuelo y asistencia a cualquiera que haya recurrido a ti. Por lo tanto, invoco tu poderosa intercesión, con esperanza y confiado en que tú escucharás mis oraciones y me alcanzarás la gracia especial y favor que tan seriamente te imploro (pedir el favor a recibir), si es para la mayor gloria de Dios y el bien de mi alma.
Ayúdame, Oh gran San Benito, vivir y morir como un hijo fiel de Dios, que sea siempre sumiso a Su santa voluntad, para lograr la felicidad eterna del cielo. Amén.`
    },
    {
      id: 38,
      title: 'Oración a San Benito para alejar los malos espíritus',
      category: 'proteccion',
      excerpt: 'Santísimo confesor del Señor; Padre y jefe de los monjes, interceded por nuestra santidad...',
      content: `Santísimo confesor del Señor; Padre y jefe de los monjes, interceded por nuestra santidad, por nuestra salud del alma, cuerpo y mente.
Destierra de nuestra vida, de nuestra casa, las asechanzas del maligno espíritu. Líbranos de funestas herejías, de malas lenguas y hechicerías.
 Pídele al Señor, remedie nuestras necesidades espirituales, y corporales. Pídele también por el progreso de la santa Iglesia Católica; y porque mi alma no muera en pecado mortal, para que así confiado en Tu poderosa intercesión, pueda algún día en el cielo, cantar las eternas alabanzas. Amén.`
    },
    {
      id: 72,
      title: 'Oraciones contra el maleficio',
      category: 'proteccion',
      excerpt: 'Dios nuestro Señor, oh Soberano de los siglos, omnipotente y todopoderoso, tú que lo has hecho todo y que lo transformas todo con tu sola voluntad...',
      content: `Dios nuestro Señor, oh Soberano de los siglos, omnipotente y todopoderoso, tú que lo has hecho todo y que lo transformas todo con tu sola voluntad; tú que en Babilonia transformaste en rocío la llama del horno siete veces más ardiente y que protegiste y salvaste a tus tres santos jóvenes; tú que eres doctor y médico de nuestras almas; tú que eres la salvación de aquellos que se dirigen a ti, te pedimos y te invocamos, haz vana, expulsa y pon en fuga toda potencia diabólica, toda presencia y maquinación satánica, toda influencia maligna y todo maleficio o mal de ojo de personas maléficas y malvadas realizados sobre tu siervo... haz que, en cambio, de la envidia y el maleficio obtenga abundancia de bienes, fuerza, éxito y caridad; tú, Señor, que amas a los hombres, extiende tus manos poderosas y tus brazos altísimos y potentes y ven a socorrer y visita esta imagen tuya, mandando sobre ella el ángel de la paz, fuerte y protector del alma y el cuerpo, que mantendrá alejado y expulsará a cualquier fuerza malvada, todo envenenamiento y hechicería de personas corruptoras y envidiosas; de modo que debajo de ti tu suplicante protegido te cante con gratitud: “el Señor es mi salvador y no tendré temor de lo que pueda hacerme el hombre.” “No tendré temor del mal porque tú estás conmigo, tú eres mi Dios, mi fuerza, mi poderoso Señor, Señor de la paz, padre de los siglos futuros”. Sí Señor Dios nuestro, ten compasión de tu imagen y salva a tu siervo... de todo daño o amenaza procedente de maleficio, y protégelo poniéndolo por encima de todo mal; por la intercesión de la más que bendita, gloriosa Señora, la madre de Dios y siempre Virgen María, de los resplandecientes arcángeles y de todos sus santos. ¡Amén!`
    },
    {
      id: 5,
      title: 'Oración por las Vocaciones',
      category: 'vocaciones',
      excerpt: 'Señor, envía obreros a tu mies...',
      content: `Señor Jesús, Buen Pastor,
      
Tú dijiste: "La mies es mucha, pero los obreros son pocos. Rogad, pues, al Señor de la mies que envíe obreros a su mies."

Te pedimos que suscites en los corazones jóvenes el deseo de seguirte más de cerca en el sacerdocio, la vida religiosa y el diaconado permanente.

Concede a los jóvenes la gracia de escuchar tu llamada y la valentía de responder con generosidad.

Bendice a los seminaristas, novicios y novicias en su formación.
Fortalece a los sacerdotes, religiosos y religiosas en su vocación.

Ayuda a las familias cristianas a ser semilleros de vocaciones,
donde se viva la fe con alegría y se valore el servicio a la Iglesia.

María, Madre de los sacerdotes, forma el corazón de los llamados.
San José, protector de la Iglesia, intercede por las vocaciones.

Amén.`,
    },
    {
      id: 6,
      title: 'Oración por la Paz Interior',
      category: 'paz',
      excerpt: 'Señor, concédeme la paz que solo tú puedes dar...',
      content: `Señor Jesús, Príncipe de la Paz,
      
Mi corazón está inquieto y busca descanso en ti.
Concédeme la paz que solo tú puedes dar, esa paz que el mundo no puede ofrecer.

Calma mis ansiedades y temores.
Libera mi mente de pensamientos negativos y preocupaciones excesivas.

Ayúdame a confiar plenamente en tu providencia,
sabiendo que tú cuidas de mí con amor infinito.

Enséñame a vivir el presente sin angustiarme por el futuro,
poniendo en tus manos todos mis proyectos y esperanzas.

Que tu paz reine en mi corazón, en mi familia y en mi entorno.
Hazme instrumento de tu paz para los demás.

Espíritu Santo, consolador divino, llena mi alma de tu serenidad.
María, Reina de la Paz, intercede por mí.

      Amén.`,
    },
    {
      id: 67,
      title: 'Oración para sentir la presencia de Dios',
      category: 'paz',
      excerpt: 'Mi Señor y mi Dios, vengo ante ti en busca de paz y tranquilidad...',
      content: `Mi Señor y mi Dios, vengo ante ti en busca de paz y tranquilidad. Por todos lados hay caos, problemas, situaciones difíciles, y todo eso me agobia. ¡Necesito sentir tu paz!
Padre amado, calma mi corazón. Ayúdame a sentir tu presencia en este momento, a sentir tu paz fluyendo por todo mi ser. Quiero sentir tu Espíritu Santo en mí, el Consolador, sanando mi corazón y llenándome de esperanza. Sosiega todo mi ser, por favor.
Señor, ayúdame a descansar bien por las noches, que yo aprenda a entregarte mis cargas y a descansar en ti. Ayúdame a recordar que tú tienes poder para transformar las situaciones y que en tus manos está la mejor solución.
Gracias porque durante toda mi vida, tú has sido bueno y fiel. Descanso con la certeza de que lo seguirás siendo, porque tú no cambias. En ti estoy seguro por toda la eternidad. Descanso en tus brazos y recibo tu paz. En el nombre de Jesús, amén.`
    },
    {
      id: 68,
      title: 'Oración para tener un día lleno de paz',
      category: 'paz',
      excerpt: 'Señor amado, gracias por este nuevo día que ha comenzado...',
      content: `Señor amado, gracias por este nuevo día que ha comenzado. Gracias porque sé que estás conmigo y me ayudarás en todo lo que tengo que hacer.
Padre, ayúdame a buscar tu rostro y a estar consciente de tu presencia constante y compañía. Ayúdame a tomar decisiones que alegren tu corazón y a tener las actitudes que te agraden.
Guárdame de conflictos, dame gracia en el trato con todos y pon en mi camino personas de paz. Protégeme de personas con malas intenciones, líbrame del mal, por favor.
Padre, quiero glorificarte en todo en este día. Guíame en cada decisión, quiero hacer tu voluntad en medio de cualquier situación. Quiero ser portador de tu paz y tu amor. Dame tu corazón para que yo pueda actuar como tú lo deseas. Quiero recibir tu bendición, pero también quiero llevar tu bendición a los demás. En el nombre de Jesús, amén.`
    },
    {
      id: 69,
      title: 'Oración por la paz personal',
      category: 'paz',
      excerpt: 'Señor mi Dios, gracias por tu presencia y tu constante amor...',
      content: `Señor mi Dios, gracias por tu presencia y tu constante amor. Gracias porque, aunque yo dude o te falle, tú nunca me fallas y sé que puedo confiar en ti. Señor, hoy pongo en tus manos mi corazón cargado de ansiedad. Ayúdame en este momento a sentir tu paz de una forma especial, esa paz que sobrepasa todo entendimiento.
Quita de mi corazón y de mi mente todo lo que está causando miedos y este sentir de impotencia. Sana mi corazón. Trae a mi mente versículos de confianza en ti porque quiero descansar con la seguridad de que tú tienes el control de todo y, por lo tanto, todo irá bien.
Padre, gracias porque en tus brazos estoy a salvo. Ayúdame a mantenerme cerca de ti, a vivir en obediencia y a buscar tu rostro en medio de cualquier situación. Es en ti que tengo la verdadera paz. En el nombre de Jesús, amén.`
    },
    {
      id: 70,
      title: 'Oración por la paz en mi país',
      category: 'paz',
      excerpt: 'Padre Dios, gracias por este país donde vivo...',
      content: `Padre Dios, gracias por este país donde vivo. Gracias porque tú amas las naciones y anhelas que todos se reconcilien contigo. Te ruego que haya un despertar espiritual en este lugar, que esta nación se llene del conocimiento de tu gloria.
Abre los ojos de mis vecinos para que te busquen de corazón y reciban tu paz. Padre, tú conoces los problemas que hay en este país: desempleo, drogas, conflictos entre las familias, depresión, corrupción… ¡Son tantos los problemas! Este país te necesita urgentemente, Señor.
Padre, que unidos como nación, busquemos de ti. En ti está la paz que necesitamos, en ti está la verdadera prosperidad y la esperanza. Inquiétanos para que busquemos en ti la solución a nuestros problemas.
Y Señor, ayúdame a mí a colaborar con la paz. Ayúdame a llevar tu amor, comprensión y ánimo donde quiera que voy. Que yo sea sal y luz en medio de esta sociedad tan necesitada de ti. En el nombre de Jesús, amén.`
    },
    {
      id: 71,
      title: 'Oración por la paz del mundo',
      category: 'paz',
      excerpt: 'Padre amado, ¡anhelamos la paz! Son muchos los problemas y las guerras en este mundo...',
      content: `Padre amado, ¡anhelamos la paz! Son muchos los problemas y las guerras en este mundo. No quiero enfocarme en ellos, sino que deseo mantener mis ojos puestos en ti. Tú eres el Dios todopoderoso y en ti está puesta mi confianza.
En tus manos pongo este mundo lleno de conflictos y guerras. Padre, trae tu paz a las naciones. Guarda a tus hijos que viven en zonas donde hay guerra. Rodéalos con tu escudo protector y ayúdalos a ser agentes de tu paz.
Solo tú, Señor, puedes cambiar el corazón de los seres humanos. Te ruego que traigas revelación tuya al corazón de los líderes mundiales y que pongas en ellos el deseo de trabajar por la paz.
Obstaculiza las tretas del enemigo, que no triunfe en su deseo de matar y destruir. Muévete con poder en cada nación, Señor, y que los gobernantes de todas las naciones se rindan a ti y luchen por la paz. En el nombre de Jesús, amén.`
    },
    {
      id: 7,
      title: 'Oración al Arcángel San Miguel',
      category: 'arcangeles',
      excerpt: 'Glorioso príncipe de la corte celestial, San Miguel arcángel, defiéndenos...',
      content: `Glorioso príncipe de la corte celestial, San Miguel arcángel, defiéndenos en el conflicto que tenemos que sostener contra los principados y potestades, contra los gobernantes del mundo de esta oscuridad, contra los espíritus de maldad en los lugares altos, ven al rescate de los hombres que Dios ha creado a su imagen y semejanza, y a quienes ha redimido a un alto precio de la tiranía del demonio, San Miguel arcángel, eres tú a quien la santa iglesia venera como su guardián y protector; a quien el Señor ha encargado llevar al cielo a las almas redimidas, ora, por lo tanto, al Dios de la paz para someter al demonio bajo nuestros pies, para que ya no retenga a los hombres cautivos ni lesione a la Iglesia, glorioso príncipe celestial, presenta nuestras oraciones al altísimo, para que sin demora pueda derramar su misericordia sobre nosotros, agarra al dragón, a la serpiente antigua, que es el demonio y satanás, átalo y échalo al abismo sin fondo, para que ya no seduzca a las naciones. Por Jesucristo Nuestro Señor. Amén.`,
    },
    {
      id: 8,
      title: 'Oración al Arcángel San Gabriel',
      category: 'arcangeles',
      excerpt: 'Oh poderoso San Gabriel Arcángel, mensajero del Señor...',
      content: `Oh poderoso San Gabriel Arcángel, mensajero del Señor, de palabras claras y sueltas para anunciar el evangelio, por tu claridad de comunicación, al haber sido asignado por Dios entre todas sus huestes para ser el supremo comunicador de las Buenas Nuevas del Reino de Dios, por ser inteligente y de Divina Luz, hoy me dirijo a ti en ferviente oración, me declaro incapaz de gobernarme por mis propios medios, no soy nadie sin una guía divina, y es por esto San Gabriel que te pido ilumines todos mis caminos, que me brindes protección, guía siempre mis pasos, alúmbrame los caminos para no desviarme del correcto, no me dejes por favor a la deriva donde pueda ser atrapado por pensamientos negros y decisiones equivocadas, más bien líbrame oh Gabriel, de todo mal y peligro dándome claridad de mente y ayudándome a tomar decisiones sabias en mi vida para siempre salir airoso en todas las empresas a mi cargo, oh Gabriel, Arcángel de la sabiduría en tus anuncios confío. Amén.`,
    },
    {
      id: 9,
      title: 'Oración al Arcángel San Rafael',
      category: 'arcangeles',
      excerpt: 'Gloriosísimo príncipe celeste San Rafael, auxiliador eterno de los hombres...',
      content: `Gloriosísimo príncipe celeste San Rafael, auxiliador eterno de los hombres, envía tus poderosos rayos tutelares sobre nosotros, indefensos humanos, envuélvenos en tus alas, y refúgianos con tu amorosa y enérgica luz, Arcángel del Señor, prodigioso San Rafael, caudillo de los ejércitos del Todopoderoso, emisario de la Divinidad, amigo de tus devotos, compañero de los caminantes, socorro de los afligidos, médico de los enfermos, refugio de los perseguidos, azote de los demonios, tesoro riquísimo de los caudales de Dios, con tu sabiduría y poder libéranos de todo mal, tú eres arcángel santo, bondadoso cuidador nuestro, y uno de aquellos siete nobilísimos espíritus que rodean al trono del Altísimo, por ello, y confiados en el grande amor que has manifestado a los hombres, te suplicamos humildes nos cuides y protejas, aléjanos de los peligros del alma y del cuerpo, de los enemigos que nos acosan, y nos concedas salud ante la enfermedad, y nos des ayuda para salir victoriosos ante los dolores y padecimientos corporales. Amén.`,
    },
    {
      id: 39,
      title: 'Acto de Consagración',
      category: 'marianas',
      excerpt: '¡Oh Señora mía! ¡Oh Madre mía! Yo me ofrezco enteramente a ti...',
      content: `¡Oh Señora mía! ¡Oh Madre mía! Yo me ofrezco enteramente a ti y en prueba de mi filial afecto te consagro en este día (noche), mis ojos, mis oídos, mi lengua, mi corazón; en una palabra, todo mi ser. Ya que soy todo(a) tuyo(a) Oh Madre de bondad, guárdame y defiéndeme como hijo(a) y posesión tuya. Amén.`
    },
    {
      id: 40,
      title: 'Acto de Reparación al Inmaculado Corazón de María',
      category: 'marianas',
      excerpt: '¡Oh Inmaculado Corazón de María, traspasado de dolor por las injurias...',
      content: `¡Oh Inmaculado Corazón de María, traspasado de dolor por las injurias con que los pecadores ultrajan vuestro Santísimo nombre y vuestras excelsas prerrogativas! Aquí tenéis, postrado a vuestros pies, un indigno hijo vuestro que, agobiado por el peso de sus propias culpas, viene arrepentido y lloroso, y con ánimo de resarcir las injurias que, a modo de penetrantes flechas, dirigen contra Vos hombres insolentes y malvados. Deseo reparar, con este acto de amor y rendimiento que hago delante de vuestro amantísimo Corazón, todas las blasfemias que se lanzan contra vuestro augusto nombre, todos los agravios que se infieren a vuestras excelsas prerrogativas y todas las ingratitudes con que los hombres corresponden a vuestro maternal amor e inagotable misericordia.

Aceptad, joh Corazón Inmaculado!, esta pequeña demostración de mi filial cariño y justo reconocimiento, junto con el firme propósito que hago de seros fiel en adelante, de salir por vuestra honra cuando la vea ultrajada y de propagar vuestro culto y vuestras glorias. Concededme, joh Corazón amabilísimo!, que viva y crezca incesantemente en vuestro santo amor, hasta verlo consumado en la gloria. Amén.

Rezar tres Avemarías en honra del poder, sabiduría y misericordia del Inmaculado Corazón de María, menospreciado por los hombres. Terminar con las siguientes jaculatorias:

¡Oh Corazón Inmaculado de María, compadeceos de nosotros!
Refugio de pecadores, rogad por nosotros.
¡Oh dulce Corazón de María, sed la salvación mía!

Avemaría, padrenuestro y gloria por las intenciones del Papa.`
    },
    {
      id: 41,
      title: 'Acuérdate',
      category: 'marianas',
      excerpt: 'Acuérdate, ¡Oh piadosísima Virgen María!, que jamás se ha oído decir...',
      content: `Acuérdate, ¡Oh piadosísima Virgen María!, que jamás se ha oído decir que ninguno de los que ha acudido a tu protección, implorando tu asistencia y reclamando tu socorro, haya sido desamparado de ti. Animado por esta confianza, a ti acudo, Oh madre, Virgen de Vírgenes, y gimiendo bajo el peso de mis pecados me atrevo a comparecer ante tu presencia soberana. Oh Madre de Dios, no deseches mis súplicas, antes bien, escúchalas y acógelas benignamente. Amén.`
    },
    {
      id: 42,
      title: 'Angelus',
      category: 'marianas',
      excerpt: 'V. El Ángel del Señor anunció a María, R. Y concibió por obra del Espíritu Santo...',
      content: `V. El Ángel del Señor anunció a María,
R. Y concibió por obra del Espíritu Santo.
Se reza un Avemaría.
V. He aquí la esclava del Señor.
R. Hágase en mi según tu palabra.
Se reza un Avemaría.
V. Y el Verbo se hizo carne.
R. Y habitó entre nosotros.
Se reza un Avemaría.
V. Ruega por nosotros, Santa Madre de Dios,
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.

Oración
Te rogamos, Señor, que derrames tu gracia en nuestras almas, para que, los que por el anuncio del Ángel, hemos conocido la encarnación de tu Hijo Jesucristo, por su Pasión y Cruz, seamos llevados a la gloria de su Resurrección. Por Jesucristo Nuestro Señor.
R. Amén.`
    },
    {
      id: 43,
      title: 'Alégrate María',
      category: 'marianas',
      excerpt: 'Alégrate María, Inmaculada y Santa, amada de Dios...',
      content: `Alégrate María,
Inmaculada y Santa,
amada de Dios,
nueva Eva elegida,
cooperadora de la reconciliación.
Madre de Jesús y nuestra,
incansable auxilio de los pecadores,
maternal intercesora,
acuérdate de este hijo tuyo.
Amén.`
    },
    {
      id: 44,
      title: 'Augusta Reina de los Cielos (Combate Espiritual)',
      category: 'marianas',
      excerpt: '¡Augusta Reina de los Cielos, Soberana Señora de los Ángeles! Tú que, desde los comienzos...',
      content: `Versión Corta

¡Augusta Reina de los Cielos, Soberana Señora de los Ángeles! Tú que, desde los comienzos, recibiste de Dios el Poder y la Misión de aplastar la cabeza de Satanás, Te suplicamos humildemente nos envíes Legiones de Ángeles para que, bajo Tus Órdenes y Poder, combatan a los demonios, donde quiera repriman su audacia, y los persigan hasta precipitarlos a los abismos.

¿Quién cómo Dios?, ¡Oh buena y tierna Madre, siempre serás nuestro amor y nuestra esperanza!. ¡Oh Divina Madre!, envía a los Santos Ángeles para defendernos, y rechazar lejos al demonio, nuestro mortal enemigo. Santos Ángeles y Arcángeles defendednos y guardadnos.
Amén.

Versión Completa

¡Augusta Reina de los Cielos, Soberana Señora de los Ángeles! Tú que, desde los comienzos, recibiste de Dios el Poder y la Misión de aplastar la cabeza de Satanás, Te suplicamos humildemente:

Envía Tus Legiones de Ángeles para que, bajo Tus Órdenes y Poder, combatan a los demonios, donde quiera repriman su audacia, y los persigan hasta precipitarlos a los abismos.

¡Oh!, Excelsa Madre de Dios, envía también a San Miguel Arcángel, el invencible Jefe de los Ejércitos del Señor en la lucha contra los emisarios del infierno entre los hombres, destruyendo los planes de los impíos y humillando a todos aquellos que quieren el mal. Obtén para ellos la gracia del arrepentimiento y la conversión, a fin de que puedan dar honra al Dios Vivo, Uno y Trino y a Ti.

¡Oh!, Nuestra Poderosa Protectora, por medio de los resplandecientes espíritus celestiales, protege por toda la Tierra las Iglesias, los Lugares Sagrados y especialmente el Santísimo Sacramento del Altar. Impide toda profanación y toda destrucción. Los Ángeles están a cada instante a la espera de Tus órdenes y arden en deseos de ejecutarlas.

¡Oh!, Madre celestial, protege además nuestros hogares y a nosotros de las insidias del enemigo infernal. Haz que los Santos Ángeles habiten siempre en ellos y nos traigan las bendiciones del Altísimo. ¿QUIÉN COMO DIOS? ¿Quién como Tú, María? Eres la Reina de los Ángeles y la Vencedora sobre satanás. Eres buena y tierna Madre, Tú serás siempre nuestro Amor y nuestra Esperanza.

¡Oh!, Madre de Dios, envíanos los Santos Ángeles, para defendernos y para rechazar lejos al demonio, nuestro mortal enemigo. Santos Ángeles y Arcángeles defiéndannos y guárdennos. Amén.`
    },
    {
      id: 45,
      title: 'Ave Maria',
      category: 'marianas',
      excerpt: 'Dios te salve, María, llena eres de gracia, el Señor está contigo...',
      content: `Dios te salve, María, llena eres de gracia, el Señor está contigo. Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús.
Santa María, Madre de Dios, ruega por nosotros pecadores ahora y en la hora de nuestra muerte. Amén.`
    },
    {
      id: 46,
      title: 'Ave Maris Stella',
      category: 'marianas',
      excerpt: 'Salve, Estrella del mar, Madre, que diste a luz a Dios...',
      content: `Salve, Estrella del mar, Madre, que diste a luz a Dios, quedando perpetuamente Virgen, feliz puerta del cielo.

Pues recibiste aquel Ave de labios de Gabriel, ciméntanos en la paz, trocando el nombre de Eva.
Suelta las prisiones a los reos, da lumbre a los ciegos, ahuyenta nuestros males, recábanos todos los bienes.
Muestra que eres Madre, reciba por tu mediación nuestras plegarias el que nacido por nosotros, se dignó ser tuyo.
Virgen singular, sobre todos suave, haz que libres de culpas, seamos suaves y castos.
Danos una vida pura, prepara una senda segura, para que, viendo a Jesús, eternamente nos gocemos.
Gloria sea a Dios Padre, a Cristo altísimo y al Espíritu Santo: a los tres un solo honor. Amén.`
    },
    {
      id: 47,
      title: 'Bendita Sea tu Pureza',
      category: 'marianas',
      excerpt: 'Bendita sea tu pureza y eternamente lo sea...',
      content: `Bendita sea tu pureza y eternamente lo sea, pues todo un Dios se recrea, en tan graciosa belleza. A Ti celestial princesa, Virgen Sagrada María, yo te ofrezco en este día (noche), alma, vida y corazón. Mírame con compasión, no me dejes, Madre mía. Amén.`
    },
    {
      id: 48,
      title: 'Bajo tu Amparo "Sub Tuum Praesidium"',
      category: 'marianas',
      excerpt: 'Bajo tu amparo nos acogemos, Santa Madre de Dios...',
      content: `Bajo tu amparo nos acogemos, Santa Madre de Dios, no desprecies nuestras súplicas en las necesidades, antes bien líbranos de todo peligro, ¡Oh Virgen gloriosa y bendita!. Amén.`
    },
    {
      id: 49,
      title: 'Consagración al Inmaculado Corazón de María',
      category: 'marianas',
      excerpt: '¡Oh Reina del Santísimo Rosario, auxilio de los cristianos, refugio del género humano...',
      content: `¡Oh Reina del Santísimo Rosario, auxilio de los cristianos, refugio del género humano, vencedora de todas las batallas de Dios! Ante vuestro Trono nos postramos suplicantes, seguros de impetrar misericordia y de alcanzar gracia y oportuno auxilio y defensa en las presentes calamidades, no por nuestros méritos, de los que no presumimos, sino únicamente por la inmensa bondad de vuestro maternal Corazón.

En esta hora trágica de la historia humana, a Vos, a vuestro Inmaculado Corazón, nos entregamos y nos consagramos, no sólo en unión con la Santa Iglesia, cuerpo místico de vuestro Hijo Jesús, que sufre y sangra en tantas partes y de tantos modos atribulada, sino también con todo el Mundo dilacerado por atroces discordias, abrasado en un incendio de odio, víctima de sus propias iniquidades.

Que os conmuevan tantas ruinas materiales y morales, tantos dolores, tantas angustias de padres y madres, de esposos, de hermanos, de niños inocentes; tantas vidas cortadas en flor, tantos cuerpos despedazados en la horrenda carnicería, tantas almas torturadas y agonizantes, tantas en peligro de perderse eternamente.

Vos, oh Madre de misericordia, impetradnos de Dios la paz; y, ante todo, las gracias que pueden convertir en un momento los humanos corazones, las gracias que preparan, concilian y aseguran la paz. Reina de la paz, rogad por nosotros y dad al mundo en guerra la paz por que suspiran los pueblos, la paz en la verdad, en la justicia, en la caridad de Cristo. Dadle la paz de las armas y la paz de las almas, para que en la tranquilidad del orden se dilate el reino de Dios.

Conceded vuestra protección a los infieles y a cuantos yacen aún en las sombras de la muerte; concédeles la paz y haced que brille para ellos el sol de la verdad y puedan repetir con nosotros ante el único Salvador del mundo: Gloria a Dios en las alturas y paz en la tierra a los hombres de buena voluntad.

Dad la paz a los pueblos separados por el error o la discordia, especialmente a aquellos que os profesan singular devoción y en los cuales no había casa donde no se hallase honrada vuestra venerada imagen (hoy quizá oculta y retirada para mejores tiempos), y haced que retornen al único redil de Cristo bajo el único verdadero Pastor.

Obtened paz y libertad completa para la Iglesia Santa de Dios; contened el diluvio inundante del neopaganismo, fomentad en los fieles el amor a la pureza, la práctica de la vida cristiana y del celo apostólico, a fin de que aumente en méritos y en número el pueblo de los que sirven a Dios.

Finalmente, así como fueron consagrados al Corazón de vuestro Hijo Jesús la Iglesia y todo el género humano, para que, puestas en El todas las esperanzas, fuese para ellos señal y prenda de victoria y de salvación; de igual manera, oh Madre nuestra y Reina del Mundo, también nos consagramos para siempre a Vos, a vuestro Inmaculado Corazón, para que vuestro amor y patrocinio aceleren el triunfo del Reino de Dios, y todas las gentes, pacificadas entre sí y con Dios, os proclamen bienaventurada y entonen con Vos, de un extremo a Otro de la tierra, el eterno Magníficat de gloria, de amor, de reconocimiento al Corazón de Jesús, en sólo el cual pueden hallar la Verdad, la Vida y la Paz.`
    },
    {
      id: 50,
      title: 'Consagración a Madre de la Eucaristía',
      category: 'marianas',
      excerpt: 'Dios mío, Yo creo que eres Uno en naturaleza, Igual en divinidad...',
      content: `Dios mío,
Yo creo que eres Uno en naturaleza, Igual en divinidad.
Tres Personas, presentes en la Eucaristía.
Ante Tí, Dios Uno y Trino, me postro en adoración
y Te reconozco como mi Creador, Redentor, Santificador.
Yo, pequeña y débil criatura,
elevada por Tu Gracia a la dignidad de ser hijo(a) Tuyo(a),
deseo vivir las enseñanzas del Evangelio,
ser un miembro dócil de la Iglesia,
aceptar los mensajes
que nos has enviado a través de la Madre de la Eucaristía.
Padre mío,
necesito Tu amor
para dar significado, dirección y propósito a mi vida,
nada puedo hacer sin Tí
al volverme hijo(a) Tuyo(a).
Jesús, dulce Maestro,
deseo conocerte y amarte más y más,
alimenta, sostiene y fortalece
mi vida con la Eucaristía,
pan de Dios, el pan de vida, pan vivo bajado del Cielo.
Espíritu Santo,
dame Tu luz
para que pueda comprender, aunque sea por un instante,
todo el infinito amor de la Santísima Trinidad
que se me da en la Eucaristía.
Oh Dios, Uno y Trino,
me consagro a Tí por medio de María,
Madre de la Eucaristía.
Me comprometo, tanto como sea posible,
a asistir diariamente a la Santa Misa
y a recibirte en mi corazón.
Creo que estás en verdad presente
en los Sagrarios de las iglesias,
donde deseo ir a alabarte, a adorarte
y hacerte compañía.
Madre de la Eucaristía,
Tú quien nos has dado a tu hijo Jesús,
con dolor y tanto amor,
mientras pendía de la Cruz,
ayúdame a vivir en la gracia para siempre estar listo
para recibir a Jesús en mi corazón.
Amén.`
    },
    {
      id: 51,
      title: 'Dulce Madre',
      category: 'marianas',
      excerpt: 'Dulce Madre, no te alejes, tu vista de mí no apartes...',
      content: `Dulce Madre, no te alejes, tu vista de mí no apartes, ven conmigo a todas
partes y solo nunca me dejes.
Ya que me proteges tanto como verdadera Madre, haz que me bendigan el
Padre, el Hijo y el Espíritu Santo.
Amén.`
    },
    {
      id: 52,
      title: 'Dulzura de los Ángeles',
      category: 'marianas',
      excerpt: 'Dulzura de los ángeles, alegría de los afligidos...',
      content: `Dulzura de los ángeles, alegría de los afligidos,
abogada de los cristianos, Virgen madre del Señor, protégeme y sálvame de
los sufrimientos eternos.

María, purísimo incensario de oro, que ha contenido a la Trinidad excelsa; en ti
se ha complacido el Padre, ha habitado el Hijo, y el Espíritu Santo, que
cubriéndote con su sombra, Virgen, te ha hecho madre de Dios.
Nosotros nos alegramos en ti, Theotókos; tú eres nuestra defensa ante Dios.
Extiende tu mano invencible y aplasta a nuestros enemigos. Manda a tus
siervos el socorro del cielo.`
    },
    {
      id: 53,
      title: 'Las 3 Aves Marias (Novena)',
      category: 'marianas',
      excerpt: 'Oh Madre de Dios y Madre de todas las gracias: por las muchísimas que te concedió...',
      content: `Oh Madre de Dios y Madre de todas las gracias: por las muchísimas que te
concedió la Santísima Trinidad, y particularmente por tu poder, sabiduría y
ardiente caridad, te suplico nos concedas a nosotros participar de estas
gracias, como participan los hijos de los bienes de sus padres, y
especialmente nos concedas la gracia que te pedimos en esta novena
honrando en ti al Padre, al Hijo y al Espíritu Santo. Amén. (Hacer aquí la
petición).

Oh Virgen poderosísima: así como Dios Padre, en su munificencia
omnipotente, levantó tu alma sobre un trono de gloria sin igual, hasta el punto
de que, después de él, eres la más poderosa en el cielo y en la tierra, así
también te suplico que me asistas en la hora de la muerte, para fortificarme y
rechazar de mí toda potestad enemiga.

Oh Virgen sapientísima: así como el Hijo de Dios, conforme a los tesoros de su
sabiduría, te adornó y llenó maravillosamente de ciencia y entendimiento, de
tal modo que gozas del conocimiento de la Santísima Trinidad más que todos
los santos juntos, y como sol brillante, con la claridad de que te ha
embellecido, adornas todo el cielo, así también te ruego me asistas en la hora
de la muerte, para llenar mi alma de las luces de la fe y de la verdadera
sabiduría, para que no la oscurezcan las tinieblas de la ignorancia y del
error.

Oh Virgen amantísima: así como el Espíritu Santo te llenó por completo de las
dulzuras de su amor y te hizo tan amable y tan amante que, después de Dios,
eres la más dulce y la más misericordiosa, así también te ruego me asistas en
la hora de la muerte, llenando mi alma de tal suavidad de amor divino, que
toda pena y amargura de muerte se cambie para mí en delicias.

Repetir por 8 días más.`
    },
    {
      id: 54,
      title: 'Madre de la Eucaristía',
      category: 'marianas',
      excerpt: 'Ave María, dulce Madre de la Eucaristía...',
      content: `Ave María, dulce Madre de la Eucaristía.
Con dolor y mucho amor, nos has dado
a tu Hijo Jesús mientras pendía de la Cruz.
Nosotros, débiles criaturas, nos aferramos a Ti
para ser hijos dignos de este
gran AMOR y DOLOR.
Ayúdanos a ser humildes y sencillos,
ayúdanos a amar a todos los hombres,
ayúdanos a vivir en la gracia
estando siempre listos para recibir
a Jesús en nuestro corazón.
Oh María, Madre de la Eucaristía,
nosotros, por cuenta propia, no podremos comprender
este gran misterio de amor.
Que obtengamos la luz del Espíritu Santo,
para que así podamos comprender
aunque sea por un solo instante,
todo el infinito amor de tu Jesús
que se entrega a Sí mismo por nosotros. Amén.`
    },
    {
      id: 55,
      title: 'Magnificat',
      category: 'marianas',
      excerpt: 'Proclama mi alma la grandeza del Señor, se alegra mi espíritu en Dios...',
      content: `Proclama mi alma la grandeza del Señor, se alegra mi espíritu en Dios, mi
salvador; porque ha mirado la humillación de su esclava.
Desde ahora me felicitarán todas las generaciones, porque el Poderoso ha
hecho obras grandes por mí:su nombre es santo, y su misericordia llega a sus
fieles de generación en generación.
El hace proezas con su brazo: dispersa a los soberbios de corazón, derriba del
trono a los poderosos y enaltece a los humildes, a los hambrientos los colma
de bienes y a los ricos los despide vacíos.
Auxilia a Israel, su siervo, acordándose de la misericordia -como lo había
prometido a nuestros padres- en favor de Abrahán y su descendencia por
siempre. Gloria al Padre....`
    },
    {
      id: 56,
      title: 'Memorare',
      category: 'marianas',
      excerpt: 'No me desampare tu amparo, no me falte tu piedad...',
      content: `No me desampare tu amparo,
no me falte tu piedad,
no me olvide tu memoria.
Si tú, Señora, me dejas, ¿quién me sostendrá?
Si tú me olvidas, ¿quién se acordará de mí?
Si tú, que eres Estrella de la mar
y guía de los errados, no me alumbras, ¿dónde iré a parar?
No me dejes tentar del enemigo,
y si me tentare, no me dejes caer,
y si cayere, ayúdame a levantar.
¿Quién te llamó, Señora, que no le oyeses?
¿Quién te pidió, que no le otorgases?`
    },
    {
      id: 57,
      title: 'Oración de la Mañana',
      category: 'marianas',
      excerpt: 'Oh, Jesús, a través del Inmaculado Corazón de María, te ofrezco mis oraciones...',
      content: `Oh, Jesús, a través del Inmaculado Corazón de María, te ofrezco mis
oraciones, trabajo, alegrías, sufrimientos de este día, en unión al Santo
Sacrificio de la Misa para el mundo. Te los ofrezco por los méritos de tu
Sagrado Corazón: la salvación de las almas, enmienda de los pecados, la
reunión de todos los cristianos; te los ofrezco por nuestros obispos y por los
Apóstoles de la oración y de manera particular por aquellos que el Santo Padre
escogió durante este mes.
Amén.`
    },
    {
      id: 58,
      title: 'Oración a la Virgen Niña',
      category: 'marianas',
      excerpt: 'Pequeña y dulce Maria, princesa mia, sin pecado concebida...',
      content: `Pequeña y dulce Maria, princesa mia, sin pecado concebida, estrella de mis
días y desde niña la mas perfecta profecia. Ilumina esta vida mia, a veces
enceguecida, sin ansias ni dicha y totalmente empobrecida. Hazme, pequeña
Maria, luz en estos dias y resplandor en la oscuridad del alma mia. Hazme
niño, pequeñito y dulcisimo para que el Buen Dios escriba lo que ha querido de
esta vida, para su gloria y como verdad que ilumina. Amén.`
    },
    {
      id: 59,
      title: '¡Oh María!',
      category: 'marianas',
      excerpt: '¡Oh María! Transforma mi corazón como el tuyo...',
      content: `¡Oh María!
Transforma mi corazón como el tuyo;
Colócale alrededor una corona de pureza adornada con virtud;
Toma mi corazón, querida Madre consagrado como tuyo propio;
Preséntaselo a Dios Padre como una ofrenda de mí para ti.
Ayúdame, Oh María, en hacer tu corazón más conocido cada día.
Amén.`
    },
    {
      id: 60,
      title: 'Para ser Buen Cristiano',
      category: 'marianas',
      excerpt: 'Santísima Señora, Madre de Dios; tú eres la más pura de alma y cuerpo...',
      content: `Santísima Señora, Madre de Dios; tú eres la más pura de alma y cuerpo, que
vives más allá de toda pureza, de toda castidad, de toda virginidad; la única
morada de toda la gracia del Espíritu Santo; que sobrepasas
incomparablemente a las potencias espirituales en pureza, en santidad de
alma y cuerpo; mírame culpable, impuro, manchado en el alma y en el cuerpo
por los vicios de mi vida impura y llena de pecado; purifica mi espíritu de sus
pasiones; santifica y encamina mis pensamientos errantes y ciegos; regula y
dirige mis sentidos; líbrame de la detestable e infame tiranía de las
inclinaciones y pasiones impuras; anula en mí el imperio de mi pecado; da la
sabiduría y el discernimiento a mi espíritu en tinieblas, miserable, para que me
corrija de mis faltas y de mis caídas, y así, libre de las tinieblas del pecado, sea
hallado digno de glorificarte, de cantarte libremente, verdadera madre de la
verdadera Luz, Cristo Dios nuestro. Pues sólo con Él y por Él eres bendita y
glorificada por toda criatura, invisible y visible, ahora y siempre, por los siglos
de los siglos. Amén.`
    },
    {
      id: 61,
      title: 'Regina Coeli',
      category: 'marianas',
      excerpt: 'V. Reina del cielo, alégrate; aleluya. R. Porque el que mereciste llevar en tu seno...',
      content: `V. Reina del cielo, alégrate; aleluya. R. Porque el que mereciste llevar en tu
seno; aleluya; V. Resucitó según dijo; aleluya. R. Ruega por nosotros a Dios;
aleluya; V. Gózate y alégrate, Virgen María; aleluya. R. Porque resucitó en
verdad el Señor; aleluya.
Oración
¡Oh, Dios!, que te dignaste alegrar al mundo por la Resurrección de tu Hijo, Nuestro Señor Jesucristo: concédenos, te
rogamos, que por la mediación de la Virgen María, su Madre, alcancemos los
gozos de la vida eterna. Por el mismo Jesucristo, Nuestro Señor.
R. Amén.`
    },
    {
      id: 62,
      title: 'Salve',
      category: 'marianas',
      excerpt: 'Dios te salve, Reina y Madre, Madre de misericordia, vida, dulzura y esperanza nuestra...',
      content: `Dios te salve, Reina y Madre, Madre de misericordia, vida, dulzura y esperanza
nuestra; Dios te salve. A Ti llamamos los desterrados hijos de Eva; a Ti
suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora,
abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después
de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh
clemente, oh piadosa, oh dulce siempre Virgen María!
Guía: Ruega por nosotros, Santa Madre de Dios.
Todos: Para que seamos dignos de alcanzar las promesas de Nuestro Señor
Jesucristo. Amén.`
    },
    {
      id: 63,
      title: 'SS Juan Pablo II - 15 Minutos en Compañía del Inmaculado Corazón de María',
      category: 'marianas',
      excerpt: '¡Oh Corazón Inmaculado de María, generoso y magnánimo como de Reina...',
      content: `Oración previa:
¡Oh Corazón Inmaculado de María, generoso y magnánimo como de Reina,
amoroso y compasivo como de Madre!: oíd los suspiros del último de vuestros
hijos que confiado acude a depositar en Vos los sentimientos y aspiraciones
de su alma.

Gracias, Corazón bondadosísimo. Vos sois manantial de las divinas
bendiciones; de Vos he recibido favores sin número. ¡Y cuántas veces, sin
darme cuenta de ello!
Cuando Jesús me redimía en el Calvario, allí estabais Vos, juntando vuestra
compasión a sus dolores, y vuestras lágrimas al torrente de su sangre
redentora.
Tengo mis delicias junto al sagrario en la Santa Eucaristía; mas ese pan de
ángeles es fruto regalado de vuestra sangre y vuestro amor.
¡Oh Corazón dulcísimo de mi Madre!, Vos sois el canal señalado por Dios
mismo para distribuir todas sus gracias a los hombres. De Vos recibí aquella
inspiración..., aquella fuerza para vencer..., aquel consuelo en mi aflicción.
De vos me vino aquella luz que me mostró el abismo a que corría..., aquella
gracia que me movió a dolor de mis pecados... Aquel peligro conjurado...,
aquella salud recobrada.., me vinieron de Vos. ¡No tienen número vuestros
favores!. ¡Gracias, Corazón dulcísimo, gracias!

II. Y Vos, Corazón compasivo, ¿qué habéis recibido de mi? ¡Oh!, lo sabéis
Vos, y yo también lo sé, para confusión mía.
A vuestro amor y ternura he respondido con fría ingratitud. Esa espada que os
atraviesa de parte a parte, joh Corazón de María!, os la he clavado yo, hijo
ingrato...; y no una, sino muchas veces.
Aquellas miradas..., aquellos sentimientos..., aquellas intenciones
inconfesables..., aquella soberbia oculta..., aquella sensualidad..., aquel
escándalo.. Que os hubiese ofendido otro menos favorecido de vuestro amor,
sería tolerable; pero que os haya disgustado yo, después de pruebas tan
elocuentes y repetidas de vuestro amor... ¡Oh Corazón Santísimo de María!, yo
me confundo y arrepiento; yo os pagaré amor con amor..., yo arrancaré la
espada cruel que os atormenta.
III. ¡Reparación, reparación! Si, os la quiero ofrecer siempre. ¡Os amo tanto! ¡Me
duelen tan de veras la ingratitud y las continuas ofensas con que los hombres
corresponden a vuestro amor!
¡Oh Corazón dulcisímo de María!, la espada cruel que os atraviesa nos habla de
la pasión y muerte de Jesús y de los pecados de los hombres que os colman
de amargura; pero desde hoy yo he de consolaros. Bendecid mis resoluciones.
Yo amaré siempre a Jesús, para que no se pierda en mi el fruto de su sangre...;
yo os prometo morir antes que pecar, porque no quiero renovar vuestros
dolores...; yo pensaré en Vos, por los que os olvidan...; os alabaré por los que os
blasfeman; yo os amaré con todas las fuerzas de mi alma...
Por vuestro amor, joh Corazón Inmaculado!, me apartaré de aquella ocasión...,
mortificaré mis sentidos...; haré que mis ojos, mis oídos, mi lengua, mis
manos..., imiten vuestros ejemplos de modestia, de caridad, de servicialidad...
¡Oh Corazón de mi Madre!, para reparar las injurias que los hombres os hacen,
me impondré entre día algunos pequeños sacrificios..., os ofreceré diariamente
el rezo del Santo Rosario..., os consagraré los primeros sábados de mes,
comulgando fervorosamente en honor vuestro...

IV. Y tengo que pediros nuevos favores, joh Corazón dulcísimo! Os lo
expongo con plenísima confianza de obtenerlos, si convienen a mi eterna
salvación. ¿No dijo vuestro Jesús: «Pídeme por el Corazón de mi Madre, y
alcanzarás cuanto deseas»? Pues concededme que no vuelva a caer en el
pecado...; que os ame en todos los instantes de mi vida...; que al acabarse
este destierro, me llevéis a gozar de vuestras ternuras en el cielo...
Corazón dulcísimo de María, Vos me habéis de salvar...; yo recojo vuestra
regaladísima promesa de asistir en la hora de la muerte con las gracias
necesarias para salvarse a cuantos hayan comulgado cinco primeros sábados
de mes seguidos. Yo os daré ese consuelo, y confío en vuestra bondad y
ternura.
Y ahora, joh Corazón Inmaculado!, Vos conocéis mi debilidad...; dadme fuerza
para vencer aquella dificultad...; para cortar con tal ocasión... Alcanzadme esa
virtud que Jesús me pide hace tanto tiempo... Y el asunto que llevo entre
manos.., y la preocupación que conocéis..., arregladlo todo para mayor gloria
de Dios.
Os pido por mis padres, hermanos, amigos (por aquel especialmente que anda
alejado de Dios)..., por la conversión de todos los pecadores, por la
perseverancia de los justos, por el alivio de mis queridos difuntos..., por los
sacerdotes, para que sean santos, por los misioneros...
Corazón bondadosísimo, dadme Vos mismo las gracias que sabéis serme
necesarias...

V. Despedida. ¡Qué dulce es, María, gozar de tu amor! ¡Qué hermoso y qué
tierno tu gran Corazón! ¡Y qué bien se está a vuestro lado! Pero tengo que
irme: me llaman mis obligaciones. ¡Corazón amantísimo de mi Madre! Me
voy, pero quiero dejar mi corazón aquí a vuestro lado, encerrado en vuestro
seno amoroso... A lo largo del día volverán a Vos mi recuerdo y los afectos
de mi alma... Cuanto antes pueda volveré con algún pequeño obsequio
practicado en vuestro honor, con algún pequeño sacrificio amorosamente
aceptado en reparación de las injurias que se os hacen.
¡Oh Corazón de mi tierna Madre, adiós! Haced que sienta durante el día vuestra
protección y vuestro amor. Ahora, recibid todo entero el del último de vuestros
hijos... ¡Adiós!`
    },
    {
      id: 64,
      title: 'Sta. María Faustina Kowalska - Oración del Diario',
      category: 'marianas',
      excerpt: 'Oh María, Virgen Inmaculada, Puro Cristal para mi corazón...',
      content: `Oh María, Virgen Inmaculada,
Puro Cristal para mi corazón.
Tú eres mi fuerza, oh ancla poderosa,
Tú eres el escudo y la defensa para el corazón débil.
Oh María, Tú eres pura e incomparable,
Virgen y Madre a la vez,
Tú eres bella como el sol, sin mancha alguna,
Nada se puede comparar con la imagen de Tu alma.
Tu belleza encantó el ojo del tres veces Santo,
Y bajó del cielo, abandonando el trono de la sede eterna,
Y tomó el cuerpo y la sangre de Tu Corazón,
Durante nueve meses escondiéndose en el Corazón
de la Virgen.
Oh Madre, Virgen, nadie comprenderá,
Que el inmenso Dios se hace hombre,
Solo por amor y por su insondable, misericordia,
A través de Ti, oh Madre, viviremos con Él eternamente.
Oh María, Virgen, Azucena más bella,
Tu Corazón fue el primer tabernáculo para Jesús
en la tierra,
Y eso porque Tu humildad fue la más profunda,
Y por eso fuiste elevada por encima de los coros de los
Ángeles y de los santos.
Oh María, dulce Madre mía,
Te entrego el alma, el cuerpo y mi pobre corazón,
Se [tú] la custodia de mi vida,
Y especialmente en la hora de la muerte,
en el último combate.`
    },
    {
      id: 65,
      title: 'Soy Todo Tuyo, María',
      category: 'marianas',
      excerpt: 'Virgen María, Madre mía. Me consagro a ti y confío en tus manos toda mi existencia...',
      content: `Virgen María, Madre mía.
Me consagro a ti y confío en tus manos toda mi existencia.
Acepta mi pasado con todo lo que fue.
Acepta mi presente con todo lo que es.
Acepta mi futuro con todo lo que será.
Con esta total consagración, te confío cuanto tengo y cuanto soy,
todo lo que he recibido de Dios.
Te confío mi inteligencia,
Mi voluntad, mi corazón.
Deposito en tus manos mi libertad;
mis ansias y mis temores;
mis esperanzas y mis deseos;
mis tristezas y mis alegrías.
Custodia mi vida y todos mis actos para que le sea más fiel al Señor,
y con tu ayuda alcance la salvación.
Te confío ¡Oh María!
Mi cuerpo y mis sentidos
para que se conserven puro
y me ayuden en el ejercicio de las virtudes.
Te confío mi alma para que Tú la preserves del mal.
Hazme partícipe de una santidad, igual a la tuya.
Hazme conforme a Cristo, ideal de mi vida.
Te confío mi entusiasmo
y el ardor de mi juventud,
Para que Tú me ayudes
a no envejecer en la fe.
Te confío mi capacidad y deseo de amar,
Enséñame y ayúdame a amar como Tú has amado
y como Jesús quiere que se ame.
Te confío mi incertidumbres y angustias,
para que en tu corazón yo encuentre
seguridad, sostén y luz,
en cada instante de mi vida.
Con esta consagración
me comprometo a imitar tu vida.
Acepto las renuncias y sacrificios
que esta elección comporta,
Y te prometo, con la gracia de Dios
y con tu ayuda,
ser fiel al compromiso asumido.
Oh María, soberana de mi vida
y de mi conducta
Dispón de mí y de todo lo que me pertenece,
para que camine siempre junto al Señor
bajo tu mirada de Madre.
¡Oh María!
Soy todo tuyo
y todo lo que poseo te pertenece
Ahora y siempre.
Amén.`
    },
    {
      id: 66,
      title: 'Visitando al Inmaculado Corazón de María',
      category: 'marianas',
      excerpt: '¡Oh Corazón de María, Madre de Dios y Madre nuestra; Corazón amabilísimo...',
      content: `¡Oh Corazón de María, Madre de Dios y Madre nuestra; Corazón amabilísimo,
objeto de las complacencias de la adorable Trinidad y digno de toda la
veneración y ternura de los Angeles y de los hombres; Corazón el más
semejante al de Jesús, del cual sois la más perfecta imagen; Corazón lleno de
bondad y que tanto os compadecéis de nuestras miserias, dignaos derretir el
hielo de nuestros corazones, y haced que vuelvan a conformarse con el
Corazón del Divino Salvador. Infundid en ellas el amor de vuestras virtudes;
inflamadlos con aquel dichoso fuego en que Vos estáis ardiendo sin cesar.
Encerrad en vuestro seno la santa Iglesia; custodiadla, sed siempre su dulce
asilo y su inexpugnable torre contra toda incursión de sus enemigos. Sed
nuestro camino para dirigirnos a Jesús, y el conducto por el cual recibamos
todas las gracias necesarias para nuestra salvación. Sed nuestro socorro en
las necesidades, nuestra fortaleza en las tentaciones, nuestro refugio en las
persecuciones, nuestra ayuda en todos los peligros; pero especialmente en los
últimos combates de nuestra vida, a la hora de la muerte, cuando todo el
infierno se desencadenará contra nosotros para arrebatar nuestras almas, en
aquel formidable momento, en aquel punto terrible del cual depende nuestra
eternidad. ¡Ah! Virgen piadosísima, hacednos sentir entonces la dulzura de
vuestro maternal Corazón, y la fuerza de vuestro poder para con el de Jesús,
abriéndonos en la misma fuente de la misericordia un refugio seguro, en
donde podamos reunirnos para bendecirle con Vos en el paraíso por todos los
siglos. Amén.

Jaculatoria. Sea por siempre y en todas partes conocido, alabado, bendecido,
amado, servido y glorificado el divinísimo Corazón de Jesús y el Inmaculado
Corazón de María. Amén.`
    },
  ];

  const filteredPrayers = prayers.filter(prayer => {
    const matchesCategory = selectedCategory === 'todas' || prayer.category === selectedCategory;
    const matchesSearch = prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openPrayerModal = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
  };

  const closePrayerModal = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setSelectedPrayer(null);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
      };
    }
  }, [selectedPrayer]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Oraciones Católicas
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-sans">
            Encuentra oraciones para cada momento de tu vida. Eleva tu corazón a Dios 
            con estas plegarias tradicionales y contemporáneas.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar oraciones..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {prayerCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-marian-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-marian-blue-100 dark:hover:bg-gray-600'
                }`}
              >
                <cat.icon className={`h-4 w-4 ${selectedCategory === cat.id ? 'text-white' : cat.color}`} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prayers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrayers.map((prayer) => {
            const categoryInfo = prayerCategories.find(cat => cat.id === prayer.category);
            return (
              <div
                key={prayer.id}
                onClick={() => openPrayerModal(prayer)}
                className="prayer-card-container bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center space-x-3 mb-4">
                    {categoryInfo && (
                      <div className={`p-2 rounded-full bg-opacity-20 ${categoryInfo.color.replace('text-', 'bg-')}`}>
                        <categoryInfo.icon className={`h-6 w-6 ${categoryInfo.color}`} />
                      </div>
                    )}
                    <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white">
                      {prayer.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-sans text-base">
                    {prayer.excerpt}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 mt-auto text-right">
                  <span className="text-marian-blue-600 dark:text-marian-blue-400 font-semibold font-sans text-sm">
                    Leer oración &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPrayers.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron oraciones
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Intenta con otros términos de búsqueda o selecciona una categoría diferente.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-serif font-bold mb-4">
            ¿Necesitas una oración especial?
          </h2>
          <p className="text-marian-blue-100 dark:text-gray-300 mb-6">
            Si no encuentras la oración que buscas, puedes solicitar una petición especial 
            a nuestra comunidad de oración.
          </p>
          <a
            href="/peticiones-oracion"
            className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <Heart className="mr-2 h-5 w-5" />
            Solicitar Oración
          </a>
        </div>
      </div>

      {/* Prayer Modal */}
      <Transition appear show={selectedPrayer !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closePrayerModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-xl transition-all">
                  {selectedPrayer && (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-serif font-bold leading-6 text-marian-blue-900 dark:text-white mb-4"
                      >
                        {selectedPrayer.title}
                      </Dialog.Title>
                      <div className="mt-4">
                        <audio ref={audioRef} src={`/audio/prayers/${selectedPrayer.id}.mp3`} />
                        <button
                          onClick={togglePlayPause}
                          className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-medium text-white bg-marian-blue-600 rounded-md hover:bg-marian-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                        >
                          {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                          {isPlaying ? 'Pausar Audio' : 'Escuchar Oración'}
                        </button>
                      </div>
                      <div className="mt-4 prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line font-sans text-lg leading-relaxed">
                          {selectedPrayer.content}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="mt-8">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-marian-blue-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-marian-blue-900 dark:text-white hover:bg-marian-blue-200 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-marian-blue-500 focus-visible:ring-offset-2"
                      onClick={closePrayerModal}
                    >
                      Cerrar
                    </button>
                  </div>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={closePrayerModal}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Prayers;
