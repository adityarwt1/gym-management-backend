# Database Setup Guide

## How to Add Prisma Console Database URL

### Step 1: Get Your Connection String from Prisma Console

1. Go to [https://console.prisma.io](https://console.prisma.io)
2. Sign in to your account
3. Either:
   - **Create a new database project** (if you deleted the old one)
   - **Or select an existing database project**
4. Once in your project, go to the **Connection** or **Settings** tab
5. Copy the **Connection String** - it will look like:
   ```
   postgresql://username:password@db.prisma.io:5432/database_name?schema=public
   ```

### Step 2: Add to .env File

Create or edit the `.env` file in the root of your project and add:

```env
DATABASE_URL="postgresql://username:password@db.prisma.io:5432/database_name?schema=public"
```

**Important:** Replace the connection string above with your actual connection string from Prisma Console.

### Step 3: Verify Connection

After adding the DATABASE_URL, run:

```bash
# Generate Prisma Client (if needed)
pnpm prisma generate

# Test the connection
pnpm prisma db pull

# Create and apply migrations
pnpm prisma migrate dev --name init
```

### Alternative: Use Local PostgreSQL

If you prefer to use a local PostgreSQL database:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/gym_management?schema=public"
```

### Alternative: Use Cloud Providers

**Supabase:**

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
```

**Neon:**

```env
DATABASE_URL="postgresql://[user]:[password]@[neon-hostname]/[dbname]?sslmode=require"
```

**Railway:**

```env
DATABASE_URL="[Connection string from Railway dashboard]"
```

### Troubleshooting

- Make sure there are **no spaces** around the `=` sign in your `.env` file
- Make sure the connection string is in **quotes**
- If using special characters in password, they may need to be URL-encoded
- Restart your application after changing the `.env` file
