/**
 * ChatMessage Component
 * Individual message bubble in chat
 */

import React from 'react';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean; // Is this message from current user?
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const { senderType, senderName, message: text, timestamp, status } = message;

  // System messages (centered)
  if (senderType === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400 max-w-[80%] text-center">
          {text}
        </div>
      </div>
    );
  }

  // User/responder messages (left/right alignment)
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender name */}
        {!isOwn && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-2">
            {senderName}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : senderType === 'responder'
              ? 'bg-green-100 dark:bg-green-900 text-gray-900 dark:text-gray-100 rounded-bl-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap wrap-break-word">{text}</p>
        </div>

        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>

          {/* Status indicator for own messages */}
          {isOwn && (
            <span className="text-xs">
              {status === 'sending' && '⏳'}
              {status === 'sent' && '✓'}
              {status === 'delivered' && '✓✓'}
              {status === 'read' && <span className="text-blue-500">✓✓</span>}
              {status === 'failed' && <span className="text-red-500">✗</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
