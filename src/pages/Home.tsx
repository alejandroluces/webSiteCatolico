import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Heart, Calendar, Sparkles, ArrowRight, Quote } from 'lucide-react';
import GospelWidget from '../components/GospelWidget';
import { useDailyQuote } from '../hooks/useDailyQuote';

const Home: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Evangelio del Día',
      description: 'Comienza tu día con la Palabra de Dios y una reflexión espiritual profunda.',
      href: '/evangelio-del-dia',
      color: 'text-marian-blue-600 dark:text-marian-blue-400',
    },
    {
      icon: User,
      title: 'Santo del Día',
      description: 'Conoce la vida y testimonio de los santos que nos inspiran cada día.',
      href: '/santo-del-dia',
      color: 'text-sacred-gold-600 dark:text-sacred-gold-400',
    },
    {
      icon: Heart,
      title: 'Oraciones',
      description: 'Encuentra oraciones para cada momento: familia, salud, trabajo y más.',
      href: '/oraciones',
      color: 'text-red-600 dark:text-red-400',
    },
    {
      icon: Calendar,
      title: 'Calendario Litúrgico',
      description: 'Sigue el año litúrgico con lecturas, santos y celebraciones.',
      href: '/calendario-liturgico',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: Sparkles,
      title: 'Novenas',
      description: 'Nueve días de oración y reflexión para momentos especiales.',
      href: '/novenas',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: BookOpen,
      title: 'Blog Católico',
      description: 'Artículos sobre espiritualidad, fe, familia y vida cristiana.',
      href: '/blog',
      color: 'text-green-600 dark:text-green-400',
    },
  ];

  const { quote: todayQuote, isLoading: isQuoteLoading, error: quoteError } = useDailyQuote();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-marian-blue-900 via-marian-blue-800 to-marian-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-marian-blue-900/50 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 animate-fade-in">
              Bienvenido a{' '}
              <span className="text-sacred-gold-400 dark:text-sacred-gold-300">
                Luz de Fe
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-marian-blue-100 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Tu portal católico para encontrar paz, fortaleza espiritual y crecimiento en la fe. 
              Acompáñanos en este camino de evangelización y encuentro con Cristo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/evangelio-del-dia"
                className="inline-flex items-center px-8 py-4 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Evangelio de Hoy
              </Link>
              <Link
                to="/oraciones"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-marian-blue-900 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl"
              >
                <Heart className="mr-2 h-5 w-5" />
                Orar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote of the Day */}
      <section className="py-12 bg-marian-blue-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {isQuoteLoading && (
            <div className="flex justify-center items-center h-24">
              <div className="w-8 h-8 border-2 border-marian-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {quoteError && !isQuoteLoading && (
            <div className="text-red-500">{quoteError}</div>
          )}
          {todayQuote && !isQuoteLoading && !quoteError && (
            <div className="relative">
              <Quote className="absolute top-0 left-0 h-8 w-8 text-sacred-gold-400 dark:text-sacred-gold-300 opacity-50 -translate-x-4 -translate-y-4" />
              <blockquote className="text-2xl md:text-3xl font-serif text-marian-blue-900 dark:text-white italic mb-4">
                "{todayQuote.text}"
              </blockquote>
              <cite className="text-lg text-marian-blue-700 dark:text-gray-300 font-medium">
                — {todayQuote.reference}
              </cite>
              <Quote className="absolute bottom-0 right-0 h-8 w-8 text-sacred-gold-400 dark:text-sacred-gold-300 opacity-50 translate-x-4 translate-y-4 rotate-180" />
            </div>
          )}
        </div>
      </section>

      {/* Gospel and Features */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gospel Widget */}
            <div className="lg:col-span-1">
              <GospelWidget />
            </div>
            
            {/* Features */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white mb-6">
                Explora Nuestro Contenido
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.slice(0, 4).map((feature, index) => (
                  <Link
                    key={feature.title}
                    to={feature.href}
                    className="group flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    <div className={`${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-marian-blue-600 dark:text-sacred-gold-400 text-sm font-medium group-hover:text-sacred-gold-600 dark:group-hover:text-sacred-gold-300 transition-colors duration-300">
                        <span>Explorar</span>
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-900 dark:to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            ¿Necesitas oración especial?
          </h2>
          <p className="text-xl text-marian-blue-100 dark:text-gray-300 mb-8">
            Nuestra comunidad está aquí para acompañarte. Comparte tus intenciones de oración 
            y permite que otros hermanos en la fe oren contigo.
          </p>
          <Link
            to="/peticiones-oracion"
            className="inline-flex items-center px-8 py-4 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            <Heart className="mr-2 h-5 w-5" />
            Pedir Oración
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
