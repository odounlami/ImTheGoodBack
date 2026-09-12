import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(authorId: string, targetId: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        authorId_targetId: {
          authorId,
          targetId,
        },
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    return { review };
  }

  async create(authorId: string, dto: CreateReviewDto) {
    if (authorId === dto.targetId) {
      throw new BadRequestException('Vous ne pouvez pas publier un avis sur votre propre profil.');
    }

    const target = await this.prisma.user.findUnique({ where: { id: dto.targetId } });
    if (!target) throw new NotFoundException('Profil cible introuvable.');

    const existing = await this.prisma.review.findUnique({
      where: {
        authorId_targetId: {
          authorId,
          targetId: dto.targetId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Vous avez déjà publié un avis sur ce profil. Vous pouvez modifier votre avis existant.');
    }

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

  async update(authorId: string, reviewId: string, dto: Pick<CreateReviewDto, 'rating' | 'comment'>) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, authorId: true },
    });

    if (!review) throw new NotFoundException('Avis introuvable.');
    if (review.authorId !== authorId) {
      throw new BadRequestException('Vous ne pouvez modifier que votre propre avis.');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
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
