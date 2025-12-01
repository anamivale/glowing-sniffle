'use client';
import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { PaperAirplaneIcon, ArrowLeftIcon, EllipsisVerticalIcon, MagnifyingGlassIcon, PaperClipIcon, FaceSmileIcon } from '@heroicons/react/24/solid';
import { getConvMessages, insertMessage } from '@/hooks/usemessages';
import { useConversationsWithProfiles } from '@/hooks/useConversationsWithProfiles';
import { useRealtimeMessages, useRealtimeConversations } from '@/hooks/useRealtimeMessages';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import ConversationItem from '@/components/ConversationItem';
import UserAvatar from '@/components/UserAvatar';
import { getOtherUserId, getUserDisplayName, formatMessageTime } from '@/utils/conversationUtils';
import { useProfile } from '@/hooks/useUsers';

/**
 * Chat component - Main messaging interface
 * Follows separation of concerns:
 * - Data fetching: Delegated to custom hooks
 * - UI Components: Extracted into reusable components
 * - Business logic: Utility functions
 * - State management: Centralized in this component
 */
const ChatContent = () => {
  // Auth state - ensure user is loaded before proceeding
  const { user, loading: authLoading } = useAuth();
  const currentUserId = user?.id;

  // Conversations state with profiles
  const {
    conversations,
    profiles,
    loading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations
  } = useConversationsWithProfiles(currentUserId);

  // Selected conversation and messages state
  // Use ID instead of object to prevent unnecessary re-renders
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);

  // Derive selected conversation from conversations list using stable ID
  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  // Message input state
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // URL parameters
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get('conversationId');

  // Get current user's profile for typing indicator
  const { profile: currentUserProfile } = useProfile(currentUserId);
  const currentUserName = currentUserProfile
    ? `${currentUserProfile.first_name || ''} ${currentUserProfile.last_name || ''}`.trim()
    : 'User';

  // Typing indicator
  const { typingUsers, sendTyping, stopTyping, isTyping } = useTypingIndicator(
    selectedConversationId,
    currentUserId,
    currentUserName,
    !!selectedConversationId
  );

  /**
   * Auto-scroll to bottom when messages change
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle new message from real-time subscription
   * Prevents duplicates from optimistic updates
   */
  const handleNewMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => {
      // Check if message already exists (from optimistic update)
      const exists = prevMessages.some(msg => msg.id === newMessage.id);
      if (exists) {
        // Replace optimistic message with real one
        return prevMessages.map(msg =>
          msg.id === newMessage.id ? newMessage : msg
        );
      }
      // Add new message if it doesn't exist
      return [...prevMessages, newMessage];
    });
  }, []);

  /**
   * Handle message update from real-time subscription (e.g., read status)
   */
  const handleMessageUpdate = useCallback((updatedMessage) => {
    setMessages((prevMessages) =>
      prevMessages.map(msg =>
        msg.id === updatedMessage.id ? updatedMessage : msg
      )
    );
  }, []);

  /**
   * Handle conversation changes from real-time subscription
   * Don't refetch unnecessarily - conversations are already updated via real-time
   * Only refetch if absolutely needed (e.g., new conversation created)
   */
  const handleConversationChange = useCallback((payload) => {
    // Only refetch if it's a new conversation (INSERT event)
    // UPDATE events are handled automatically by the real-time subscription
    if (payload.eventType === 'INSERT') {
      refetchConversations();
    }
    // For UPDATE events, the conversations list already updates via real-time
  }, [refetchConversations]);

  // Set up real-time subscriptions for messages in current conversation
  useRealtimeMessages(
    selectedConversationId,
    handleNewMessage,
    handleMessageUpdate,
    !!selectedConversationId // Only subscribe when a conversation is selected
  );

  // Set up real-time subscriptions for conversation list
  useRealtimeConversations(
    currentUserId,
    handleConversationChange,
    !!currentUserId // Only subscribe when user is authenticated
  );

  /**
   * Load messages when a conversation is selected
   * Only shows loading on initial load, not on real-time updates
   * Uses stable selectedConversationId to prevent unnecessary refetches
   */
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      setMessageError(null);
      setMessageLoading(false);
      return;
    }

    async function loadMessages() {
      try {
        // Show loading indicator
        setMessageLoading(true);
        setMessageError(null);
        const msgs = await getConvMessages(selectedConversationId);
        setMessages(msgs || []);
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessageError('Failed to load messages');
        setMessages([]);
      } finally {
        setMessageLoading(false);
      }
    }

    loadMessages();
  }, [selectedConversationId]); // Only depends on the ID, not the object

  /**
   * Auto-select conversation from URL if present
   */
  useEffect(() => {
    if (conversationIdFromUrl && conversations.length > 0) {
      // Just set the ID, not the entire object
      setSelectedConversationId(conversationIdFromUrl);
    }
  }, [conversationIdFromUrl, conversations.length]); // Only depend on length to avoid re-runs

  /**
   * Handle sending a new message
   * Uses optimistic UI updates for better UX
   * Real message will be received via real-time subscription
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validation
    if (!newMessage.trim()) {
      return;
    }

    if (!selectedConversationId) {
      console.error('No conversation selected');
      return;
    }

    if (!currentUserId) {
      console.error('No current user ID');
      return;
    }

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    // Create optimistic message for immediate UI update
    const optimisticMessage = {
      id: tempId,
      content: messageContent,
      sender_id: currentUserId,
      is_read: false,
      created_at: new Date().toISOString(),
      _isOptimistic: true // Mark as optimistic for tracking
    };

    // Immediately update UI and clear input
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    stopTyping(); // Stop typing indicator when sending

    try {
      const { error } = await insertMessage(
        selectedConversationId,
        currentUserId,
        messageContent
      );

      if (error) {
        throw new Error(error.message || 'Failed to send message');
      }

      // Remove optimistic message - real one will come via real-time subscription
      setMessages(prev => prev.filter(msg => msg.id !== tempId));

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      // Restore message text
      setNewMessage(messageContent);
      alert('Failed to send message. Please try again.');
    }
  };

  /**
   * Handle typing in the input field
   * Sends typing indicator and auto-stops after 3 seconds
   */
  const handleTyping = useCallback((value) => {
    setNewMessage(value);

    // Send typing indicator
    if (value.trim()) {
      sendTyping();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    } else {
      stopTyping();
    }
  }, [sendTyping, stopTyping]);

  /**
   * Clean up typing timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  /**
   * Open a conversation
   */
  const openConversation = (conv) => {
    setSelectedConversationId(conv.id);
  };

  /**
   * Go back to conversation list (mobile)
   */
  const goBack = () => {
    setSelectedConversationId(null);
  };

  /**
   * Get the other user's profile for the selected conversation
   */
  const getOtherUserProfile = () => {
    if (!selectedConversation || !currentUserId) {
      return null;
    }
    const otherUserId = getOtherUserId(selectedConversation, currentUserId);
    return profiles[otherUserId] || null;
  };

  // Track if this is the initial load vs a conversation switch
  const prevConversationIdRef = useRef(null);
  useEffect(() => {
    prevConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Loading state
  if (authLoading || conversationsLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading conversations...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Error state
  if (conversationsError) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="text-center">
              <p className="text-red-500 mb-4">{conversationsError}</p>
              <button
                onClick={refetchConversations}
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Retry
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const otherUserProfile = getOtherUserProfile();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
          {/* Conversations List */}
          <div className={`${selectedConversationId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-gray-800`}>
            {/* Header */}
            <div className="bg-gray-900 p-3 sm:p-4 flex items-center justify-between border-b border-gray-800">
              <h1 className="text-lg sm:text-xl font-semibold">Chats</h1>
              <div className="flex gap-2 sm:gap-4">
                <button
                  className="hover:bg-gray-800 p-2 rounded-full transition"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon size={18} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  className="hover:bg-gray-800 p-2 rounded-full transition"
                  aria-label="More options"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto bg-black scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {conversations.length === 0 ? (
                <div className="flex items-center justify-center p-6 sm:p-8">
                  <p className="text-sm sm:text-base text-gray-400">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUserId = getOtherUserId(conv, currentUserId);
                  const otherUserProfile = profiles[otherUserId];

                  return (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      otherUserProfile={otherUserProfile}
                      isSelected={selectedConversationId === conv.id}
                      onClick={openConversation}
                      isOnline={false} // TODO: Integrate with presence system
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col bg-black min-w-0">
              {/* Chat Header */}
              <div className="bg-gray-900 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border-b border-gray-800">
                <button
                  onClick={goBack}
                  className="md:hidden hover:bg-gray-800 p-2 rounded-full transition flex-shrink-0"
                  aria-label="Go back"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <UserAvatar
                  profile={otherUserProfile}
                  isOnline={false}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-white text-sm sm:text-base truncate">
                    {getUserDisplayName(otherUserProfile)}
                  </h2>
                </div>
                <button
                  className="hover:bg-gray-800 p-2 rounded-full transition flex-shrink-0"
                  aria-label="Search in conversation"
                >
                  <MagnifyingGlassIcon size={18} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  className="hover:bg-gray-800 p-2 rounded-full transition flex-shrink-0"
                  aria-label="More options"
                >
                  <EllipsisVerticalIcon className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.95)),
                               repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.02) 10px, rgba(255,255,255,.02) 20px)`
                }}
              >
                {messageLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-gray-400">Loading messages...</p>
                    </div>
                  </div>
                ) : messageError ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-red-500">{messageError}</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    // Skip rendering if msg is null or undefined
                    if (!msg) return null;

                    const isMyMessage = msg.sender_id === currentUserId;
                    const isOptimistic = msg._isOptimistic;

                    return (
                      <div key={msg.id}>
                        <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg px-3 sm:px-4 py-2 rounded-lg shadow-lg ${
                              isMyMessage
                                ? 'bg-white text-black rounded-br-none'
                                : 'bg-gray-800 text-white rounded-bl-none'
                            } ${isOptimistic ? 'opacity-70' : 'opacity-100'}`}
                          >
                            <p className="text-xs sm:text-sm break-words">{msg.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className={`text-[10px] sm:text-xs ${isMyMessage ? 'text-gray-600' : 'text-gray-400'}`}>
                                {formatMessageTime(msg.created_at)}
                              </span>
                              {isMyMessage && (
                                isOptimistic ? (
                                  // Clock icon for sending state
                                  <svg
                                    viewBox="0 0 16 16"
                                    width="14"
                                    height="14"
                                    className="text-gray-500 animate-pulse"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm1-6V4H7v5l4 2.4.7-1.2L9 8z"
                                    />
                                  </svg>
                                ) : (
                                  // Double check marks
                                  <svg
                                    viewBox="0 0 16 15"
                                    width="16"
                                    height="15"
                                    className={msg.is_read ? 'text-blue-500' : 'text-gray-600'}
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.89 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                    />
                                  </svg>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {isTyping && typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-white rounded-lg rounded-bl-none px-4 py-2 max-w-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {typingUsers[0].user_name} is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-gray-900 p-3 sm:p-4 border-t border-gray-800">
                <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    className="hidden sm:flex hover:bg-gray-800 p-2 rounded-full transition text-gray-400 hover:text-white"
                    aria-label="Add emoji"
                  >
                    <FaceSmileIcon className="sm:w-6 sm:h-6" />
                  </button>
                  <button
                    type="button"
                    className="hidden sm:flex hover:bg-gray-800 p-2 rounded-full transition text-gray-400 hover:text-white"
                    aria-label="Attach file"
                  >
                    <PaperClipIcon className="sm:w-6 sm:h-6" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-600"
                    aria-label="Message input"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`p-2 sm:p-3 rounded-full transition flex-shrink-0 ${
                      newMessage.trim()
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                    aria-label="Send message"
                  >
                    <PaperAirplaneIcon className="sm:w-5 sm:h-5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-black">
              <div className="text-center text-gray-500">
                <div className="mb-4">
                  <svg
                    viewBox="0 0 212 212"
                    width="200"
                    height="200"
                    className="mx-auto opacity-20"
                  >
                    <path
                      fill="currentColor"
                      d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"
                    />
                    <path
                      fill="#000"
                      d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-light mb-2">Chat</h2>
                <p className="text-sm">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

/**
 * Wrapper component with Suspense boundary for useSearchParams
 */
const Chat = () => {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    }>
      <ChatContent />
    </Suspense>
  );
};

export default Chat;
