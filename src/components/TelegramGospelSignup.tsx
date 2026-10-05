import { Send } from 'lucide-react';

const TelegramGospelSignup = () => {
  const configuredUrl = (import.meta.env.VITE_TELEGRAM_CHANNEL_URL || 'https://t.me/caminodefecl').trim();
  const channelUrl = /^https:\/\/t\.me\/(?:[A-Za-z][A-Za-z0-9_]{4,}|\+[A-Za-z0-9_-]+)$/.test(configuredUrl)
    ? configuredUrl : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 dark:from-gray-700 dark:to-gray-600 text-white p-5">
        <div className="flex items-center space-x-2">
          <Send className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-lg font-serif font-semibold">Evangelio por Telegram</h3>
        </div>
        <p className="text-sky-50/90 dark:text-gray-200 text-sm mt-1">El Evangelio y la oración de la mañana, cada día.</p>
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Únete a nuestro canal gratuito de Telegram para acompañar tu día con la Palabra de Dios.
          Puedes salir del canal cuando quieras.
        </p>
        {channelUrl ? (
          <a href={channelUrl} target="_blank" rel="noopener noreferrer"
            className="mt-4 w-full inline-flex items-center justify-center px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors">
            Unirme al canal de Telegram
          </a>
        ) : (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Próximamente podrás unirte a nuestro canal desde aquí.</p>
        )}
      </div>
    </div>
  );
};

export default TelegramGospelSignup;
