import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  displayName: string;

  @IsString()
  uid: string;

  @IsEmail()
  email: string;

  @IsString()
  photoURL: string;
}
