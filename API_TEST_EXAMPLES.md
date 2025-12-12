# API Test Examples - POST Request Bodies

## Base URL

```
http://localhost:3000
```

---

## 1. Create Merchant API

**Endpoint:** `POST /merchant`

### Full Example (All Fields):

```json
{
  "gymName": "FitZone Gym",
  "firstName": "John",
  "lastName": "Doe",
  "addressLine1": "123 Main Street",
  "addressLine2": "Suite 100",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "phoneNumber": "+1234567890"
}
```

### Minimal Example (Required Fields Only):

```json
{
  "gymName": "PowerHouse Fitness",
  "firstName": "Jane",
  "lastName": "Smith",
  "addressLine1": "456 Oak Avenue",
  "city": "Los Angeles",
  "state": "CA",
  "country": "USA",
  "phoneNumber": "+1987654321"
}
```

### Example with Indian Address:

```json
{
  "gymName": "Gold's Gym Mumbai",
  "firstName": "Raj",
  "lastName": "Kumar",
  "addressLine1": "123 MG Road",
  "addressLine2": "2nd Floor",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "phoneNumber": "+919876543210"
}
```

---

## 2. Create Lead API

**Endpoint:** `POST /leads`

### Full Example (All Fields):

```json
{
  "assignedToId": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "phoneNumber": "+1234567890",
  "email": "alice.johnson@example.com",
  "gender": "FEMALE",
  "dob": "1990-05-15T00:00:00.000Z",
  "height": 165,
  "weight": 60,
  "activityLevel": "MODERATELY_ACTIVE",
  "wellnessGoal": "BUILD_MUSCLE",
  "fitnessFocus": "GYM_WORKOUT",
  "preferredGymTime": "EVENING",
  "workoutIntensity": "HIGH",
  "medicalConcern": "NONE",
  "previousGymExperience": true,
  "inquiryDate": "2024-12-12T10:00:00.000Z",
  "interestLevel": "HOT",
  "followUpStatus": "NEW_INQUIRY",
  "preferredPackage": "Premium Annual",
  "preferredPTPackage": "Personal Training - 3 sessions/week",
  "heardFrom": "SOCIAL_MEDIA"
}
```

### Minimal Example (Required Fields Only):

```json
{
  "firstName": "Bob",
  "lastName": "Wilson",
  "phoneNumber": "+1987654321",
  "gender": "MALE",
  "dob": "1985-08-20T00:00:00.000Z",
  "inquiryDate": "2024-12-12T14:30:00.000Z"
}
```

### Example - Weight Loss Goal:

```json
{
  "firstName": "Sarah",
  "lastName": "Miller",
  "phoneNumber": "+1555123456",
  "email": "sarah.miller@example.com",
  "gender": "FEMALE",
  "dob": "1992-03-10T00:00:00.000Z",
  "height": 170,
  "weight": 75,
  "activityLevel": "SEDENTARY",
  "wellnessGoal": "LOSE_WEIGHT",
  "fitnessFocus": "NUTRITION",
  "preferredGymTime": "MORNING",
  "workoutIntensity": "MODERATE",
  "medicalConcern": "NONE",
  "previousGymExperience": false,
  "inquiryDate": "2024-12-12T09:00:00.000Z",
  "interestLevel": "WARM",
  "followUpStatus": "NEW_INQUIRY",
  "preferredPackage": "Basic Monthly",
  "heardFrom": "WORD_OF_MOUTH"
}
```

### Example - Yoga Enthusiast:

```json
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "phoneNumber": "+919876543210",
  "email": "priya.sharma@example.com",
  "gender": "FEMALE",
  "dob": "1995-07-25T00:00:00.000Z",
  "height": 160,
  "weight": 55,
  "activityLevel": "LIGHTLY_ACTIVE",
  "wellnessGoal": "MANAGE_STRESS",
  "fitnessFocus": "YOGA",
  "preferredGymTime": "MORNING",
  "workoutIntensity": "LIGHT",
  "medicalConcern": "NONE",
  "previousGymExperience": true,
  "inquiryDate": "2024-12-12T08:00:00.000Z",
  "interestLevel": "HOT",
  "followUpStatus": "NEW_INQUIRY",
  "preferredPackage": "Yoga Membership",
  "heardFrom": "WELLVANTAGE_APP"
}
```

