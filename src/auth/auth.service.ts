import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Cette adresse e-mail est déjà utilisée.');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const slug = await this.generateUniqueSlug(dto.name);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name: dto.name.trim(),
        whatsapp: dto.whatsapp.trim(),
        bio: dto.bio.trim(),
        slug,
      },
    });

    return this.authResponse(user.id, user.email, user.slug);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('E-mail ou mot de passe incorrect.');
    return this.authResponse(user.id, user.email, user.slug);
  }

  private async authResponse(id: string, email: string, slug: string) {
    const accessToken = await this.jwt.signAsync({ sub: id, email });
    return { accessToken, user: { id, email, slug } };
  }

  private async generateUniqueSlug(name: string) {
    const base = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'profil';

    let slug = base;
    let suffix = 2;
    while (await this.prisma.user.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix++}`;
    }
    return slug;
  }
}
