const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL || 'sqlite://./data/social-studio.db';
const FAKE_PLATFORM_URL = process.env.FAKE_PLATFORM_URL || 'http://localhost:4000';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'dev-webhook-secret-change-me';
const TOKEN_ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'dev-encryption-key-change-me';

module.exports = { PORT, DATABASE_URL, FAKE_PLATFORM_URL, WEBHOOK_SECRET, TOKEN_ENCRYPTION_KEY };
