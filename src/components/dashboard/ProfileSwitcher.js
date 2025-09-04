"use client";

import { useState } from 'react';
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
  X
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

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
  
  const [showDropdown, setShowDropdown] = useState(false);
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

  return (
    <>
      {/* Profile Switcher Button */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 min-w-[200px] justify-between"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              {currentProfile?.avatar ? (
                <img src={currentProfile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-xs font-medium">
                  {currentProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <span className="font-medium truncate">
              {currentProfile?.displayName || 'Select Profile'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </Button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px]"
            >
              {/* Profile List */}
              <div className="p-2 space-y-1">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                      profile.id === currentProfileId
                        ? 'bg-purple-50 border border-purple-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className="flex items-center space-x-3 flex-1"
                      onClick={() => {
                        switchProfile(profile.id);
                        setShowDropdown(false);
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-white text-sm font-medium">
                            {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{profile.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">@{profile.username}</p>
                      </div>
                    </div>
                    
                    {profile.id === currentProfileId && (
                      <Check className="w-4 h-4 text-purple-600" />
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(profile)}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      {profiles.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Create New Profile Button */}
              <div className="border-t border-gray-200 p-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push('/onboarding');
                    setShowDropdown(false);
                  }}
                  className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Profile
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Profile Modal removed; onboarding flow handles creation */}

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
