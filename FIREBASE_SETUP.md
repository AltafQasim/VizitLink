# Firebase Authentication Setup

This project uses Firebase Authentication for Google sign-in. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "VizitLink")
4. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project console, go to "Authentication"
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Google" as a sign-in provider
5. Configure Google sign-in with your Google Cloud project

## 3. Get Your Firebase Config

1. In your Firebase project console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web"
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

## 5. Configure Google OAuth

1. In Firebase Console, go to Authentication > Sign-in method
2. Click on "Google" provider
3. Enable it and add your authorized domains
4. For development, add `localhost` to authorized domains

## 6. Test the Setup

1. Run your development server: `npm run dev`
2. Go to `/signup` or `/login`
3. Try signing in with Google
4. You should be redirected to the dashboard after successful authentication

## Features Implemented

- ✅ Google Authentication
- ✅ User state management with React Context
- ✅ Protected dashboard route
- ✅ Sign out functionality
- ✅ Loading states
- ✅ Error handling

## File Structure

```
src/
├── lib/
│   └── firebase.ts          # Firebase configuration and auth functions
├── contexts/
│   └── AuthContext.tsx      # Authentication context provider
├── components/
│   ├── Signup.tsx          # Updated with Firebase auth
│   └── Login.tsx           # Updated with Firebase auth
└── app/
    ├── layout.tsx          # Updated with AuthProvider
    └── dashboard/
        └── page.tsx        # Protected dashboard page
```

## Next Steps

1. Add email/password authentication
2. Implement user profile management
3. Add database integration (Firestore)
4. Add more social login providers
5. Implement password reset functionality
