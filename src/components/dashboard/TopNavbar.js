"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { getProfileUrl } from '../../lib/dashboardStorage';
import { 
  Bell, 
  ChevronDown, 
  Copy, 
  Check, 
  Settings, 
  LogOut,
  Crown,
  User
} from 'lucide-react';
import ProfileSwitcher from './ProfileSwitcher';

export default function TopNavbar() {
  const { user, signOut } = useAuth();
  const { data } = useDashboard();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    const username = data?.profile?.username;
    if (!username) return;
    const url = getProfileUrl(username);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4 items-center justify-between"
    >
      {/* Left side */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-gray-900 text-xl">VizitLink</h1>
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Profile URL */}
        {data?.profile?.username && (
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-600">{getProfileUrl(data.profile.username)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUrl}
              className="h-6 w-6 p-0"
            >
              {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        )}

        {data?.profile?.isLive && (
          <div className="flex items-center space-x-1 text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        )}
      </div>
      
      {/* User/Profile Switcher */}
      <div className="border-gray-100">
        <ProfileSwitcher />
      </div>


      {/* Right side */}
      {/* <div className="flex items-center space-x-4"> */}
        {/* Upgrade button */}
        {/* <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Button> */}

        {/* Notifications */}
        {/* <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button> */}

      {/* </div> */}
    </motion.div>
  );
}
