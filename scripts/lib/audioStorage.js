import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const VALID_AUDIO_STORAGE_PROVIDERS = new Set(['auto', 'supabase', 'r2']);

function normalizePrefix(prefix = '') {
  return String(prefix).replace(/^\/+|\/+$/g, '');
}

function normalizeBaseUrl(url = '') {
  return String(url).trim().replace(/\/+$/g, '');
}

export function getRequestedAudioStorageProvider(env = process.env) {
  return String(env.AUDIO_STORAGE_PROVIDER || 'auto').trim().toLowerCase();
}

export function shouldSaveLocalAudioCopy(env = process.env) {
  return String(env.AUDIO_SAVE_LOCAL_COPY || 'false').trim().toLowerCase() === 'true';
}

export function getR2AudioConfig(env = process.env) {
  return {
    accountId: env.R2_ACCOUNT_ID,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    bucketName: env.R2_BUCKET_NAME,
    publicBaseUrl: normalizeBaseUrl(env.R2_PUBLIC_BASE_URL || ''),
    audioPrefix: normalizePrefix(env.R2_AUDIO_PREFIX || 'audio_content'),
  };
}

export function isR2Configured(env = process.env) {
  const config = getR2AudioConfig(env);

  return Boolean(
    config.accountId &&
    config.accessKeyId &&
    config.secretAccessKey &&
    config.bucketName &&
    config.publicBaseUrl,
  );
}

export function assertR2Configured(env = process.env) {
  if (!isR2Configured(env)) {
    throw new Error(
      'Faltan variables de Cloudflare R2. Revisa: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME y R2_PUBLIC_BASE_URL.',
    );
  }
}

export function resolveAudioStorageProvider(env = process.env) {
  const requestedProvider = getRequestedAudioStorageProvider(env);

  if (!VALID_AUDIO_STORAGE_PROVIDERS.has(requestedProvider)) {
    throw new Error(
      `AUDIO_STORAGE_PROVIDER inválido: "${requestedProvider}". Valores válidos: auto, supabase, r2.`,
    );
  }

  if (requestedProvider === 'auto') {
    return isR2Configured(env) ? 'r2' : 'supabase';
  }

  if (requestedProvider === 'r2') {
    assertR2Configured(env);
  }

  return requestedProvider;
}

export function buildR2ObjectKey(fileName, env = process.env) {
  const { audioPrefix } = getR2AudioConfig(env);
  return audioPrefix ? `${audioPrefix}/${fileName}` : fileName;
}

export function buildR2PublicUrl(objectKey, env = process.env) {
  const { publicBaseUrl } = getR2AudioConfig(env);

  if (!publicBaseUrl) {
    throw new Error('Falta R2_PUBLIC_BASE_URL para construir la URL pública del audio.');
  }

  return `${publicBaseUrl}/${objectKey}`;
}

export function createR2Client(env = process.env) {
  assertR2Configured(env);

  const config = getR2AudioConfig(env);

  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export async function uploadAudioBuffer({
  buffer,
  fileName,
  contentType = 'audio/mpeg',
  cacheControl = 'public, max-age=31536000, immutable',
  env = process.env,
  client,
}) {
  if (!buffer) {
    throw new Error('No se recibió buffer de audio para subir a Cloudflare R2.');
  }

  const r2Client = client || createR2Client(env);
  const config = getR2AudioConfig(env);
  const objectKey = buildR2ObjectKey(fileName, env);

  await r2Client.send(new PutObjectCommand({
    Bucket: config.bucketName,
    Key: objectKey,
    Body: buffer,
    ContentType: contentType,
    CacheControl: cacheControl,
  }));

  return {
    objectKey,
    publicUrl: buildR2PublicUrl(objectKey, env),
  };
}
