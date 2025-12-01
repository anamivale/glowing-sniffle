/**
 * Utility functions for conversation handling
 */

/**
 * Gets the other user's ID from a conversation
 * @param {Object} conversation - The conversation object
 * @param {string} currentUserId - The current user's ID
 * @returns {string|null} The other user's ID or null if not found
 */
export function getOtherUserId(conversation, currentUserId) {
  if (!conversation || !currentUserId) {
    return null;
  }

  return conversation.user1_id === currentUserId
    ? conversation.user2_id
    : conversation.user1_id;
}

/**
 * Gets user initials from profile data
 * @param {Object} profile - The user profile object
 * @returns {string} The user's initials (max 2 characters)
 */
export function getUserInitials(profile) {
  if (!profile) {
    return '??';
  }

  const { first_name, last_name } = profile;

  if (first_name && last_name) {
    return `${first_name[0]}${last_name[0]}`.toUpperCase();
  }

  if (first_name) {
    return first_name.substring(0, 2).toUpperCase();
  }

  return '??';
}

/**
 * Gets user display name from profile data
 * @param {Object} profile - The user profile object
 * @returns {string} The user's display name
 */
export function getUserDisplayName(profile) {
  if (!profile) {
    return 'Unknown User';
  }

  const { first_name, last_name } = profile;

  if (first_name && last_name) {
    return `${first_name} ${last_name}`;
  }

  if (first_name) {
    return first_name;
  }

  if (last_name) {
    return last_name;
  }

  return 'Unknown User';
}

/**
 * Formats a timestamp for display in chat
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted time string
 */
export function formatMessageTime(timestamp) {
  if (!timestamp) {
    return '';
  }

  try {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
}
