import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: string, dto: CreateReviewDto) {
    if (authorId === dto.targetId) {
      throw new BadRequestException('Vous ne pouvez pas publier un avis sur votre propre profil.');
    }

    const target = await this.prisma.user.findUnique({ where: { id: dto.targetId } });
    if (!target) throw new NotFoundException('Profil cible introuvable.');

    return this.prisma.review.create({
      data: {
        authorId,
        targetId: dto.targetId,
        rating: dto.rating,
        comment: dto.comment?.trim() || null,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        author: { select: { id: true, name: true, slug: true } },
      },
    });
  }
}
