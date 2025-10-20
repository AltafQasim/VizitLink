"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { 
  ChevronDown, 
  Plus, 
  Settings, 
  Trash2, 
  Edit3,
  User,
  Check,
  X,
  ArrowLeftRight,
  Zap,
  HelpCircle,
  BookOpen,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSwitcher() {
  const { 
    profiles, 
    currentProfileId, 
    currentProfile,
    switchProfile, 
    createProfile, 
    updateProfile, 
    deleteProfile
  } = useDashboard();
  const router = useRouter();
  
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatar: ''
  });

  // Creation moved to onboarding flow

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

  const handleDeleteProfile = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      try {
        await deleteProfile(profileId);
        setShowDropdown(false);
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
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
    setShowDropdown(false);
  };

  const resetForm = () => {
    setFormData({ username: '', displayName: '', bio: '', avatar: '' });
    setEditingProfile(null);
  };

  const { signOut } = useAuth();

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Only add listener when dropdown is open
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    // Cleanup listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      {/* Profile Switcher Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors w-full"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-teal-700 to-teal-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {currentProfile?.avatar ? (
              <img src={currentProfile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white text-sm font-semibold">
                {currentProfile?.displayName?.charAt(0).toUpperCase() || 'A'}
              </span>
            )}
          </div>
          <span className="font-semibold text-gray-900 text-sm truncate">
            {currentProfile?.username || 'altafak01'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-600 ml-auto transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-[-37%] translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-[280px] overflow-hidden"
            >
              {/* Current Profile Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {currentProfile?.avatar ? (
                        <img src={currentProfile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-base font-semibold">
                          {currentProfile?.displayName?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate m-0">
                        {currentProfile?.username || 'altafak01'}
                      </p>
                      <p className="text-xs text-gray-500 truncate m-0">
                        {process.env.SITE_URL}/{currentProfile?.username || 'altafak01'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    Free
                  </span>
                </div>
              </div>
              {/* Menu Items */}
              <div className="p-2">
                {/* Switch VizitLink */}
                <button
                  onClick={() => {
                    setShowSwitchModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3 text-left"
                >
                  <ArrowLeftRight className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Switch VizitLink</span>
                </button>

                {/* Create new VizitLink */}
                <button
                  onClick={() => {
                    router.push('/onboarding');
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3 text-left"
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Create new VizitLink</span>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Account & Settings Section */}
              <div className="p-2">
                {/* Account */}
                <button
                  onClick={() => {
                    router.push('/dashboard/settings');
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3 text-left"
                >
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Account</span>
                </button>

                {/* Upgrade */}
                <button
                  onClick={() => {
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3 text-left"
                >
                  <Zap className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Upgrade</span>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Help Section */}
              <div className="p-2">
                {/* Ask a question */}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3 text-left"
                >
                  <HelpCircle className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Ask a question</span>
                </button>

                {/* Help topics */}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3 text-left"
                >
                  <BookOpen className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Help topics</span>
                </button>

                {/* Share feedback */}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3 text-left"
                >
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Share feedback</span>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Log out */}
              <div className="p-2">
                <button
                  onClick={() => {
                    signOut();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3 text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Switch VizitLink Modal */}
      <AnimatePresence>
        {showSwitchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSwitchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] w-full max-w-[640px] max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative px-8 pt-8 pb-6">
                <h2 className="text-2xl font-semibold text-gray-900 text-center">Switch VizitLink</h2>
                <button
                  onClick={() => setShowSwitchModal(false)}
                  className="absolute top-6 right-6 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-900" strokeWidth={2} />
                </button>
              </div>

              {/* Profiles List */}
              <div className="overflow-y-auto max-h-[calc(85vh-120px)] px-6 pb-8">
                <div className="space-y-0">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        switchProfile(profile.id);
                        setShowSwitchModal(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-[60px] h-[60px] flex-shrink-0 bg-gray-300 rounded-full flex items-center justify-center">
                          {profile.avatar ? (
                            <img 
                              src={profile.avatar} 
                              alt={profile.username} 
                              className="w-full h-full rounded-full object-cover" 
                            />
                          ) : (
                            <User className="w-8 h-8 text-white" strokeWidth={2} />
                          )}
                        </div>
                        
                        {/* Profile Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-semibold text-gray-900 text-lg truncate">
                            @{profile.username}
                          </p>
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {process.env.SITE_URL}/{profile.username}
                          </p>
                        </div>
                      </div>
                      
                      {/* Free Badge */}
                      <span className="px-3 py-1.5 bg-[#E5E1D8] text-gray-700 text-xs font-medium rounded-md flex-shrink-0 ml-3">
                        Free
                      </span>
                    </button>
                  ))}
                </div>

                {/* Create New VizitLink Button */}
                <button
                  onClick={() => {
                    router.push('/onboarding');
                    setShowSwitchModal(false);
                  }}
                  className="w-full flex items-center space-x-4 px-2 py-2 hover:bg-gray-200 rounded-lg transition-colors mt-2"
                >
                  <div className="w-[60px] h-[60px] flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-7 h-7 text-gray-700" strokeWidth={2} />
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">Create New VizitLink</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                >
                  <X className="w-4 h-4" />
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
    </>
  );
}
