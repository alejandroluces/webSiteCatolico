import React, { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Eye, Clock, CheckCircle } from 'lucide-react';

const ContentManager: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'gospel' | 'saint' | 'reading'>('gospel');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newContent, setNewContent] = useState({
    date: '',
    type: 'gospel' as 'gospel' | 'saint' | 'reading',
    title: '',
    content: '',
    reference: '',
    reflection: '',
    prayer: '',
    author: '',
    liturgical_season: '',
    liturgical_color: '',
    is_active: true
  });

  const handleCreateContent = async () => {
    setIsLoading(true);
    
    // Simulación de creación
    setTimeout(() => {
      setIsLoading(false);
      setShowCreateForm(false);
      alert('Contenido creado exitosamente');
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setNewContent({
      date: '',
      type: 'gospel',
      title: '',
      content: '',
      reference: '',
      reflection: '',
      prayer: '',
      author: '',
      liturgical_season: '',
      liturgical_color: '',
      is_active: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
              <h1 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                Gestor de Contenido
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-marian-blue-600 dark:hover:text-sacred-gold-400 transition-colors duration-200"
              >
                Ver Sitio Web
              </a>
              <a
                href="/admin/dashboard"
                className="text-gray-600 dark:text-gray-400 hover:text-marian-blue-600 dark:hover:text-sacred-gold-400 transition-colors duration-200"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Gestor de Contenido
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Administra el contenido diario del portal católico
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Contenido
          </button>
        </div>

        {/* Content Type Selector */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'gospel', label: 'Evangelio' },
            { key: 'saint', label: 'Santos' },
            { key: 'reading', label: 'Lecturas' }
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedType === type.key
                  ? 'bg-marian-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-marian-blue-100 dark:hover:bg-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-6">
              Crear Nuevo Contenido
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={newContent.date}
                  onChange={(e) => setNewContent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo
                </label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500"
                >
                  <option value="gospel">Evangelio</option>
                  <option value="saint">Santo</option>
                  <option value="reading">Lectura</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500"
                  placeholder="Título del contenido"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenido Principal
                </label>
                <textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 resize-vertical"
                  placeholder="Contenido principal..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateContent}
                className="px-6 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Crear'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white">
              Contenido {selectedType === 'gospel' ? 'del Evangelio' : selectedType === 'saint' ? 'de Santos' : 'de Lecturas'}
            </h3>
          </div>

          <div className="p-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No hay contenido disponible</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Crea el primer contenido para comenzar
              </p>
            </div>
          </div>
        </div>

        {/* Scheduled Content */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white">
              Contenido Programado
            </h3>
          </div>

          <div className="p-6">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No hay contenido programado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;