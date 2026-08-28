import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';

function keyFromSecret(secret) {
  if (!secret) throw new Error('TOKEN_ENCRYPTION_KEY is required');
  return createHash('sha256').update(secret, 'utf8').digest();
}

export function encryptToken(token, secret = process.env.TOKEN_ENCRYPTION_KEY) {
  if (!token) throw new Error('token is required');
  const key = keyFromSecret(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${VERSION}.${iv.toString('base64url')}.${tag.toString('base64url')}.${ciphertext.toString('base64url')}`;
}

export function decryptToken(payload, secret = process.env.TOKEN_ENCRYPTION_KEY) {
  if (!payload) throw new Error('encrypted token is required');
  const [version, iv64, tag64, ciphertext64] = payload.split('.');
  if (version !== VERSION || !iv64 || !tag64 || !ciphertext64) throw new Error('invalid encrypted token');
  const decipher = createDecipheriv(ALGORITHM, keyFromSecret(secret), Buffer.from(iv64, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag64, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(ciphertext64, 'base64url')), decipher.final()]).toString('utf8');
}

export function redactToken(value) {
  if (!value) return value;
  return '[REDACTED]';
}
