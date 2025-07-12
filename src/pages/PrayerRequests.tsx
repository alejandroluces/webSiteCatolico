import React, { useState } from 'react';
import { Heart, Send, Clock, Users, MessageCircle, Plus, Filter, Search } from 'lucide-react';
import AdBanner from '../components/Ads/AdBanner';

const PrayerRequests: React.FC = () => {
  const [newRequest, setNewRequest] = useState({
    name: '',
    email: '',
    intention: '',
    category: 'general',
    isAnonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas', count: 24 },
    { id: 'general', name: 'General', count: 8 },
    { id: 'salud', name: 'Salud', count: 6 },
    { id: 'familia', name: 'Familia', count: 4 },
    { id: 'trabajo', name: 'Trabajo', count: 3 },
    { id: 'paz', name: 'Paz', count: 3 },
  ];

  const prayerRequests = [
    {
      id: 1,
      name: 'María G.',
      intention: 'Por la salud de mi madre que está enferma. Que Dios le conceda fortaleza y una pronta recuperación.',
      category: 'salud',
      date: '2 horas',
      prayers: 15,
      isUrgent: true,
    },
    {
      id: 2,
      name: 'Anónimo',
      intention: 'Por la unidad de mi familia. Que el Señor nos ayude a perdonarnos y a vivir en armonía.',
      category: 'familia',
      date: '4 horas',
      prayers: 23,
      isUrgent: false,
    },
    {
      id: 3,
      name: 'Carlos M.',
      intention: 'Por encontrar trabajo. Que Dios me guíe hacia una oportunidad laboral que me permita sostener a mi familia.',
      category: 'trabajo',
      date: '6 horas',
      prayers: 18,
      isUrgent: false,
    },
    {
      id: 4,
      name: 'Ana L.',
      intention: 'Por la paz en el mundo y especialmente por los países en conflicto. Que cese la violencia.',
      category: 'paz',
      date: '8 horas',
      prayers: 31,
      isUrgent: false,
    },
    {
      id: 5,
      name: 'Familia Rodríguez',
      intention: 'Por nuestro hijo que está pasando por una crisis de fe. Que el Señor toque su corazón.',
      category: 'familia',
      date: '12 horas',
      prayers: 27,
      isUrgent: false,
    },
    {
      id: 6,
      name: 'Anónimo',
      intention: 'Por mi conversión personal y por alejarme de los vicios que me alejan de Dios.',
      category: 'general',
      date: '1 día',
      prayers: 42,
      isUrgent: false,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewRequest(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setNewRequest(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setNewRequest({
        name: '',
        email: '',
        intention: '',
        category: 'general',
        isAnonymous: false,
      });
      setShowForm(false);
    }, 2000);
  };

  const filteredRequests = prayerRequests.filter(request => {
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesSearch = request.intention.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePray = (requestId: number) => {
    // Placeholder for prayer functionality
    alert('¡Gracias por orar! Tu oración ha sido registrada.');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 dark:bg-green-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-marian-blue-900 dark:text-white mb-4">
            ¡Petición Enviada!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Tu petición de oración ha sido compartida con nuestra comunidad. 
            Muchos hermanos en la fe orarán por tu intención.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Ver Peticiones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Peticiones de Oración
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comparte tus intenciones con nuestra comunidad de fe. Juntos elevamos nuestras 
            oraciones al Señor, sabiendo que Él escucha cada súplica del corazón.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-marian-blue-600 dark:text-sacred-gold-400 mb-2">
              {prayerRequests.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Peticiones Activas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {prayerRequests.reduce((sum, req) => sum + req.prayers, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Oraciones Ofrecidas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              500+
            </div>
            <div className="text-gray-600 dark:text-gray-300">Oraciones Respondidas</div>
          </div>
        </div>

        {/* Add Prayer Request Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-8 py-4 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            {showForm ? 'Cancelar' : 'Compartir Petición'}
          </button>
        </div>

        {/* Prayer Request Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-6">
              Compartir Petición de Oración
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newRequest.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                    placeholder="Tu nombre o iniciales"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newRequest.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="salud">Salud</option>
                    <option value="familia">Familia</option>
                    <option value="trabajo">Trabajo</option>
                    <option value="paz">Paz</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="intention" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Intención de Oración *
                </label>
                <textarea
                  id="intention"
                  name="intention"
                  value={newRequest.intention}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Comparte tu intención de oración con respeto y fe..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={newRequest.isAnonymous}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-marian-blue-600 focus:ring-marian-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Publicar como anónimo
                </label>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tu petición será compartida con nuestra comunidad de fe para que oren por tu intención. 
                  Respetamos tu privacidad y moderamos todas las peticiones antes de publicarlas.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-marian-blue-600 hover:bg-marian-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Compartir Petición
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <AdBanner position="inline" size="medium" />

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar peticiones..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 ${
                request.isUrgent ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-marian-blue-900 dark:text-white">
                      {request.name}
                    </h3>
                    {request.isUrgent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Urgente
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-marian-blue-100 text-marian-blue-800 dark:bg-gray-600 dark:text-gray-300 capitalize">
                      {categories.find(cat => cat.id === request.category)?.name}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {request.intention}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Hace {request.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{request.prayers} personas orando</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePray(request.id)}
                  className="inline-flex items-center px-4 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Orar por esta intención
                </button>
                <button className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-marian-blue-600 dark:hover:text-sacred-gold-400 transition-colors duration-200">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar mensaje de apoyo
                </button>
              </div>
            </div>
          ))}
        </div>

        <AdBanner position="inline" size="small" />

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron peticiones
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Intenta con otros términos de búsqueda o selecciona una categoría diferente.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-serif font-bold mb-4">
            "Orad unos por otros para que seáis curados"
          </h2>
          <p className="text-marian-blue-100 dark:text-gray-300 mb-6 italic">
            — Santiago 5:16
          </p>
          <p className="text-marian-blue-100 dark:text-gray-300 mb-6">
            La oración comunitaria tiene un poder especial. Cuando nos unimos en oración, 
            el Señor escucha nuestras súplicas con amor paternal.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            Compartir tu Petición
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrayerRequests;