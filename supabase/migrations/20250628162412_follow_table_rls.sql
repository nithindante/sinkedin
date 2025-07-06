--
-- RLS POLICIES FOR 'relationships' TABLE
--

-- 1. Enable RLS on the table
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;

-- 2. Create policy for SELECT (reading follow data)
-- This allows anyone to see the list of followers/following for a profile.
CREATE POLICY "Follow relationships are public."
  ON public.relationships FOR SELECT
  USING (true);

-- 3. Create policy for INSERT (creating a follow)
-- A user can only insert a row where they are the follower.
CREATE POLICY "Users can follow other users."
  ON public.relationships FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- 4. Create policy for DELETE (deleting a follow / unfollowing)
-- A user can only delete a row where they are the follower.
CREATE POLICY "Users can unfollow other users."
  ON public.relationships FOR DELETE
  USING (auth.uid() = follower_id);