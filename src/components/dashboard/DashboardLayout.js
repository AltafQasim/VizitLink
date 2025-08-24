"use client";

import { motion, AnimatePresence } from 'framer-motion';
import TopNavbar from './TopNavbar';
import MobileNavbar from './MobileNavbar';
import Sidebar from './Sidebar';
import LivePreview from './LivePreview';
import MobilePreview from './MobilePreview';
import LinksTab from './tabs/LinksTab';
import ProductsTab from './tabs/ProductsTab';
import { useDashboard } from '../../context/DashboardContext';

export default function DashboardLayout() {
  const { activeTab } = useDashboard();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'links':
        return <LinksTab />;
      case 'shop':
        return <ProductsTab />;
      case 'design':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Design</h2>
              <p className="text-gray-600">Customize your VizitLink appearance</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Design customization coming soon...</p>
            </div>
          </div>
        );
      case 'audience':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Audience</h2>
              <p className="text-gray-600">View your followers and subscribers</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Audience analytics coming soon...</p>
            </div>
          </div>
        );
      case 'insights':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Insights</h2>
              <p className="text-gray-600">Analytics and performance metrics</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Analytics dashboard coming soon...</p>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tools</h2>
              <p className="text-gray-600">Growth tools and utilities</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Growth tools coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-600">Account and billing settings</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <LinksTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Navigation */}
      <MobileNavbar />
      
      {/* Desktop Top Navbar */}
      <TopNavbar />
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Panel */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Live Preview */}
        <LivePreview />
      </div>
      
      {/* Mobile Preview */}
      <MobilePreview />
    </div>
  );
}
