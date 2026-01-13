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

## 3. Enable Anonymous Sign-ins

Anonymous sign-ins allow users to use the app immediately without creating an account. Sessions persist across app launches.

1. In your Supabase dashboard, go to **Authentication** (left sidebar)
2. Click **Providers** (under Configuration)
3. Scroll down to find **Anonymous Sign-ins**
4. Click on it to expand
5. Toggle **Enable Anonymous Sign-ins** to ON
6. Click **Save**

> **Why Anonymous Sign-ins?** Users get a real authenticated session without friction. They can later link their account to email/password if needed. This enables leaderboards and profile features while maintaining a seamless UX.

## 4. Configure Environment Variables

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

## 5. Apply the Database Schema

> **Important**: Use a NEW query tab for schema vs seed. Supabase only shows results from the last statement, so running both in one tab may hide errors.

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query** to open a fresh query tab
4. Copy the **entire contents** of `supabase/schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see "Success. No rows returned" — this means the tables were created.

## 6. Apply the Profiles Schema

The profiles table stores user display names and avatars for leaderboards.

1. In the SQL Editor, click **New query** to open a fresh tab
2. Copy the **entire contents** of `supabase/profiles.sql`
3. Paste and click **Run**

This creates:
- `profiles` table linked to `auth.users`
- RLS policies for authenticated access
- Auto-updating `updated_at` trigger

## 7. Seed Initial Data

> **Important**: Use a **NEW query tab** for seeding (not the same tab as schema).

1. In the SQL Editor, click **New query** to open a fresh tab
2. Copy the **entire contents** of `supabase/seed.sql`
3. Paste and click **Run**

This creates:
- 2 training tracks (Athlete Track, Functional Fitness Track)
- 12 exercises (Back Squat, Deadlift, etc.)
- 14 training days (7 days × 2 tracks for the current week)

The seed is **idempotent** — you can run it multiple times safely. It uses `ON CONFLICT DO UPDATE` to upsert data.

## 8. Verify the Setup

> **Note**: Supabase SQL Editor only displays the result of the **last query**. Use this single combined query to verify all data at once:

In the SQL Editor, click **New query** and run:

```sql
SELECT
  (SELECT COUNT(*) FROM training_tracks) AS tracks,
  (SELECT COUNT(*) FROM exercises) AS exercises,
  (SELECT COUNT(*) FROM training_days) AS training_days;
```

**Expected result:**

| tracks | exercises | training_days |
|--------|-----------|---------------|
| 2      | 12        | 14            |

If any count is 0, re-run the appropriate SQL file.

### Verify Profiles Table

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'profiles'
) AS profiles_table_exists;
```

### Verify JSON Data (Optional)

To confirm the workout JSON is valid:

```sql
SELECT id, track_id, jsonb_pretty(workouts)
FROM training_days
WHERE jsonb_array_length(workouts) > 0
LIMIT 1;
```

You should see properly formatted JSON with workout objects containing `id`, `trackId`, `dateISO`, `title`, and `movements`.

### Check RLS Policies

The schema includes RLS policies that allow anonymous reads. To verify:

```sql
SELECT policyname FROM pg_policies WHERE tablename = 'training_tracks';
```

For profiles:

```sql
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
```

Expected policies: `Profiles are viewable by authenticated users`, `Users can insert own profile`, `Users can update own profile`

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
3. Check Supabase dashboard → SQL Editor → Run the verification query above
4. If tables are empty, run `supabase/seed.sql` in a new query tab

### JSON Syntax Error When Running seed.sql

**Cause**: Older seed.sql versions used string concatenation inside JSON literals.

**Solution**: Pull the latest `supabase/seed.sql` which uses `jsonb_build_object()` and `jsonb_build_array()` functions to construct JSON safely.

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

### Profile Save Fails with RLS Error

**Cause**: User is not authenticated or anonymous sign-ins are not enabled.

**Solutions**:
1. Verify anonymous sign-ins are enabled (see step 3 above)
2. Check the browser/app console for auth errors
3. Verify profiles RLS policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
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

## Authentication Flow

The app uses Supabase Anonymous Sign-ins for seamless identity:

1. **App Launch**: `ensureSession()` checks for existing session
2. **No Session**: Creates anonymous session via `signInAnonymously()`
3. **Session Exists**: Reuses existing session (persisted in AsyncStorage)
4. **Profile Setup**: User can set display name (stored in `public.profiles`)

Sessions persist across app launches. Users can later link to email/password if needed.

## Next Steps

- **Phase 2**: Link anonymous users to email/password accounts
- **Phase 3**: Build admin dashboard for publishing programming
- **Future**: Sync user results and PRs to Supabase
