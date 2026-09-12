import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt({ message: 'La note doit être un nombre entier.' })
  @Min(1, { message: 'La note doit être au minimum de 1.' })
  @Max(5, { message: 'La note doit être au maximum de 5.' })
  rating!: number;

  @ApiProperty({ example: 'Très bonne expérience.', required: false, maxLength: 1000 })
  @IsOptional()
  @IsString({ message: 'Le commentaire doit être une chaîne de caractères.' })
  @MaxLength(1000, { message: 'Le commentaire ne doit pas dépasser 1000 caractères.' })
  comment?: string;
}
