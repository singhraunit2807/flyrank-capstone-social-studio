export const PORT = Number(process.env.PORT || 3000);
export const DATABASE_URL = process.env.DATABASE_URL || 'sqlite://./data/social-studio.db';
export const FAKE_PLATFORM_URL = process.env.FAKE_PLATFORM_URL || 'http://localhost:4000';
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'dev-webhook-secret-change-me';
export const TOKEN_ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'dev-encryption-key-change-me';
export const DEFAULT_FAKE_ACCESS_TOKEN = process.env.DEFAULT_FAKE_ACCESS_TOKEN || 'dev-fake-access-token';
