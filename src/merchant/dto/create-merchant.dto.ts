import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMerchantDto {
  @IsString()
  @IsNotEmpty()
  gymName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  uid: string;
}
