--
-- RLS POLICIES FOR 'profiles' TABLE
--

-- 1. Enable RLS on the table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create policy for SELECT (reading data)
-- This policy allows any user (authenticated or not) to view all profiles.
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

-- 3. Create policy for UPDATE (modifying data)
-- This policy only allows a user to update their OWN profile.
-- It checks if the user's authenticated ID matches the 'id' column of the row they are trying to change.
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Comments for clarity
COMMENT ON POLICY "Public profiles are viewable by everyone." ON public.profiles IS 'Allows read access to all profiles for displaying user information publicly.';
COMMENT ON POLICY "Users can update their own profile." ON public.profiles IS 'Ensures a user can only modify their own profile data.';