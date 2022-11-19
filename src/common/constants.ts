export const BCRYPT_SALT: string = '10';
export const JWT_SECRET: string = 'PROWESS_SECRET';
export const JWT_USERS_EXPIRY_TIME: string = '30d';

// at least 1 char & 1 num
export const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

export const loadingGifUrl = 'assets/gifs/loading.gif';
