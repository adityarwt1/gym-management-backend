import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto) {
    return this.prisma.leads.create({
      data: {
        ...createLeadDto,
        assignedTo: createLeadDto.assignedToId
          ? { connect: { id: createLeadDto.assignedToId } }
          : undefined,
        assignedToId: undefined,
      } as Prisma.LeadsCreateInput,
      include: {
        assignedTo: true,
        notes: true,
      },
    });
  }

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

  async findOne(id: number) {
    const lead = await this.prisma.leads.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        notes: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    // Check if lead exists
    await this.findOne(id);

    const { assignedToId, ...rest } = updateLeadDto;

    return this.prisma.leads.update({
      where: { id },
      data: {
        ...rest,
        assignedTo: assignedToId
          ? { connect: { id: assignedToId } }
          : assignedToId === null
            ? { disconnect: true }
            : undefined,
      } as Prisma.LeadsUpdateInput,
      include: {
        assignedTo: true,
        notes: true,
      },
    });
  }

  async remove(id: number) {
    // Check if lead exists
    await this.findOne(id);

    return this.prisma.leads.delete({
      where: { id },
    });
  }
}
