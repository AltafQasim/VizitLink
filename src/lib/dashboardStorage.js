const STORAGE_KEY = 'vizitlink_dashboard_data';

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
    theme: 'Blocks',
    wallpaper: 'Hero',
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

export const saveToBackend = async (data) => {
  // Currently using localStorage, can be replaced with Supabase API calls
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const loadFromBackend = async () => {
  // Currently using localStorage, can be replaced with Supabase API calls
  const stored = localStorage.getItem(STORAGE_KEY);
  
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

export const getProfileUrl = (username) => {
  return `https://vizitlink.com/${username}`;
};
