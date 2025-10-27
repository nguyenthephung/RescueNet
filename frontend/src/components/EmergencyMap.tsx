/**
 * Emergency Location Map Component
 * Shows user's current location on an interactive map
 * Uses Leaflet for mapping
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { EmergencyLocation } from '@/types';

// Leaflet imports - must be dynamic to avoid SSR issues
let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  
  // Fix Leaflet default icon issue
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface EmergencyMapProps {
  location: EmergencyLocation | null;
  className?: string;
}

export function EmergencyMap({ location, className = '' }: EmergencyMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || !L) {
      return;
    }

    // Initialize map only once
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [21.0285, 105.8542], // Default: Hanoi, Vietnam
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setIsLoading(false);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker when location changes
  useEffect(() => {
    if (!mapRef.current || !location || !L) {
      return;
    }

    const { latitude, longitude, accuracy } = location;

    // Remove old marker and circle
    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (circleRef.current) {
      circleRef.current.remove();
    }

    // Add new marker
    const marker = L.marker([latitude, longitude], {
      icon: L.divIcon({
        className: 'custom-emergency-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: rgb(220, 38, 38);
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
            }
          </style>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
    }).addTo(mapRef.current);

    markerRef.current = marker;

    // Add accuracy circle
    const circle = L.circle([latitude, longitude], {
      radius: accuracy || 50,
      color: 'rgb(220, 38, 38)',
      fillColor: 'rgb(220, 38, 38)',
      fillOpacity: 0.1,
      weight: 2,
    }).addTo(mapRef.current);

    circleRef.current = circle;

    // Center map on location
    mapRef.current.setView([latitude, longitude], 16);

    // Add popup
    marker.bindPopup(`
      <div style="text-align: center; padding: 8px;">
        <strong style="color: rgb(220, 38, 38); font-size: 14px;">Vị trí khẩn cấp</strong><br/>
        <small style="color: #666;">Độ chính xác: ±${Math.round(accuracy || 0)}m</small>
      </div>
    `).openPopup();
  }, [location]);

  if (typeof window === 'undefined') {
    return null; // Don't render on server
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 rounded-xl z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-neutral-600">Đang tải bản đồ...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-xl shadow-lg"
        style={{ minHeight: '400px' }}
      />
      {!location && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 rounded-xl backdrop-blur-sm">
          <div className="text-center text-white p-6">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="font-semibold">Đang xác định vị trí...</p>
            <p className="text-sm opacity-75 mt-1">Vui lòng cho phép truy cập vị trí</p>
          </div>
        </div>
      )}
    </div>
  );
}
