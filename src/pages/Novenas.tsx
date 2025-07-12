import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Calendar, Heart, BookOpen, ArrowLeft, ArrowRight, Share2, Download } from 'lucide-react';
import AdBanner from '../components/Ads/AdBanner';

const Novenas: React.FC = () => {
  const { novenaId } = useParams();
  const [currentDay, setCurrentDay] = useState(1);

  const novenas = [
    {
      id: 'sagrado-corazon',
      title: 'Novena al Sagrado Corazón de Jesús',
      description: 'Nueve días de oración y devoción al Corazón de Jesús, fuente de amor y misericordia.',
      image: 'https://images.pexels.com/photos/8815007/pexels-photo-8815007.jpeg?auto=compress&cs=tinysrgb&w=800',
      patron: 'Sagrado Corazón de Jesús',
      feast: '19 de junio',
      color: 'text-red-600 dark:text-red-400',
    },
    {
      id: 'inmaculada-concepcion',
      title: 'Novena a la Inmaculada Concepción',
      description: 'Preparación espiritual para la fiesta de la Inmaculada Concepción de María.',
      image: 'https://images.pexels.com/photos/8815015/pexels-photo-8815015.jpeg?auto=compress&cs=tinysrgb&w=800',
      patron: 'Inmaculada Concepción',
      feast: '8 de diciembre',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'san-jose',
      title: 'Novena a San José',
      description: 'Invocando la intercesión del padre adoptivo de Jesús y esposo de María.',
      image: 'https://images.pexels.com/photos/8815003/pexels-photo-8815003.jpeg?auto=compress&cs=tinysrgb&w=800',
      patron: 'San José',
      feast: '19 de marzo',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      id: 'divina-misericordia',
      title: 'Novena a la Divina Misericordia',
      description: 'Oración de confianza en la misericordia infinita de Dios.',
      image: 'https://images.pexels.com/photos/8815009/pexels-photo-8815009.jpeg?auto=compress&cs=tinysrgb&w=800',
      patron: 'Divina Misericordia',
      feast: 'Domingo después de Pascua',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'santa-teresita',
      title: 'Novena a Santa Teresita del Niño Jesús',
      description: 'Siguiendo el camino de confianza y abandono de la pequeña Teresa.',
      image: 'https://images.pexels.com/photos/8815011/pexels-photo-8815011.jpeg?auto=compress&cs=tinysrgb&w=800',
      patron: 'Santa Teresita',
      feast: '1 de octubre',
      color: 'text-pink-600 dark:text-pink-400',
    },
  ];

  const novenaContent = {
    'sagrado-corazon': {
      days: [
        {
          day: 1,
          title: 'Primer Día - El Amor de Jesús',
          reading: 'Juan 15:9-17',
          meditation: 'Contemplamos el amor infinito del Corazón de Jesús, que nos ama con amor eterno. Este amor no tiene límites ni condiciones, es puro y desinteresado.',
          prayer: 'Sagrado Corazón de Jesús, en quien están todos los tesoros de la sabiduría y del conocimiento, ten piedad de nosotros. Concédenos conocer tu amor y vivir según tu voluntad. Amén.',
          intention: 'Por el aumento de la fe en nuestros corazones',
        },
        {
          day: 2,
          title: 'Segundo Día - La Humildad de Jesús',
          reading: 'Mateo 11:28-30',
          meditation: 'El Corazón de Jesús es manso y humilde. Nos invita a aprender de Él, a cargar con su yugo que es suave y su carga que es ligera.',
          prayer: 'Corazón manso y humilde de Jesús, haz nuestro corazón semejante al tuyo. Enséñanos la verdadera humildad y la mansedumbre cristiana. Amén.',
          intention: 'Por la conversión de los pecadores',
        },
        {
          day: 3,
          title: 'Tercer Día - La Paciencia de Jesús',
          reading: 'Lucas 23:32-43',
          meditation: 'Contemplamos la paciencia infinita del Corazón de Jesús, que perdona incluso desde la cruz y promete el paraíso al buen ladrón.',
          prayer: 'Corazón paciente de Jesús, que soportas nuestras infidelidades con amor, concédenos la gracia de la paciencia en las pruebas. Amén.',
          intention: 'Por la paz en las familias',
        },
        {
          day: 4,
          title: 'Cuarto Día - La Obediencia de Jesús',
          reading: 'Filipenses 2:5-11',
          meditation: 'Jesús fue obediente hasta la muerte, y muerte de cruz. Su Corazón nos enseña la obediencia perfecta a la voluntad del Padre.',
          prayer: 'Corazón obediente de Jesús, enséñanos a hacer siempre la voluntad del Padre, como Tú la hiciste perfectamente. Amén.',
          intention: 'Por las vocaciones sacerdotales y religiosas',
        },
        {
          day: 5,
          title: 'Quinto Día - La Pobreza de Jesús',
          reading: '2 Corintios 8:9',
          meditation: 'El Corazón de Jesús eligió la pobreza para enriquecernos. Nos enseña el desprendimiento de los bienes materiales.',
          prayer: 'Corazón pobre de Jesús, que siendo rico te hiciste pobre por nosotros, libra nuestros corazones del apego a las riquezas. Amén.',
          intention: 'Por los pobres y necesitados',
        },
        {
          day: 6,
          title: 'Sexto Día - La Castidad de Jesús',
          reading: 'Mateo 5:8',
          meditation: 'El Corazón purísimo de Jesús nos llama a la pureza de corazón, para poder ver a Dios y vivir en su presencia.',
          prayer: 'Corazón purísimo de Jesús, purifica nuestros corazones y concédenos la gracia de la castidad según nuestro estado de vida. Amén.',
          intention: 'Por la pureza de costumbres',
        },
        {
          day: 7,
          title: 'Séptimo Día - El Celo de Jesús',
          reading: 'Juan 2:13-17',
          meditation: 'El celo por la casa del Padre consume el Corazón de Jesús. Nos enseña a tener celo por la gloria de Dios y la salvación de las almas.',
          prayer: 'Corazón celoso de Jesús, inflama nuestros corazones con el celo por tu gloria y por la salvación de nuestros hermanos. Amén.',
          intention: 'Por la evangelización del mundo',
        },
        {
          day: 8,
          title: 'Octavo Día - La Generosidad de Jesús',
          reading: 'Juan 10:10-18',
          meditation: 'El Corazón de Jesús se entrega completamente por nosotros. Nos enseña la generosidad sin límites en el servicio a Dios y al prójimo.',
          prayer: 'Corazón generoso de Jesús, que das tu vida por nosotros, enséñanos a ser generosos en el servicio y en el amor. Amén.',
          intention: 'Por los enfermos y moribundos',
        },
        {
          day: 9,
          title: 'Noveno Día - El Amor Misericordioso de Jesús',
          reading: 'Lucas 15:11-32',
          meditation: 'El Corazón de Jesús es fuente inagotable de misericordia. Como el padre del hijo pródigo, siempre nos espera con los brazos abiertos.',
          prayer: 'Corazón misericordioso de Jesús, fuente de toda consolación, ten piedad de nosotros y de todo el mundo. Concédenos las gracias que te pedimos. Amén.',
          intention: 'Por nuestras intenciones particulares',
        },
      ],
    },
  };

  const selectedNovena = novenas.find(n => n.id === novenaId);
  const selectedContent = novenaContent[novenaId as keyof typeof novenaContent];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedNovena ? selectedNovena.title : 'Novenas - Luz de Fe',
        text: selectedNovena ? selectedNovena.description : 'Descubre nuestras novenas católicas',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (selectedNovena && selectedContent) {
    const currentDayContent = selectedContent.days[currentDay - 1];

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className={`h-8 w-8 ${selectedNovena.color}`} />
              <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
                {selectedNovena.title}
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {selectedNovena.description}
            </p>
            <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Fiesta: {selectedNovena.feast}</span>
              </div>
            </div>
          </div>

          <AdBanner position="inline" size="medium" />

          {/* Day Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white">
                Día {currentDay} de 9
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                  disabled={currentDay === 1}
                  className="p-2 bg-marian-blue-100 dark:bg-gray-700 text-marian-blue-600 dark:text-sacred-gold-400 rounded-lg hover:bg-marian-blue-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentDay(Math.min(9, currentDay + 1))}
                  disabled={currentDay === 9}
                  className="p-2 bg-marian-blue-100 dark:bg-gray-700 text-marian-blue-600 dark:text-sacred-gold-400 rounded-lg hover:bg-marian-blue-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-marian-blue-500 to-sacred-gold-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentDay / 9) * 100}%` }}
              />
            </div>

            {/* Day Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-3">
                  {currentDayContent.title}
                </h3>
                <div className="bg-marian-blue-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-4 w-4 text-marian-blue-600 dark:text-sacred-gold-400" />
                    <span className="font-medium text-marian-blue-900 dark:text-white">
                      Lectura: {currentDayContent.reading}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-3">
                  Meditación
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentDayContent.meditation}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-3">
                  Oración
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-sacred-gold-400 dark:border-sacred-gold-300">
                  <p className="text-gray-800 dark:text-gray-200 italic leading-relaxed">
                    {currentDayContent.prayer}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-3">
                  Intención del Día
                </h4>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {currentDayContent.intention}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <AdBanner position="inline" size="small" />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-6 py-3 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartir Novena
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-medium rounded-lg transition-colors duration-200">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </button>
          </div>

          {/* All Days Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-6">
              Todos los Días
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedContent.days.map((day, index) => (
                <button
                  key={day.day}
                  onClick={() => setCurrentDay(day.day)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    currentDay === day.day
                      ? 'border-marian-blue-500 bg-marian-blue-50 dark:bg-gray-700 dark:border-sacred-gold-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-marian-blue-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold text-marian-blue-900 dark:text-white mb-1">
                    Día {day.day}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {day.title.split(' - ')[1]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Novenas List View
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Novenas Católicas
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Nueve días de oración, reflexión y encuentro con Dios. Descubre nuestras novenas 
            tradicionales para momentos especiales de tu vida espiritual.
          </p>
        </div>

        <AdBanner position="inline" size="medium" />

        {/* Novenas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {novenas.map((novena, index) => (
            <div
              key={novena.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <img
                src={novena.image}
                alt={novena.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className={`${novena.color} mb-3`}>
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-3">
                  {novena.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {novena.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>Patrono: {novena.patron}</span>
                  <span>Fiesta: {novena.feast}</span>
                </div>
                <a
                  href={`/novenas/${novena.id}`}
                  className="inline-flex items-center w-full justify-center px-4 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Comenzar Novena
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div className="bg-marian-blue-50 dark:bg-gray-800 rounded-xl shadow-lg border border-marian-blue-100 dark:border-gray-700 p-8">
          <h2 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white mb-6 text-center">
            ¿Qué es una Novena?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-marian-blue-900 dark:text-white mb-4">
                Tradición Católica
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Una novena es una práctica devocional católica que consiste en nueve días consecutivos 
                de oración, dirigida a Dios, la Virgen María, o algún santo en particular.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Esta tradición se basa en los nueve días que los apóstoles y María pasaron en oración 
                en el Cenáculo, esperando la venida del Espíritu Santo en Pentecostés.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-marian-blue-900 dark:text-white mb-4">
                Cómo Rezar una Novena
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-sacred-gold-600 dark:text-sacred-gold-400">•</span>
                  <span>Elige un momento tranquilo del día para la oración</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sacred-gold-600 dark:text-sacred-gold-400">•</span>
                  <span>Lee la meditación del día con atención</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sacred-gold-600 dark:text-sacred-gold-400">•</span>
                  <span>Reza la oración propuesta con fe y devoción</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sacred-gold-600 dark:text-sacred-gold-400">•</span>
                  <span>Mantén la intención en tu corazón durante todo el día</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sacred-gold-600 dark:text-sacred-gold-400">•</span>
                  <span>Persevera los nueve días completos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Novenas;