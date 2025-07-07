-- Function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.create_follower_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a row into the notifications table
  INSERT INTO public.notifications(recipient_user_id, triggering_user_id, type)
  -- The recipient is the person being followed (NEW.following_id)
  -- The trigger is the person who just followed (NEW.follower_id)
  VALUES(NEW.following_id, NEW.follower_id, 'new_follower');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger that calls the function
CREATE TRIGGER on_new_follow
  AFTER INSERT ON public.relationships
  FOR EACH ROW EXECUTE PROCEDURE public.create_follower_notification();