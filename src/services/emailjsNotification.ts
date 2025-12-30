import emailjs from '@emailjs/browser';

export type SignupNotificationParams = {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
};

const getEnv = (key: string) => {
  // Vite envs are exposed via import.meta.env
  const raw = (import.meta.env as unknown as Record<string, string | undefined>)[key];
  if (!raw) return undefined;
  return String(raw)
    .trim()
    // allow copy/paste with quotes
    .replace(/^[`'\"]+/, '')
    .replace(/[`'\"]+$/, '')
    // common copy/paste trailing semicolon
    .replace(/;$/, '')
    .trim();
};

export const sendSignupEmailNotification = async (params: SignupNotificationParams) => {
  const serviceId = getEnv('VITE_EMAILJS_SERVICE_ID') || '';
  const templateId = getEnv('VITE_EMAILJS_TEMPLATE_ID') || '';
  const publicKey = getEnv('VITE_EMAILJS_PUBLIC_KEY') || '';
  const toEmail = getEnv('VITE_NOTIFICATION_EMAIL') || '';

  const isConfigured = Boolean(serviceId) && Boolean(templateId) && Boolean(publicKey) && Boolean(toEmail);
  if (!isConfigured) {
    // no-op: la suscripción debe funcionar aunque no haya email
    console.warn('EmailJS (frontend) notification skipped (missing env)', {
      hasServiceId: Boolean(serviceId),
      hasTemplateId: Boolean(templateId),
      hasPublicKey: Boolean(publicKey),
      hasToEmail: Boolean(toEmail),
    });
    return;
  }

  // EmailJS template params
  const templateParams = {
    to_email: toEmail,
    first_name: params.firstName,
    last_name: params.lastName || '',
    phone: params.phone,
    email: params.email || '',
    subscribed_at: new Date().toISOString(),
    source: 'website',
    channel: 'whatsapp-gospel',
  };

  if (import.meta.env.DEV) {
    console.log('[EmailJS] sending signup notification', {
      serviceId,
      templateId,
      publicKeyTail: publicKey ? publicKey.slice(-4) : '',
      toEmail,
    });
  }

  // Using browser SDK
  try {
    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
    });
  } catch (err: any) {
    // emailjs-com suele devolver { status, text }
    const status = typeof err?.status === 'number' ? err.status : undefined;
    const text = typeof err?.text === 'string' ? err.text : undefined;
    console.warn('[EmailJS] send failed', { status, text });
    throw err;
  }
};
