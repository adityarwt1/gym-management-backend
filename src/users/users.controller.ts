import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // Base route = /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users
  getMessage() {
    return this.usersService.getHello();
  }
}
