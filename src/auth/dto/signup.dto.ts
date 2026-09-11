import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Jean Dupont' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le nom est obligatoire.' })
  name!: string;

  @ApiProperty({ example: '+22997000000', required: false })
  @IsOptional()
  @IsString({ message: 'Le numéro WhatsApp doit être une chaîne de caractères.' })
  whatsapp?: string;

  @ApiProperty({ example: 'Développeur web freelance', required: false })
  @IsOptional()
  @IsString({ message: 'La biographie doit être une chaîne de caractères.' })
  bio?: string;

  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail({}, { message: 'Adresse email invalide.' })
  email!: string;

  @ApiProperty({ example: 'motdepasse123', minLength: 8 })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  password!: string;

  @ApiProperty({ example: 'motdepasse123', minLength: 8 })
  @IsString({ message: 'La confirmation du mot de passe doit être une chaîne de caractères.' })
  @MinLength(8, { message: 'La confirmation du mot de passe doit contenir au moins 8 caractères.' })
  confirmPassword!: string;
}
