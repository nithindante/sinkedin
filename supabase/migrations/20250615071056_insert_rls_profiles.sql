--
-- RLS POLICY FOR 'profiles' TABLE (INSERT)
--

-- 1. Create policy for INSERT (creating data)
-- This policy allows an authenticated user to create a profile for themselves.
-- It checks that the 'id' of the new row matches their own authenticated user ID.
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Comment for clarity
COMMENT ON POLICY "Users can insert their own profile." ON public.profiles IS 'Ensures a user can only create a profile linked to their own auth ID.';