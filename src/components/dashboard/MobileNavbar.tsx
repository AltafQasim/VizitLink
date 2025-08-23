"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { getProfileUrl } from '@/lib/dashboardStorage';
import { 
  Menu, 
  X, 
  Copy, 
  Check, 
  Settings, 
  LogOut,
  Crown,
  User,
  Bell,
  Save
} from 'lucide-react';

export default function MobileNavbar() {
  const { user, signOut } = useAuth();
  const { data, hasUnsavedChanges, saveChanges, activeTab, setActiveTab } = useDashboard();
  const [showMenu, setShowMenu] = useState(false);
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

  const menuItems = [
    { id: 'links', label: 'My VizitLink' },
    { id: 'shop', label: 'Shop' },
    { id: 'design', label: 'Design' },
    { id: 'audience', label: 'Audience' },
    { id: 'insights', label: 'Insights' },
    { id: 'tools', label: 'Tools' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-gray-900 text-lg">VizitLink</h1>
          <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Save button */}
          {hasUnsavedChanges && (
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white px-3"
            >
              <Save className="w-4 h-4" />
            </Button>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          </Button>

          {/* Menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="p-2"
          >
            {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-gray-200"
          >
            {/* Profile URL */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-600 truncate">
                  {getProfileUrl(data.profile.username)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="h-6 w-6 p-0 ml-2"
                >
                  {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              
              {data.profile.isLive && (
                <div className="flex items-center space-x-1 text-green-600 text-sm mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-4 py-2">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User section */}
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                  <p className="text-xs text-gray-500">Free Plan</p>
                </div>
              </div>

              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Account Settings
                </button>
                
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </button>
                
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </button>
                
                <button 
                  onClick={signOut}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
