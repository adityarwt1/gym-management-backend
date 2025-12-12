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
} from './create-lead.dto';

// Re-export types for convenience
export type {
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
};

export class UpdateLeadDto {
  assignedToId?: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  gender?: Gender;
  dob?: Date;
  height?: number;
  weight?: number;
  activityLevel?: ActivityLevel;
  wellnessGoal?: WellnessGoal;
  fitnessFocus?: FitnessFocus;
  preferredGymTime?: PreferredGymTime;
  workoutIntensity?: WorkoutIntensity;
  medicalConcern?: MedicalConcern;
  previousGymExperience?: boolean;
  inquiryDate?: Date;
  interestLevel?: InterestLevel;
  followUpStatus?: FollowUpStatus;
  preferredPackage?: string;
  preferredPTPackage?: string;
  heardFrom?: HeardFrom;
}
