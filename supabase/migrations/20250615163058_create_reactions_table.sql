-- Custom ENUM type for reactions
CREATE TYPE public.reaction_type AS ENUM (
  'F',
  'Clown',
  'Skull',
  'Relatable'
);

-- public.reactions table
CREATE TABLE public.reactions (
  post_id BIGINT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, post_id) -- Composite key to enforce one reaction per user per post
);

-- Comments for clarity
COMMENT ON TABLE public.reactions IS 'Tracks user reactions on posts.';