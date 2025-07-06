-- Enable Row Level Security (RLS) for the storage.objects table
create policy "Only user can upload their avatar"
on storage.objects for insert to authenticated with check (
    -- restrict bucket
    bucket_id = 'avatars'
);