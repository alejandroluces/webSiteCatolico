import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Moon, Sun, ChevronDown, Cross } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Evangelio', href: '/evangelio-del-dia' },
    { name: 'Santo del Día', href: '/santo-del-dia' },
    { name: 'Oraciones', href: '/oraciones' },
    { name: 'Blog', href: '/blog' },
    { name: 'Aprende a Rezar el rosario', href: '/aprende-a-rezar' },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-gradient-to-r from-white via-marian-blue-50/20 to-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 flex items-center gap-2 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <Cross className="h-8 w-8 text-sacred-gold-500 dark:text-sacred-gold-400 group-hover:text-sacred-gold-600 dark:group-hover:text-sacred-gold-300 transition-colors duration-300" />
              <div className="absolute inset-0 bg-sacred-gold-400 dark:bg-sacred-gold-300 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-marian-blue-900 via-marian-blue-700 to-sacred-gold-600 dark:from-white dark:via-sacred-gold-200 dark:to-sacred-gold-400 bg-clip-text text-transparent group-hover:from-sacred-gold-600 group-hover:via-marian-blue-700 group-hover:to-marian-blue-900 dark:group-hover:from-sacred-gold-400 dark:group-hover:via-sacred-gold-200 dark:group-hover:to-white transition-all duration-500">
                Camino de Fe
              </span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase -mt-1">
                Portal Católico
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? 'text-marian-blue-900 dark:text-sacred-gold-400'
                    : 'text-gray-700 hover:text-marian-blue-700 dark:text-gray-300 dark:hover:text-sacred-gold-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 hover:text-marian-blue-700 dark:text-gray-300 dark:hover:text-sacred-gold-300 transition-colors duration-200"
              aria-label="Cambiar tema"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-marian-blue-700 dark:text-gray-300 dark:hover:text-sacred-gold-300 transition-colors duration-200"
              aria-label="Menú"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-white to-marian-blue-50/30 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? 'text-marian-blue-900 bg-marian-blue-50 dark:text-sacred-gold-400 dark:bg-gray-700'
                    : 'text-gray-700 hover:text-marian-blue-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-sacred-gold-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
