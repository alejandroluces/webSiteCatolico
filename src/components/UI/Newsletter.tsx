import React, { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-2 text-green-400 mb-4">
          <Check className="h-8 w-8" />
          <span className="text-xl font-serif">¡Gracias por suscribirte!</span>
        </div>
        <p className="text-marian-blue-100 dark:text-gray-300">
          Recibirás el Evangelio del día en tu correo cada mañana.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Mail className="h-6 w-6 text-sacred-gold-400 dark:text-sacred-gold-300" />
        <h3 className="text-2xl font-serif font-semibold text-white">
          Evangelio del Día
        </h3>
      </div>
      
      <p className="text-marian-blue-100 dark:text-gray-300 mb-6 max-w-md mx-auto">
        Comienza cada día con la Palabra de Dios. Recibe el Evangelio y una reflexión en tu correo.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex space-x-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sacred-gold-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Suscribirse</span>
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-marian-blue-200 dark:text-gray-400 mt-3">
          Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
        </p>
      </form>
    </div>
  );
};

export default Newsletter;