import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string) {
    return this.userService.findOne(uid);
  }

  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(uid, dto);
  }

  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.userService.remove(uid);
  }
}