### Example - Medical Concern:

```json
{
  "firstName": "Michael",
  "lastName": "Brown",
  "phoneNumber": "+1444123456",
  "email": "michael.brown@example.com",
  "gender": "MALE",
  "dob": "1988-11-05T00:00:00.000Z",
  "height": 180,
  "weight": 90,
  "activityLevel": "SEDENTARY",
  "wellnessGoal": "MODIFY_DIET",
  "fitnessFocus": "NUTRITION",
  "preferredGymTime": "AFTERNOON",
  "workoutIntensity": "LIGHT",
  "medicalConcern": "DIABETES",
  "previousGymExperience": false,
  "inquiryDate": "2024-12-12T15:00:00.000Z",
  "interestLevel": "WARM",
  "followUpStatus": "NEEDS_FOLLOWUP",
  "preferredPackage": "Health & Wellness Program",
  "heardFrom": "WALK_IN"
}
```

---

## Enum Values Reference

### Gender:

- `"MALE"`
- `"FEMALE"`
- `"OTHER"`

### ActivityLevel:

- `"SEDENTARY"`
- `"LIGHTLY_ACTIVE"`
- `"MODERATELY_ACTIVE"`
- `"VERY_ACTIVE"`

### WellnessGoal:

- `"LOSE_WEIGHT"`
- `"GAIN_WEIGHT"`
- `"BUILD_MUSCLE"`
- `"MODIFY_DIET"`
- `"MANAGE_STRESS"`
- `"IMPROVE_STEP_COUNT"`
- `"GENERAL_WELLNESS"`

### FitnessFocus:

- `"GYM_WORKOUT"`
- `"YOGA"`
- `"MEDITATION"`
- `"NUTRITION"`
- `"RECOVERY"`

### PreferredGymTime:

- `"MORNING"`
- `"AFTERNOON"`
- `"EVENING"`
- `"LATE_EVENING"`

### WorkoutIntensity:

- `"LIGHT"`
- `"MODERATE"`
- `"HIGH"`

### MedicalConcern:

- `"DIABETES"`
- `"HYPERTENSION"`
- `"ASTHMA"`
- `"OTHER"`
- `"NONE"`

### HeardFrom:

- `"SOCIAL_MEDIA"`
- `"WORD_OF_MOUTH"`
- `"WALK_IN"`
- `"WELLVANTAGE_APP"`

### InterestLevel:

- `"HOT"`
- `"WARM"`
- `"COLD"`

### FollowUpStatus:

- `"NEW_INQUIRY"`
- `"NEEDS_FOLLOWUP"`
- `"ENGAGED"`
- `"CONVERTED"`
- `"ARCHIVED"`

---

## Testing with cURL

### Create Merchant:

```bash
curl -X POST http://localhost:3000/merchant \
  -H "Content-Type: application/json" \
  -d '{
    "gymName": "FitZone Gym",
    "firstName": "John",
    "lastName": "Doe",
    "addressLine1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "phoneNumber": "+1234567890"
  }'
```

### Create Lead:

```bash
curl -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "phoneNumber": "+1234567890",
    "email": "alice@example.com",
    "gender": "FEMALE",
    "dob": "1990-05-15T00:00:00.000Z",
    "inquiryDate": "2024-12-12T10:00:00.000Z"
  }'
```

---

## Testing with Postman

1. **Method:** POST
2. **URL:** `http://localhost:3000/merchant` or `http://localhost:3000/leads`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body:** Select "raw" and "JSON", then paste any of the examples above

---

## Notes

- All date fields should be in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Enum values are case-sensitive - use exact values as shown
- `assignedToId` is optional but if provided, must be a valid Merchant ID
- `addressLine2` is optional for Merchant
- Most fields in Lead are optional except: `firstName`, `lastName`, `phoneNumber`, `gender`, `dob`, and `inquiryDate`
