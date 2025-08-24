"use client";

import { motion } from 'framer-motion';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Link as LinkIcon, 
  ShoppingBag, 
  Palette, 
  Users, 
  BarChart3, 
  Settings, 
  Wrench,
  Plus
} from 'lucide-react';

const menuItems = [
  { id: 'links', label: 'My VizitLink', icon: LinkIcon },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'audience', label: 'Audience', icon: Users },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useDashboard();

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col"
    >
      {/* User info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">U</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">User</p>
            <p className="text-sm text-gray-500">Free Plan</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.li key={item.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-purple-100 text-purple-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Quick actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-purple-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-purple-700 font-medium mb-1">New growth tools</p>
          <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold">
            Get started →
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">Your setup checklist</p>
            <p className="text-xs text-gray-500">5 of 6 complete</p>
          </div>
          <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold">
            Finish setup
          </button>
        </div>
      </div>
    </motion.div>
  );
}
