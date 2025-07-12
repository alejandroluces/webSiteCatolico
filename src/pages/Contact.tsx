import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general',
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Correo Electrónico',
      details: 'contacto@luzdefe.com',
      description: 'Respuesta en 24-48 horas',
    },
    {
      icon: Phone,
      title: 'Teléfono',
      details: '+34 600 000 000',
      description: 'Lunes a Viernes, 9:00 - 18:00',
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      details: 'Madrid, España',
      description: 'Oficinas centrales',
    },
  ];

  const categories = [
    { value: 'general', label: 'Consulta General' },
    { value: 'oracion', label: 'Petición de Oración' },
    { value: 'contenido', label: 'Sugerencia de Contenido' },
    { value: 'colaboracion', label: 'Colaboración' },
    { value: 'tecnico', label: 'Problema Técnico' },
    { value: 'espiritual', label: 'Dirección Espiritual' },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 dark:bg-green-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-marian-blue-900 dark:text-white mb-4">
            ¡Mensaje Enviado!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos pronto.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Enviar Otro Mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white mb-4">
            Contacta con Nosotros
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Estamos aquí para acompañarte en tu camino de fe. Comparte tus consultas, 
            peticiones de oración o sugerencias con nuestra comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-marian-blue-100 dark:bg-gray-700 p-3 rounded-lg">
                      <info.icon className="h-6 w-6 text-marian-blue-600 dark:text-sacred-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-marian-blue-900 dark:text-white mb-1">
                        {info.title}
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {info.details}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-marian-blue-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Horarios de Atención
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Lunes - Viernes:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Sábados:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Domingos:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Cerrado</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                *Horario peninsular español (CET/CEST)
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-6">
                Envíanos un Mensaje
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoría
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Asunto *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                      placeholder="Asunto de tu mensaje"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Comparte tu mensaje, consulta o petición..."
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Al enviar este formulario, aceptas nuestra{' '}
                    <a href="/politica-privacidad" className="text-marian-blue-600 dark:text-sacred-gold-400 hover:underline">
                      Política de Privacidad
                    </a>{' '}
                    y el tratamiento de tus datos personales según lo establecido en ella.
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
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif font-bold text-center text-marian-blue-900 dark:text-white mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-2">
                  ¿Cuánto tiempo tardan en responder?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Respondemos a todos los mensajes en un plazo de 24-48 horas durante días laborables.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-2">
                  ¿Puedo solicitar oraciones especiales?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Por supuesto. Tenemos una sección específica para peticiones de oración donde puedes compartir tus intenciones.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-2">
                  ¿Ofrecen dirección espiritual?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sí, nuestro director espiritual está disponible para consultas y orientación mediante cita previa.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-2">
                  ¿Cómo puedo colaborar con Luz de Fe?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Siempre buscamos colaboradores comprometidos con la evangelización. Contacta con nosotros para conocer las oportunidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;