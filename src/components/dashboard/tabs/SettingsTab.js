"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from '../../../context/DashboardContext';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  CreditCard,
  Crown,
  LogOut,
  Globe,
  Smartphone,
  Calendar
} from 'lucide-react';

export default function SettingsTab() {
  const { user, signOut, updatePassword } = useAuth();
  const { data } = useDashboard();
  
  // State management
  const [activeSection, setActiveSection] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  
  // Account settings
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [linkClicks, setLinkClicks] = useState(true);
  
  // Privacy settings
  const [profilePublic, setProfilePublic] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [allowIndexing, setAllowIndexing] = useState(true);
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Sessions
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
      loadUserPreferences();
      loadActiveSessions();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (preferences) {
        setEmailNotifications(preferences.email_notifications ?? true);
        setMarketingEmails(preferences.marketing_emails ?? false);
        setWeeklyReport(preferences.weekly_report ?? true);
        setNewFollowers(preferences.new_followers ?? true);
        setLinkClicks(preferences.link_clicks ?? true);
        setProfilePublic(preferences.profile_public ?? true);
        setShowAnalytics(preferences.show_analytics ?? true);
        setAllowIndexing(preferences.allow_indexing ?? true);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const loadActiveSessions = async () => {
    // Mock data - replace with actual session management
    setActiveSessions([
      {
        id: '1',
        device: 'Windows PC',
        location: 'New York, USA',
        lastActive: new Date(),
        current: true,
      }
    ]);
  };

  // Check if user signed up with Google OAuth
  const isGoogleUser = user?.app_metadata?.provider === 'google' || 
                       user?.app_metadata?.providers?.includes('google');

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error('Current password is incorrect');
        setIsLoading(false);
        return;
      }

      // Update password
      const { error } = await updatePassword(newPassword);
      if (error) throw error;

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: emailNotifications,
          marketing_emails: marketingEmails,
          weekly_report: weeklyReport,
          new_followers: newFollowers,
          link_clicks: linkClicks,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          profile_public: profilePublic,
          show_analytics: showAnalytics,
          allow_indexing: allowIndexing,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Privacy settings saved');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsLoading(true);
    try {
      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Sign out and delete auth user
      await signOut();
      toast.success('Account deleted successfully');
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    // Only show Security section for non-OAuth users
    ...(!isGoogleUser ? [{ id: 'security', label: 'Security', icon: Shield }] : []),
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'sessions', label: 'Sessions', icon: Smartphone },
  ];

  return (
    <div className="p-1 space-y-4 sm:space-y-6 pt-0 max-w-full">
      {/* Header */}
      <div className="mt-1 px-3 py-3 sm:px-4 lg:px-6 lg:py-4 sm:sticky sm:top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b border-border rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 px-3 sm:px-4 lg:px-6">
        {/* Sidebar Navigation - Mobile optimized */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-2 overflow-x-auto lg:overflow-x-visible">
            <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap min-h-[44px] ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-4 sm:p-6"
          >
            {/* Account Settings */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Account Information</h3>
                  <p className="text-sm text-muted-foreground">Update your account details</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="min-h-[44px] bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact support to change your email address
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Created</Label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </div>
                  </div>

                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && !isGoogleUser && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your password and security preferences</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="min-h-[44px] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="min-h-[44px] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="min-h-[44px] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Password Requirements</h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Minimum 8 characters</li>
                          <li>• Mix of letters and numbers recommended</li>
                          <li>• Avoid common passwords</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground">Danger Zone</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-red-900 mb-1">Delete Account</h4>
                        <p className="text-xs text-red-700">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteModal(true)}
                        className="min-h-[44px] w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Choose what notifications you want to receive</p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="flex items-center justify-between min-h-[44px]">
                    <div className="flex-1">
                      <Label htmlFor="emailNotifications" className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Receive email notifications for important updates
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-foreground">Email Preferences</h4>
                    
                    <div className="flex items-center justify-between min-h-[44px]">
                      <div className="flex-1">
                        <Label htmlFor="linkClicks" className="text-sm font-medium">Link Clicks</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Get notified when someone clicks your links
                        </p>
                      </div>
                      <Switch
                        id="linkClicks"
                        checked={linkClicks}
                        onCheckedChange={setLinkClicks}
                        disabled={!emailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between min-h-[44px]">
                      <div className="flex-1">
                        <Label htmlFor="newFollowers" className="text-sm font-medium">New Followers</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Be notified when you get new followers
                        </p>
                      </div>
                      <Switch
                        id="newFollowers"
                        checked={newFollowers}
                        onCheckedChange={setNewFollowers}
                        disabled={!emailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between min-h-[44px]">
                      <div className="flex-1">
                        <Label htmlFor="weeklyReport" className="text-sm font-medium">Weekly Report</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Receive a weekly summary of your analytics
                        </p>
                      </div>
                      <Switch
                        id="weeklyReport"
                        checked={weeklyReport}
                        onCheckedChange={setWeeklyReport}
                        disabled={!emailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between min-h-[44px]">
                      <div className="flex-1">
                        <Label htmlFor="marketingEmails" className="text-sm font-medium">Marketing Emails</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Receive tips, updates, and promotional content
                        </p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isLoading}
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">Control your privacy and data preferences</p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="flex items-center justify-between min-h-[44px]">
                    <div className="flex-1">
                      <Label htmlFor="profilePublic" className="text-base font-medium">Public Profile</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Make your profile visible to everyone
                      </p>
                    </div>
                    <Switch
                      id="profilePublic"
                      checked={profilePublic}
                      onCheckedChange={setProfilePublic}
                    />
                  </div>

                  <div className="flex items-center justify-between min-h-[44px]">
                    <div className="flex-1">
                      <Label htmlFor="showAnalytics" className="text-base font-medium">Show Analytics</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Display view counts and click statistics on your profile
                      </p>
                    </div>
                    <Switch
                      id="showAnalytics"
                      checked={showAnalytics}
                      onCheckedChange={setShowAnalytics}
                    />
                  </div>

                  <div className="flex items-center justify-between min-h-[44px]">
                    <div className="flex-1">
                      <Label htmlFor="allowIndexing" className="text-base font-medium">Search Engine Indexing</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Allow search engines to index your profile
                      </p>
                    </div>
                    <Switch
                      id="allowIndexing"
                      checked={allowIndexing}
                      onCheckedChange={setAllowIndexing}
                    />
                  </div>

                  <Button
                    onClick={handleSavePrivacy}
                    disabled={isLoading}
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeSection === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Billing & Subscription</h3>
                  <p className="text-sm text-muted-foreground">Manage your subscription and billing information</p>
                </div>

                <Separator />

                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-5 h-5 text-purple-600" />
                          <h4 className="text-lg font-semibold text-gray-900">Free Plan</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          You're currently on the free plan
                        </p>
                      </div>
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Active
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600" />
                        Unlimited links
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600" />
                        Basic analytics
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600" />
                        Custom themes
                      </div>
                    </div>

                    <Button className="w-full min-h-[44px]">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-4">Payment Method</h4>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <CreditCard className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No payment method on file
                      </p>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-4">Billing History</h4>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        No billing history available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sessions */}
            {activeSection === 'sessions' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-muted rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
                          <Smartphone className="w-5 h-5 text-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-foreground">{session.device}</h4>
                            {session.current && (
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Globe className="w-3 h-3 inline mr-1" />
                            {session.location}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last active: {session.lastActive.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-[44px] w-full sm:w-auto"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full sm:w-auto min-h-[44px]"
                  onClick={() => {
                    signOut();
                    window.location.href = '/login';
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out All Devices
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-900 mb-2">What will be deleted:</h4>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Your profile and all associated data</li>
                <li>• All your links and custom content</li>
                <li>• Analytics and statistics</li>
                <li>• Account settings and preferences</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deleteConfirm">
                Type <span className="font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="deleteConfirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="min-h-[44px]"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText('');
              }}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE' || isLoading}
              className="w-full sm:w-auto min-h-[44px]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
