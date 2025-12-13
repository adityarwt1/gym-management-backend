import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * CREATE USER
   */
  async create(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { uid: data.uid },
    });

    if (existing) {
      throw new ConflictException('User already exists.');
    }

    try {
      const user = await this.prisma.user.create({ data });

      const token = this.jwtService.sign(
        { uid: user.uid },
        {
          expiresIn: '7d',
          issuer: 'WellVantage',
        },
      );

      return {
        success: true,
        token,
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  /**
   * GET USER BY UID
   */
  async findOne(uid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      success: true,
      user,
    };
  }

  /**
   * UPDATE USER
   */
  async update(uid: string, data: UpdateUserDto) {
    await this.ensureUserExists(uid);

    const updated = await this.prisma.user.update({
      where: { uid },
      data,
    });

    return {
      success: true,
      user: updated,
    };
  }

  /**
   * DELETE USER
   */
  async remove(uid: string) {
    await this.ensureUserExists(uid);

    await this.prisma.user.delete({
      where: { uid },
    });

    return {
      success: true,
      message: 'User deleted successfully.',
    };
  }

  async verify(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      if (!decoded) {
        throw new BadRequestException('Invalid token');
      }

      if (new Date() > new Date(decoded.exp * 1000)) {
        throw new UnauthorizedException();
      }
      const response = {
        success: true,
        user: decoded,
      };
      return response;
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  /**
   * SHARED HELPER
   */
  private async ensureUserExists(uid: string) {
    const user = await this.prisma.user.findUnique({ where: { uid } });
    if (!user) throw new NotFoundException('User not found.');
  }
}
