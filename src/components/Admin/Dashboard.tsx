import React, { useState } from 'react';
import { Calendar, Users, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import GospelSyncButton from './GospelSyncButton';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate] = useState<Date>(new Date());
  const [syncStatus, setSyncStatus] = useState<'success' | 'error' | 'idle'>('idle');

  const handlePublishScheduled = async () => {
    setIsLoading(true);
    
    // Simulación de publicación
    setTimeout(() => {
      setIsLoading(false);
      alert('Contenido programado publicado exitosamente');
    }, 1500);
  };

  const handleSyncComplete = (success: boolean) => {
    setSyncStatus(success ? 'success' : 'error');
    
    // Resetear el estado después de 5 segundos
    setTimeout(() => {
      setSyncStatus('idle');
    }, 5000);
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
                Panel de Control
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
              Panel de Control
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Gestión y monitoreo del sistema Luz de Fe
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePublishScheduled}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Calendar className="mr-2 h-4 w-4" />
              )}
              Publicar Programado
            </button>
            <GospelSyncButton onSyncComplete={handleSyncComplete} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Contenido</p>
                <p className="text-2xl font-bold text-marian-blue-900 dark:text-white">
                  156
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              142 activos, 14 programados
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Administradores</p>
                <p className="text-2xl font-bold text-marian-blue-900 dark:text-white">
                  3
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              5 total registrados
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Evangelios</p>
                <p className="text-2xl font-bold text-marian-blue-900 dark:text-white">
                  365
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              365 días del año
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Próxima Actualización</p>
                <p className="text-2xl font-bold text-marian-blue-900 dark:text-white">
                  1:00 AM
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Actualización automática
            </div>
          </div>
        </div>

        {/* Status Message */}
        {syncStatus === 'success' ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-green-900 dark:text-green-300 mb-2">
              ¡Sincronización Exitosa!
            </h3>
            <p className="text-green-700 dark:text-green-400">
              El evangelio del día ha sido sincronizado correctamente con la base de datos.
            </p>
          </div>
        ) : syncStatus === 'error' ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-red-900 dark:text-red-300 mb-2">
              Error de Sincronización
            </h3>
            <p className="text-red-700 dark:text-red-400">
              Ocurrió un error al sincronizar el evangelio. Verifica que el archivo Excel exista y tenga el formato correcto.
            </p>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-green-900 dark:text-green-300 mb-2">
              ¡Todo en Orden!
            </h3>
            <p className="text-green-700 dark:text-green-400">
              El sistema de actualización automática del evangelio está funcionando correctamente.
            </p>
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Instrucciones de Sincronización con Supabase
          </h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              El sistema está configurado para sincronizar automáticamente el evangelio del día con Supabase a la 1:00 AM utilizando:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Archivos Excel con formato <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">DDMMYYYY.xlsx</code> en la carpeta <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">public/images/gospels/</code></li>
              <li>Imágenes con formato <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">DDMMYYYY.png</code> en la misma carpeta</li>
              <li>El contenido del evangelio debe estar en la celda <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">I2</code> del Excel</li>
              <li>Reflexiones generadas automáticamente con Google Gemini AI</li>
            </ul>
            <p>
              Para sincronizar manualmente el evangelio, puedes usar el botón "Sincronizar Evangelio" en la parte superior.
            </p>
            <p className="mt-4 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <strong>Nota:</strong> Asegúrate de que los archivos Excel tengan el formato correcto y que la celda I2 contenga el evangelio completo, incluyendo título, referencia, contenido y oración.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;