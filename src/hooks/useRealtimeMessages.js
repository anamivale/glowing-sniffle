"use client";
import { useEffect, useCallback } from "react";
import { getBrowserSupabase } from "@/lib/supabas";

/**
 * Custom hook for real-time message updates
 * Subscribes to new messages and updates in a specific conversation
 *
 * @param {string} conversationId - The conversation ID to subscribe to
 * @param {Function} onNewMessage - Callback when a new message is inserted
 * @param {Function} onMessageUpdate - Callback when a message is updated (e.g., read status)
 * @param {boolean} enabled - Whether the subscription is enabled
 */
export function useRealtimeMessages(
  conversationId,
  onNewMessage,
  onMessageUpdate,
  enabled = true
) {
  useEffect(() => {
    if (!conversationId || !enabled) {
      return;
    }

    const supabase = getBrowserSupabase();

    // Subscribe to messages for this conversation
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('New message received:', payload.new);
          if (onNewMessage) {
            onNewMessage(payload.new);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('Message updated:', payload.new);
          if (onMessageUpdate) {
            onMessageUpdate(payload.new);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Messages subscription status for ${conversationId}:`, status);
      });

    // Cleanup subscription on unmount or when conversationId changes
    return () => {
      console.log(`Unsubscribing from messages:${conversationId}`);
      supabase.removeChannel(channel);
    };
  }, [conversationId, enabled, onNewMessage, onMessageUpdate]);
}

/**
 * Custom hook for real-time conversation list updates
 * Subscribes to changes in conversations table
 *
 * @param {string} currentUserId - The current user's ID
 * @param {Function} onConversationChange - Callback when conversations are updated
 * @param {boolean} enabled - Whether the subscription is enabled
 */
export function useRealtimeConversations(
  currentUserId,
  onConversationChange,
  enabled = true
) {
  useEffect(() => {
    if (!currentUserId || !enabled) {
      return;
    }

    const supabase = getBrowserSupabase();

    // Subscribe to conversations involving this user
    const channel = supabase
      .channel(`conversations:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation changed:', payload);
          // Only trigger if this user is involved
          const conversation = payload.new || payload.old;
          if (
            conversation &&
            (conversation.user1_id === currentUserId ||
              conversation.user2_id === currentUserId)
          ) {
            if (onConversationChange) {
              // Pass the full payload including eventType
              onConversationChange({
                eventType: payload.eventType,
                conversation: payload.new || payload.old,
                payload
              });
            }
          }
        }
      )
      .subscribe((status) => {
        console.log(`Conversations subscription status:`, status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log(`Unsubscribing from conversations:${currentUserId}`);
      supabase.removeChannel(channel);
    };
  }, [currentUserId, enabled, onConversationChange]);
}
