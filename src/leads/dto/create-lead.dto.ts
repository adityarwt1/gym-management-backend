import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Gender,
  ActivityLevel,
  WellnessGoal,
  FitnessFocus,
  PreferredGymTime,
  WorkoutIntensity,
  MedicalConcern,
  HeardFrom,
  InterestLevel,
  FollowUpStatus,
} from '../../generated/prisma/client';

class CreateLeadNoteDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsString()
  note: string;
}

export class CreateLeadDto {
  @IsOptional()
  @IsInt()
  assignedToId?: number;

  @IsString()
  token: string;
  // BASIC DETAILS
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{9,14}$/, {
    message: 'Phone number must be in format: +919876543210 (10-15 digits)',
  })
  phoneNumber: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  dob: string;

  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(300)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(500)
  weight?: number;

  // PREFERENCES
  @IsOptional()
  @IsEnum(ActivityLevel)
  activityLevel?: ActivityLevel;

  @IsOptional()
  @IsEnum(WellnessGoal)
  wellnessGoal?: WellnessGoal;

  @IsOptional()
  @IsEnum(FitnessFocus)
  fitnessFocus?: FitnessFocus;

  @IsOptional()
  @IsEnum(PreferredGymTime)
  preferredGymTime?: PreferredGymTime;

  @IsOptional()
  @IsEnum(WorkoutIntensity)
  workoutIntensity?: WorkoutIntensity;

  @IsOptional()
  @IsEnum(MedicalConcern)
  medicalConcern?: MedicalConcern;

  @IsOptional()
  @IsBoolean()
  previousGymExperience?: boolean;

  // STATUS
  @IsDateString()
  inquiryDate: string;

  @IsOptional()
  @IsEnum(InterestLevel)
  interestLevel?: InterestLevel;

  @IsOptional()
  @IsEnum(FollowUpStatus)
  followUpStatus?: FollowUpStatus;

  @IsOptional()
  @IsString()
  preferredPackage?: string;

  @IsOptional()
  @IsString()
  preferredPTPackage?: string;

  @IsOptional()
  @IsEnum(HeardFrom)
  heardFrom?: HeardFrom;

  // NOTES
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLeadNoteDto)
  notes?: CreateLeadNoteDto[];
}
