export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const ActivityLevel = {
  SEDENTARY: 'SEDENTARY',
  LIGHTLY_ACTIVE: 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE: 'MODERATELY_ACTIVE',
  VERY_ACTIVE: 'VERY_ACTIVE',
} as const;

export type ActivityLevel = (typeof ActivityLevel)[keyof typeof ActivityLevel];

export const WellnessGoal = {
  LOSE_WEIGHT: 'LOSE_WEIGHT',
  GAIN_WEIGHT: 'GAIN_WEIGHT',
  BUILD_MUSCLE: 'BUILD_MUSCLE',
  MODIFY_DIET: 'MODIFY_DIET',
  MANAGE_STRESS: 'MANAGE_STRESS',
  IMPROVE_STEP_COUNT: 'IMPROVE_STEP_COUNT',
  GENERAL_WELLNESS: 'GENERAL_WELLNESS',
} as const;

export type WellnessGoal = (typeof WellnessGoal)[keyof typeof WellnessGoal];

export const FitnessFocus = {
  GYM_WORKOUT: 'GYM_WORKOUT',
  YOGA: 'YOGA',
  MEDITATION: 'MEDITATION',
  NUTRITION: 'NUTRITION',
  RECOVERY: 'RECOVERY',
} as const;

export type FitnessFocus = (typeof FitnessFocus)[keyof typeof FitnessFocus];

export const PreferredGymTime = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  EVENING: 'EVENING',
  LATE_EVENING: 'LATE_EVENING',
} as const;

export type PreferredGymTime =
  (typeof PreferredGymTime)[keyof typeof PreferredGymTime];

export const WorkoutIntensity = {
  LIGHT: 'LIGHT',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
} as const;

export type WorkoutIntensity =
  (typeof WorkoutIntensity)[keyof typeof WorkoutIntensity];

export const MedicalConcern = {
  DIABETES: 'DIABETES',
  HYPERTENSION: 'HYPERTENSION',
  ASTHMA: 'ASTHMA',
  OTHER: 'OTHER',
  NONE: 'NONE',
} as const;

export type MedicalConcern =
  (typeof MedicalConcern)[keyof typeof MedicalConcern];

export const HeardFrom = {
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  WORD_OF_MOUTH: 'WORD_OF_MOUTH',
  WALK_IN: 'WALK_IN',
  WELLVANTAGE_APP: 'WELLVANTAGE_APP',
} as const;

export type HeardFrom = (typeof HeardFrom)[keyof typeof HeardFrom];

export const InterestLevel = {
  HOT: 'HOT',
  WARM: 'WARM',
  COLD: 'COLD',
} as const;

export type InterestLevel = (typeof InterestLevel)[keyof typeof InterestLevel];

export const FollowUpStatus = {
  NEW_INQUIRY: 'NEW_INQUIRY',
  NEEDS_FOLLOWUP: 'NEEDS_FOLLOWUP',
  ENGAGED: 'ENGAGED',
  CONVERTED: 'CONVERTED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type FollowUpStatus =
  (typeof FollowUpStatus)[keyof typeof FollowUpStatus];
