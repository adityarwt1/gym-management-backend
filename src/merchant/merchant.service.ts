import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class MerchantService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MerchantCreateInput) {
    return this.prisma.merchant.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.merchant.findMany({
      include: {
        leads: true,
      },
    });
  }

  async findOne(id: number) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        leads: true,
      },
    });

    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }

    return merchant;
  }

  async update(id: number, data: Prisma.MerchantUpdateInput) {
    // Check if merchant exists
    await this.findOne(id);

    return this.prisma.merchant.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    // Check if merchant exists
    await this.findOne(id);

    return this.prisma.merchant.delete({
      where: { id },
    });
  }
}
