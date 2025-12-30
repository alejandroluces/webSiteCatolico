import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';

const Terms: React.FC = () => {
  const lastUpdated = '15 de Enero, 2025';

  const sections = [
    {
      id: 'aceptacion',
      title: 'Aceptación de los Términos',
      icon: Scale,
      content: `Al acceder y utilizar el sitio web Camino de Fe, usted acepta estar sujeto a estos Términos y Condiciones de Uso y a todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, no debe utilizar este sitio web.

Estos términos pueden ser actualizados periódicamente sin previo aviso. Es su responsabilidad revisar estos términos regularmente. El uso continuado del sitio web después de cualquier cambio constituye su aceptación de los nuevos términos.`
    },
    {
      id: 'uso-sitio',
      title: 'Uso del Sitio Web',
      icon: Shield,
      content: `Camino de Fe es un portal católico dedicado a la evangelización, formación espiritual y acompañamiento en la fe. El contenido está destinado para uso personal, educativo y espiritual.

Usted se compromete a:
• Utilizar el sitio web de manera respetuosa y conforme a los valores católicos
• No usar el contenido para fines comerciales sin autorización expresa
• Respetar los derechos de autor y propiedad intelectual
• No intentar dañar, interferir o comprometer la seguridad del sitio
• Proporcionar información veraz en formularios y comunicaciones

Está prohibido:
• Publicar contenido ofensivo, difamatorio o contrario a la doctrina católica
• Usar el sitio para actividades ilegales o no autorizadas
• Intentar acceder a áreas restringidas del sitio web
• Reproducir, distribuir o modificar el contenido sin permiso`
    },
    {
      id: 'contenido',
      title: 'Contenido y Propiedad Intelectual',
      icon: FileText,
      content: `Todo el contenido del sitio web Camino de Fe, incluyendo textos, imágenes, gráficos, logos, iconos, software y otros materiales, está protegido por derechos de autor y otras leyes de propiedad intelectual.

Derechos de Autor:
• El contenido original es propiedad de Camino de Fe o sus licenciantes
• Las citas bíblicas y textos litúrgicos son de dominio público
• Las imágenes de santos y arte sacro pueden tener derechos específicos

Uso Permitido:
• Puede ver, descargar e imprimir contenido para uso personal y no comercial
• Puede compartir enlaces a nuestras páginas en redes sociales
• Puede citar nuestro contenido con la debida atribución

Uso Prohibido:
• Reproducción comercial sin autorización
• Modificación o alteración del contenido
• Eliminación de avisos de derechos de autor`
    },
    {
      id: 'peticiones-oracion',
      title: 'Peticiones de Oración y Contenido del Usuario',
      icon: AlertTriangle,
      content: `Al enviar peticiones de oración, comentarios o cualquier otro contenido al sitio web, usted otorga a Camino de Fe una licencia no exclusiva para usar, reproducir y mostrar dicho contenido en el sitio web.

Responsabilidades del Usuario:
• El contenido debe ser respetuoso y apropiado
• No debe contener información personal sensible de terceros
• Debe ser veraz y no difamatorio
• Debe respetar la privacidad de otros

Moderación:
• Nos reservamos el derecho de moderar, editar o eliminar contenido
• Podemos rechazar peticiones que no cumplan nuestros estándares
• No somos responsables del contenido enviado por usuarios

Privacidad:
• Las peticiones pueden ser publicadas de forma anónima
• Respetamos la confidencialidad de la información personal
• Consulte nuestra Política de Privacidad para más detalles`
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scale className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Términos y Condiciones
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Estos términos rigen el uso del sitio web Camino de Fe. Al utilizar nuestros servicios,
            usted acepta cumplir con estas condiciones.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Última actualización: {lastUpdated}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-marian-blue-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Bienvenido a Camino de Fe
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Camino de Fe es un portal católico dedicado a la evangelización, formación espiritual
            y acompañamiento en la fe. Estos términos y condiciones establecen las reglas y 
            regulaciones para el uso de nuestro sitio web, ubicado en luzdefe.com.
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
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Exención de Responsabilidad
              </h3>
              <div className="text-yellow-700 dark:text-yellow-200 text-sm space-y-2">
                <p>
                  El contenido de este sitio web se proporciona únicamente con fines informativos 
                  y espirituales. Aunque nos esforzamos por mantener la información actualizada y 
                  correcta, no ofrecemos garantías sobre la completitud, exactitud o idoneidad 
                  del contenido.
                </p>
                <p>
                  Camino de Fe no se hace responsable de ningún daño directo, indirecto, incidental
                  o consecuente que pueda surgir del uso de este sitio web o de la confianza 
                  depositada en su contenido.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Limitación de Responsabilidad
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              En ningún caso Camino de Fe, sus directores, empleados, colaboradores o afiliados
              serán responsables de:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Daños directos, indirectos, incidentales o consecuentes</li>
              <li>Pérdida de beneficios, datos o uso</li>
              <li>Interrupción del servicio o errores en el sitio web</li>
              <li>Contenido de terceros o enlaces externos</li>
              <li>Virus u otros componentes dañinos</li>
            </ul>
            <p>
              Esta limitación se aplica independientemente de si hemos sido advertidos 
              de la posibilidad de tales daños.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Ley Aplicable y Jurisdicción
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Estos términos y condiciones se rigen por las leyes de España. Cualquier disputa 
              relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los 
              tribunales españoles.
            </p>
            <p>
              Si alguna disposición de estos términos se considera inválida o inaplicable, 
              las disposiciones restantes permanecerán en pleno vigor y efecto.
            </p>
          </div>
        </div>

        {/* External Links */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Enlaces Externos
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Nuestro sitio web puede contener enlaces a sitios web de terceros. Estos enlaces 
              se proporcionan únicamente para su conveniencia e información.
            </p>
            <p>
              No tenemos control sobre el contenido de estos sitios externos y no somos 
              responsables de su contenido, políticas de privacidad o prácticas. La inclusión 
              de cualquier enlace no implica respaldo por nuestra parte.
            </p>
            <p>
              Le recomendamos que revise los términos y condiciones y las políticas de privacidad 
              de cualquier sitio web de terceros que visite.
            </p>
          </div>
        </div>

        {/* Modifications */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Modificaciones de los Términos
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier 
              momento sin previo aviso. Las modificaciones entrarán en vigor inmediatamente 
              después de su publicación en el sitio web.
            </p>
            <p>
              Es su responsabilidad revisar periódicamente estos términos. El uso continuado 
              del sitio web después de cualquier modificación constituye su aceptación de los 
              términos modificados.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-serif font-semibold mb-6 text-center">
            Información de Contacto
          </h2>
          <p className="text-marian-blue-100 dark:text-gray-300 mb-6 text-center">
            Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Mail className="h-6 w-6 text-sacred-gold-400" />
              <span className="text-sm">Email</span>
              <span className="text-marian-blue-100 dark:text-gray-300">
                legal@luzdefe.com
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
                Santiago, Chile
              </span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/contacto"
              className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contactar sobre Términos
            </a>
          </div>
        </div>

        {/* Final Notice */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Al utilizar el sitio web Camino de Fe, usted reconoce que ha leído, entendido y
            acepta estar sujeto a estos Términos y Condiciones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
