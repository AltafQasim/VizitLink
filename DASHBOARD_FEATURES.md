# VizitLink Admin Dashboard

## 🎯 Overview

A complete admin dashboard for VizitLink, inspired by Vizitlink, built with Next.js, React, TailwindCSS, and Framer Motion.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Styling**: TailwindCSS + Framer Motion animations
- **State Management**: React Context + localStorage
- **Authentication**: Supabase Auth with Google OAuth
- **UI Components**: Custom components + Radix UI

### Data Structure
```typescript
interface DashboardData {
  profile: Profile;        // User profile info
  links: Link[];          // Social media links
  products: Product[];    // Shop products
  design: DesignSettings; // Theme & styling
  analytics: Analytics;   // Performance metrics
}
```

## 🎨 Features

### ✅ Implemented

#### 1. **Authentication System**
- Google OAuth integration with Supabase
- Protected routes with automatic redirects
- User session management
- Logout functionality

#### 2. **Dashboard Layout**
- **Top Navbar**: Logo, profile URL, save button, user menu
- **Left Sidebar**: Navigation menu with 7 sections
- **Main Panel**: Dynamic content area
- **Live Preview**: Mobile mockup with real-time updates

#### 3. **Links Management** (Fully Functional)
- Add/edit/delete links
- Toggle active/inactive status
- Drag & drop reordering (UI ready)
- Icon selection
- URL validation
- Real-time preview updates

#### 4. **Live Preview**
- Mobile mockup with realistic design
- Real-time updates as you edit
- Profile display with avatar
- Active links with social icons
- Shop section preview
- Status indicators

#### 5. **State Management**
- Global dashboard context
- Unsaved changes detection
- Auto-save functionality
- localStorage persistence
- Supabase-ready data structure

### 🚧 Coming Soon

#### 1. **Shop Management**
- Product CRUD operations
- Image upload functionality
- Pricing management
- Inventory tracking

#### 2. **Design Customization**
- Theme selection
- Color customization
- Font selection
- Background options
- Button styles

#### 3. **Analytics Dashboard**
- View/click tracking
- Performance graphs
- Audience insights
- Growth metrics

#### 4. **Tools Section**
- Social media planner
- Instagram auto-reply
- Link shortener
- Content ideas generator

#### 5. **Settings Panel**
- Account management
- Billing & subscriptions
- Privacy settings
- Integration options

## 🔧 Setup Instructions

### 1. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Tables (Future)
```sql
-- Users table (handled by Supabase Auth)
-- Profiles table
-- Links table
-- Products table
-- Design_settings table
-- Analytics table
```

### 3. Google OAuth Setup
- Configure Google Cloud Console
- Add redirect URIs
- Enable Google provider in Supabase

## 🎯 Key Components

### Core Components
- `DashboardLayout` - Main layout wrapper
- `TopNavbar` - Header with user controls
- `Sidebar` - Navigation menu
- `LivePreview` - Mobile mockup
- `LinksTab` - Links management interface

### Context Providers
- `AuthProvider` - Authentication state
- `DashboardProvider` - Dashboard data & state

### Utilities
- `dashboardStorage.ts` - localStorage + Supabase integration
- `types/dashboard.ts` - TypeScript definitions

## 🎨 Design System

### Colors
- **Primary**: Purple (#7C3AED)
- **Secondary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Animations
- Page transitions with Framer Motion
- Hover effects on interactive elements
- Loading states with spinners
- Smooth tab switching

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Flexible layout system

## 🔄 Data Flow

1. **Load**: `loadFromBackend()` → localStorage → Context
2. **Update**: User action → Context update → UI re-render
3. **Save**: Manual save → `saveToBackend()` → localStorage
4. **Preview**: Context changes → Live preview updates

## 🚀 Future Enhancements

### Phase 1: Complete Core Features
- [ ] Shop management
- [ ] Design customization
- [ ] Analytics dashboard

### Phase 2: Advanced Features
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] API integrations

### Phase 3: Enterprise Features
- [ ] White-label solutions
- [ ] Advanced customization
- [ ] Enterprise analytics

## 📱 Mobile Responsiveness

The dashboard is fully responsive with:
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Optimized layouts for all screen sizes
- Mobile-first design approach

## 🔒 Security Features

- Protected routes with authentication
- Secure OAuth flow
- Data validation
- XSS protection
- CSRF protection (via Supabase)

## 📊 Performance

- Optimized bundle size
- Lazy loading for components
- Efficient state management
- Minimal re-renders
- Fast page transitions
