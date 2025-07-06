-- public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  headline TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 50),
  CONSTRAINT headline_length CHECK (char_length(headline) <= 100),    
  CONSTRAINT bio_length CHECK (char_length(bio) <= 200)
);

-- Comments for clarity
COMMENT ON TABLE public.profiles IS 'Public profile information for each user.';
COMMENT ON COLUMN public.profiles.id IS 'References the internal Supabase auth.users table.';