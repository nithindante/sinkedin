-- public.relationships table
CREATE TABLE public.relationships (
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- A user cannot follow themselves
  CONSTRAINT check_cannot_follow_self CHECK (follower_id <> following_id),

  -- The composite primary key ensures a user can only follow another user once
  PRIMARY KEY (follower_id, following_id)
);

-- Comments for clarity
COMMENT ON TABLE public.relationships IS 'Stores the follower-following relationships between users.';
COMMENT ON COLUMN public.relationships.follower_id IS 'The user who is initiating the follow.';
COMMENT ON COLUMN public.relationships.following_id IS 'The user who is being followed.';