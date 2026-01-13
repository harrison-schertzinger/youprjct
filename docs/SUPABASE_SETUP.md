# Supabase Setup Guide

This guide walks you through setting up Supabase as the backend for You.First training programming.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Name**: `you-first` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the closest to your users
4. Click **Create new project** and wait for setup (~2 minutes)

## 2. Get Your API Credentials

Once your project is ready:

1. Go to **Settings** → **API** (in the left sidebar)
2. Find these values:
   - **Project URL** → This is your `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `EXPO_PUBLIC_SUPABASE_ANON_KEY`

> **Note**: The `anon` key is safe to use in client apps. It only allows operations permitted by Row Level Security (RLS) policies.

## 3. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Restart the Expo dev server to pick up the new env vars:
   ```bash
   npx expo start --clear
   ```

## 4. Apply the Database Schema

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see "Success. No rows returned" — this means the tables were created.

## 5. Seed Initial Data

After applying the schema, seed the training data:

1. In the SQL Editor, click **New query**
2. Copy the entire contents of `supabase/seed.sql`
3. Paste and click **Run**

This creates:
- 2 training tracks (Athlete Track, Functional Fitness Track)
- 12 exercises (Back Squat, Deadlift, etc.)
- 14 training days (7 days × 2 tracks for the current week)

## 6. Verify the Setup

### Check Tables Have Data

In the SQL Editor, run:

```sql
SELECT * FROM training_tracks;
SELECT COUNT(*) FROM exercises;
SELECT COUNT(*) FROM training_days;
```

Expected results:
- 2 tracks
- 12 exercises
- 14 training days

### Check RLS Policies

The schema includes RLS policies that allow anonymous reads. To verify:

```sql
-- Should return the policy names
SELECT policyname FROM pg_policies WHERE tablename = 'training_tracks';
```

### Test from the App

1. Start the app: `npx expo start`
2. Navigate to Body → Training
3. You should see the programming from Supabase

## Troubleshooting

### "No training data" / Empty Training Screen

**Cause**: App can't fetch from Supabase, falling back to seed data.

**Solutions**:
1. Check your `.env.local` has correct values
2. Restart Expo with `npx expo start --clear`
3. Check Supabase dashboard → SQL Editor → Run `SELECT * FROM training_tracks`
4. If tables are empty, run `supabase/seed.sql`

### "403 Forbidden" / RLS Blocking Reads

**Cause**: Row Level Security is blocking anonymous access.

**Solutions**:
1. Verify the RLS policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('training_tracks', 'exercises', 'training_days');
   ```

2. If no policies, re-run the schema.sql which includes:
   ```sql
   CREATE POLICY "Training tracks are viewable by everyone"
     ON training_tracks FOR SELECT TO anon, authenticated USING (true);
   ```

3. **Temporary workaround** (not recommended for production):
   ```sql
   ALTER TABLE training_tracks DISABLE ROW LEVEL SECURITY;
   ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;
   ALTER TABLE training_days DISABLE ROW LEVEL SECURITY;
   ```

### Admin Cannot Insert/Update Data

**Cause**: RLS policies only allow SELECT for anon users. Admin writes require service_role key.

**Solutions**:

1. **Use the Supabase Dashboard**: The dashboard uses the service_role key automatically. Insert/update via:
   - SQL Editor (recommended)
   - Table Editor UI

2. **Use service_role key in admin tools**: For a future admin dashboard, use the `service_role` key (found in Settings → API → `service_role`). Never expose this key in client apps.

3. **Temporary: Disable RLS for development**:
   ```sql
   -- Disable RLS temporarily for seeding
   ALTER TABLE training_days DISABLE ROW LEVEL SECURITY;

   -- Re-enable after seeding
   ALTER TABLE training_days ENABLE ROW LEVEL SECURITY;
   ```

### Network Errors / Timeouts

**Cause**: Supabase project may be paused (free tier) or network issues.

**Solutions**:
1. Check Supabase dashboard — paused projects show a "Resume" button
2. Free tier projects pause after 1 week of inactivity
3. Check your internet connection
4. The app will fall back to local seed data when offline

## Environment Variable Reference

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Project API URL | Settings → API → Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anonymous/public key | Settings → API → anon public |

## Next Steps

- **Phase 2**: Add Supabase Auth for user accounts
- **Phase 3**: Build admin dashboard for publishing programming
- **Future**: Sync user results and PRs to Supabase
