import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}