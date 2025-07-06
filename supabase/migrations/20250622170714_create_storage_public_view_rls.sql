-- Allow anyone to read files from avatars bucket
create policy "Public read access to avatars"
on storage.objects
for select
using (
  bucket_id = 'avatars'
);
