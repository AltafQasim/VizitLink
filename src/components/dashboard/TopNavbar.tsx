"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { getProfileUrl } from '@/lib/dashboardStorage';
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

export default function TopNavbar() {
  const { user, signOut } = useAuth();
  const { data, hasUnsavedChanges, saveChanges } = useDashboard();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    const url = getProfileUrl(data.profile.username);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    await saveChanges();
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

        {data.profile.isLive && (
          <div className="flex items-center space-x-1 text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Save button */}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save Changes
            </Button>
          </motion.div>
        )}

        {/* Upgrade button */}
        <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button>

        {/* User menu */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>

          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
              
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Account Settings
              </button>
              
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </button>
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button 
                  onClick={signOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
