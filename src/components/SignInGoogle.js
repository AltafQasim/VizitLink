"use client";

import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from './GoogleIcon';

const GoogleAuthButton = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <Button 
      onClick={handleGoogleSignIn}
      variant="outline" 
      className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-3xl flex items-center justify-center gap-3 transition-colors duration-200"
    >
      <GoogleIcon className="w-5 h-5" />
      <span className="text-gray-700 font-medium text-base">Continue with Google</span>
    </Button>
  );
};

export default GoogleAuthButton;