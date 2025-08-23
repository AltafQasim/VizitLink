import { DashboardData } from '@/types/dashboard';

const STORAGE_KEY = 'vizitlink_dashboard_data';

// Default data
const defaultData: DashboardData = {
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
      title: 'My Product',
      description: 'Product description',
      price: 29.99,
      imageUrl: '',
      active: true,
      createdAt: new Date().toISOString(),
    },
  ],
  design: {
    theme: 'default',
    wallpaper: '',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonStyle: 'rounded',
    fontFamily: 'Inter',
  },
  analytics: {
    views: 1250,
    clicks: 342,
    followers: 89,
    subscribers: 23,
  },
};

export const saveToBackend = async (data: DashboardData): Promise<void> => {
  // Currently using localStorage, can be replaced with Supabase API calls
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const loadFromBackend = async (): Promise<DashboardData> => {
  // Currently using localStorage, can be replaced with Supabase API calls
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return default data if nothing stored
  return defaultData;
};

export const getProfileUrl = (username: string): string => {
  return `https://vizitlink.com/${username}`;
};
