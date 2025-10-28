/**
 * ChatWindow Component
 * Main chat interface container
 */

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useLanguageRedux } from '@/hooks/useLanguageRedux';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatWindowProps {
  messages: ChatMessageType[];
  currentUserId: string;
  isConnected: boolean;
  isTyping: boolean;
  typingUser: string | null;
  error: string | null;
  onSendMessage: (message: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export function ChatWindow({
  messages,
  currentUserId,
  isConnected,
  isTyping,
  typingUser,
  error,
  onSendMessage,
  onTypingStart,
  onTypingStop
}: ChatWindowProps) {
  const { t } = useLanguageRedux();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {t('chat.title')}
          </h3>
        </div>
        
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isConnected ? t('chat.connected') : t('chat.disconnected')}
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-2">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {t('chat.noMessages')}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
              />
            ))}
            
            {/* Typing indicator */}
            {isTyping && typingUser && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 px-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>{t('chat.typingIndicator', { user: typingUser })}</span>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSendMessage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
        disabled={!isConnected}
        placeholder={isConnected ? t('chat.placeholder') : t('chat.connecting')}
      />
    </div>
  );
}
