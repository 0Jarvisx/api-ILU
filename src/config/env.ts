import 'dotenv/config';

interface Env {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CLIENT_ORIGIN: string;
  DATABASE_URL: string;
  COOKIE_MAX_AGE: number; // ms
  APP_URL: string;
  STORAGE_DRIVER: 'local' | 's3';
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
}

const env: Env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL as string,
  COOKIE_MAX_AGE: Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 días
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  STORAGE_DRIVER: (process.env.STORAGE_DRIVER as 'local' | 's3') || 'local',
  AWS_REGION: process.env.AWS_REGION || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
};

const required: (keyof Env)[] = ['JWT_SECRET', 'DATABASE_URL'];
for (const key of required) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default env;
