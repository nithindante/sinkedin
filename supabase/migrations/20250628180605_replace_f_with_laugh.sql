-- Step 1: Rename the existing ENUM type to a temporary name.
ALTER TYPE public.reaction_type RENAME TO reaction_type_old;

-- Step 2: Create the new ENUM type with the desired values.
-- We've replaced 'F' with 'laugh'.
CREATE TYPE public.reaction_type AS ENUM (
  'Laugh',
  'Clown',
  'Skull',
  'Relatable'
);

-- Step 3: Alter the column in the reactions table.
-- This is the key step. We use a `USING` clause with a `CASE` statement
-- to convert the old data to the new type during the alteration.
ALTER TABLE public.reactions
ALTER COLUMN reaction TYPE public.reaction_type
USING (
  CASE reaction::text
    WHEN 'F' THEN 'Laugh' -- Convert 'F' to 'Laugh'
    ELSE reaction::text   -- Keep all other values the same
  END
)::public.reaction_type; -- Cast the final result back to the new ENUM type

-- Step 4: Drop the old, now-unused ENUM type.
DROP TYPE public.reaction_type_old;