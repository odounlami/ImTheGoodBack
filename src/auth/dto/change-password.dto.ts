import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'ancienmotdepasse' })
  @IsString({ message: 'Le mot de passe actuel doit être une chaîne de caractères.' })
  currentPassword!: string;

  @ApiProperty({ example: 'nouveaumotdepasse', minLength: 8 })
  @IsString({ message: 'Le nouveau mot de passe doit être une chaîne de caractères.' })
  @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' })
  newPassword!: string;
}
