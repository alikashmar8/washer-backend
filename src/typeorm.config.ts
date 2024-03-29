import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'mysql',
    host: process.env.TYPEORM_HOST || '127.0.0.1',
    username: process.env.TYPEORM_USERNAME || 'root',
    password: process.env.TYPEORM_PASSWORD || '',
    database: process.env.TYPEORM_DATABASE || 'washer_db',
    port: parseInt(process.env.TYPEORM_PORT) || 3306,
    logging: process.env.TYPEORM_LOGGING === 'true',
    // entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    // migrations: [path.join(__dirname, '../src/migrations/**/*{.ts,.js}')],
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/src/migrations/**/*.ts'],
    synchronize: false,
  });