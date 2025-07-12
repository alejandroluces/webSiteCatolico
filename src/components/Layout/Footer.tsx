import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-marian-blue-900 dark:bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold">
              Luz de Fe
            </Link>
            <p className="text-sm text-marian-blue-100 dark:text-gray-400 mt-1">
              Portal Católico de Evangelización
            </p>
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
            © {currentYear} Luz de Fe. Todos los derechos reservados.
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