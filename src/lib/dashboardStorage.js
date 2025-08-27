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
    theme: '', // Start with no theme selected
    wallpaper: '', // Start with no wallpaper selected
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

export const saveToBackend = async (data, profileId = null) => {
  // If profileId is provided, save to profile-specific storage
  const storageKey = profileId ? `vizitlink_profile_${profileId}` : STORAGE_KEY;
  localStorage.setItem(storageKey, JSON.stringify(data));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const loadFromBackend = async (profileId = null) => {
  // If profileId is provided, load from profile-specific storage
  const storageKey = profileId ? `vizitlink_profile_${profileId}` : STORAGE_KEY;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    const parsed = JSON.parse(stored);
    // Normalize legacy product shape to the new schema
    if (Array.isArray(parsed?.products)) {
      parsed.products = parsed.products.map((p) => ({
        id: p.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: p.title || 'Untitled Product',
        brand: p.brand || p.vendor || 'Unknown',
        price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
        currency: p.currency || 'USD',
        url: p.url || p.link || '#',
        image: p.image || p.imageUrl || '/placeholder.svg',
        clicks: typeof p.clicks === 'number' ? p.clicks : 0,
        ctr: typeof p.ctr === 'number' ? p.ctr : 0.0,
        active: typeof p.active === 'boolean' ? p.active : true,
        createdAt: p.createdAt || new Date().toISOString(),
      }));
    }
    return parsed;
  }
  
  // Return default data if nothing stored
  return defaultData;
};

export const saveProfileToBackend = async (profiles) => {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const loadProfilesFromBackend = async () => {
  const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
  
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed;
  }
  
  // Return default profiles if nothing stored
  return defaultProfiles;
};

export const getProfileUrl = (username) => {
  return `https://vizitlink.com/${username}`;
};

// Migration function for existing users
export const migrateToMultipleProfiles = async () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) return;
  
  try {
    const parsed = JSON.parse(existingData);
    
    // Create a profile from existing data
    const profile = {
      id: 'profile_1',
      username: parsed.profile?.username || 'user',
      displayName: parsed.profile?.displayName || 'Your Name',
      bio: parsed.profile?.bio || 'Add your bio here',
      avatar: parsed.profile?.avatar || '',
      customUrl: parsed.profile?.customUrl || 'vizitlink.com/user',
      isLive: parsed.profile?.isLive || true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save profiles
    await saveProfileToBackend([profile]);
    
    // Save profile data
    await saveToBackend(parsed, profile.id);
    
    // Remove old storage
    localStorage.removeItem(STORAGE_KEY);
    
    console.log('Successfully migrated to multiple profiles');
  } catch (error) {
    console.error('Error migrating to multiple profiles:', error);
  }
};
