import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, Cross } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-marian-blue-900 dark:bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <Cross className="h-7 w-7 text-sacred-gold-400 dark:text-sacred-gold-400 group-hover:text-sacred-gold-300 dark:group-hover:text-sacred-gold-300 transition-colors duration-300" />
                <div className="absolute inset-0 bg-sacred-gold-300 dark:bg-sacred-gold-300 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold bg-gradient-to-r from-white via-sacred-gold-200 to-sacred-gold-400 dark:from-white dark:via-sacred-gold-200 dark:to-sacred-gold-400 bg-clip-text text-transparent group-hover:from-sacred-gold-400 group-hover:via-sacred-gold-200 group-hover:to-white dark:group-hover:from-sacred-gold-400 dark:group-hover:via-sacred-gold-200 dark:group-hover:to-white transition-all duration-500">
                  Camino de Fe
                </span>
                <span className="text-[10px] font-medium text-marian-blue-200 dark:text-gray-400 tracking-wider uppercase -mt-1">
                  Portal Católico
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
            <Link to="/evangelio-del-dia" className="text-marian-blue-100 hover:text-white dark:text-gray-300">
              Evangelio del Día
            </Link>
            <Link to="/oraciones" className="text-marian-blue-100 hover:text-white dark:text-gray-300">
              Oraciones
            </Link>
            <Link to="/contacto" className="text-marian-blue-100 hover:text-white dark:text-gray-300">
              Contacto
            </Link>
          </div>
        </div>
        
        <div className="border-t border-marian-blue-800 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-marian-blue-200 dark:text-gray-400">
            © {currentYear} Camino de Fe. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-1 text-sm text-marian-blue-200 dark:text-gray-400 mt-4 md:mt-0">
            <span>Hecho con</span>
            <Heart className="h-4 w-4 text-red-400 fill-current" />
            <span>para la gloria de Dios</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
