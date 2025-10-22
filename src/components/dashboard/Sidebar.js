"use client";

import { motion } from 'framer-motion';
import { useDashboard } from '../../context/DashboardContext';
import ProfileSwitcher from './ProfileSwitcher';
import {
  Link as LinkIcon,
  ShoppingBag,
  Palette,
  Users,
  BarChart3,
  Settings,
  Wrench,
  Folder,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

// Profile-related tabs (shown with live preview)
const profileMenuItems = [
  { id: 'links', label: 'Links', icon: LinkIcon },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'design', label: 'Design', icon: Palette },
];

// Other top-level menu items
const otherMenuItems = [
  { id: 'profiles', label: 'Profiles', icon: Users },
  // { id: 'audience', label: 'Audience', icon: Users },
  // { id: 'insights', label: 'Insights', icon: BarChart3 },
  // { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, data } = useDashboard();
  const [isProfileSectionOpen, setIsProfileSectionOpen] = useState(true);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.pathname = `/dashboard/${tabId}`;
      url.searchParams.delete('tab');
      window.history.pushState({}, '', url.toString());
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col overflow-y-auto scroll-elegant scrollbar-accent"
    >
      
      {/* Navigation */}
      <nav className="p-4">
        {/* Current Profile Section */}
        <div className="mb-2">
          <button
            onClick={() => setIsProfileSectionOpen(!isProfileSectionOpen)}
            className="w-full flex items-center justify-between px-2 py-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5" />
              <span>My VizitLink</span>
            </div>
            {isProfileSectionOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          <motion.ul
            initial={false}
            animate={{
              height: isProfileSectionOpen ? 'auto' : 0,
              opacity: isProfileSectionOpen ? 1 : 0
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="space-y-1 overflow-hidden"
          >
            {profileMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <motion.li
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-1 rounded-lg text-left transition-all duration-200 ${isActive
                        ? 'bg-gradient-to-r from-purple-100 to-blue-50 text-purple-700 font-medium shadow-sm border border-purple-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : ''}`} />
                    <span className='text-sm'>{item.label}</span>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 mb-4"></div>

        {/* Other Menu Items */}
        <ul className="space-y-1">
          {otherMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.li
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-1 rounded-lg text-left transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-purple-100 to-blue-50 text-purple-700 font-medium shadow-sm border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : ''}`} />
                  <span className='text-sm'>{item.label}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Quick actions */}
      {/* <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 mb-3 border border-purple-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-purple-900 font-semibold mb-1">New growth tools</p>
              <p className="text-xs text-purple-700 mb-2">Boost your engagement</p>
              <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                Get started →
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-gray-900">Setup checklist</p>
              <p className="text-xs text-gray-500 mt-0.5">5 of 6 complete</p>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin-slow relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-purple-600">83%</span>
              </div>
            </div>
          </div>
          <button className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
            Finish setup
          </button>
        </div>
      </div> */}
    </motion.div>
  );
}
