import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import prisma from 'lib/prisma';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getOne() {
    return this.usersService.getHello();
  }

  @Get('test')
  getSecond() {
    return this.usersService.getHewllow2();
  }

  @Post()
  storeUserInfo(): string {
    return '';
  }
}
