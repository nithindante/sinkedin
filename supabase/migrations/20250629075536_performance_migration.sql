-- This migration fixes performance issues identified by the Supabase Performance Advisor.
-- 1. Wraps auth.uid() in a subquery for all relevant RLS policies to prevent re-evaluation per row.
-- 2. Adds indexes to foreign key columns to speed up joins and cascading deletes.

-- === Fix RLS Performance Warnings (Auth RLS Initialization Plan) ===

-- ----
-- Table: public.profiles
-- ----
DROP POLICY "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

-- ----
-- Table: public.posts
-- ----
DROP POLICY "Authenticated users can create posts." ON public.posts;
CREATE POLICY "Authenticated users can create posts."
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY "Users can update their own posts." ON public.posts;
CREATE POLICY "Users can update their own posts."
  ON public.posts FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY "Users can delete their own posts." ON public.posts;
CREATE POLICY "Users can delete their own posts."
  ON public.posts FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ----
-- Table: public.reactions
-- ----
DROP POLICY "Authenticated users can create reactions." ON public.reactions;
CREATE POLICY "Authenticated users can create reactions."
  ON public.reactions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY "Users can update their own reactions." ON public.reactions;
CREATE POLICY "Users can update their own reactions."
  ON public.reactions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY "Users can delete their own reactions." ON public.reactions;
CREATE POLICY "Users can delete their own reactions."
  ON public.reactions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ----
-- Table: public.comments
-- ----
DROP POLICY "Users can create their own comments." ON public.comments;
CREATE POLICY "Users can create their own comments."
  ON public.comments FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY "Users can update their own comments." ON public.comments;
CREATE POLICY "Users can update their own comments."
  ON public.comments FOR UPDATE
  USING ((select auth.uid()) = user_id);

DROP POLICY "Users can delete their own comments." ON public.comments;
CREATE POLICY "Users can delete their own comments."
  ON public.comments FOR DELETE
  USING ((select auth.uid()) = user_id);

-- ----
-- Table: public.relationships
-- ----
DROP POLICY "Users can follow other users." ON public.relationships;
CREATE POLICY "Users can follow other users."
  ON public.relationships FOR INSERT
  WITH CHECK ((select auth.uid()) = follower_id);

DROP POLICY "Users can unfollow other users." ON public.relationships;
CREATE POLICY "Users can unfollow other users."
  ON public.relationships FOR DELETE
  USING ((select auth.uid()) = follower_id);


-- === Add Indexes for Foreign Keys (Unindexed Foreign Keys) ===

-- ----
-- Table: public.posts
-- ----
CREATE INDEX ON public.posts (user_id);

-- ----
-- Table: public.comments
-- ----
CREATE INDEX ON public.comments (post_id);
CREATE INDEX ON public.comments (user_id);

-- ----
-- Table: public.reactions
-- ----
CREATE INDEX ON public.reactions (post_id);
-- Note: An index on user_id is already created by the composite primary key (user_id, post_id).
-- The linter may still suggest it. Adding it explicitly doesn't hurt but is often redundant.
-- Let's add it for completeness as suggested by the linter.
CREATE INDEX ON public.reactions (user_id);


-- ----
-- Table: public.relationships
-- ----
-- Note: The primary key (follower_id, following_id) creates a multi-column index.
-- This index is efficient for lookups on `follower_id`, but not for `following_id`.
-- We will add separate indexes as recommended for optimal performance on both columns.
CREATE INDEX ON public.relationships (follower_id);
CREATE INDEX ON public.relationships (following_id);