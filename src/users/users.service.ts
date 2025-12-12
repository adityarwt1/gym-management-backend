import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getHello(): string {
    return 'Hello world.';
  }

  getHewllow2(): string {
    return 'Hellow wordld.';
  }
}
