'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, Search, Paperclip, Smile } from 'lucide-react';
import { getConvMessages, insertMessage } from '@/hooks/usemessages';
import { getConversations } from '@/hooks/useConversations';
import { useSearchParams } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth"
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

const Chat = () => {
  const [conversations, setConversations] = useState([])
  const user = useAuth()
  const currentUserId = user?.id || "69a0e91d-7026-4605-a2bc-bb39ac941d08"

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([])
  const [messageLoading, setMessageLoading] = useState(false)
  const [convLoading, setConvLoading] = useState(false)

  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get('conversationId');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    if (!selectedConversation?.id) {
      setMessages([]); // Clear messages when no conversation selected
      return;
    }
    async function loadMessages() {
      setMessageLoading(true)
      const msgs = await getConvMessages(selectedConversation.id)
      setMessages(msgs || [])
      setMessageLoading(false)
    }
    loadMessages()
  }, [selectedConversation?.id])


  useEffect(() => {
    async function loadConversations() {
      setConvLoading(true)
      console.log(currentUserId);

      const convs = await getConversations(currentUserId)
      setConversations(convs || [])
      setConvLoading(false)
      
      // Auto-select conversation from URL if present
      if (conversationIdFromUrl && convs) {
        const targetConv = convs.find(c => c.id === conversationIdFromUrl);
        if (targetConv) {
          setSelectedConversation(targetConv);
        }
      }
    }
    loadConversations()
  }, [conversationIdFromUrl, currentUserId]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.id) return;

    const messageContent = newMessage;
    
    // Create optimistic message for immediate UI update
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      sender_id: currentUserId,
      is_read: false,
      created_at: new Date().toISOString()
    };

    // Immediately update UI
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      const { data, error } = await insertMessage(
        selectedConversation.id,
        currentUserId,
        messageContent
      );

      if (error) {
        console.error('Error sending message:', error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        // Restore message text
        setNewMessage(messageContent);
        alert('Failed to send message. Please try again.');
        return;
      }

      // Replace optimistic message with real one from database
      if (data) {
        setMessages(prev => 
          prev.map(msg => msg.id === optimisticMessage.id ? data : msg)
        );
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      setNewMessage(messageContent);
      alert('Failed to send message. Please try again.');
    }
  };

  const openConversation = (conv) => {
    setSelectedConversation(conv);
  };

  const goBack = () => {
    setSelectedConversation(null);
  };

  if (convLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-screen bg-black text-white">
            <p>Loading conversations...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex h-screen bg-black text-white font-sans">
          {/* Conversations List */}
          <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col border-r border-gray-800`}>
            {/* Header */}
            <div className="bg-gray-900 p-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold">Chats</h1>
              <div className="flex gap-4">
                <button className="hover:bg-gray-800 p-2 rounded-full transition">
                  <Search size={20} />
                </button>
                <button className="hover:bg-gray-800 p-2 rounded-full transition">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto bg-black">
              {conversations.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-gray-400">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className={`flex items-center gap-3 p-4 hover:bg-gray-900 cursor-pointer border-b border-gray-900 transition ${
                      selectedConversation?.id === conv.id ? 'bg-gray-900' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {conv.user2_id?.toString().substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      {conv.user2_id?.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-white truncate">
                          {conv.user2_id || 'Unknown User'}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400 truncate">
                          {conv.messages?.[0]?.content || 'No messages yet'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-white text-black text-xs font-semibold rounded-full px-2 py-0.5 ml-2">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col bg-black">
              {/* Chat Header */}
              <div className="bg-gray-900 p-4 flex items-center gap-3 border-b border-gray-800">
                <button
                  onClick={goBack}
                  className="md:hidden hover:bg-gray-800 p-2 rounded-full transition"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {selectedConversation.user2_id?.toString().substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-white">
                    {selectedConversation.user2_id || 'Unknown User'}
                  </h2>
                </div>
                <button className="hover:bg-gray-800 p-2 rounded-full transition">
                  <Search size={20} />
                </button>
                <button className="hover:bg-gray-800 p-2 rounded-full transition">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.95)), 
                               repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.02) 10px, rgba(255,255,255,.02) 20px)`
                }}
              >
                {messageLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Loading messages...</p>
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

                    return (
                      <div key={msg.id}>
                        {/* Message bubble */}
                        <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-lg ${
                              isMyMessage
                                ? 'bg-white text-black rounded-br-none'
                                : 'bg-gray-800 text-white rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm break-words">{msg.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className={`text-xs ${isMyMessage ? 'text-gray-600' : 'text-gray-400'}`}>
                                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                }) : ''}
                              </span>
                              {isMyMessage && (
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
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-gray-900 p-4 border-t border-gray-800">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="hover:bg-gray-800 p-2 rounded-full transition text-gray-400 hover:text-white"
                  >
                    <Smile size={24} />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-gray-800 p-2 rounded-full transition text-gray-400 hover:text-white"
                  >
                    <Paperclip size={24} />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-full transition ${
                      newMessage.trim()
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <Send size={20} />
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

export default Chat;