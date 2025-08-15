import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Moon, Sun, ChevronDown } from 'lucide-react';
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
    { name: 'Aprende a Rezar', href: '/aprende-a-rezar' },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-2xl font-bold text-marian-blue-900 dark:text-white">
            Luz de Fe
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
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
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
