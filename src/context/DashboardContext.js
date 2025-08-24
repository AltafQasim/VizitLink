"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { saveToBackend, loadFromBackend } from '../lib/dashboardStorage';

const DashboardContext = createContext(undefined);

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [activeTab, setActiveTab] = useState('links');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await loadFromBackend();
        setData(loadedData);
        setOriginalData(loadedData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateData = (updates) => {
    if (data) {
      setData({ ...data, ...updates });
    }
  };

  const saveChanges = async () => {
    if (data) {
      try {
        await saveToBackend(data);
        setOriginalData(data);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  const resetChanges = () => {
    if (originalData) {
      setData(originalData);
    }
  };

  const hasUnsavedChanges = data && originalData && JSON.stringify(data) !== JSON.stringify(originalData);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const value = {
    data,
    activeTab,
    hasUnsavedChanges,
    isLoading,
    setActiveTab,
    updateData,
    saveChanges,
    resetChanges,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
