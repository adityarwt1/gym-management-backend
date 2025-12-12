import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: false,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
        issuer: 'WellVantage',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
