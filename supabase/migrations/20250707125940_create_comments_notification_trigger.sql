-- Function that creates the notification
CREATE OR REPLACE FUNCTION public.create_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
BEGIN
  -- 1. Get the ID of the author of the post that was commented on
  SELECT user_id INTO post_author_id FROM public.posts WHERE id = NEW.post_id;

  -- 2. Only create a notification if the commenter is not the post's author
  IF post_author_id <> NEW.user_id THEN
    INSERT INTO public.notifications(recipient_user_id, triggering_user_id, type, post_id)
    VALUES(post_author_id, NEW.user_id, 'new_comment', NEW.post_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger that calls the function after a new comment is inserted
CREATE TRIGGER on_new_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE PROCEDURE public.create_comment_notification();