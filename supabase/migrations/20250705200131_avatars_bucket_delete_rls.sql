-- This migration adds a secure and performant RLS policy to allow users to delete their own avatars.
-- It follows Supabase's performance best practices by evaluating auth.uid() only once per query.

BEGIN;

-- First, drop the policy if it already exists to make this script re-runnable.
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Create the policy for the DELETE operation.
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  -- The user must be authenticated.
  auth.role() = 'authenticated'

  -- The policy only applies to files in the 'avatars' bucket.
  AND bucket_id = 'avatars'

  -- The user's ID must match the name of the folder the file is in.
  -- This is the core security check.
  -- (select auth.uid()) is used for performance, ensuring the function is called only once.
  AND (select auth.uid()) = (storage.foldername(name))[1]::uuid
);

COMMIT;