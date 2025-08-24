"use client";

import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

const GoogleAuthButton = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <Button 
      onClick={handleGoogleSignIn}
      variant="outline" 
      className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200"
    >
      <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">G</div>
      <span className="text-gray-700 font-medium text-base">Continue with Google</span>
    </Button>
  );
};

export default GoogleAuthButton;
