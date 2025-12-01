import React from 'react';
import { getUserInitials } from '@/utils/conversationUtils';

/**
 * UserAvatar component for displaying user profile pictures or initials
 * Follows single responsibility principle - only handles avatar display
 *
 * @param {Object} props
 * @param {Object} props.profile - User profile object
 * @param {boolean} props.isOnline - Whether the user is online
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 * @param {string} props.className - Additional CSS classes
 */
export default function UserAvatar({
  profile,
  isOnline = false,
  size = 'md',
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  const onlineDotSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const avatarSize = sizeClasses[size] || sizeClasses.md;
  const dotSize = onlineDotSizes[size] || onlineDotSizes.md;

  return (
    <div className={`relative ${className}`}>
      {profile?.profile_picture ? (
        <img
          src={profile.profile_picture}
          alt={`${profile.first_name || 'User'}'s avatar`}
          className={`${avatarSize} rounded-full object-cover bg-gray-700`}
        />
      ) : (
        <div className={`${avatarSize} rounded-full bg-gray-700 flex items-center justify-center`}>
          <span className="font-semibold text-white">
            {getUserInitials(profile)}
          </span>
        </div>
      )}
      {isOnline && (
        <div
          className={`absolute bottom-0 right-0 ${dotSize} bg-green-500 rounded-full border-2 border-black`}
          aria-label="Online"
        />
      )}
    </div>
  );
}
