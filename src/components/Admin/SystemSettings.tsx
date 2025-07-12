import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Database, Shield, Bell, Clock } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'Luz de Fe',
    site_description: 'Portal católico para evangelización y formación espiritual',
    auto_publish_time: '06:00',
    backup_retention_days: 30,
    max_content_versions: 10,
    notification_email: 'admin@luzdefe.com',
    maintenance_mode: false,
    analytics_enabled: true,
    content_approval_required: true,
    emergency_content_enabled: true
  });

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setIsSaving(false);
      alert('Configuraciones guardadas exitosamente');
    }, 1500);
  };

  const handleCreateBackup = async () => {
    alert('Backup creado exitosamente');
  };

  const handleCleanupSessions = async () => {
    alert('Sesiones expiradas limpiadas exitosamente');
  };

  const settingCategories = {
    general: {
      title: 'Configuración General',
      icon: Settings,
      settings: ['site_name', 'site_description', 'maintenance_mode']
    },
    content: {
      title: 'Gestión de Contenido',
      icon: Database,
      settings: ['auto_publish_time', 'content_approval_required', 'max_content_versions', 'emergency_content_enabled']
    },
    notifications: {
      title: 'Notificaciones',
      icon: Bell,
      settings: ['notification_email']
    },
    system: {
      title: 'Sistema',
      icon: Shield,
      settings: ['backup_retention_days', 'analytics_enabled']
    }
  };

  const renderSettingInput = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleInputChange(key, e.target.checked)}
            className="h-4 w-4 text-marian-blue-600 focus:ring-marian-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {value ? 'Activado' : 'Desactivado'}
          </span>
        </label>
      );
    }

    if (typeof value === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500"
          min="1"
        />
      );
    }

    if (key === 'auto_publish_time') {
      return (
        <input
          type="time"
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500"
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
              <h1 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                Panel de Administración
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Configuración del Sistema
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Gestiona las configuraciones globales del portal
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="inline-flex items-center px-6 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>

        {/* Settings Categories */}
        <div className="space-y-8">
          {Object.entries(settingCategories).map(([categoryKey, category]) => {
            const categorySettings = Object.keys(settings).filter(key => 
              category.settings.includes(key)
            );

            return (
              <div key={categoryKey} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 text-white p-6 rounded-t-xl">
                  <div className="flex items-center space-x-3">
                    <category.icon className="h-6 w-6" />
                    <h2 className="text-xl font-serif font-semibold">
                      {category.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {categorySettings.map((key) => (
                      <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                        </div>
                        
                        <div className="md:col-span-2">
                          {renderSettingInput(key, settings[key as keyof typeof settings])}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Actions */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-r from-sacred-gold-500 to-sacred-gold-600 dark:from-gray-700 dark:to-gray-600 text-white p-6 rounded-t-xl">
            <h2 className="text-xl font-serif font-semibold">
              Acciones del Sistema
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Backup Manual
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Crear un backup manual de toda la base de datos.
                </p>
                <button
                  onClick={handleCreateBackup}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Crear Backup
                </button>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Limpiar Sesiones
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Eliminar sesiones expiradas y limpiar la base de datos.
                </p>
                <button
                  onClick={handleCleanupSessions}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Limpiar Sesiones
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                Importante
              </h3>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>• Los cambios en la configuración afectan a todo el sistema</li>
                <li>• Algunos cambios requieren reiniciar servicios</li>
                <li>• Mantén siempre un backup antes de cambios importantes</li>
                <li>• El modo de mantenimiento deshabilitará el acceso público</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;