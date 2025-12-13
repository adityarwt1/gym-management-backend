import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /**
   * Verify and extract merchant from token
   */
  private async verifyTokenAndGetMerchant(token: string) {
    try {
      const decodedData = this.jwt.verify(token);

      if (new Date() > new Date(decodedData.exp * 1000)) {
        throw new UnauthorizedException('Token expired');
      }

      const merchant = await this.prisma.merchant.findUnique({
        where: { uid: decodedData.uid },
      });

      if (!merchant) {
        throw new BadRequestException('Merchant account not found');
      }

      return merchant;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * CREATE LEAD
   */
  async create(createLeadDto: CreateLeadDto) {
    try {
      // Verify token and get merchant
      const merchant = await this.verifyTokenAndGetMerchant(
        createLeadDto.token,
      );

      // Check for duplicate lead (same phone number for this merchant)
      const existingLead = await this.prisma.leads.findFirst({
        where: {
          phoneNumber: createLeadDto.phoneNumber,
          assignedToId: merchant.id,
        },
      });

      if (existingLead) {
        throw new ConflictException(
          `Lead with phone number ${createLeadDto.phoneNumber} already exists`,
        );
      }

      // Prepare notes data if provided
      const notesData = createLeadDto.notes?.length
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
          assignedToId: merchant.id, // Use merchant ID from token
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
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
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
    token: string;
    interestLevel?: string;
    followUpStatus?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      /// if query not exist
      if (!query) {
        throw new BadRequestException();
      }
      if (!query?.token) {
        throw new UnauthorizedException();
      }
      const page = query?.page || 1;
      const limit = query?.limit || 10;
      const skip = (page - 1) * limit;

      const where: Prisma.LeadsWhereInput = {};
      // getting merchant id
      if (!query?.token) {
        throw new BadRequestException();
      }

      const decoded = this.jwt.verify(query?.token as string);
      console.log(decoded);
      // get the merchant id
      const merchant = await this.prisma.merchant.findUnique({
        where: {
          uid: decoded.uid,
        },
        select: {
          id: true,
        },
      });
      console.log('merchant data', merchant);
      if (merchant?.id) {
        where.assignedToId = merchant.id as number;
      }

      if (query?.interestLevel) {
        where.interestLevel = query.interestLevel.toUpperCase() as any;
      }

      if (query?.followUpStatus) {
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
      // Verify token and get merchant
      const merchant = await this.jwt.verify(updateLeadDto.token as string);

      // Check if lead exists and belongs to this merchant
      const existingLead = await this.prisma.leads.findFirst({
        where: {
          id,
        },
        include: { notes: true },
      });

      if (!existingLead) {
        throw new NotFoundException(
          `Lead with ID ${id} not found or you don't have access to it`,
        );
      }

      // Check for duplicate phone number if updating
      if (
        updateLeadDto.phoneNumber &&
        updateLeadDto.phoneNumber !== existingLead.phoneNumber
      ) {
        const duplicate = await this.prisma.leads.findFirst({
          where: {
            phoneNumber: updateLeadDto.phoneNumber,
            assignedToId: merchant.id,
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
      if (updateLeadDto.notes && updateLeadDto.notes.length > 0) {
        notesOperation = {
          deleteMany: {},
          create: updateLeadDto.notes.map((note) => ({
            note: note.note,
            date: note.date ? new Date(note.date) : new Date(),
          })),
        };
      }

      // Prepare update data - only include fields that are provided
      const updateData: any = {};

      if (updateLeadDto.firstName !== undefined)
        updateData.firstName = updateLeadDto.firstName;
      if (updateLeadDto.lastName !== undefined)
        updateData.lastName = updateLeadDto.lastName;
      if (updateLeadDto.phoneNumber !== undefined)
        updateData.phoneNumber = updateLeadDto.phoneNumber;
      if (updateLeadDto.email !== undefined)
        updateData.email = updateLeadDto.email;
      if (updateLeadDto.gender !== undefined)
        updateData.gender = updateLeadDto.gender;
      if (updateLeadDto.dob !== undefined)
        updateData.dob = new Date(updateLeadDto.dob);
      if (updateLeadDto.height !== undefined)
        updateData.height = updateLeadDto.height;
      if (updateLeadDto.weight !== undefined)
        updateData.weight = updateLeadDto.weight;
      if (updateLeadDto.activityLevel !== undefined)
        updateData.activityLevel = updateLeadDto.activityLevel;
      if (updateLeadDto.wellnessGoal !== undefined)
        updateData.wellnessGoal = updateLeadDto.wellnessGoal;
      if (updateLeadDto.fitnessFocus !== undefined)
        updateData.fitnessFocus = updateLeadDto.fitnessFocus;
      if (updateLeadDto.preferredGymTime !== undefined)
        updateData.preferredGymTime = updateLeadDto.preferredGymTime;
      if (updateLeadDto.workoutIntensity !== undefined)
        updateData.workoutIntensity = updateLeadDto.workoutIntensity;
      if (updateLeadDto.medicalConcern !== undefined)
        updateData.medicalConcern = updateLeadDto.medicalConcern;
      if (updateLeadDto.previousGymExperience !== undefined)
        updateData.previousGymExperience = updateLeadDto.previousGymExperience;
      if (updateLeadDto.inquiryDate !== undefined)
        updateData.inquiryDate = new Date(updateLeadDto.inquiryDate);
      if (updateLeadDto.interestLevel !== undefined)
        updateData.interestLevel = updateLeadDto.interestLevel;
      if (updateLeadDto.followUpStatus !== undefined)
        updateData.followUpStatus = updateLeadDto.followUpStatus;
      if (updateLeadDto.preferredPackage !== undefined)
        updateData.preferredPackage = updateLeadDto.preferredPackage;
      if (updateLeadDto.preferredPTPackage !== undefined)
        updateData.preferredPTPackage = updateLeadDto.preferredPTPackage;
      if (updateLeadDto.heardFrom !== undefined)
        updateData.heardFrom = updateLeadDto.heardFrom;
      if (updateLeadDto.notes) updateData.notes = notesOperation;

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
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
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
