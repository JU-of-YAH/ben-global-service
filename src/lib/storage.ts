import { supabase } from './supabase'

export async function uploadCarImage(
  file: File,
  slug: string,
) {
  const extension =
    file.name.split('.').pop()?.toLowerCase() || 'jpg'

  const fileName = `${crypto.randomUUID()}.${extension}`
  const filePath = `${slug}/${fileName}`

  const { error } = await supabase.storage
    .from('car-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage
    .from('car-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}