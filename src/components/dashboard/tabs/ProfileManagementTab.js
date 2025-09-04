"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/button';
import { useDashboard } from '../../../context/DashboardContext';
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
  Globe
} from 'lucide-react';

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
  
  const [showCreateModal, setShowCreateModal] = useState(needsProfileCreation || false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatar: ''
  });

  // Auto-open create modal for new users
  useEffect(() => {
    if (needsProfileCreation) {
      setShowCreateModal(true);
    }
  }, [needsProfileCreation]);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      await createProfile(formData);
      setShowCreateModal(false);
      setFormData({ username: '', displayName: '', bio: '', avatar: '' });
      if (needsProfileCreation) {
        setNeedsProfileCreation(false);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
          {needsProfileCreation ? (
            <p className="text-gray-600">Welcome! Please create your first profile to get started.</p>
          ) : (
            <p className="text-gray-600">Manage your VizitLink profiles</p>
          )}
        </div>
        {!needsProfileCreation && (
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Create Profile</span>
          </Button>
        )}
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const stats = getProfileStats(profile);
          const isActive = profile.id === currentProfileId;
          
          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white border rounded-lg p-6 transition-all ${
                isActive 
                  ? 'border-purple-300 shadow-lg ring-2 ring-purple-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
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
                    className={isActive ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {isActive ? 'Active' : 'Switch to'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(profile)}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                
                <div className="flex space-x-1">
                  {profiles.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile URL */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Profile URL</span>
                  <a
                    href={`https://vizitlink.com/${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center"
                  >
                    vizitlink.com/{profile.username}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Profile Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Profile</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </Button>
              </div>
              
              <form onSubmit={handleCreateProfile} className="space-y-4">
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
                    Create Profile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
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
                  ×
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
    </div>
  );
}
