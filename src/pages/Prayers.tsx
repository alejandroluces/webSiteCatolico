import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Search, BookOpen, Users, Briefcase, Shield, Home, Cross } from 'lucide-react';
import AdBanner from '../components/Ads/AdBanner';

const Prayers: React.FC = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'todas');

  const prayerCategories = [
    { id: 'todas', name: 'Todas las Oraciones', icon: BookOpen, color: 'text-marian-blue-600 dark:text-marian-blue-400' },
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
  ];

  const filteredPrayers = prayers.filter(prayer => {
    const matchesCategory = selectedCategory === 'todas' || prayer.category === selectedCategory;
    const matchesSearch = prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [expandedPrayer, setExpandedPrayer] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="space-y-6">
          {filteredPrayers.map((prayer) => (
            <div
              key={prayer.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-2">
                      {prayer.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {prayerCategories.find(cat => cat.id === prayer.category) && (
                        <>
                          <div className={prayerCategories.find(cat => cat.id === prayer.category)!.color}>
                            {React.createElement(prayerCategories.find(cat => cat.id === prayer.category)!.icon, { className: 'h-4 w-4' })}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {prayerCategories.find(cat => cat.id === prayer.category)!.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {prayer.excerpt}
                </p>

                {expandedPrayer === prayer.id && (
                  <div className="bg-marian-blue-50 dark:bg-gray-700 rounded-lg p-6 mb-4">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                        {prayer.content}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedPrayer(expandedPrayer === prayer.id ? null : prayer.id)}
                  className="inline-flex items-center px-4 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  {expandedPrayer === prayer.id ? 'Ocultar Oración' : 'Ver Oración Completa'}
                </button>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default Prayers;