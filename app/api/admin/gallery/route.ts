import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { image_url, storage_path, category, title_id, title_en, description_id, description_en, taken_at } = body;

    if (!image_url || !storage_path || !category || !title_id || !description_id) {
      return Response.json({ error: 'Field wajib tidak lengkap.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('gallery_items')
      .insert({
        image_url,
        storage_path,
        category,
        title_id,
        title_en: title_en || title_id,
        description_id,
        description_en: description_en || description_id,
        is_published: true,
        ...(taken_at ? { taken_at } : {}),
      })
      .select()
      .single();

    if (error) {
      console.error('Gallery insert failed:', error.message);
      return Response.json({ error: 'Foto belum tersimpan.' }, { status: 500 });
    }

    return Response.json({ item: data });
  } catch (err) {
    console.error('Gallery POST error:', err);
    return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, category, title_id, title_en, description_id, description_en, image_url, storage_path, is_published, taken_at } = body;

    if (!id) {
      return Response.json({ error: 'ID wajib disertakan.' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (category !== undefined) updates.category = category;
    if (title_id !== undefined) updates.title_id = title_id;
    if (title_en !== undefined) updates.title_en = title_en;
    if (description_id !== undefined) updates.description_id = description_id;
    if (description_en !== undefined) updates.description_en = description_en;
    if (image_url !== undefined) updates.image_url = image_url;
    if (storage_path !== undefined) updates.storage_path = storage_path;
    if (is_published !== undefined) updates.is_published = is_published;
    if (taken_at !== undefined) updates.taken_at = taken_at || null;

    const { data, error } = await supabase
      .from('gallery_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Gallery update failed:', error.message);
      return Response.json({ error: 'Foto belum diperbarui.' }, { status: 500 });
    }

    return Response.json({ item: data });
  } catch (err) {
    console.error('Gallery PATCH error:', err);
    return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'ID wajib disertakan.' }, { status: 400 });
  }

  const { data: current, error: lookupError } = await supabase
    .from('gallery_items')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();

  if (lookupError) {
    console.error('Gallery lookup failed:', lookupError.message);
    return Response.json({ error: 'Foto tidak ditemukan.' }, { status: 404 });
  }

  const { error } = await supabase.from('gallery_items').delete().eq('id', id);

  if (error) {
    console.error('Gallery delete failed:', error.message);
    return Response.json({ error: 'Foto belum dihapus.' }, { status: 500 });
  }

  if (current?.storage_path) {
    const { error: storageError } = await supabase.storage
      .from('betami-gallery')
      .remove([current.storage_path]);
    if (storageError) {
      console.warn('Failed to delete gallery photo from storage:', storageError.message);
    }
  }

  return Response.json({ success: true });
}