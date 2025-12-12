-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE');

-- CreateEnum
CREATE TYPE "WellnessGoal" AS ENUM ('LOSE_WEIGHT', 'GAIN_WEIGHT', 'BUILD_MUSCLE', 'MODIFY_DIET', 'MANAGE_STRESS', 'IMPROVE_STEP_COUNT', 'GENERAL_WELLNESS');

-- CreateEnum
CREATE TYPE "FitnessFocus" AS ENUM ('GYM_WORKOUT', 'YOGA', 'MEDITATION', 'NUTRITION', 'RECOVERY');

-- CreateEnum
CREATE TYPE "PreferredGymTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'LATE_EVENING');

-- CreateEnum
CREATE TYPE "WorkoutIntensity" AS ENUM ('LIGHT', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "MedicalConcern" AS ENUM ('DIABETES', 'HYPERTENSION', 'ASTHMA', 'OTHER', 'NONE');

-- CreateEnum
CREATE TYPE "HeardFrom" AS ENUM ('SOCIAL_MEDIA', 'WORD_OF_MOUTH', 'WALK_IN', 'WELLVANTAGE_APP');

-- CreateEnum
CREATE TYPE "InterestLevel" AS ENUM ('HOT', 'WARM', 'COLD');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('NEW_INQUIRY', 'NEEDS_FOLLOWUP', 'ENGAGED', 'CONVERTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Merchant" (
    "id" SERIAL NOT NULL,
    "gymName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT NOT NULL,
    "leadId" INTEGER NOT NULL,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "assignedToId" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "gender" "Gender" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "height" INTEGER,
    "weight" INTEGER,
    "activityLevel" "ActivityLevel",
    "wellnessGoal" "WellnessGoal",
    "fitnessFocus" "FitnessFocus",
    "preferredGymTime" "PreferredGymTime",
    "workoutIntensity" "WorkoutIntensity",
    "medicalConcern" "MedicalConcern",
    "previousGymExperience" BOOLEAN NOT NULL DEFAULT false,
    "inquiryDate" TIMESTAMP(3) NOT NULL,
    "interestLevel" "InterestLevel",
    "followUpStatus" "FollowUpStatus",
    "preferredPackage" TEXT,
    "preferredPTPackage" TEXT,
    "heardFrom" "HeardFrom",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
