import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  // id: number;
  @IsString()
  displayName: string;

  @IsString()
  uid: string;

  @IsEmail()
  email: string;

  @IsString()
  photoURL: string;
}
