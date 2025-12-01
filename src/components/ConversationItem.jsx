import React from 'react';
import UserAvatar from './UserAvatar';
import { getUserDisplayName } from '@/utils/conversationUtils';

/**
 * ConversationItem component for displaying a single conversation in the list
 * Follows single responsibility principle - only handles conversation item display
 *
 * @param {Object} props
 * @param {Object} props.conversation - The conversation object
 * @param {Object} props.otherUserProfile - The other user's profile data
 * @param {boolean} props.isSelected - Whether this conversation is currently selected
 * @param {Function} props.onClick - Callback when the conversation is clicked
 * @param {boolean} props.isOnline - Whether the other user is online
 */
export default function ConversationItem({
  conversation,
  otherUserProfile,
  isSelected = false,
  onClick,
  isOnline = false
}) {
  if (!conversation) {
    return null;
  }

  const displayName = getUserDisplayName(otherUserProfile);
  const lastMessage = conversation.messages?.[0];
  const unreadCount = conversation.unreadCount || 0;

  const handleClick = () => {
    if (onClick) {
      onClick(conversation);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-gray-900 cursor-pointer border-b border-gray-900 transition ${
        isSelected ? 'bg-gray-900' : ''
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <UserAvatar
        profile={otherUserProfile}
        isOnline={isOnline}
        size="sm"
        className="flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-semibold text-white text-sm sm:text-base truncate">
            {displayName}
          </h3>
          {unreadCount > 0 && (
            <span className="bg-white text-black text-xs font-semibold rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-400 truncate">
          {lastMessage?.content || 'No messages yet'}
        </p>
      </div>
    </div>
  );
}

