import React, { useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Search, BookOpen, Users, Briefcase, Shield, Home, Cross, X } from 'lucide-react';
import AdBanner from '../components/Ads/AdBanner';
import { Dialog, Transition } from '@headlessui/react';

interface Prayer {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
}

const Prayers: React.FC = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'todas');
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);

  const prayerCategories = [
    { id: 'todas', name: 'Todas las Oraciones', icon: BookOpen, color: 'text-marian-blue-600 dark:text-marian-blue-400' },
    { id: 'arcangeles', name: 'Arcángeles', icon: Shield, color: 'text-yellow-600 dark:text-yellow-400' },
    { id: 'familia', name: 'Familia', icon: Home, color: 'text-red-600 dark:text-red-400' },
    { id: 'salud', name: 'Salud', icon: Heart, color: 'text-green-600 dark:text-green-400' },
    { id: 'trabajo', name: 'Trabajo', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'proteccion', name: 'Protección', icon: Shield, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'vocaciones', name: 'Vocaciones', icon: Users, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'paz', name: 'Paz Interior', icon: Cross, color: 'text-sacred-gold-600 dark:text-sacred-gold-400' },
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
      title: 'Oración a San José. Protector de las familias',
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
    setSelectedPrayer(null);
  };

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
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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

        <AdBanner position="inline" size="medium" />

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
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {prayer.excerpt}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 mt-auto">
                  <span className="text-marian-blue-600 dark:text-marian-blue-400 font-semibold">
                    Leer oración
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <AdBanner position="inline" size="small" />

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
                      <div className="mt-4 prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
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
