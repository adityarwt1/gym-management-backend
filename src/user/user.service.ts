import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import prisma from 'lib/prisma';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class RegisterService {
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
      id: user.uid,
    };
    try {
      const token = jwt.sign(tokenPayLoad, process.env.JWT_SECRET as string, {
        expiresIn: '7d', // for sevel day validate,
        issuer: 'WellVanteg',
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

  findOne(id: number) {
    return `This action returns a #${id} register`;
  }

  update(id: number, updateRegisterDto: UpdateUserDto) {
    return `This action updates a #${id} register`;
  }

  remove(id: number) {
    return `This action removes a #${id} register`;
  }
}
