import React from 'react';
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Privacy: React.FC = () => {
  const lastUpdated = '15 de Enero, 2025';

  const sections = [
    {
      id: 'informacion-recopilamos',
      title: 'Información que Recopilamos',
      icon: Database,
      content: [
        {
          subtitle: 'Información Personal',
          text: 'Recopilamos información que usted nos proporciona directamente, como su nombre, dirección de correo electrónico, y cualquier otra información que decida compartir cuando se suscribe a nuestro boletín, envía peticiones de oración, o se pone en contacto con nosotros.'
        },
        {
          subtitle: 'Información de Uso',
          text: 'Recopilamos información sobre cómo utiliza nuestro sitio web, incluyendo las páginas que visita, el tiempo que pasa en cada página, y las acciones que realiza.'
        },
        {
          subtitle: 'Información Técnica',
          text: 'Recopilamos información técnica como su dirección IP, tipo de navegador, sistema operativo, y datos de cookies para mejorar la funcionalidad del sitio.'
        }
      ]
    },
    {
      id: 'como-usamos',
      title: 'Cómo Usamos su Información',
      icon: Eye,
      content: [
        {
          subtitle: 'Servicios Espirituales',
          text: 'Utilizamos su información para proporcionarle contenido espiritual personalizado, responder a sus peticiones de oración, y enviarle el Evangelio del día si se ha suscrito.'
        },
        {
          subtitle: 'Comunicación',
          text: 'Podemos usar su información de contacto para responder a sus consultas, enviarle actualizaciones sobre nuestros servicios, y comunicarnos con usted sobre asuntos relacionados con su cuenta.'
        },
        {
          subtitle: 'Mejora del Servicio',
          text: 'Analizamos el uso del sitio web para mejorar nuestros servicios, desarrollar nuevas funcionalidades, y personalizar su experiencia.'
        }
      ]
    },
    {
      id: 'compartir-informacion',
      title: 'Compartir Información',
      icon: Shield,
      content: [
        {
          subtitle: 'No Vendemos Datos',
          text: 'Nunca vendemos, alquilamos o comercializamos su información personal a terceros.'
        },
        {
          subtitle: 'Proveedores de Servicios',
          text: 'Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro sitio web, como servicios de hosting, análisis web, y envío de correos electrónicos.'
        },
        {
          subtitle: 'Requisitos Legales',
          text: 'Podemos divulgar información si es requerido por ley o para proteger nuestros derechos, propiedad, o seguridad.'
        }
      ]
    },
    {
      id: 'seguridad',
      title: 'Seguridad de Datos',
      icon: Lock,
      content: [
        {
          subtitle: 'Medidas de Protección',
          text: 'Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.'
        },
        {
          subtitle: 'Transmisión Segura',
          text: 'Utilizamos conexiones SSL/TLS encriptadas para proteger la transmisión de datos entre su navegador y nuestros servidores.'
        },
        {
          subtitle: 'Acceso Limitado',
          text: 'El acceso a su información personal está limitado a empleados y colaboradores que necesitan esta información para proporcionarle nuestros servicios.'
        }
      ]
    }
  ];

  const rights = [
    'Acceder a la información personal que tenemos sobre usted',
    'Rectificar información inexacta o incompleta',
    'Solicitar la eliminación de su información personal',
    'Oponerse al procesamiento de su información',
    'Solicitar la portabilidad de sus datos',
    'Retirar su consentimiento en cualquier momento'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            En Camino de Fe, respetamos y protegemos su privacidad. Esta política explica cómo
            recopilamos, usamos y protegemos su información personal.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Última actualización: {lastUpdated}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-marian-blue-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Nuestro Compromiso con su Privacidad
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Como portal católico dedicado a la evangelización y el acompañamiento espiritual, 
            entendemos la importancia de la confianza y la privacidad. Nos comprometemos a 
            proteger su información personal y a ser transparentes sobre nuestras prácticas 
            de recopilación y uso de datos.
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 text-white p-6">
                <div className="flex items-center space-x-3">
                  <section.icon className="h-6 w-6" />
                  <h2 className="text-2xl font-serif font-semibold">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-3">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rights Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-sacred-gold-500 to-sacred-gold-600 dark:from-gray-700 dark:to-gray-600 text-white p-6">
            <h2 className="text-2xl font-serif font-semibold">
              Sus Derechos
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Bajo las leyes de protección de datos aplicables, usted tiene los siguientes derechos 
              con respecto a su información personal:
            </p>
            <ul className="space-y-3">
              {rights.map((right, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-sacred-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">{right}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cookies Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Uso de Cookies
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web. 
              Las cookies nos ayudan a:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Recordar sus preferencias y configuraciones</li>
              <li>Analizar el tráfico del sitio web</li>
              <li>Personalizar el contenido</li>
              <li>Mejorar la funcionalidad del sitio</li>
            </ul>
            <p>
              Puede controlar el uso de cookies a través de la configuración de su navegador. 
              Para más información, consulte nuestra{' '}
              <a href="/politica-cookies" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                Política de Cookies
              </a>.
            </p>
          </div>
        </div>

        {/* Third Party Services */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Servicios de Terceros
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Nuestro sitio web puede utilizar servicios de terceros para mejorar la funcionalidad 
              y proporcionar análisis. Estos pueden incluir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google Analytics:</strong> Para análisis de tráfico web</li>
              <li><strong>Servicios de email:</strong> Para envío de boletines</li>
              <li><strong>Redes sociales:</strong> Para funciones de compartir</li>
            </ul>
            <p>
              Estos servicios tienen sus propias políticas de privacidad que recomendamos revisar.
            </p>
          </div>
        </div>

        {/* Data Retention */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Retención de Datos
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Conservamos su información personal solo durante el tiempo necesario para cumplir 
              con los propósitos para los cuales fue recopilada, incluyendo:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Proporcionar nuestros servicios espirituales</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Resolver disputas</li>
              <li>Hacer cumplir nuestros acuerdos</li>
            </ul>
            <p>
              Cuando ya no necesitemos su información, la eliminaremos de forma segura.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-serif font-semibold mb-6 text-center">
            Contacto sobre Privacidad
          </h2>
          <p className="text-marian-blue-100 dark:text-gray-300 mb-6 text-center">
            Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, 
            no dude en contactarnos:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Mail className="h-6 w-6 text-sacred-gold-400" />
              <span className="text-sm">Email</span>
              <span className="text-marian-blue-100 dark:text-gray-300">
                privacidad@luzdefe.com
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Phone className="h-6 w-6 text-sacred-gold-400" />
              <span className="text-sm">Teléfono</span>
              <span className="text-marian-blue-100 dark:text-gray-300">
                +34 600 000 000
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <MapPin className="h-6 w-6 text-sacred-gold-400" />
              <span className="text-sm">Dirección</span>
              <span className="text-marian-blue-100 dark:text-gray-300">
                Madrid, España
              </span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/contacto"
              className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contactar sobre Privacidad
            </a>
          </div>
        </div>

        {/* Updates */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Actualizaciones de esta Política
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios 
            en nuestras prácticas o por otras razones operativas, legales o regulatorias. 
            Le notificaremos sobre cambios significativos publicando la política actualizada 
            en nuestro sitio web y actualizando la fecha de "última actualización".
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
