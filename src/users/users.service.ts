import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getBySlug(slug: string) {
    const user = await this.prisma.user.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        bio: true,
        whatsapp: true,
        slug: true,
        createdAt: true,
        receivedReviews: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            author: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Profil introuvable.');

    const aggregate = await this.prisma.review.aggregate({
      where: { targetId: user.id },
      _avg: { rating: true },
      _count: { _all: true },
    });

    return {
      ...user,
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count._all,
      reviews: user.receivedReviews,
    };
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.whatsapp !== undefined ? { whatsapp: dto.whatsapp.trim() } : {}),
        ...(dto.bio !== undefined ? { bio: dto.bio.trim() } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        whatsapp: true,
        bio: true,
        slug: true,
        createdAt: true,
      },
    });
  }
}
