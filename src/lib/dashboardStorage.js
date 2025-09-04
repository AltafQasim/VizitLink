import { supabase } from './supabase';

const STORAGE_KEY = 'vizitlink_dashboard_data';
const PROFILES_STORAGE_KEY = 'vizitlink_profiles';

// Default data
const defaultData = {
  profile: {
    id: '1',
    username: 'user',
    displayName: 'Your Name',
    bio: 'Add your bio here',
    avatar: '',
    customUrl: 'vizitlink.com/user',
    isLive: true,
  },
  links: [
    {
      id: '1',
      title: 'Instagram',
      url: 'https://instagram.com',
      icon: 'instagram',
      order: 1,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'YouTube',
      url: 'https://youtube.com',
      icon: 'youtube',
      order: 2,
      active: true,
      createdAt: new Date().toISOString(),
    },
  ],
  products: [
    {
      id: '1',
      title: 'Sample Product',
      brand: 'Your Brand',
      price: 29.99,
      currency: 'USD',
      url: '#',
      image: '/placeholder.svg',
      clicks: 0,
      ctr: 0.0,
      active: true,
      createdAt: new Date().toISOString(),
    },
  ],
  design: {
    theme: '',
    wallpaper: '',
    wallpaperImage: '',
    wallpaperVideo: '',
    wallpaperTint: 20,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonStyle: 'Minimal',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '16px',
    hideLinktreeFooter: false,
  },
  analytics: {
    views: 1250,
    clicks: 342,
    followers: 89,
    subscribers: 23,
  },
};

// Default profiles
const defaultProfiles = [
  {
    id: 'profile_1',
    username: 'user',
    displayName: 'Your Name',
    bio: 'Add your bio here',
    avatar: '',
    customUrl: 'vizitlink.com/user',
    isLive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

async function getCurrentUserId() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || null;
  } catch {
    return null;
  }
}

function mapProfileRowToApp(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio || '',
    avatar: row.avatar_url || '',
    customUrl: row.custom_url || '',
    isLive: Boolean(row.is_live),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDesignRowToApp(row) {
  if (!row) return defaultData.design;
  return {
    theme: row.theme || '',
    wallpaper: row.wallpaper || '',
    wallpaperImage: row.wallpaper_image || '',
    wallpaperVideo: row.wallpaper_video || '',
    wallpaperTint: typeof row.wallpaper_tint === 'number' ? row.wallpaper_tint : 20,
    backgroundColor: row.background_color || '#ffffff',
    textColor: row.text_color || '#000000',
    buttonStyle: row.button_style || 'Minimal',
    fontFamily: row.font_family || 'Inter',
    fontWeight: row.font_weight || '400',
    fontSize: row.font_size || '16px',
    hideLinktreeFooter: Boolean(row.hide_linktree_footer),
  };
}

function mapLinkRowToApp(row) {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    icon: row.icon || 'website',
    order: row.order,
    active: Boolean(row.active),
    createdAt: row.created_at,
  };
}

function mapProductRowToApp(row) {
  return {
    id: row.id,
    title: row.title,
    brand: row.brand || 'Unknown',
    price: Number(row.price) || 0,
    currency: row.currency || 'USD',
    url: row.url,
    image: row.image || '/placeholder.svg',
    clicks: typeof row.clicks === 'number' ? row.clicks : 0,
    ctr: typeof row.ctr === 'number' ? row.ctr : 0.0,
    active: Boolean(row.active),
    createdAt: row.created_at,
  };
}

