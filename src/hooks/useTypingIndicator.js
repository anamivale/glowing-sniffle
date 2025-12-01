"use client";
import { useEffect, useState, useCallback } from "react";
import { getBrowserSupabase } from "@/lib/supabas";

/**
 * Custom hook for typing indicators using Supabase Presence
 * Shows when other users are typing in a conversation
 *
 * @param {string} conversationId - The conversation ID
 * @param {string} currentUserId - The current user's ID
 * @param {string} currentUserName - The current user's display name
 * @param {boolean} enabled - Whether typing indicators are enabled
 */
export function useTypingIndicator(
  conversationId,
  currentUserId,
  currentUserName = 'User',
  enabled = true
) {
  const [typingUsers, setTypingUsers] = useState([]);
  const [channel, setChannel] = useState(null);

  /**
   * Broadcast that the current user is typing
   */
  const sendTyping = useCallback(() => {
    if (!channel || !enabled || !conversationId || !currentUserId) {
      return;
    }

    // Send typing event
    channel.track({
      user_id: currentUserId,
      user_name: currentUserName,
      typing: true,
      last_typed_at: new Date().toISOString()
    });
  }, [channel, enabled, conversationId, currentUserId, currentUserName]);

  /**
   * Broadcast that the current user stopped typing
   */
  const stopTyping = useCallback(() => {
    if (!channel || !enabled || !conversationId || !currentUserId) {
      return;
    }

    // Send stop typing event
    channel.track({
      user_id: currentUserId,
      user_name: currentUserName,
      typing: false,
      last_typed_at: new Date().toISOString()
    });
  }, [channel, enabled, conversationId, currentUserId, currentUserName]);

  /**
   * Set up presence channel for typing indicators
   */
  useEffect(() => {
    if (!conversationId || !enabled || !currentUserId) {
      return;
    }

    const supabase = getBrowserSupabase();

    // Create presence channel for this conversation
    const presenceChannel = supabase.channel(`typing:${conversationId}`, {
      config: {
        presence: {
          key: currentUserId
        }
      }
    });

    // Subscribe to presence changes
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();

        // Extract typing users (exclude current user)
        const typing = [];
        Object.keys(state).forEach(key => {
          const presences = state[key];
          presences.forEach(presence => {
            if (
              presence.user_id !== currentUserId &&
              presence.typing === true
            ) {
              // Check if user is still typing (within last 5 seconds)
              const lastTyped = new Date(presence.last_typed_at);
              const now = new Date();
              const secondsSinceTyped = (now - lastTyped) / 1000;

              if (secondsSinceTyped < 5) {
                typing.push({
                  user_id: presence.user_id,
                  user_name: presence.user_name
                });
              }
            }
          });
        });

        setTypingUsers(typing);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Typing indicator subscribed for ${conversationId}`);
        }
      });

    setChannel(presenceChannel);

    // Cleanup
    return () => {
      console.log(`Unsubscribing from typing:${conversationId}`);
      presenceChannel.untrack();
      supabase.removeChannel(presenceChannel);
      setChannel(null);
      setTypingUsers([]);
    };
  }, [conversationId, enabled, currentUserId]);

  return {
    typingUsers,
    sendTyping,
    stopTyping,
    isTyping: typingUsers.length > 0
  };
}
