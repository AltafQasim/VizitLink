"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { saveToBackend, loadFromBackend, saveProfileToBackend, loadProfilesFromBackend, migrateToMultipleProfiles, loadLinksForProfile, loadProductsForProfile, loadDesignForProfile, loadProfileForId } from '../lib/dashboardStorage';

const DashboardContext = createContext(undefined);

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [activeTab, setActiveTab] = useState('links');
  const lastFetchedRef = useRef({ links: null, products: null, design: null });
  const [isLoading, setIsLoading] = useState(true);
  
  // Multiple profiles support
  const [profiles, setProfiles] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  
  // New state for profile creation flow
  const [needsProfileCreation, setNeedsProfileCreation] = useState(false);
  
  // Undo/Redo functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 20;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Migrate existing users to multiple profiles system
        await migrateToMultipleProfiles();
        
        // Load profiles first
        const loadedProfiles = await loadProfilesFromBackend();
        setProfiles(loadedProfiles);
        
        // Check if user has any profiles
        if (loadedProfiles.length > 0) {
          const lastUsedProfile = localStorage.getItem('vizitlink_last_profile');
          const profileToUse = lastUsedProfile && loadedProfiles.find(p => p.id === lastUsedProfile) 
            ? lastUsedProfile 
            : loadedProfiles[0].id;
          
          setCurrentProfileId(profileToUse);
          
          // Load current profile data
          const loadedData = await loadFromBackend(profileToUse);
          setData(loadedData);
          setOriginalData(loadedData);
          setHistory([loadedData]);
          setHistoryIndex(0);
          setNeedsProfileCreation(false);
        } else {
          // User has no profiles, show profile creation form
          setNeedsProfileCreation(true);
          setActiveTab('profiles'); // Switch to profiles tab
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Refresh-on-tab when needed only
  useEffect(() => {
    const refreshByTab = async () => {
      if (!currentProfileId || !data) return;
      try {
        if (activeTab === 'links') {
          const fresh = await loadLinksForProfile(currentProfileId);
          // Avoid extra state updates if unchanged
          if (JSON.stringify(fresh) !== JSON.stringify(data.links)) {
            setData(prev => ({ ...prev, links: fresh }));
          }
          lastFetchedRef.current.links = Date.now();
        } else if (activeTab === 'shop') {
          const fresh = await loadProductsForProfile(currentProfileId);
          if (JSON.stringify(fresh) !== JSON.stringify(data.products)) {
            setData(prev => ({ ...prev, products: fresh }));
          }
          lastFetchedRef.current.products = Date.now();
        } else if (activeTab === 'design') {
          const [freshDesign, freshProfile] = await Promise.all([
            loadDesignForProfile(currentProfileId),
            loadProfileForId(currentProfileId)
          ]);
          if (JSON.stringify(freshDesign) !== JSON.stringify(data.design) || JSON.stringify(freshProfile) !== JSON.stringify(data.profile)) {
            setData(prev => ({ ...prev, design: freshDesign, profile: freshProfile }));
          }
          lastFetchedRef.current.design = Date.now();
        }
      } catch (e) {
        console.error('Tab refresh failed:', e);
      }
    };

    refreshByTab();
  }, [activeTab, currentProfileId]);

  // Profile management functions
  const createProfile = useCallback(async (profileData) => {
    // First persist basic profile without id (UUID generated in DB)
    await saveProfileToBackend([
      ...profiles,
      {
        username: profileData.username,
        displayName: profileData.displayName,
        bio: profileData.bio || '',
        avatar: profileData.avatar || '',
        customUrl: `vizitlink.com/${profileData.username}`,
        isLive: true,
      },
    ]);

    // Reload profiles from backend to get the UUID
    const refreshed = await loadProfilesFromBackend();
    setProfiles(refreshed);
    const created = refreshed.find(p => p.username === profileData.username);
    if (!created) return null;

    // Create default data for the new profile id
    const defaultProfileData = {
      profile: created,
      links: [],
      products: [],
      design: {
        theme: '',
        wallpaper: '',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        buttonStyle: 'Minimal',
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: '16px',
        hideVizitlinkFooter: false,
      },
      analytics: {
        views: 0,
        clicks: 0,
        followers: 0,
        subscribers: 0,
      },
    };

    await saveToBackend(defaultProfileData, created.id);
    setCurrentProfileId(created.id);
    setData(defaultProfileData);
    setOriginalData(defaultProfileData);
    setHistory([defaultProfileData]);
    setHistoryIndex(0);
    localStorage.setItem('vizitlink_last_profile', created.id);

    return created;
  }, [profiles]);

  const switchProfile = useCallback(async (profileId) => {
    if (profileId === currentProfileId) return;
    
    try {
      // Save current profile data if exists
      if (data && currentProfileId) {
        await saveToBackend(data, currentProfileId);
      }
      
      // Load new profile data
      const newProfileData = await loadFromBackend(profileId);
      setData(newProfileData);
      setOriginalData(newProfileData);
      setCurrentProfileId(profileId);
      
      // Update last used profile
      localStorage.setItem('vizitlink_last_profile', profileId);
      
      // Reset history for new profile
      setHistory([newProfileData]);
      setHistoryIndex(0);
    } catch (error) {
      console.error('Error switching profile:', error);
    }
  }, [currentProfileId, data]);

  const updateProfile = useCallback(async (profileId, updates) => {
    const updatedProfiles = profiles.map(p => 
      p.id === profileId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    setProfiles(updatedProfiles);
    await saveProfileToBackend(updatedProfiles);
    
    // Update current profile data if it's the active one
    if (profileId === currentProfileId && data) {
      const updatedData = { ...data, profile: { ...data.profile, ...updates } };
      setData(updatedData);
    }
  }, [profiles, currentProfileId, data]);

  const deleteProfile = useCallback(async (profileId) => {
    if (profiles.length <= 1) {
      throw new Error('Cannot delete the last profile');
    }
    
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    await saveProfileToBackend(updatedProfiles);
    
    // If deleted profile was current, switch to first available
    if (profileId === currentProfileId) {
      const nextProfile = updatedProfiles[0];
      await switchProfile(nextProfile.id);
    }
    
    // Remove profile data from storage
    localStorage.removeItem(`vizitlink_profile_${profileId}`);
  }, [profiles, currentProfileId, switchProfile]);

  const duplicateProfile = useCallback(async (profileId) => {
    const profileToDuplicate = profiles.find(p => p.id === profileId);
    if (!profileToDuplicate) return;
    
    const duplicatedProfile = await createProfile({
      username: `${profileToDuplicate.username}_copy`,
      displayName: `${profileToDuplicate.displayName} (Copy)`,
      bio: profileToDuplicate.bio,
      avatar: profileToDuplicate.avatar,
    });
    
    // Duplicate the profile data
    const profileData = await loadFromBackend(profileId);
    if (profileData) {
      const duplicatedData = {
        ...profileData,
        profile: duplicatedProfile,
        analytics: {
          views: 0,
          clicks: 0,
          followers: 0,
          subscribers: 0,
        },
      };
      await saveToBackend(duplicatedData, duplicatedProfile.id);
    }
  }, [profiles, createProfile]);

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

  const saveChanges = useCallback(async (overrideData) => {
    const snapshot = overrideData || data;
    if (snapshot) {
      try {
        await saveToBackend(snapshot, currentProfileId);
        setOriginalData(snapshot);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }, [data, currentProfileId]);

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

  // Allow rendering even if data is null when onboarding is needed
  if (isLoading || (!data && !needsProfileCreation)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const value = {
    data,
    setData,
    originalData,
    activeTab,
    setActiveTab,
    isLoading,
    profiles,
    currentProfileId,
    currentProfile: data?.profile,
    switchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
    needsProfileCreation,
    setNeedsProfileCreation,
    hasUnsavedChanges,
    isLoading,
    canUndo,
    canRedo,
    // Profile management
    profiles,
    currentProfileId,
    currentProfile: profiles.find(p => p.id === currentProfileId),
    setActiveTab,
    updateData,
    updateDesignData,
    saveChanges,
    resetChanges,
    undo,
    redo,
    // Profile functions
    createProfile,
    switchProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
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
