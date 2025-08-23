# Supabase Authentication Setup

## 1. Supabase Project Setup

1. [Supabase](https://supabase.com) पर जाएं और एक नया project बनाएं
2. Project settings में जाएं और API keys copy करें

## 2. Environment Variables

`.env.local` file बनाएं और निम्नलिखित variables add करें:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 3. Google OAuth Setup

### Supabase में:
1. Authentication > Settings > Auth Providers में जाएं
2. Google provider को enable करें
3. Google OAuth credentials add करें

### Google Cloud Console में:
1. [Google Cloud Console](https://console.cloud.google.com) में जाएं
2. नया project बनाएं या existing project select करें
3. APIs & Services > Credentials में जाएं
4. "Create Credentials" > "OAuth 2.0 Client IDs" select करें
5. Application type: "Web application" select करें
6. Authorized redirect URIs में add करें:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (development के लिए)

## 4. Features

✅ Google Sign In/Sign Up
✅ Protected Routes
✅ Authentication Context
✅ User Dashboard
✅ Automatic Redirects
✅ Loading States

## 5. Usage

### Login/Signup:
- `/login` या `/signup` पर जाएं
- "Continue with Google" button पर click करें

### Protected Routes:
- `/dashboard` - केवल authenticated users access कर सकते हैं
- Unauthenticated users automatically `/login` पर redirect हो जाएंगे

### Navigation:
- Authenticated users: Dashboard और Log out buttons दिखेंगे
- Unauthenticated users: Log in और Sign up buttons दिखेंगे

## 6. Components

- `AuthContext` - Authentication state management
- `ProtectedRoute` - Route protection wrapper
- `Login` - Login page with Google OAuth
- `Signup` - Signup page with Google OAuth
- `DashboardContent` - Protected dashboard content
- `StickyNavbar` - Updated with auth state

## 7. Security

- All sensitive routes are protected
- Authentication state is managed globally
- Automatic session management
- Secure OAuth flow with Supabase
