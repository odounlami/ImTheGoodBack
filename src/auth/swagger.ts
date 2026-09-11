import { ApiProperty } from '@nestjs/swagger';

export class SignupSwaggerDto {
  @ApiProperty({ example: 'Jean Dupont' }) name!: string;
  @ApiProperty({ example: '+22997000000' }) whatsapp!: string;
  @ApiProperty({ example: 'Développeur web freelance', required: false }) bio?: string;
  @ApiProperty({ example: 'jean@example.com' }) email!: string;
  @ApiProperty({ example: 'motdepasse123' }) password!: string;
  @ApiProperty({ example: 'motdepasse123' }) confirmPassword!: string;
}
