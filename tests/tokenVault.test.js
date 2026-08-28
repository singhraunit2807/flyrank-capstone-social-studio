import test from 'node:test';
import assert from 'node:assert/strict';
import { decryptToken, encryptToken, redactToken } from '../src/security/tokenVault.js';

const secret = 'test-secret-that-is-never-committed-as-a-real-secret';

test('encrypt/decrypt round trip preserves token', () => {
  const encrypted = encryptToken('super-secret-token', secret);
  assert.notEqual(encrypted, 'super-secret-token');
  assert.equal(decryptToken(encrypted, secret), 'super-secret-token');
});

test('encrypted token cannot be decrypted with another key', () => {
  const encrypted = encryptToken('super-secret-token', secret);
  assert.throws(() => decryptToken(encrypted, 'wrong-secret'));
});

test('token redaction never exposes the value', () => {
  assert.equal(redactToken('secret'), '[REDACTED]');
});
