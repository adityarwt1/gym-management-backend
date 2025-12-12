import { $Enums } from '../../generated/prisma/client.js';

// Re-export Prisma enums for convenience
export type Gender = $Enums.Gender;
export type ActivityLevel = $Enums.ActivityLevel;
export type WellnessGoal = $Enums.WellnessGoal;
export type FitnessFocus = $Enums.FitnessFocus;
export type PreferredGymTime = $Enums.PreferredGymTime;
export type WorkoutIntensity = $Enums.WorkoutIntensity;
export type MedicalConcern = $Enums.MedicalConcern;
export type HeardFrom = $Enums.HeardFrom;
export type InterestLevel = $Enums.InterestLevel;
export type FollowUpStatus = $Enums.FollowUpStatus;

// Export enum values for validation
export const Gender = $Enums.Gender;
export const ActivityLevel = $Enums.ActivityLevel;
export const WellnessGoal = $Enums.WellnessGoal;
export const FitnessFocus = $Enums.FitnessFocus;
export const PreferredGymTime = $Enums.PreferredGymTime;
export const WorkoutIntensity = $Enums.WorkoutIntensity;
export const MedicalConcern = $Enums.MedicalConcern;
export const HeardFrom = $Enums.HeardFrom;
export const InterestLevel = $Enums.InterestLevel;
export const FollowUpStatus = $Enums.FollowUpStatus;

export class CreateLeadDto {
  assignedToId?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  gender: Gender;
  dob: Date;
  height?: number;
  weight?: number;
  activityLevel?: ActivityLevel;
  wellnessGoal?: WellnessGoal;
  fitnessFocus?: FitnessFocus;
  preferredGymTime?: PreferredGymTime;
  workoutIntensity?: WorkoutIntensity;
  medicalConcern?: MedicalConcern;
  previousGymExperience?: boolean;
  inquiryDate: Date;
  interestLevel?: InterestLevel;
  followUpStatus?: FollowUpStatus;
  preferredPackage?: string;
  preferredPTPackage?: string;
  heardFrom?: HeardFrom;
}
