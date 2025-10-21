import { supabase } from './supabase';

// Fetch all social links for a given profile in display order
export async function getSocialLinksByProfile(profileId) {
  if (!profileId) return [];
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profileId)
    .order('order', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Insert or update a social link. Returns the saved row
export async function upsertSocialLinkForProfile(profileId, link) {
  if (!profileId) throw new Error('Missing profileId');
  const payload = {
    id: link.id || undefined,
    profile_id: profileId,
    icon: link.icon || 'website',
    title: link.title || '',
    url: link.url || '',
    active: typeof link.active === 'boolean' ? link.active : true,
    order: typeof link.order === 'number' ? link.order : null,
  };

  const { data, error } = await supabase
    .from('links')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSocialLinkById(profileId, id) {
  if (!profileId) throw new Error('Missing profileId');
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('profile_id', profileId)
    .eq('id', id);
  if (error) throw error;
}

export async function reorderSocialLinks(profileId, orderedIds) {
  if (!profileId || !Array.isArray(orderedIds)) return;
  
  // Use individual updates to avoid NOT NULL constraint issues
  const promises = orderedIds.map((id, index) => 
    supabase
      .from('links')
      .update({ order: index })
      .eq('id', id)
      .eq('profile_id', profileId)
  );
  
  const results = await Promise.all(promises);
  const errors = results.filter(r => r.error).map(r => r.error);
  
  if (errors.length > 0) {
    console.error('Reorder errors:', errors);
    throw errors[0];
  }
}
