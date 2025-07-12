import React, { useState } from 'react';
import { Cookie, Settings, Eye, BarChart3, Share2, Shield, Check, X } from 'lucide-react';

const Cookies: React.FC = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  const lastUpdated = '15 de Enero, 2025';

  const cookieTypes = [
    {
      id: 'necessary',
      name: 'Cookies Necesarias',
      icon: Shield,
      description: 'Estas cookies son esenciales para el funcionamiento básico del sitio web y no pueden ser desactivadas.',
      required: true,
      examples: [
        'Cookies de sesión para mantener su navegación',
        'Cookies de seguridad para proteger contra ataques',
        'Cookies de preferencias de idioma',
        'Cookies de consentimiento de cookies'
      ],
      duration: 'Sesión o hasta 1 año'
    },
    {
      id: 'functional',
      name: 'Cookies Funcionales',
      icon: Settings,
      description: 'Estas cookies permiten que el sitio web recuerde las opciones que hace y proporcione características mejoradas.',
      required: false,
      examples: [
        'Preferencias de tema (modo oscuro/claro)',
        'Configuración de fuente y accesibilidad',
        'Recordar formularios completados',
        'Preferencias de contenido personalizado'
      ],
      duration: 'Hasta 1 año'
    },
    {
      id: 'analytics',
      name: 'Cookies de Análisis',
      icon: BarChart3,
      description: 'Estas cookies nos ayudan a entender cómo los visitantes interactúan con el sitio web.',
      required: false,
      examples: [
        'Google Analytics para estadísticas de uso',
        'Medición de rendimiento del sitio',
        'Análisis de comportamiento de usuarios',
        'Informes de errores y mejoras'
      ],
      duration: 'Hasta 2 años'
    },
    {
      id: 'marketing',
      name: 'Cookies de Marketing',
      icon: Share2,
      description: 'Estas cookies se utilizan para mostrar anuncios relevantes y medir la efectividad de las campañas.',
      required: false,
      examples: [
        'Google AdSense para anuncios relevantes',
        'Seguimiento de conversiones',
        'Personalización de anuncios',
        'Integración con redes sociales'
      ],
      duration: 'Hasta 2 años'
    }
  ];

  const handlePreferenceChange = (cookieType: string, enabled: boolean) => {
    if (cookieType === 'necessary') return; // Cannot disable necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: enabled
    }));
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
    // Here you would typically save preferences and reload or update the page
    alert('Preferencias guardadas. Se han aceptado todas las cookies.');
  };

  const handleAcceptNecessary = () => {
    setCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
    // Here you would typically save preferences
    alert('Preferencias guardadas. Solo se han aceptado las cookies necesarias.');
  };

  const handleSavePreferences = () => {
    // Here you would typically save the current preferences
    alert('Preferencias de cookies guardadas correctamente.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Cookie className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Política de Cookies
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Información sobre cómo utilizamos las cookies en Luz de Fe y cómo puede 
            controlar su uso para mejorar su experiencia de navegación.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Última actualización: {lastUpdated}
          </div>
        </div>

        {/* What are Cookies */}
        <div className="bg-marian-blue-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            ¿Qué son las Cookies?
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo 
              cuando visita un sitio web. Nos ayudan a hacer que el sitio web funcione, 
              mejoran su experiencia de navegación, y nos proporcionan información sobre 
              cómo se utiliza el sitio.
            </p>
            <p>
              En Luz de Fe, utilizamos cookies para recordar sus preferencias, analizar 
              el tráfico del sitio, y personalizar el contenido para ofrecerle la mejor 
              experiencia espiritual posible.
            </p>
          </div>
        </div>

        {/* Cookie Types and Preferences */}
        <div className="space-y-6 mb-8">
          <h2 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white text-center mb-8">
            Tipos de Cookies y Preferencias
          </h2>
          
          {cookieTypes.map((cookieType) => (
            <div
              key={cookieType.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <cookieType.icon className="h-6 w-6 text-marian-blue-600 dark:text-sacred-gold-400" />
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white">
                        {cookieType.name}
                      </h3>
                      {cookieType.required && (
                        <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs rounded-full">
                          Requeridas
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      onClick={() => handlePreferenceChange(cookieType.id, !cookiePreferences[cookieType.id as keyof typeof cookiePreferences])}
                      disabled={cookieType.required}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        cookiePreferences[cookieType.id as keyof typeof cookiePreferences]
                          ? 'bg-marian-blue-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      } ${cookieType.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          cookiePreferences[cookieType.id as keyof typeof cookiePreferences]
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {cookieType.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-marian-blue-900 dark:text-white mb-2">
                      Ejemplos de uso:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {cookieType.examples.map((example, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-sacred-gold-600 dark:text-sacred-gold-400 mt-1">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-marian-blue-900 dark:text-white mb-2">
                      Duración:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cookieType.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cookie Preferences Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-6 text-center">
            Gestionar Preferencias de Cookies
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleAcceptAll}
              className="inline-flex items-center px-6 py-3 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <Check className="mr-2 h-5 w-5" />
              Aceptar Todas
            </button>
            
            <button
              onClick={handleSavePreferences}
              className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <Settings className="mr-2 h-5 w-5" />
              Guardar Preferencias
            </button>
            
            <button
              onClick={handleAcceptNecessary}
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <X className="mr-2 h-5 w-5" />
              Solo Necesarias
            </button>
          </div>
        </div>

        {/* Third Party Cookies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Cookies de Terceros
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Algunos de nuestros socios pueden establecer cookies en su dispositivo cuando 
              visita nuestro sitio web. Estos incluyen:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="font-semibold text-marian-blue-900 dark:text-white mb-2">
                  Google Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Nos ayuda a entender cómo los visitantes utilizan nuestro sitio web.
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-marian-blue-600 dark:text-sacred-gold-400 text-sm hover:underline"
                >
                  Ver política de privacidad →
                </a>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="font-semibold text-marian-blue-900 dark:text-white mb-2">
                  Google AdSense
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Muestra anuncios relevantes y mide su efectividad.
                </p>
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-marian-blue-600 dark:text-sacred-gold-400 text-sm hover:underline"
                >
                  Ver política de anuncios →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* How to Control Cookies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Cómo Controlar las Cookies
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Puede controlar y/o eliminar las cookies como desee. Puede eliminar todas 
              las cookies que ya están en su dispositivo y configurar la mayoría de los 
              navegadores para evitar que se establezcan.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-marian-blue-900 dark:text-white mb-3">
                  Configuración del Navegador:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                      Safari
                    </a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                      Internet Explorer
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-marian-blue-900 dark:text-white mb-3">
                  Herramientas de Exclusión:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                      Exclusión de Google Analytics
                    </a>
                  </li>
                  <li>
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                      Configuración de anuncios de Google
                    </a>
                  </li>
                  <li>
                    <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                      Your Online Choices (EU)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Nota:</strong> Si deshabilita las cookies, algunas funciones del sitio web 
                pueden no funcionar correctamente. Esto puede afectar su experiencia de navegación.
              </p>
            </div>
          </div>
        </div>

        {/* Contact and Updates */}
        <div className="bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">
            ¿Preguntas sobre Cookies?
          </h2>
          <p className="text-marian-blue-100 dark:text-gray-300 mb-6">
            Si tiene preguntas sobre nuestra política de cookies o desea más información 
            sobre cómo utilizamos las cookies, no dude en contactarnos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <Eye className="mr-2 h-5 w-5" />
              Contactar
            </a>
            <a
              href="/politica-privacidad"
              className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-marian-blue-900 text-white font-semibold rounded-lg transition-all duration-300"
            >
              <Shield className="mr-2 h-5 w-5" />
              Política de Privacidad
            </a>
          </div>
        </div>

        {/* Last Update Notice */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Esta política de cookies puede actualizarse periódicamente para reflejar cambios 
            en nuestras prácticas o por razones legales. La fecha de última actualización 
            se muestra en la parte superior de esta página.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cookies;