import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const colorClasses = variant === 'light' 
    ? 'text-white' 
    : 'text-marian-blue-900 dark:text-sacred-gold-400';

  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="relative">
        {/* Chalice with cross */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-sacred-gold-400 to-sacred-gold-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
          <div className="relative">
            {/* Cross */}
            <div className="w-4 h-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-4 bg-white"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-0.5 bg-white"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Light rays */}
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-sacred-gold-400 dark:text-sacred-gold-300 animate-bounce-gentle" />
      </div>
      
      <div className="flex flex-col">
        <span className={`font-serif font-bold ${textClasses[size]} ${colorClasses} tracking-tight group-hover:text-sacred-gold-600 dark:group-hover:text-sacred-gold-300 transition-colors duration-300`}>
          Camino de Fe
        </span>
        {size !== 'sm' && (
          <span className={`text-xs ${variant === 'light' ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'} font-sans tracking-wide`}>
            Portal Católico
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
