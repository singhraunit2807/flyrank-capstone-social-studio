const crypto = require('crypto');

function keyFromSecret(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptToken(token, secret) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFromSecret(secret), iv);
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((b) => b.toString('base64')).join('.');
}

function decryptToken(value, secret) {
  const [ivB64, tagB64, dataB64] = value.split('.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyFromSecret(secret), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf8');
}

module.exports = { encryptToken, decryptToken };
