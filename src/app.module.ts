import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MerchantModule } from './merchant/merchant.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [PrismaModule, UsersModule, MerchantModule, LeadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
