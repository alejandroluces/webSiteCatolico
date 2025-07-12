import React, { useState } from 'react';
import { RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { GospelSyncService } from '../../services/gospelSyncService';

interface GospelSyncButtonProps {
  onSyncComplete?: (success: boolean) => void;
}

const GospelSyncButton: React.FC<GospelSyncButtonProps> = ({ onSyncComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSync = async () => {
    setIsLoading(true);
    setSyncStatus('idle');
    setStatusMessage('Sincronizando evangelio del día...');

    try {
      const success = await GospelSyncService.syncTodayGospel();
      
      if (success) {
        setSyncStatus('success');
        setStatusMessage('Evangelio sincronizado correctamente');
        if (onSyncComplete) onSyncComplete(true);
      } else {
        setSyncStatus('error');
        setStatusMessage('Error al sincronizar el evangelio');
        if (onSyncComplete) onSyncComplete(false);
      }
    } catch (error) {
      console.error('Error al sincronizar:', error);
      setSyncStatus('error');
      setStatusMessage('Error inesperado al sincronizar');
      if (onSyncComplete) onSyncComplete(false);
    } finally {
      setIsLoading(false);
      
      // Resetear el estado después de 5 segundos
      setTimeout(() => {
        if (syncStatus !== 'idle') {
          setSyncStatus('idle');
          setStatusMessage('');
        }
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleSync}
        disabled={isLoading}
        className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
          syncStatus === 'success' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : syncStatus === 'error'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-marian-blue-600 hover:bg-marian-blue-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : syncStatus === 'success' ? (
          <Check className="mr-2 h-5 w-5" />
        ) : syncStatus === 'error' ? (
          <AlertTriangle className="mr-2 h-5 w-5" />
        ) : (
          <RefreshCw className="mr-2 h-5 w-5" />
        )}
        {isLoading ? 'Sincronizando...' : 'Sincronizar Evangelio'}
      </button>
      
      {statusMessage && (
        <p className={`mt-2 text-sm ${
          syncStatus === 'success' 
            ? 'text-green-600 dark:text-green-400' 
            : syncStatus === 'error' 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-600 dark:text-gray-400'
        }`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default GospelSyncButton;