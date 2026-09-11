import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail({}, { message: 'Adresse email invalide.' })
  email!: string;

  @ApiProperty({ example: 'motdepasse123', minLength: 8 })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  password!: string;
}
