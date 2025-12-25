import React, { useState } from 'react';
import { Palette, Search, Filter, Heart, Eye, Download, Share2, Calendar, User } from 'lucide-react';

const SacredArt: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas las Obras', count: 48 },
    { id: 'pinturas', name: 'Pinturas', count: 18 },
    { id: 'esculturas', name: 'Esculturas', count: 12 },
    { id: 'iconos', name: 'Iconos', count: 8 },
    { id: 'vitrales', name: 'Vitrales', count: 6 },
    { id: 'manuscritos', name: 'Manuscritos', count: 4 },
  ];

  const periods = [
    { id: 'all', name: 'Todas las Épocas' },
    { id: 'paleocristiano', name: 'Arte Paleocristiano' },
    { id: 'bizantino', name: 'Arte Bizantino' },
    { id: 'romanico', name: 'Arte Románico' },
    { id: 'gotico', name: 'Arte Gótico' },
    { id: 'renacimiento', name: 'Renacimiento' },
    { id: 'barroco', name: 'Barroco' },
    { id: 'moderno', name: 'Arte Moderno' },
  ];

  const artworks = [
    {
      id: 1,
      title: 'La Última Cena',
      artist: 'Leonardo da Vinci',
      period: 'renacimiento',
      category: 'pinturas',
      year: '1495-1498',
      location: 'Milán, Italia',
      description: 'Obra maestra del Renacimiento que representa el momento en que Jesús anuncia que uno de sus discípulos lo traicionará.',
      image: 'https://images.pexels.com/photos/356966/pexels-photo-356966.jpeg?auto=compress&cs=tinysrgb&w=800',
      significance: 'Una de las pinturas más famosas del mundo, revolucionaria por su técnica de perspectiva y composición.',
      views: 15420,
      likes: 892,
    },
    {
      id: 2,
      title: 'La Piedad',
      artist: 'Miguel Ángel',
      period: 'renacimiento',
      category: 'esculturas',
      year: '1498-1499',
      location: 'Basílica de San Pedro, Vaticano',
      description: 'Escultura en mármol que representa a la Virgen María sosteniendo el cuerpo de Cristo después de la crucifixión.',
      image: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800',
      significance: 'Única obra firmada por Miguel Ángel, considerada una de las esculturas más perfectas jamás creadas.',
      views: 12350,
      likes: 756,
    },
    {
      id: 3,
      title: 'Cristo Pantocrátor',
      artist: 'Anónimo',
      period: 'bizantino',
      category: 'iconos',
      year: 'Siglo VI',
      location: 'Monasterio de Santa Catalina, Sinaí',
      description: 'Icono encáustico que muestra a Cristo como gobernante del universo, una de las imágenes más antiguas de Cristo.',
      image: 'https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg?auto=compress&cs=tinysrgb&w=800',
      significance: 'Uno de los iconos más antiguos y mejor conservados, sobrevivió a la iconoclastia bizantina.',
      views: 8920,
      likes: 445,
    },
    {
      id: 4,
      title: 'La Anunciación',
      artist: 'Fra Angelico',
      period: 'renacimiento',
      category: 'pinturas',
      year: '1440-1445',
      location: 'Convento de San Marcos, Florencia',
      description: 'Fresco que representa el momento en que el Ángel Gabriel anuncia a María que será la madre de Jesús.',
      image: 'https://images.pexels.com/photos/3845458/pexels-photo-3845458.jpeg?auto=compress&cs=tinysrgb&w=800',
      significance: 'Ejemplo perfecto del arte religioso del Renacimiento temprano, con una técnica y espiritualidad excepcionales.',
      views: 7650,
      likes: 523,
    },
    {
      id: 5,
      title: 'Vidriera de la Sainte-Chapelle',
      artist: 'Maestros vidrieros del siglo XIII',
      period: 'gotico',
      category: 'vitrales',
      year: '1241-1248',
      location: 'París, Francia',
      description: 'Conjunto de vitrales que narran la historia bíblica desde el Génesis hasta la resurrección de Cristo.',
      image: 'https://images.pexels.com/photos/161154/stained-glass-church-window-colorful-161154.jpeg?auto=compress&cs=tinysrgb&w=800',
      significance: 'Considerado uno de los conjuntos de vitrales más hermosos del arte gótico mundial.',
      views: 6890,
      likes: 412,
    },
    {
      id: 6,
      title: 'El Libro de Kells',
      artist: 'Monjes irlandeses',
      period: 'paleocristiano',
      category: 'manuscritos',
      year: 'Siglo IX',
      location: 'Trinity College, Dublín',
      description: 'Manuscrito iluminado que contiene los cuatro Evangelios en latín, decorado con intrincados diseños celtas.',
      image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
      significance: 'Obra maestra del arte celta cristiano, famoso por sus ilustraciones detalladas y coloridas.',
      views: 5420,
      likes: 298,
    },
  ];

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || artwork.category === selectedCategory;
    const matchesPeriod = selectedPeriod === 'all' || artwork.period === selectedPeriod;
    return matchesSearch && matchesCategory && matchesPeriod;
  });

  const handleShare = (artwork: typeof artworks[0]) => {
    if (navigator.share) {
      navigator.share({
        title: `${artwork.title} - ${artwork.artist}`,
        text: artwork.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleLike = (artworkId: number) => {
    // Placeholder for like functionality
    console.log(`Liked artwork ${artworkId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Palette className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Arte Sacro
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre la belleza del arte cristiano a través de los siglos. Desde iconos bizantinos 
            hasta obras maestras del Renacimiento, explora cómo la fe ha inspirado las creaciones más sublimes.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar obras de arte, artistas..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Artwork */}
        {filteredArtworks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-6">
              Obra Destacada
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={filteredArtworks[0].image}
                    alt={filteredArtworks[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-marian-blue-100 text-marian-blue-800 dark:bg-gray-600 dark:text-gray-300">
                      {categories.find(cat => cat.id === filteredArtworks[0].category)?.name}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sacred-gold-100 text-sacred-gold-800 dark:bg-gray-600 dark:text-gray-300">
                      {periods.find(period => period.id === filteredArtworks[0].period)?.name}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-bold text-marian-blue-900 dark:text-white mb-2">
                    {filteredArtworks[0].title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{filteredArtworks[0].artist}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{filteredArtworks[0].year}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {filteredArtworks[0].description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{filteredArtworks[0].views.toLocaleString()} vistas</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{filteredArtworks[0].likes} me gusta</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLike(filteredArtworks[0].id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleShare(filteredArtworks[0])}
                        className="p-2 text-marian-blue-600 dark:text-sacred-gold-400 hover:bg-marian-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredArtworks.slice(1).map((artwork, index) => (
            <div
              key={artwork.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-marian-blue-800">
                    {categories.find(cat => cat.id === artwork.category)?.name}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-1">
                  <button
                    onClick={() => handleLike(artwork.id)}
                    className="p-2 bg-white/90 text-red-500 rounded-full hover:bg-white transition-colors duration-200"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleShare(artwork)}
                    className="p-2 bg-white/90 text-marian-blue-600 rounded-full hover:bg-white transition-colors duration-200"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-2">
                  {artwork.title}
                </h3>
                
                <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{artwork.artist}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{artwork.year}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {artwork.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{artwork.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{artwork.likes}</span>
                    </div>
                  </div>
                  <span className="text-sacred-gold-600 dark:text-sacred-gold-400 font-medium">
                    {artwork.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron obras
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Intenta con otros términos de búsqueda o ajusta los filtros.
            </p>
          </div>
        )}

        {/* Educational Section */}
        <div className="mt-16 bg-marian-blue-50 dark:bg-gray-800 rounded-xl shadow-lg border border-marian-blue-100 dark:border-gray-700 p-8">
          <h2 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white mb-6 text-center">
            El Arte Sacro a Través de los Siglos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Arte Paleocristiano
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Los primeros cristianos desarrollaron un arte simbólico en las catacumbas, 
                  usando símbolos como el pez, el ancla y el Buen Pastor para expresar su fe.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Arte Bizantino
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Los iconos bizantinos representan una ventana al cielo, con técnicas específicas 
                  que buscan mostrar la divinidad más que la realidad física.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Renacimiento
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  El Renacimiento combinó la perfección técnica con la espiritualidad, 
                  creando obras maestras que siguen inspirando la fe y el arte.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-serif font-bold mb-4">
            ¿Te Inspira el Arte Sacro?
          </h2>
          <p className="text-marian-blue-100 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            El arte sacro nos acerca a Dios a través de la belleza. Comparte estas obras 
            con otros y ayuda a difundir la riqueza del patrimonio artístico cristiano.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-colors duration-200">
              <Download className="mr-2 h-5 w-5" />
              Descargar Catálogo
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-marian-blue-900 text-white font-semibold rounded-lg transition-all duration-300">
              <Share2 className="mr-2 h-5 w-5" />
              Compartir Colección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SacredArt;
