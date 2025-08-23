"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { DashboardData, TabType } from '@/types/dashboard';
import { saveToBackend, loadFromBackend } from '@/lib/dashboardStorage';

interface DashboardContextType {
  data: DashboardData;
  activeTab: TabType;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  setActiveTab: (tab: TabType) => void;
  updateData: (updates: Partial<DashboardData>) => void;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [originalData, setOriginalData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('links');
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

  const updateData = (updates: Partial<DashboardData>) => {
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
