
async function uploadImage(file, supabase, userId) {
  const fileExt = file.name.split('.').pop();
  const filename = `${userId}/avatar.${fileExt}`; // folder = userId
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filename, file, { upsert: true });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

export default uploadImage;