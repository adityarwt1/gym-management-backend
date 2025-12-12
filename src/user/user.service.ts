import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import prisma from 'lib/prisma';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  async create(data: CreateUserDto) {
    // field validation for the register
    if (!data.displayName || !data.email || !data.photoURL || !data.uid) {
      throw new BadRequestException('Field not provided properly!');
    }
    const user = await prisma.user.create({ data });

    // if by chance failed to conenction
    if (!user) {
      throw new InternalServerErrorException('Failed to create user.');
    }

    // creting token payload
    const tokenPayLoad = {
      uid: user.uid,
    };
    try {
      const token = jwt.sign(tokenPayLoad, process.env.JWT_SECRET as string, {
        expiresIn: '7d', // for sevel day validate,
        issuer: 'WellVantege',
      });
      const response = {
        success: true,
        token,
      };
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create token.', {
        description: 'maybe jwt secret not provided properly.',
      });
    }
    /// final valur for the
  }

  async findOne(uid: string) {
    const user = await prisma.user.findUnique({
      where: {
        uid,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const response = {
      succuss: true,
      user,
    };
    return response;
  }

  async update(uid: string, data: UpdateUserDto) {
    const user = await prisma.user.findUnique({
      where: {
        uid,
      },
    });
    // if not found
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const upadteUser = await prisma.user.update({
      where: {
        uid,
      },
      data,
    });

    if (!upadteUser) {
      throw new InternalServerErrorException('Failed to update user.');
    }
    const response = {
      succees: true,
      user: upadteUser,
    };
    return response;
  }

  async remove(uid: string) {
    const user = await prisma.user.findUnique({
      where: {
        uid,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await prisma.user.delete({
      where: {
        uid,
      },
    });

    const response = {
      succuss: true,
      message: 'user deleted successfully.',
    };
    return response;
  }
}
