import React, { useState, useEffect } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si ya está autenticado
  useEffect(() => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
    }
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulación de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // NOTA: En un entorno real, esto debería ser una llamada a un backend seguro.
      // Para la demo, usamos variables de entorno como se define en el README.
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@luzdefe.com';
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

      if (credentials.email === adminEmail && credentials.password === adminPassword) {
        // Guardar token de autenticación
        localStorage.setItem('admin_token', 'demo_token_' + Date.now());
        localStorage.setItem('admin_user', JSON.stringify({
          email: credentials.email,
          role: 'admin',
          name: 'Administrador',
          id: 'admin-demo-id'
        }));
        
        // Redirigir a la página solicitada o al dashboard
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      } else {
        setError('Credenciales incorrectas. Por favor, verifique su email y contraseña.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-marian-blue-900 to-marian-blue-800 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to site link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-marian-blue-100 dark:text-gray-300 hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al sitio web
          </Link>
        </div>

        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-sacred-gold-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">
            Panel de Administración
          </h2>
          <p className="text-marian-blue-100 dark:text-gray-300">
            Acceso exclusivo para administradores de Camino de Fe
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                  placeholder="admin@luzdefe.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-marian-blue-600 hover:bg-marian-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marian-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              🔐 Credenciales de Demo:
            </h3>
            <div className="space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Email:</strong> admin@luzdefe.com
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Contraseña:</strong> admin123
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                ℹ️ Este es un panel de demostración con datos simulados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
