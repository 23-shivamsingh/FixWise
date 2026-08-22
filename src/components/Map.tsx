import React, { useEffect, useRef } from 'react';
import { Repairer } from '../types';
import L from 'leaflet';
import { Star, ShieldCheck, MapPin, Navigation, ArrowRight } from 'lucide-react';

interface MapProps {
  repairers: Repairer[];
  selectedRepairer: Repairer | null;
  onSelectRepairer: (repairer: Repairer) => void;
  userLocation: { lat: number; lng: number; city: string };
  height?: string;
}

export const Map: React.FC<MapProps> = ({
  repairers,
  selectedRepairer,
  onSelectRepairer,
  userLocation,
  height = '100%',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: User location or first repairer
    const centerLat = selectedRepairer?.lat || userLocation.lat;
    const centerLng = selectedRepairer?.lng || userLocation.lng;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    // Clean, light-themed OpenStreetMap tiles (CartoDB Positron / OSM standard)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // User Location Pulse Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(
        `<div class="text-xs font-semibold text-slate-800 p-1">📍 You are here<br/><span class="text-slate-500 font-normal">${userLocation.city}</span></div>`
      );

    // Repairer Markers
    markersRef.current = {};

    repairers.forEach((rep) => {
      const isSelected = selectedRepairer?.id === rep.id;

      const markerIcon = L.divIcon({
        className: 'custom-repairer-marker',
        html: `
          <div class="cursor-pointer transition-all duration-200 transform ${
            isSelected ? 'scale-115 -translate-y-1' : 'hover:scale-105'
          }">
            <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg border ${
              isSelected
                ? 'bg-emerald-700 text-white border-emerald-500 ring-4 ring-emerald-100'
                : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-500'
            }">
              <div class="w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}"></div>
              <span class="text-xs font-bold whitespace-nowrap">${rep.name.split(' ')[0]}</span>
              <span class="text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-500'} font-medium">${rep.distanceKm}km</span>
            </div>
          </div>
        `,
        iconSize: [100, 34],
        iconAnchor: [50, 17],
      });

      const marker = L.marker([rep.lat, rep.lng], { icon: markerIcon }).addTo(map);

      marker.on('click', () => {
        onSelectRepairer(rep);
      });

      markersRef.current[rep.id] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [repairers, userLocation]);

  // Pan to selected repairer when changed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRepairer) return;

    mapInstanceRef.current.flyTo([selectedRepairer.lat, selectedRepairer.lng], 14, {
      duration: 1,
    });
  }, [selectedRepairer]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100" style={{ height }}>
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />

      {/* Floating map legend / current location badge */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-2 text-xs font-medium text-slate-700">
        <Navigation className="w-3.5 h-3.5 text-blue-600" />
        <span>Near {userLocation.city}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
        <span className="text-emerald-700 font-semibold">{repairers.length} Verified Labs</span>
      </div>

      {/* Quick selected repairer card overlay on mobile/bottom */}
      {selectedRepairer && (
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between gap-3 md:hidden">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm truncate">{selectedRepairer.name}</span>
              {selectedRepairer.verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center text-amber-500 font-medium">
                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                {selectedRepairer.rating}
              </span>
              <span>•</span>
              <span>{selectedRepairer.distanceKm} km away</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">{selectedRepairer.warrantyDays}d warranty</span>
            </div>
          </div>
          <button
            onClick={() => onSelectRepairer(selectedRepairer)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm flex items-center gap-1"
          >
            Select <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
