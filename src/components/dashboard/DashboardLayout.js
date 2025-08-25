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
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
  const { activeTab, setActiveTab } = useDashboard();
  const [isFading, setIsFading] = useState(false);

  // Read initial tab from path (/dashboard/links) or query (?tab=links)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const pathParts = url.pathname.split('/');
    const pathTab = pathParts[2]; // /dashboard/{tab}
    const queryTab = url.searchParams.get('tab');
    const nextTab = pathTab || queryTab;
    if (nextTab) setActiveTab(nextTab);

    const handlePop = () => {
      const u = new URL(window.location.href);
      const parts = u.pathname.split('/');
      const pTab = parts[2];
      const qTab = u.searchParams.get('tab');
      const nTab = pTab || qTab || 'links';
      setActiveTab(nTab);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [setActiveTab]);

  // Trigger a smooth fade only for the center content
  useEffect(() => {
    setIsFading(true);
    const t = setTimeout(() => setIsFading(false), 180);
    return () => clearTimeout(t);
  }, [activeTab]);

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
        <div className="flex-1 overflow-y-auto max-h-[calc(100dvh-100px)] relative scroll-elegant scrollbar-accent">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
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
