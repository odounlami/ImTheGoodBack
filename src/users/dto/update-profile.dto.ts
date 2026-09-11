import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Jean Dupont', required: false, minLength: 2, maxLength: 120 })
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères.' })
  @MaxLength(120, { message: 'Le nom ne doit pas dépasser 120 caractères.' })
  name?: string;

  @ApiProperty({ example: '+22997000000', required: false, maxLength: 30 })
  @IsOptional()
  @IsString({ message: 'Le numéro WhatsApp doit être une chaîne de caractères.' })
  @MaxLength(30, { message: 'Le numéro WhatsApp ne doit pas dépasser 30 caractères.' })
  whatsapp?: string;

  @ApiProperty({ example: 'Développeur web freelance', required: false, maxLength: 500 })
  @IsOptional()
  @IsString({ message: 'La biographie doit être une chaîne de caractères.' })
  @MaxLength(500, { message: 'La biographie ne doit pas dépasser 500 caractères.' })
  bio?: string;

  @ApiProperty({ example: 'jean@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Adresse email invalide.' })
  email?: string;

  @ApiProperty({ example: 'motdepasse123', required: false, minLength: 8 })
  @IsOptional()
  @IsString({ message: 'Le mot de passe actuel doit être une chaîne de caractères.' })
  currentPassword?: string;
}
