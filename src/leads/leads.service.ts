import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE LEAD
   */
  async create(createLeadDto: CreateLeadDto) {
    try {
      // Check if merchant exists if assignedToId is provided
      if (createLeadDto.assignedToId) {
        const merchant = await this.prisma.merchant.findUnique({
          where: { id: createLeadDto.assignedToId },
        });
        if (!merchant) {
          throw new BadRequestException(
            `Merchant with ID ${createLeadDto.assignedToId} not found`,
          );
        }
      }

      // Check for duplicate lead (same phone number)
      const existingLead = await this.prisma.leads.findFirst({
        where: { phoneNumber: createLeadDto.phoneNumber },
      });

      if (existingLead) {
        throw new ConflictException(
          `Lead with phone number ${createLeadDto.phoneNumber} already exists`,
        );
      }

      // Prepare notes data if provided
      const notesData = createLeadDto.notes
        ? {
            create: createLeadDto.notes.map((note) => ({
              note: note.note,
              date: note.date ? new Date(note.date) : new Date(),
            })),
          }
        : undefined;

      // Create lead with notes
      const lead = await this.prisma.leads.create({
        data: {
          firstName: createLeadDto.firstName,
          lastName: createLeadDto.lastName,
          phoneNumber: createLeadDto.phoneNumber,
          email: createLeadDto.email,
          gender: createLeadDto.gender,
          dob: new Date(createLeadDto.dob),
          height: createLeadDto.height,
          weight: createLeadDto.weight,
          activityLevel: createLeadDto.activityLevel,
          wellnessGoal: createLeadDto.wellnessGoal,
          fitnessFocus: createLeadDto.fitnessFocus,
          preferredGymTime: createLeadDto.preferredGymTime,
          workoutIntensity: createLeadDto.workoutIntensity,
          medicalConcern: createLeadDto.medicalConcern,
          previousGymExperience: createLeadDto.previousGymExperience ?? false,
          inquiryDate: new Date(createLeadDto.inquiryDate),
          interestLevel: createLeadDto.interestLevel,
          followUpStatus: createLeadDto.followUpStatus,
          preferredPackage: createLeadDto.preferredPackage,
          preferredPTPackage: createLeadDto.preferredPTPackage,
          heardFrom: createLeadDto.heardFrom,
          assignedToId: createLeadDto.assignedToId,
          notes: notesData,
        },
        include: {
          notes: true,
          assignedTo: {
            select: {
              id: true,
              gymName: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Lead created successfully',
        data: lead,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create lead: ' + error.message);
    }
  }

  /**
   * FIND ALL LEADS
   */
  async findAll(query?: {
    assignedToId?: number;
    interestLevel?: string;
    followUpStatus?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 10;
      const skip = (page - 1) * limit;

      const where: Prisma.LeadsWhereInput = {};

      if (query?.assignedToId) {
        where.assignedToId = query.assignedToId;
      }

      if (query?.interestLevel) {
        // Convert to uppercase to match enum values
        where.interestLevel = query.interestLevel.toUpperCase() as any;
      }

      if (query?.followUpStatus) {
        // Convert to uppercase to match enum values
        where.followUpStatus = query.followUpStatus.toUpperCase() as any;
      }

      const [leads, total] = await Promise.all([
        this.prisma.leads.findMany({
          where,
          skip,
          take: limit,
          include: {
            notes: {
              orderBy: {
                date: 'desc',
              },
            },
            assignedTo: {
              select: {
                id: true,
                gymName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.leads.count({ where }),
      ]);

      return {
        success: true,
        data: leads,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch leads: ' + error.message);
    }
  }

  /**
   * FIND ONE LEAD
   */
  async findOne(id: number) {
    try {
      const lead = await this.prisma.leads.findUnique({
        where: { id },
        include: {
          notes: {
            orderBy: {
              date: 'desc',
            },
          },
          assignedTo: {
            select: {
              id: true,
              gymName: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
      });

      if (!lead) {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }

      return {
        success: true,
        data: lead,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch lead: ' + error.message);
    }
  }

  /**
   * UPDATE LEAD
   */
  async update(id: number, updateLeadDto: UpdateLeadDto) {
    try {
      // Check if lead exists
      const existingLead = await this.prisma.leads.findUnique({
        where: { id },
        include: { notes: true },
      });

      if (!existingLead) {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }

      // Check if merchant exists if assignedToId is being updated
      if (updateLeadDto.assignedToId !== undefined) {
        if (updateLeadDto.assignedToId !== null) {
          const merchant = await this.prisma.merchant.findUnique({
            where: { id: updateLeadDto.assignedToId },
          });
          if (!merchant) {
            throw new BadRequestException(
              `Merchant with ID ${updateLeadDto.assignedToId} not found`,
            );
          }
        }
      }

      // Check for duplicate phone number if updating
      if (
        updateLeadDto.phoneNumber &&
        updateLeadDto.phoneNumber !== existingLead.phoneNumber
      ) {
        const duplicate = await this.prisma.leads.findFirst({
          where: {
            phoneNumber: updateLeadDto.phoneNumber,
            NOT: { id },
          },
        });
        if (duplicate) {
          throw new ConflictException(
            `Lead with phone number ${updateLeadDto.phoneNumber} already exists`,
          );
        }
      }

      // Handle notes update
      let notesOperation = {};
      if (updateLeadDto.notes) {
        // Delete existing notes and create new ones
        notesOperation = {
          deleteMany: {},
          create: updateLeadDto.notes.map((note) => ({
            note: note.note,
            date: note.date ? new Date(note.date) : new Date(),
          })),
        };
      }

      // Prepare update data
      const updateData: any = {
        ...(updateLeadDto.firstName && { firstName: updateLeadDto.firstName }),
        ...(updateLeadDto.lastName && { lastName: updateLeadDto.lastName }),
        ...(updateLeadDto.phoneNumber && {
          phoneNumber: updateLeadDto.phoneNumber,
        }),
        ...(updateLeadDto.email !== undefined && {
          email: updateLeadDto.email,
        }),
        ...(updateLeadDto.gender && { gender: updateLeadDto.gender }),
        ...(updateLeadDto.dob && { dob: new Date(updateLeadDto.dob) }),
        ...(updateLeadDto.height !== undefined && {
          height: updateLeadDto.height,
        }),
        ...(updateLeadDto.weight !== undefined && {
          weight: updateLeadDto.weight,
        }),
        ...(updateLeadDto.activityLevel && {
          activityLevel: updateLeadDto.activityLevel,
        }),
        ...(updateLeadDto.wellnessGoal && {
          wellnessGoal: updateLeadDto.wellnessGoal,
        }),
        ...(updateLeadDto.fitnessFocus && {
          fitnessFocus: updateLeadDto.fitnessFocus,
        }),
        ...(updateLeadDto.preferredGymTime && {
          preferredGymTime: updateLeadDto.preferredGymTime,
        }),
        ...(updateLeadDto.workoutIntensity && {
          workoutIntensity: updateLeadDto.workoutIntensity,
        }),
        ...(updateLeadDto.medicalConcern && {
          medicalConcern: updateLeadDto.medicalConcern,
        }),
        ...(updateLeadDto.previousGymExperience !== undefined && {
          previousGymExperience: updateLeadDto.previousGymExperience,
        }),
        ...(updateLeadDto.inquiryDate && {
          inquiryDate: new Date(updateLeadDto.inquiryDate),
        }),
        ...(updateLeadDto.interestLevel && {
          interestLevel: updateLeadDto.interestLevel,
        }),
        ...(updateLeadDto.followUpStatus && {
          followUpStatus: updateLeadDto.followUpStatus,
        }),
        ...(updateLeadDto.preferredPackage !== undefined && {
          preferredPackage: updateLeadDto.preferredPackage,
        }),
        ...(updateLeadDto.preferredPTPackage !== undefined && {
          preferredPTPackage: updateLeadDto.preferredPTPackage,
        }),
        ...(updateLeadDto.heardFrom && { heardFrom: updateLeadDto.heardFrom }),
        ...(updateLeadDto.assignedToId !== undefined && {
          assignedToId: updateLeadDto.assignedToId,
        }),
        ...(updateLeadDto.notes && { notes: notesOperation }),
      };

      const updatedLead = await this.prisma.leads.update({
        where: { id },
        data: updateData,
        include: {
          notes: {
            orderBy: {
              date: 'desc',
            },
          },
          assignedTo: {
            select: {
              id: true,
              gymName: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Lead updated successfully',
        data: updatedLead,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update lead: ' + error.message);
    }
  }

  /**
   * REMOVE LEAD
   */
  async remove(id: number) {
    try {
      const lead = await this.prisma.leads.findUnique({
        where: { id },
      });

      if (!lead) {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }

      await this.prisma.leads.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Lead deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete lead: ' + error.message);
    }
  }

  /**
   * ADD NOTE TO LEAD
   */
  async addNote(leadId: number, note: string, date?: string) {
    try {
      const lead = await this.prisma.leads.findUnique({
        where: { id: leadId },
      });

      if (!lead) {
        throw new NotFoundException(`Lead with ID ${leadId} not found`);
      }

      const newNote = await this.prisma.leadNote.create({
        data: {
          note,
          date: date ? new Date(date) : new Date(),
          leadId,
        },
      });

      return {
        success: true,
        message: 'Note added successfully',
        data: newNote,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to add note: ' + error.message);
    }
  }
}
