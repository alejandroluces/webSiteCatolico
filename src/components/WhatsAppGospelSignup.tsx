import React, { useMemo, useState } from 'react';
import { MessageCircle, Loader2, X } from 'lucide-react';
import { subscribeToWhatsAppGospel } from '../services/whatsappSubscriptionService';

const normalizePhone = (raw: string) => raw.replace(/[^0-9+]/g, '');

const isValidEmail = (email: string) => {
  if (!email) return true; // optional
  // simple email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string) => {
  // Accept +569XXXXXXXX or 569XXXXXXXX or 9XXXXXXXX (we'll store cleaned)
  const p = phone.replace(/\D/g, '');
  return p.length >= 10;
};

const WhatsAppGospelSignup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const cleanedPhone = useMemo(() => normalizePhone(phone), [phone]);

  const canSubmit =
    firstName.trim().length >= 2 &&
    isValidPhone(cleanedPhone) &&
    isValidEmail(email.trim()) &&
    consent &&
    !loading;

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await subscribeToWhatsAppGospel({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        phone: cleanedPhone,
        email: email.trim() || undefined,
      });

      setResult({
        type: res.ok ? 'success' : 'error',
        message: res.message,
      });

      if (res.ok) {
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setConsent(false);

        // cerrar modal luego de un momento para que el usuario vea el mensaje
        setTimeout(() => setOpen(false), 1200);
      }
    } catch {
      setResult({
        type: 'error',
        message: 'Ocurrió un error inesperado. Intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CTA compacta (estilo consistente con GospelWidget) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-700 dark:to-gray-600 text-white p-5">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="text-lg font-serif font-semibold">Evangelio por WhatsApp</h3>
          </div>
          <p className="text-green-50/90 dark:text-gray-200 text-sm mt-1">
            Envío diario a las <strong>07:00</strong> (America/Santiago).
          </p>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Suscríbete y recibe cada mañana el Evangelio del día directo en tu WhatsApp.
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 w-full inline-flex items-center justify-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Suscribirme
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !loading && setOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-800 dark:to-gray-700 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold">Recibe el Evangelio por WhatsApp</h3>
                <p className="text-sm text-green-50/90">Envío diario 07:00 (America/Santiago)</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tu nombre"
                      required
                      minLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp (teléfono) *</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: +56912345678"
                      required
                    />
                    {!isValidPhone(cleanedPhone) && phone.trim().length > 0 && (
                      <p className="mt-1 text-xs text-red-600">Ingresa un teléfono válido (incluye código de país).</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo (opcional)</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="tu@email.com"
                    />
                    {!isValidEmail(email.trim()) && (
                      <p className="mt-1 text-xs text-red-600">Correo inválido.</p>
                    )}
                  </div>
                </div>

                <label className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span>
                    Acepto recibir mensajes por WhatsApp con el Evangelio del día. Podré darme de baja cuando quiera.
                  </span>
                </label>

                {result && (
                  <div
                    className={`rounded-lg p-3 text-sm border ${
                      result.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200'
                    }`}
                  >
                    {result.message}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                    className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Confirmar suscripción'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppGospelSignup;
