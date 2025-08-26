"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { saveToBackend, loadFromBackend } from '../lib/dashboardStorage';

const DashboardContext = createContext(undefined);

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [activeTab, setActiveTab] = useState('links');
  const [isLoading, setIsLoading] = useState(true);
  
  // Undo/Redo functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 20;

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await loadFromBackend();
        setData(loadedData);
        setOriginalData(loadedData);
        // Initialize history with loaded data
        setHistory([loadedData]);
        setHistoryIndex(0);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addToHistory = useCallback((newData) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(newData);
      
      // Keep only the last maxHistorySize items
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }
      
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const updateData = useCallback((updates) => {
    if (data) {
      const newData = { ...data, ...updates };
      setData(newData);
      
      // Don't add profile image changes to history
      if (!updates.profile?.avatar) {
        addToHistory(newData);
      }
    }
  }, [data, addToHistory]);

  const updateDesignData = useCallback((designUpdates) => {
    if (data) {
      const newData = {
        ...data,
        design: {
          ...data.design,
          ...designUpdates
        }
      };
      setData(newData);
      addToHistory(newData);
    }
  }, [data, addToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
    }
  }, [history, historyIndex]);

  const saveChanges = useCallback(async () => {
    if (data) {
      try {
        await saveToBackend(data);
        setOriginalData(data);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }, [data]);

  const resetChanges = useCallback(() => {
    if (originalData) {
      setData(originalData);
      // Reset history to original data
      setHistory([originalData]);
      setHistoryIndex(0);
    }
  }, [originalData]);

  const hasUnsavedChanges = data && originalData && JSON.stringify(data) !== JSON.stringify(originalData);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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
    canUndo,
    canRedo,
    setActiveTab,
    updateData,
    updateDesignData,
    saveChanges,
    resetChanges,
    undo,
    redo,
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
