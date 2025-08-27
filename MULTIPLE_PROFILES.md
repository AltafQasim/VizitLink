# Multiple Profiles Functionality

## Overview

VizitLink now supports multiple profiles, allowing users to create and manage multiple VizitLink profiles from a single account. This feature enables users to maintain separate profiles for different purposes, brands, or audiences.

## Features

### 🎯 **Profile Management**
- **Create New Profiles**: Add unlimited profiles with unique usernames
- **Edit Profiles**: Modify display names, bios, and avatars
- **Duplicate Profiles**: Clone existing profiles with all settings
- **Delete Profiles**: Remove unwanted profiles (minimum 1 profile required)
- **Profile Switching**: Seamlessly switch between profiles

### 🔄 **Profile Switching**
- **Quick Switcher**: Dropdown in top navigation for instant profile switching
- **Active Profile Indicator**: Visual indication of current active profile
- **Last Used Profile**: Automatically remembers the last used profile
- **Seamless Transitions**: Smooth switching between profiles with preserved data

### 💾 **Data Isolation**
- **Separate Storage**: Each profile maintains its own data
- **Independent Settings**: Links, products, and design settings are profile-specific
- **Analytics Separation**: Individual analytics for each profile
- **No Data Mixing**: Complete isolation between profiles

### 🎨 **Profile Customization**
- **Unique Usernames**: Each profile has a distinct URL
- **Custom Display Names**: Personalized names for each profile
- **Individual Bios**: Separate bio text for each profile
- **Profile Avatars**: Unique profile pictures

## Technical Implementation

### Storage Structure

```javascript
// Profile List Storage
localStorage.setItem('vizitlink_profiles', JSON.stringify(profiles))

// Individual Profile Data Storage
localStorage.setItem(`vizitlink_profile_${profileId}`, JSON.stringify(profileData))

// Last Used Profile
localStorage.setItem('vizitlink_last_profile', profileId)
```

### Data Migration

The system automatically migrates existing users to the multiple profiles system:

1. **Detection**: Checks for existing single profile data
2. **Migration**: Converts single profile to multiple profiles format
3. **Preservation**: Maintains all existing data and settings
4. **Cleanup**: Removes old storage format

### Context Management

```javascript
// DashboardContext provides:
{
  profiles,           // Array of all profiles
  currentProfileId,   // ID of active profile
  currentProfile,     // Active profile object
  createProfile,      // Create new profile
  switchProfile,      // Switch to different profile
  updateProfile,      // Update profile details
  deleteProfile,      // Delete profile
  duplicateProfile    // Duplicate existing profile
}
```

## User Interface

### Profile Switcher (Top Navigation)
- **Dropdown Button**: Shows current profile with avatar
- **Profile List**: Displays all available profiles
- **Quick Actions**: Edit, duplicate, and delete options
- **Create Button**: Easy access to create new profiles

### Profile Management Tab
- **Grid Layout**: Visual cards for each profile
- **Profile Stats**: Views, clicks, and performance metrics
- **Action Buttons**: Switch, edit, duplicate, delete
- **Profile URLs**: Direct links to public profiles

### Modals
- **Create Profile**: Form for new profile creation
- **Edit Profile**: Modify existing profile details
- **Confirmation**: Safe deletion with confirmation dialogs

## Usage Examples

### Creating a New Profile

```javascript
const newProfile = await createProfile({
  username: 'mybrand',
  displayName: 'My Brand',
  bio: 'Official VizitLink for My Brand',
  avatar: 'https://example.com/avatar.jpg'
});
```

### Switching Profiles

```javascript
await switchProfile('profile_123');
// Automatically saves current profile data
// Loads new profile data
// Updates UI and context
```

### Updating Profile

```javascript
await updateProfile('profile_123', {
  displayName: 'Updated Brand Name',
  bio: 'New bio text'
});
```

## Benefits

### For Users
- **Multiple Brands**: Manage separate profiles for different businesses
- **Content Organization**: Keep personal and professional content separate
- **A/B Testing**: Test different designs and content strategies
- **Audience Segmentation**: Target different audiences with specific profiles

### For Business
- **Scalability**: Support for unlimited profiles per user
- **User Retention**: Increased engagement through multiple use cases
- **Monetization**: Potential for premium multi-profile features
- **Analytics**: Better insights into user behavior and preferences

## Future Enhancements

### Planned Features
- **Profile Templates**: Pre-designed profile layouts
- **Bulk Operations**: Manage multiple profiles simultaneously
- **Profile Analytics**: Detailed performance metrics
- **Profile Sharing**: Share profile configurations between users
- **API Integration**: External profile management capabilities

### Technical Improvements
- **Database Migration**: Move from localStorage to proper database
- **Real-time Sync**: Live updates across multiple devices
- **Profile Backup**: Export/import profile configurations
- **Advanced Permissions**: Role-based profile access

## Migration Guide

### For Existing Users
1. **Automatic Migration**: System detects and migrates existing data
2. **No Data Loss**: All existing content is preserved
3. **Seamless Experience**: Users can immediately use multiple profiles
4. **Backward Compatibility**: Old URLs continue to work

### For New Users
1. **Default Profile**: Single profile created automatically
2. **Easy Expansion**: Simple process to add more profiles
3. **Guided Setup**: Step-by-step profile creation wizard

## Troubleshooting

### Common Issues

**Profile Not Switching**
- Check if profile data is properly saved
- Verify localStorage permissions
- Clear browser cache if needed

**Data Not Loading**
- Ensure profile ID is valid
- Check storage quota limits
- Verify migration completed successfully

**Profile Creation Fails**
- Check username uniqueness
- Verify required fields are filled
- Ensure sufficient storage space

### Support

For technical support or feature requests:
- Check console for error messages
- Verify browser compatibility
- Contact development team

## Conclusion

The multiple profiles functionality significantly enhances VizitLink's capabilities, providing users with a powerful tool for managing multiple online presences. The implementation is robust, user-friendly, and scalable for future enhancements.

This feature positions VizitLink as a comprehensive solution for individuals and businesses managing multiple online identities, while maintaining the simplicity and ease of use that users expect.
