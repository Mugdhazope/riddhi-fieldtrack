import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

interface VisitPoint {
  id: string;
  doctorName: string;
  time: string;
  lat: number;
  lng: number;
}

interface TodayRouteMapProps {
  visits?: VisitPoint[];
}

// Default mock visits for today's route
const defaultVisits: VisitPoint[] = [
  { id: '1', doctorName: 'Dr. Sharma', time: '9:30 AM', lat: 19.1136, lng: 72.8697 },
  { id: '2', doctorName: 'Dr. Patel', time: '11:00 AM', lat: 19.1255, lng: 72.8362 },
  { id: '3', doctorName: 'Dr. Mehta', time: '1:30 PM', lat: 19.1362, lng: 72.8296 },
];

// Fix for Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function TodayRouteMap({ visits = defaultVisits }: TodayRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current && visits.length > 0) {
      // Initialize map centered on first visit
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [visits[0].lat, visits[0].lng],
        13
      );

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);

      // Create route line
      const routePoints: L.LatLngExpression[] = visits.map(v => [v.lat, v.lng]);
      L.polyline(routePoints, {
        color: 'hsl(187, 79%, 45%)',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(mapInstanceRef.current);

      // Add markers for each visit
      visits.forEach((visit, index) => {
        const isFirst = index === 0;
        const isLast = index === visits.length - 1;
        
        // Custom icon colors
        const markerColor = isFirst ? '#22c55e' : isLast ? '#ef4444' : '#3b82f6';
        
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background: ${markerColor};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            ">${index + 1}</div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker([visit.lat, visit.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="padding: 4px 0;">
              <strong style="font-size: 14px;">${visit.doctorName}</strong><br/>
              <span style="color: #666; font-size: 12px;">${visit.time}</span>
              ${isFirst ? '<br/><span style="color: #22c55e; font-size: 11px; font-weight: 500;">First Punch</span>' : ''}
              ${isLast ? '<br/><span style="color: #ef4444; font-size: 11px; font-weight: 500;">Last Punch</span>' : ''}
            </div>
          `);
      });

      // Fit bounds to show all markers
      const bounds = L.latLngBounds(routePoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [visits]);

  if (visits.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            Today's Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-lg bg-muted/50 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No visits recorded yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            Today's Route
          </CardTitle>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Start
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              End
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-48 sm:h-56 rounded-lg overflow-hidden" />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>First punch: {visits[0]?.time}</span>
          <span>Last punch: {visits[visits.length - 1]?.time}</span>
        </div>
      </CardContent>
    </Card>
  );
}
