
async function uploadImage(file, supabase, name) {
    const fileExt = file.name.split('.').pop();
    const filename = `${name}_${Date.now()}.${fileExt}`;
    

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filename, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filename);

    return urlData.publicUrl;
}

export default uploadImage