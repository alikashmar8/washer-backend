import { VehicleType } from "./enums/vehicle-type.enum";

export const BCRYPT_SALT: string = '10';
export const JWT_SECRET: string = 'PROWESS_SECRET';
export const JWT_USERS_EXPIRY_TIME: string = '30d';

// at least 1 char & 1 num
export const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;


// settings keys
export const EXCHANGE_RATE = 'EXCHANGE_RATE';
export const CAR_COST =  VehicleType.CAR+'_COST';
export const RANGE_COST =  VehicleType.RANGE+'_COST';
export const TRUCK_COST =  VehicleType.TRUCK+'_COST';
export const VAN_COST =  VehicleType.VAN+'_COST';
export const MOTORCYCLE_COST =  VehicleType.MOTORCYCLE+'_COST';
export const POINTS_PER_ORDER_PERCENTAGE =  'POINTS_PER_ORDER_PERCENTAGE';