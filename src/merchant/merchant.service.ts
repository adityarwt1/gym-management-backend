import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class MerchantService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE MERCHANT
   */
  async create(data: Prisma.MerchantCreateInput) {
    // 1. Check if merchant already exists by phone
    const existingMerchant = await this.prisma.merchant.findFirst({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    if (existingMerchant) {
      throw new ConflictException(
        'A merchant already exists with this phone number.',
      );
    }

    // 2. Create merchant
    const createdMerchant = await this.prisma.merchant.create({
      data,
    });

    return {
      success: true,
      message: 'Merchant created successfully.',
      merchant: createdMerchant,
    };
  }

  /**
   * GET ALL MERCHANTS
   */
  async findAll() {
    const merchants = await this.prisma.merchant.findMany({
      include: {
        leads: true,
      },
    });
    return {
      success: true,
      merchants,
    };
  }

  /**
   * GET ONE MERCHANT BY ID
   */
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

    return {
      success: true,
      merchant,
    };
  }

  /**
   * UPDATE MERCHANT
   */
  async update(id: number, data: Prisma.MerchantUpdateInput) {
    // 1. Ensure merchant exists
    await this.findOne(id);

    // 2. If phoneNumber is being updated → check duplicates
    if (data.phoneNumber) {
      const phoneExists = await this.prisma.merchant.findFirst({
        where: {
          phoneNumber: data.phoneNumber as string,
          id: { not: id }, // ensure not the same merchant
        },
      });

      if (phoneExists) {
        throw new ConflictException(
          'Another merchant already uses this phone number.',
        );
      }
    }

    // 3. Update merchant
    const updatedMerchant = await this.prisma.merchant.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: 'Merchant updated successfully.',
      merchant: updatedMerchant,
    };
  }

  /**
   * DELETE MERCHANT
   */
  async remove(id: number) {
    await this.findOne(id); // ensures merchant exists first

    const deleted = await this.prisma.merchant.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Merchant deleted successfully.',
      merchant: deleted,
    };
  }
}
