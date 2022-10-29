export const BCRYPT_SALT: string = '10';
export const CRYPTO_SECRET: string = 'PROWESS_ENCRYPTION_SECRET';
export const CRYPTO_KEY:Buffer = Buffer.from(CRYPTO_SECRET, 'hex');
export const CRYPTO_IV = Buffer.from('prowess', 'hex');


//  (await promisify(scrypt)(CRYPTO_SECRET, BCRYPT_SALT, 32)) as Buffer;

export const JWT_SECRET: string = 'PROWESS_SECRET';
export const JWT_SUPER_ADMIN_EXPIRY_TIME: string = '1h';
export const JWT_USERS_EXPIRY_TIME: string = '30d';

