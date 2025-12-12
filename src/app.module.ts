import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MerchantModule } from './merchant/merchant.module';
import { LeadsModule } from './leads/leads.module';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
    }),
    PrismaModule,
    UserModule,
    MerchantModule,
    LeadsModule,
    UserModule,
    UserModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
