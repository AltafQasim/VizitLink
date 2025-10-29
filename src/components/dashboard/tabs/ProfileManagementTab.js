"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/button';
import { useDashboard } from '../../../context/DashboardContext';
import { supabase } from '../../../lib/supabase';
import { isUsernameAvailable } from '../../../lib/dashboardStorage';
import { toast } from 'sonner';
import {
  Plus,
  Edit3,
  Trash2,
  Settings,
  Eye,
  ExternalLink,
  Calendar,
  Users,
  BarChart3,
  Globe,
  X,
  ChevronLeft,
  Info,
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { BASE_URL } from '../../../lib/constants';

export default function ProfileManagementTab() {
  const {
    profiles,
    currentProfileId,
    currentProfile,
    switchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    needsProfileCreation, // Add this new state
    setNeedsProfileCreation // Add this new function
  } = useDashboard();

  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeUsernameModal, setShowChangeUsernameModal] = useState(false);
  const [showConfirmChangeModal, setShowConfirmChangeModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailableState, setIsUsernameAvailableState] = useState(null);
  const debounceRef = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatar: ''
  });

  // If user needs profile, encourage onboarding page
  useEffect(() => {
    if (needsProfileCreation) {
      // No modal; show message and provide button below
    }
  }, [needsProfileCreation]);

  // Username normalization (same as onboarding)
  const normalizeUsername = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);

  // Check if username matches valid pattern (3-20 chars)
  const isValidPattern = useMemo(() => 
    newUsername.length >= 3 && newUsername.length <= 20, 
    [newUsername]
  );

  // Real-time username availability check (identical to onboarding)
  useEffect(() => {
    const value = normalizeUsername(newUsername.trim());
    
    // Reset state if empty
    if (!value) {
      setIsUsernameAvailableState(null);
      return;
    }
    
    // Don't check if less than 3 chars
    if (value.length < 3) {
      setIsUsernameAvailableState(null);
      return;
    }

    // Don't check if username hasn't changed
    if (value === editingProfile?.username) {
      setIsUsernameAvailableState(true);
      return;
    }

    // Debounce the availability check
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const available = await isUsernameAvailable(value);
        setIsUsernameAvailableState(available);
      } catch (error) {
        console.error('Error checking username availability:', error);
        setIsUsernameAvailableState(false);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newUsername, editingProfile?.username]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editingProfile.id, formData);
      setShowEditModal(false);
      setEditingProfile(null);
      setFormData({ username: '', displayName: '', bio: '', avatar: '' });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const openEditModal = (profile) => {
    setEditingProfile(profile);
    setFormData({
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar
    });
    setShowEditModal(true);
  };

  const openChangeUsernameModal = (profile) => {
    setEditingProfile(profile);
    setNewUsername(profile.username);
    setIsUsernameAvailableState(null);
    setShowChangeUsernameModal(true);
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username === editingProfile?.username) {
      setIsUsernameAvailableState(true);
      return true;
    }

    setIsCheckingUsername(true);
    try {
      const available = await isUsernameAvailable(username);
      setIsUsernameAvailableState(available);
      return available;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = normalizeUsername(e.target.value);
    setNewUsername(value);
  };

  const handleReviewUsernameChange = async () => {
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    if (!isValidPattern) {
      toast.error('Please enter 3–20 valid characters');
      return;
    }

    if (isUsernameAvailableState === false) {
      toast.error('This username is already taken');
      return;
    }

    setShowChangeUsernameModal(false);
    setShowConfirmChangeModal(true);
  };

  const handleConfirmUsernameChange = async () => {
    try {
      await updateProfile(editingProfile.id, { ...editingProfile, username: normalizeUsername(newUsername) });
      toast.success('Username updated successfully');
      setShowConfirmChangeModal(false);
      setEditingProfile(null);
      setNewUsername('');
      setIsUsernameAvailableState(null);
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username');
    }
  };

  const cancelUsernameChange = () => {
    setShowChangeUsernameModal(false);
    setShowConfirmChangeModal(false);
    setEditingProfile(null);
    setNewUsername('');
    setIsUsernameAvailableState(null);
  };

  const handleDeleteProfile = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      try {
        await deleteProfile(profileId);
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  const getProfileStats = (profile) => {
    // This would typically come from analytics data
    return {
      views: Math.floor(Math.random() * 10000),
      clicks: Math.floor(Math.random() * 1000),
      followers: Math.floor(Math.random() * 500),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="mt-1 px-3 py-3 sm:px-4 lg:px-6 lg:py-4 sm:sticky sm:top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b border-border rounded-lg flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
          {needsProfileCreation ? (
            <p className="text-gray-600">Welcome! Please create your first profile to get started.</p>
          ) : (
            <p className="text-gray-600">Manage your VizitLink profiles</p>
          )}
        </div>
        {!needsProfileCreation && (
          <Button onClick={() => router.push('/onboarding')} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Create Profile</span>
          </Button>
        )}
      </div>

      {/* Profiles Grid */}
      <div className="bg-background rounded-lg p-3 sm:p-4 lg:p-6 border border-border max-w-full overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const stats = getProfileStats(profile);
          const isActive = profile.id === currentProfileId;

          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`bg-white border rounded-lg p-6 transition-all flex flex-col justify-between border-border hover:shadow-lg hover:border-primary/50 ${isActive
                ? 'border-purple-300 shadow-lg ring-2 ring-purple-100'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-lg font-medium">
                          {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{profile.displayName}</h3>
                      <p className="text-sm text-gray-500">@{profile.username}</p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Active
                    </span>
                  )}
                </div>

                {/* Profile Bio */}
                {profile.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{profile.bio}</p>
                )}
              </div>
              <div>
                {/* Profile Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="font-semibold text-gray-900">{stats.views.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Clicks</p>
                    <p className="font-semibold text-gray-900">{stats.clicks.toLocaleString()}</p>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => switchProfile(profile.id)}
                      disabled={isActive}
                      className={`h-8 sm:h-9 ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      {isActive ? 'Active' : 'Switch to'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openChangeUsernameModal(profile)}
                      className="h-8 sm:h-9"
                    >
                      <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      Change Username
                    </Button>
                  </div>

                  <div className="flex space-x-1">
                    {profiles.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Profile URL */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Profile URL</span>
                    <a
                      href={`${BASE_URL}/${profile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:text-purple-700 flex items-center"
                    >
                      {new URL(BASE_URL).hostname}/{profile.username}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* If no profiles yet, provide clear call-to-action */}
      {needsProfileCreation && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
          <p className="text-sm text-purple-800">You don’t have any profiles yet. Create your first one to get started.</p>
          <Button onClick={() => router.push('/onboarding')} className="ml-4">Create Profile</Button>
        </div>
      )}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && editingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Profile</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(false)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleEditProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add your bio here"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Update Profile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Username Modal - First Modal */}
      <AnimatePresence>
        {showChangeUsernameModal && editingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={cancelUsernameChange}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={cancelUsernameChange}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h3 className="text-xl font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">
                  Change username
                </h3>
                <button
                  onClick={cancelUsernameChange}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Username Input with Real-time Validation */}
              <div className="mb-2">
                <div className="relative">
                  <div className={`flex items-stretch border-2 rounded-xl bg-white overflow-hidden transition-colors ${
                    isCheckingUsername
                      ? 'border-gray-300'
                      : (newUsername && isUsernameAvailableState === true && isValidPattern && editingProfile?.username !== newUsername)
                        ? 'border-green-400'
                        : (newUsername && (isUsernameAvailableState === false || !isValidPattern))
                          ? 'border-red-500'
                          : 'border-gray-300'
                  }`}>
                    <span className="px-4 inline-flex items-center text-gray-500 bg-gray-50 border-r text-base">
                      {new URL(BASE_URL).hostname}/
                    </span>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={handleUsernameChange}
                      className="flex-1 px-3 sm:px-4 py-3 sm:py-4 focus:outline-none focus:border-transparent focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none !outline-none !border-0 !ring-0 !ring-offset-0"
                      placeholder="username"
                      autoFocus
                    />
                    <span className="w-12 flex items-center justify-center">
                      {isCheckingUsername && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
                      {!isCheckingUsername && newUsername && isUsernameAvailableState === true && isValidPattern && editingProfile?.username !== newUsername && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                      {!isCheckingUsername && newUsername && (isUsernameAvailableState === false || !isValidPattern) && (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Character Counter and Rules */}
              <div className="mb-2 text-xs text-gray-500 flex items-center justify-between">
                <span>Use 3–20 letters or numbers. No spaces or symbols.</span>
                <span className="tabular-nums">{newUsername.length}/20</span>
              </div>

              {/* Validation Status Messages */}
              {newUsername && (
                <div className="mb-4 text-sm">
                  {isCheckingUsername && (
                    <span className="text-gray-500">Checking availability…</span>
                  )}
                  {!isCheckingUsername && isUsernameAvailableState === true && isValidPattern && editingProfile?.username !== newUsername && (
                    <span className="text-green-600 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Great! Username is available.
                    </span>
                  )}
                  {!isCheckingUsername && (isUsernameAvailableState === false || !isValidPattern) && (
                    <span className="text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {!isValidPattern 
                        ? 'Please enter 3–20 valid characters.' 
                        : 'That username is already taken'}
                    </span>
                  )}
                </div>
              )}

              {/* Note */}
              <p className="text-gray-700 text-sm mb-6">
                <span className="font-semibold">Note:</span> changing your username will also change your QR code and URL
              </p>

              {/* Review Button */}
              <Button
                onClick={handleReviewUsernameChange}
                disabled={
                  !newUsername.trim() || 
                  isCheckingUsername || 
                  isUsernameAvailableState === false || 
                  !isValidPattern ||
                  editingProfile?.username === newUsername
                }
                className={`w-full py-6 text-base font-medium rounded-full mb-3 transition-all ${
                  !newUsername.trim() || isCheckingUsername || isUsernameAvailableState === false || !isValidPattern || editingProfile?.username === newUsername
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isCheckingUsername ? 'Checking…' : 'Review username change'}
              </Button>

              {/* Cancel Button */}
              <Button
                onClick={cancelUsernameChange}
                variant="outline"
                className="w-full py-6 text-base font-medium rounded-full border-2 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Change Modal - Second Modal */}
      <AnimatePresence>
        {showConfirmChangeModal && editingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={cancelUsernameChange}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    setShowConfirmChangeModal(false);
                    setShowChangeUsernameModal(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h3 className="text-xl font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">
                  Confirm change
                </h3>
                <button
                  onClick={cancelUsernameChange}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Important Information Box */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 mb-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Important information</h4>
                    <p className="text-gray-700 text-sm">
                      Once you change your username, your current QR code and URL for @{editingProfile.username} will no longer work.
                    </p>
                  </div>
                </div>
              </div>

              {/* New Username and URL */}
              <div className="mb-6 space-y-2">
                <p className="text-gray-900">
                  <span className="font-semibold">New username:</span> {normalizeUsername(newUsername)}
                </p>
                <p className="text-gray-900">
                  <span className="font-semibold">New URL:</span> {new URL(BASE_URL).hostname}/{normalizeUsername(newUsername)}
                </p>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirmUsernameChange}
                className="w-full py-6 text-base font-medium rounded-full mb-3 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Confirm change
              </Button>

              {/* Cancel Button */}
              <Button
                onClick={cancelUsernameChange}
                variant="outline"
                className="w-full py-6 text-base font-medium rounded-full border-2 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
