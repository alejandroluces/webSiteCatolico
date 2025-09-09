import React from 'react';
import { Heart, Users, BookOpen, Award, Mail, Phone } from 'lucide-react';

const About: React.FC = () => {
  const team = [
    {
      name: 'Padre Miguel Rodríguez',
      role: 'Director Espiritual',
      description: 'Sacerdote diocesano con 15 años de experiencia en evangelización digital.',
      image: 'https://images.pexels.com/photos/8815007/pexels-photo-8815007.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    },
    {
      name: 'María González',
      role: 'Coordinadora de Contenido',
      description: 'Teóloga especializada en espiritualidad y escritura católica.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    },
    {
      name: 'Carlos Martín',
      role: 'Desarrollador Web',
      description: 'Ingeniero comprometido con usar la tecnología para evangelizar.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    },
  ];

  const stats = [
    { number: '50,000+', label: 'Visitantes mensuales' },
    { number: '1,000+', label: 'Oraciones respondidas' },
    { number: '500+', label: 'Artículos publicados' },
    { number: '3 años', label: 'Evangelizando online' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-marian-blue-900 to-marian-blue-700 dark:from-gray-900 dark:to-gray-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Acerca de Camino de Fe
          </h1>
          <p className="text-xl text-marian-blue-100 dark:text-gray-300 leading-relaxed">
            Somos una comunidad católica digital dedicada a evangelizar, formar e inspirar 
            a través de contenido espiritual auténtico y de calidad.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white mb-6">
                Nuestra Misión
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Camino de Fe nació con el deseo de llevar la luz del Evangelio a cada rincón del mundo digital.
                  Creemos que la fe católica puede y debe adaptarse a los nuevos tiempos sin perder su esencia.
                </p>
                <p>
                  Nuestro objetivo es ser un faro de esperanza para quienes buscan a Dios, ofreciendo 
                  contenido espiritual que nutra el alma y fortalezca la fe de nuestros hermanos católicos.
                </p>
                <p>
                  A través de la oración, la formación y la comunidad, acompañamos a cada persona 
                  en su camino de santidad y encuentro personal con Jesucristo.
                </p>
              </div>
            </div>
            <div className="bg-marian-blue-50 dark:bg-gray-800 rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Heart className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-marian-blue-900 dark:text-white mb-2">Evangelización</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Llevamos el mensaje de Cristo a través de medios digitales modernos
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BookOpen className="h-6 w-6 text-marian-blue-600 dark:text-sacred-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-marian-blue-900 dark:text-white mb-2">Formación</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Ofrecemos recursos para el crecimiento espiritual y el conocimiento de la fe
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-sacred-gold-600 dark:text-sacred-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-marian-blue-900 dark:text-white mb-2">Comunidad</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Creamos espacios de encuentro y oración para fortalecer la fe comunitaria
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center text-marian-blue-900 dark:text-white mb-12">
            Nuestro Impacto
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-marian-blue-600 dark:text-sacred-gold-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Conoce a las personas que trabajan con dedicación para llevar la luz de Cristo 
              a través de este portal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <div className="text-sacred-gold-600 dark:text-sacred-gold-400 font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-marian-blue-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center text-marian-blue-900 dark:text-white mb-12">
            Nuestros Valores
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-3">
                Fidelidad a la Doctrina Católica
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Todo nuestro contenido está basado en las enseñanzas del Magisterio de la Iglesia Católica, 
                garantizando ortodoxia y autenticidad en cada publicación.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-3">
                Accesibilidad y Cercanía
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Creemos que la fe debe ser accesible para todos. Por eso, presentamos el contenido espiritual 
                de manera clara, cercana y adaptada a los tiempos actuales.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-3">
                Espíritu de Servicio
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Trabajamos como instrumentos al servicio de Dios y de nuestros hermanos, 
                con humildad y dedicación en cada aspecto de nuestro ministerio digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-900 dark:to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            ¿Quieres Contactarnos?
          </h2>
          <p className="text-xl text-marian-blue-100 dark:text-gray-300 mb-8">
            Estamos aquí para acompañarte en tu camino de fe. No dudes en escribirnos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="inline-flex items-center px-8 py-4 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Mail className="mr-2 h-5 w-5" />
              Enviar Mensaje
            </a>
            <a
              href="tel:+34600000000"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-marian-blue-900 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl"
            >
              <Phone className="mr-2 h-5 w-5" />
              Llamar Ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
