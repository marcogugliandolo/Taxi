import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Driver } from '../types';
import { useTheme } from '../ThemeProvider';

export default function MapView({ 
  drivers, 
  center, 
  routePoints,
  pickup,
  dropoff
}: { 
  drivers: Driver[], 
  center: [number, number],
  routePoints?: [number, number][],
  pickup?: [number, number],
  dropoff?: [number, number]
}) {
  const { theme } = useTheme();
  const mapUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const carIcon = L.divIcon({
    html: `<div style="background-color: ${theme === 'dark' ? '#fff' : '#000'}; color: ${theme === 'dark' ? '#000' : '#fff'}; padding: 6px; border-radius: 9999px; border: 4px solid ${theme === 'dark' ? '#09090b' : '#fff'}; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
           </div>`,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

  const pickupIcon = L.divIcon({
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const dropoffIcon = L.divIcon({
    html: `<div style="background-color: #000; width: 16px; height: 16px; border-radius: 2px; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <MapContainer center={center} zoom={15} zoomControl={false} className="w-full h-full absolute inset-0 z-0 bg-[#E8EEF2] dark:bg-zinc-950">
      <TileLayer key={theme} url={mapUrl} />
      
      {routePoints && routePoints.length > 0 && (
        <Polyline 
          positions={routePoints} 
          color={theme === 'dark' ? '#60a5fa' : '#3b82f6'} 
          weight={5} 
          opacity={0.8}
          dashArray="1, 8"
          lineCap="round"
        />
      )}

      {pickup && <Marker position={pickup} icon={pickupIcon} />}
      {dropoff && <Marker position={dropoff} icon={dropoffIcon} />}

      {drivers.map(d => (
        <Marker key={d.id} position={d.location} icon={carIcon} />
      ))}
      <MapController center={center} routePoints={routePoints} />
    </MapContainer>
  );
}

function MapController({ center, routePoints }: { center: [number, number], routePoints?: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (routePoints && routePoints.length > 1) {
      const bounds = L.latLngBounds(routePoints as [number, number][]);
      // Pad bounds taking into account the UI overlays (bottom sheet padding)
      map.fitBounds(bounds, { animate: true, duration: 1.5, paddingBottomRight: [0, 300], paddingTopLeft: [40, 40] });
    } else {
      map.flyTo(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, routePoints, map]);
  return null;
}

