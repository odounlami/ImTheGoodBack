import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
            author: { select: { name: true } },
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
      id: user.id,
      name: user.name,
      bio: user.bio,
      whatsapp: user.whatsapp,
      slug: user.slug,
      createdAt: user.createdAt,
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count._all,
      reviews: user.receivedReviews.map((review) => ({
        id: review.id,
        authorName: review.author.name,
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt,
      })),
    };
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const emailChanged = dto.email !== undefined && dto.email.trim().toLowerCase() !== user.email;

    if (emailChanged) {
      if (!dto.currentPassword) {
        throw new UnauthorizedException('Le mot de passe actuel est requis pour modifier l’adresse e-mail.');
      }

      const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Mot de passe actuel incorrect.');
      }

      const email = dto.email.trim().toLowerCase();
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Cette adresse e-mail est déjà utilisée.');
      }
    }

    const email = dto.email?.trim().toLowerCase();

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.email !== undefined ? { email } : {}),
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