// SAVE DATA (profile+design+links+products)
export const saveToBackend = async (data, profileId = null) => {
  if (!profileId) return;

  // Update profile
  const profileUpdate = {
    username: data?.profile?.username,
    display_name: data?.profile?.displayName,
    bio: data?.profile?.bio || null,
    avatar_url: data?.profile?.avatar || null,
    custom_url: data?.profile?.customUrl || null,
    is_live: Boolean(data?.profile?.isLive),
    updated_at: new Date().toISOString(),
  };
  await supabase.from('profiles').update(profileUpdate).eq('id', profileId);

  // DESIGN: upsert by profile_id
  const designPayload = {
    profile_id: profileId,
    theme: data?.design?.theme || null,
    wallpaper: data?.design?.wallpaper || null,
    wallpaper_image: data?.design?.wallpaperImage || null,
    wallpaper_video: data?.design?.wallpaperVideo || null,
    wallpaper_tint: Number(data?.design?.wallpaperTint ?? 20),
    background_color: data?.design?.backgroundColor || '#ffffff',
    text_color: data?.design?.textColor || '#000000',
    button_style: data?.design?.buttonStyle || 'Minimal',
    font_family: data?.design?.fontFamily || 'Inter',
    font_weight: data?.design?.fontWeight || '400',
    font_size: data?.design?.fontSize || '16px',
    hide_linktree_footer: Boolean(data?.design?.hideLinktreeFooter),
    updated_at: new Date().toISOString(),
  };

  // Check if design exists for this profile
  const { data: existingDesign } = await supabase
    .from('designs')
    .select('id')
    .eq('profile_id', profileId)
    .maybeSingle();

  if (existingDesign) {
    // Update existing design
    const { error: updateError } = await supabase
      .from('designs')
      .update(designPayload)
      .eq('profile_id', profileId);
    
    if (updateError) {
      console.error('Error updating design:', updateError);
      throw updateError;
    }
  } else {
    // Insert new design
    const { error: insertError } = await supabase
      .from('designs')
      .insert(designPayload);
    
    if (insertError) {
      console.error('Error inserting design:', insertError);
      throw insertError;
    }
  }

  // LINKS: upsert by id, delete removed
  const { data: existingLinks } = await supabase
    .from('links')
    .select('id')
    .eq('profile_id', profileId);
  const existingLinkIds = new Set((existingLinks || []).map(r => r.id));
  const incomingLinks = (data?.links || []).map(l => ({
    id: l.id && String(l.id).length > 0 ? l.id : undefined,
    profile_id: profileId,
    title: l.title,
    url: l.url,
    icon: l.icon || 'website',
    order: Number(l.order) || 1,
    active: Boolean(l.active),
  }));
  const incomingIds = new Set((data?.links || []).map(l => String(l.id)));

  // Delete rows that are no longer present
  const toDelete = [...existingLinkIds].filter(id => !incomingIds.has(id));
  if (toDelete.length) {
    await supabase.from('links').delete().in('id', toDelete);
  }
  if (incomingLinks.length) {
    await supabase.from('links').upsert(incomingLinks, { onConflict: 'id' });
  }

  // PRODUCTS: upsert by id, delete removed
  const { data: existingProducts, error: fetchProductsError } = await supabase
    .from('products')
    .select('id')
    .eq('profile_id', profileId);
  
  if (fetchProductsError) {
    console.error('Error fetching existing products:', fetchProductsError);
    throw fetchProductsError;
  }
  
  const existingProductIds = new Set((existingProducts || []).map(r => r.id));
  const incomingProducts = (data?.products || []).map(p => ({
    id: p.id && String(p.id).length > 0 ? p.id : undefined,
    profile_id: profileId,
    title: p.title || 'Untitled Product',
    brand: p.brand || 'Unknown',
    price: Number(p.price) || 0,
    currency: p.currency || 'USD',
    url: p.url || '#',
    image: p.image || '/placeholder.svg',
    clicks: typeof p.clicks === 'number' ? p.clicks : 0,
    ctr: typeof p.ctr === 'number' ? p.ctr : 0.0,
    active: Boolean(p.active),
    created_at: p.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  
  const incomingProdIds = new Set((data?.products || []).map(p => String(p.id)));
  const prodToDelete = [...existingProductIds].filter(id => !incomingProdIds.has(id));
  
  if (prodToDelete.length) {
    const { error: deleteProductsError } = await supabase
      .from('products')
      .delete()
      .in('id', prodToDelete);
    
    if (deleteProductsError) {
      console.error('Error deleting products:', deleteProductsError);
      throw deleteProductsError;
    }
  }
  
  if (incomingProducts.length) {
    const { error: upsertProductsError } = await supabase
      .from('products')
      .upsert(incomingProducts, { onConflict: 'id' });
    
    if (upsertProductsError) {
      console.error('Error upserting products:', upsertProductsError);
      throw upsertProductsError;
    }
  }
};

// LOAD DATA (profile+design+links+products)
export const loadFromBackend = async (profileId = null) => {
  if (!profileId) return defaultData;

  // Fetch profile
  const { data: profileRow } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();
  if (!profileRow) return defaultData;

  // Fetch design
  const { data: designRow } = await supabase
    .from('designs')
    .select('*')
    .eq('profile_id', profileId)
    .maybeSingle();

  // Fetch links
  const { data: linkRows } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profileId)
    .order('order', { ascending: true });

  // Fetch products
  const { data: productRows } = await supabase
    .from('products')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: true });

  return {
    profile: mapProfileRowToApp(profileRow),
    design: mapDesignRowToApp(designRow),
    links: (linkRows || []).map(mapLinkRowToApp),
    products: (productRows || []).map(mapProductRowToApp),
    analytics: defaultData.analytics,
  };
};

