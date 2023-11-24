import * as path from 'path';

export default () => ({
  database: {
    type: 'mysql',
    host: process.env.TYPEORM_HOST || '127.0.0.1',
    username: process.env.TYPEORM_USERNAME || 'root',
    password: process.env.TYPEORM_PASSWORD || '',
    database: process.env.TYPEORM_DATABASE || 'cleanclinic',
    port: parseInt(process.env.TYPEORM_PORT) || 3306,
    logging: process.env.TYPEORM_LOGGING === 'true',
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '../src/migrations/**/*{.ts,.js}')],
    // entities: ['dist/**/*.entity{.ts,.js}'],
    // migrations: ['src/migrations/**/*.ts'],
    // synchronize: process.env.TYPEORM_SYNCHRONIZE || 'false',
    synchronize: false,
    timezone: 'Z',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    ignoreTLS: process.env.MAIL_IGNORE_TLS,
    secure: process.env.MAIL_SECURE,
    user: process.env.MAIL_IGNORE_USER,
    pass: process.env.MAIL_IGNORE_PASS,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientId2: process.env.GOOGLE_CLIENT_ID2,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
  },
});
