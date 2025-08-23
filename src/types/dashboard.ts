export interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

export interface DesignSettings {
  theme: string;
  wallpaper: string;
  backgroundColor: string;
  textColor: string;
  buttonStyle: string;
  fontFamily: string;
}

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  customUrl: string;
  isLive: boolean;
}

export interface Analytics {
  views: number;
  clicks: number;
  followers: number;
  subscribers: number;
}

export interface DashboardData {
  profile: Profile;
  links: Link[];
  products: Product[];
  design: DesignSettings;
  analytics: Analytics;
}

export type TabType = 'links' | 'shop' | 'design' | 'audience' | 'insights' | 'tools' | 'settings';
