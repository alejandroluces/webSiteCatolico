export interface WhatsAppSubscriptionInput {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
}

export interface WhatsAppSubscriptionResult {
  ok: boolean;
  message: string;
}

export async function subscribeToWhatsAppGospel(
  input: WhatsAppSubscriptionInput
): Promise<WhatsAppSubscriptionResult> {
  const resp = await fetch('/.netlify/functions/whatsapp-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  // En modo dev con `vite`, este endpoint no existe (404) a menos que uses `netlify dev`.
  if (resp.status === 404) {
    const isVitePort = typeof window !== 'undefined' && window.location?.port === '5173';
    return {
      ok: false,
      message:
        isVitePort
          ? 'Estás abriendo la web en el puerto 5173 (Vite) y ahí las funciones `/.netlify/functions/*` no existen. Para probar en local, ejecuta `npm run dev:netlify` y abre la web en: http://localhost:8890 (o el puerto que configure Netlify Dev, por defecto suele ser 8888).'
          : 'El endpoint de suscripción no está disponible en este modo. Para probar en local, ejecuta: `npm run dev:netlify` y abre http://localhost:8890 (o el puerto que configure Netlify Dev).',
    };
  }

  const data = (await resp.json().catch(() => ({}))) as Partial<WhatsAppSubscriptionResult>;

  if (!resp.ok) {
    return {
      ok: false,
      message: data.message || 'No se pudo completar la suscripción. Intenta nuevamente.',
    };
  }

  return {
    ok: true,
    message: data.message || 'Suscripción creada correctamente.',
  };
}