// PROFILE LIST CRUD (used by DashboardContext)
export const saveProfileToBackend = async (profiles) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  for (const p of profiles) {
    // Do not send client-generated ids; let Supabase generate UUIDs.
    await supabase.from('profiles').upsert({
      user_id: userId,
      username: p.username,
      display_name: p.displayName,
      bio: p.bio || null,
      avatar_url: p.avatar || null,
      custom_url: p.customUrl || null,
      is_live: Boolean(p.isLive),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'username' });
  }
};

export const loadProfilesFromBackend = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const { data: rows } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  return (rows || []).map(mapProfileRowToApp);
};

export const getProfileUrl = (username) => {
  return `https://vizitlink.com/${username}`;
};

// Check if a username is available (fast, head request with count)
export const isUsernameAvailable = async (username) => {
  if (!username || username.length < 3) return false;
  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('username', username.toLowerCase());
  if (error) {
    console.error('Username availability check failed:', error);
    return false;
  }
  return (count || 0) === 0;
};

// Given a base string, generate a few candidate usernames and return available ones
export const getUsernameSuggestions = async (base) => {
  const clean = (base || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);
  const seed = clean || 'user';
  const now = Date.now().toString().slice(-4);
  const candidates = Array.from(new Set([
    seed,
    `${seed}${now.slice(0, 2)}`,
    `${seed}${now}`,
    `${seed}official`,
    `${seed}studio`,
    `${seed}_${Math.floor(Math.random() * 90 + 10)}`,
  ])).slice(0, 6);

  // Query availability for all candidates in one request
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .in('username', candidates);
  if (error) {
    console.error('Suggestion check failed:', error);
    return candidates;
  }
  const taken = new Set((data || []).map((r) => r.username));
  return candidates.filter((c) => !taken.has(c));
};

export async function loadPublicProfileByUsername(username) {
  if (!username) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_live', true)
    .maybeSingle();
  if (!profile) return null;

  const profileId = profile.id;

  const [{ data: design }, { data: links }, { data: products }] = await Promise.all([
    supabase.from('designs').select('*').eq('profile_id', profileId).maybeSingle(),
    supabase.from('links').select('*').eq('profile_id', profileId).eq('active', true).order('order', { ascending: true }),
    supabase.from('products').select('*').eq('profile_id', profileId).eq('active', true).order('created_at', { ascending: true }),
  ]);

  return {
    profile: mapProfileRowToApp(profile),
    design: mapDesignRowToApp(design),
    links: (links || []).map(mapLinkRowToApp),
    products: (products || []).map(mapProductRowToApp),
  };
}

// Migration function is no-op now (local storage removed)
export const migrateToMultipleProfiles = async () => {};
