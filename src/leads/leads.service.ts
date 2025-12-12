import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE LEAD
   */
  async create(createLeadDto: CreateLeadDto) {
    const { assignedToId, phoneNumber, email, ...rest } = createLeadDto;

    // 1. Validate duplicate phone number
    const existingLead = await this.prisma.leads.findFirst({
      where: { phoneNumber },
    });

    if (existingLead) {
      throw new ConflictException(
        'A lead already exists with this phone number.',
      );
    }

    // 2. Validate assigned merchant (if provided)
    if (assignedToId) {
      const merchant = await this.prisma.merchant.findUnique({
        where: { id: assignedToId },
      });

      if (!merchant) {
        throw new BadRequestException('Assigned merchant does not exist.');
      }
    }

    // 3. Create lead
    const createdLead = await this.prisma.leads.create({
      data: {
        ...rest,
        phoneNumber,
        email,
        assignedTo: assignedToId
          ? { connect: { id: assignedToId } }
          : undefined,
      },
      include: {
        assignedTo: true,
        notes: true,
      },
    });

    return {
      success: true,
      message: 'Lead created successfully.',
      lead: createdLead,
    };
  }

  /**
   * GET ALL LEADS
   */
  async findAll() {
    return this.prisma.leads.findMany({
      include: {
        assignedTo: true,
        notes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * GET SINGLE LEAD
   */
  async findOne(id: number) {
    const lead = await this.prisma.leads.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        notes: { orderBy: { date: 'desc' } },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  /**
   * UPDATE LEAD
   */
  async update(id: number, updateLeadDto: UpdateLeadDto) {
    // Ensure lead exists
    const existingLead = await this.findOne(id);

    const { assignedToId, phoneNumber, ...rest } = updateLeadDto;

    // 1. Validate new phone number (if changed)
    if (phoneNumber && phoneNumber !== existingLead.phoneNumber) {
      const conflict = await this.prisma.leads.findFirst({
        where: {
          phoneNumber,
          id: { not: id }, // exclude current lead
        },
      });

      if (conflict) {
        throw new ConflictException(
          'Another lead already uses this phone number.',
        );
      }
    }

    // 2. Validate assigned merchant on update
    let assignedData:
      | Prisma.MerchantUpdateOneWithoutLeadsNestedInput
      | undefined = undefined;

    if (assignedToId) {
      const merchant = await this.prisma.merchant.findUnique({
        where: { id: assignedToId },
      });

      if (!merchant) {
        throw new BadRequestException('Assigned merchant does not exist.');
      }

      assignedData = { connect: { id: assignedToId } };
    } else if (assignedToId === null) {
      assignedData = { disconnect: true };
    }

    // 3. Update lead
    const updatedLead = await this.prisma.leads.update({
      where: { id },
      data: {
        ...rest,
        phoneNumber,
        assignedTo: assignedData,
      },
      include: {
        assignedTo: true,
        notes: true,
      },
    });

    return {
      success: true,
      message: 'Lead updated successfully.',
      lead: updatedLead,
    };
  }

  /**
   * DELETE LEAD
   */
  async remove(id: number) {
    await this.findOne(id);

    const deleted = await this.prisma.leads.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Lead deleted successfully.',
      lead: deleted,
    };
  }
}
