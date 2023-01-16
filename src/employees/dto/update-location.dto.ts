import { IsNumber } from 'class-validator';
export class UpdateLocationDto {
    @IsNumber()
    readonly latitude: number;

    @IsNumber()
    readonly longitude: number;
}