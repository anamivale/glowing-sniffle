"use client";
import { useEffect, useState, useCallback } from "react";
import { getBrowserSupabase } from "@/lib/supabas";
import { getOtherUserId } from "@/utils/conversationUtils";

/**
 * Custom hook to fetch conversations with user profiles
 * Follows single responsibility - handles conversation data fetching with profile enrichment
 *
 * @param {string} currentUserId - The current user's ID
 * @returns {Object} { conversations, profiles, loading, error, refetch }
 */
export function useConversationsWithProfiles(currentUserId) {
  const [conversations, setConversations] = useState([]);
  const [profiles, setProfiles] = useState({}); // Map of userId -> profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversationsWithProfiles = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      setError("No user ID provided");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const supabase = getBrowserSupabase();

      // Fetch conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            content,
            created_at,
            is_read
          )
        `)
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false, foreignTable: 'messages' });

      if (conversationsError) {
        throw conversationsError;
      }

      const conversationsList = conversationsData || [];

      // Extract unique user IDs to fetch profiles
      const otherUserIds = conversationsList
        .map(conv => getOtherUserId(conv, currentUserId))
        .filter(Boolean); // Remove null/undefined values

      // Remove duplicates
      const uniqueUserIds = [...new Set(otherUserIds)];

      // Fetch profiles for all other users in batch
      if (uniqueUserIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', uniqueUserIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // Don't throw - allow conversations to display without profiles
        } else {
          // Create a map of userId -> profile for quick lookup
          const profilesMap = {};
          profilesData?.forEach(profile => {
            if (profile?.user_id) {
              profilesMap[profile.user_id] = profile;
            }
          });
          setProfiles(profilesMap);
        }
      }

      setConversations(conversationsList);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.message || "Failed to fetch conversations");
      setConversations([]);
      setProfiles({});
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchConversationsWithProfiles();
  }, [fetchConversationsWithProfiles]);

  return {
    conversations,
    profiles,
    loading,
    error,
    refetch: fetchConversationsWithProfiles
  };
}

/**
 * Helper hook to get a specific user profile from the profiles map
 *
 * @param {Object} profiles - The profiles map
 * @param {string} userId - The user ID to get profile for
 * @returns {Object|null} The user profile or null
 */
export function useProfileFromMap(profiles, userId) {
  return profiles?.[userId] || null;
}
