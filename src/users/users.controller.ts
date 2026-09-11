import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

type AuthenticatedRequest = Request & { user: { id: string } };

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.usersService.getBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(req.user.id, dto);
  }
}
