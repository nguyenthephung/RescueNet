/**
 * ChatInput Component
 * Message input with send button and typing indicator
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface ChatInputProps {
  onSend: (message: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder
}: ChatInputProps) {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTypingStop();
    }, 2000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;

    onSend(message.trim());
    setMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      onTypingStop();
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Focus back on input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-end gap-2">
        {/* Text input */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('chat.placeholder')}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 px-4 py-2 
                     text-gray-900 dark:text-gray-100 
                     placeholder:text-gray-400 dark:placeholder:text-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     disabled:opacity-50 disabled:cursor-not-allowed
                     max-h-32 overflow-y-auto"
          style={{
            height: 'auto',
            minHeight: '40px'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
          }}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="shrink-0 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                     text-white font-medium rounded-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('chat.send')}
        </button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {t('chat.sendHint')}
      </p>
    </form>
  );
}
