-- Bloquear suscripciones (temporal)
--
-- Esto deshabilita la suscripción desde frontend/Netlify Function
-- eliminando las policies RLS para roles anon/authenticated.
--
-- Importante:
-- - NO afecta a service_role.
-- - Mantiene la policy "whatsapp_subscriptions_service_role_all" intacta.

-- Quitar permisos de suscripción pública
drop policy if exists "whatsapp_subscriptions_anon_insert" on public.whatsapp_subscriptions;
drop policy if exists "whatsapp_subscriptions_anon_update" on public.whatsapp_subscriptions;

