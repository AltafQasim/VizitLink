import { supabase } from './supabase';

// Fetch all custom links for a given profile in display order
export async function getCustomLinksByProfile(profileId) {
  if (!profileId) return [];
  const { data, error } = await supabase
    .from('custom_links')
    .select('*')
    .eq('profile_id', profileId)
    .order('order', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Insert or update a custom link. Returns the saved row
export async function upsertCustomLinkForProfile(profileId, link) {
  if (!profileId) throw new Error('Missing profileId');
  const payload = {
    id: link.id || undefined,
    profile_id: profileId,
    icon: link.icon || 'default',
    title: link.title || '',
    url: link.url || '',
    redirect_url: link.redirect_url || null,
    layout: link.layout || 'classic',
    thumbnail: link.thumbnail || null,
    description: link.description || null,
    domain: link.domain || null,
    favicon: link.favicon || null,
    active: typeof link.active === 'boolean' ? link.active : false,
    order: typeof link.order === 'number' ? link.order : null,
  };

  const { data, error } = await supabase
    .from('custom_links')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCustomLinkById(profileId, id) {
  if (!profileId) throw new Error('Missing profileId');
  const { error } = await supabase
    .from('custom_links')
    .delete()
    .eq('profile_id', profileId)
    .eq('id', id);
  if (error) throw error;
}

export async function reorderCustomLinks(profileId, orderedIds) {
  if (!profileId || !Array.isArray(orderedIds)) return;
  const updates = orderedIds.map((id, index) => ({ id, profile_id: profileId, order: index }));
  const { error } = await supabase.from('custom_links').upsert(updates, { onConflict: 'id' });
  if (error) throw error;
}


