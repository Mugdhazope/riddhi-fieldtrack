import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Search, 
  ArrowLeft, 
  Calendar, 
  CheckCircle2,
  Navigation,
  Clock,
  Loader2
} from 'lucide-react';
import { 
  mockDoctors, 
  getDoctorsByDistance, 
  getDoctorWeeklyVisits, 
  getDoctorLastVisit,
  isDoctorVisitedThisWeek,
  Doctor 
} from '@/data/mockData';

interface DoctorWithDistance extends Doctor {
  distance: number;
  weeklyVisits: number;
  lastVisit: string | null;
  visitedThisWeek: boolean;
}

export default function DoctorList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<DoctorWithDistance[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Simulate GPS acquisition
    setIsLoadingLocation(true);
    const timer = setTimeout(() => {
      // Mock current location (Andheri area)
      const mockLocation = { lat: 19.1136, lng: 72.8697 };
      setCurrentLocation(mockLocation);
      
      const doctorsWithDistance = getDoctorsByDistance(mockLocation.lat, mockLocation.lng).map(doc => ({
        ...doc,
        weeklyVisits: getDoctorWeeklyVisits(doc.id),
        lastVisit: getDoctorLastVisit(doc.id),
        visitedThisWeek: isDoctorVisitedThisWeek(doc.id),
      }));
      
      setDoctors(doctorsWithDistance);
      setIsLoadingLocation(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.town.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  };

  const formatLastVisit = (date: string | null): string => {
    if (!date) return 'Never visited';
    const visitDate = new Date(date);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/mr')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Doctor List</h1>
              <p className="text-xs text-muted-foreground">All doctors sorted by distance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-lg">
        {/* GPS Status */}
        {isLoadingLocation ? (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 mb-4">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Acquiring your location...</span>
          </div>
        ) : currentLocation && (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-secondary/10 mb-4">
            <Navigation className="w-5 h-5 text-secondary" />
            <span className="text-sm text-foreground">Doctors sorted by distance from you</span>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-primary">{doctors.length}</div>
              <p className="text-xs text-muted-foreground">Total Doctors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-secondary">
                {doctors.filter(d => d.visitedThisWeek).length}
              </div>
              <p className="text-xs text-muted-foreground">Visited This Week</p>
            </CardContent>
          </Card>
        </div>

        {/* Doctor List */}
        <div className="space-y-3">
          {filteredDoctors.map((doctor, index) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start gap-3 p-4">
                  {/* Rank / Visit indicator */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    doctor.visitedThisWeek 
                      ? 'bg-secondary/10' 
                      : 'bg-muted'
                  }`}>
                    {doctor.visitedThisWeek ? (
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-foreground truncate">{doctor.name}</h3>
                        <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                      </div>
                      {/* Distance Badge */}
                      <Badge variant="outline" className="flex-shrink-0 gap-1">
                        <MapPin className="w-3 h-3" />
                        {formatDistance(doctor.distance)}
                      </Badge>
                    </div>

                    {/* Location & Specialty */}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {doctor.specialization}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {doctor.area}, {doctor.town}
                      </span>
                    </div>

                    {/* Visit Stats */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Last: {formatLastVisit(doctor.lastVisit)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          This week: {doctor.weeklyVisits}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredDoctors.length === 0 && !isLoadingLocation && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No doctors found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
