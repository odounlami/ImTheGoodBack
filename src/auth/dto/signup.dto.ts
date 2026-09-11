import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Jean Dupont' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '+22997000000' })
  @IsString()
  @IsNotEmpty()
  whatsapp!: string;

  @ApiProperty({ example: 'Développeur web freelance' })
  @IsString()
  @IsNotEmpty()
  bio!: string;

  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'motdepasse123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'motdepasse123', minLength: 8 })
  @IsString()
  @MinLength(8)
  confirmPassword!: string;
}
