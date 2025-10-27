/**
 * WebSocket Hook for Real-time Location Tracking
 * Sends user location to backend every 5 seconds during active emergency
 */

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { EmergencyLocation } from '@/types';

interface UseLocationWebSocketProps {
  requestId?: string;
  location: EmergencyLocation | null;
  isActive: boolean; // Only send when emergency is active
}

export function useLocationWebSocket({ requestId, location, isActive }: UseLocationWebSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only connect when there's an active emergency request
    if (!isActive || !requestId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Connect to WebSocket server
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setError(null);
      
      // Join room for this emergency request
      socket.emit('join-emergency', { requestId });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      setError('Không thể kết nối đến server');
    });

    socket.on('location-received', (data) => {
      console.log('Location update acknowledged:', data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isActive, requestId]);

  // Send location updates every 5 seconds
  useEffect(() => {
    if (!isConnected || !location || !requestId || !socketRef.current) {
      return;
    }

    const sendLocation = () => {
      if (socketRef.current && location) {
        socketRef.current.emit('location-update', {
          requestId,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            timestamp: new Date().toISOString(),
          },
        });
      }
    };

    // Send immediately on connect
    sendLocation();

    // Then send every 5 seconds
    const interval = setInterval(sendLocation, 5000);

    return () => clearInterval(interval);
  }, [isConnected, location, requestId]);

  return {
    isConnected,
    error,
  };
}
