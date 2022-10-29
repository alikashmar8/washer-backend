import * as path from 'path';

export default () => ({
  database: {
    type: 'mysql',
    host: process.env.TYPEORM_HOST || 'mysql',
    username: process.env.TYPEORM_USERNAME || 'prowess',
    password: process.env.TYPEORM_PASSWORD || 'P@ssw0rd',
    database: process.env.TYPEORM_DATABASE || 'prowess_db',
    port: parseInt(process.env.TYPEORM_PORT) || 3306,
    logging: process.env.TYPEORM_LOGGING === 'true',
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '../src/migrations/**/*{.ts,.js}')],
    // entities: ['dist/**/*.entity{.ts,.js}'],
    // migrations: ['src/migrations/**/*.ts'],
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  },
});

