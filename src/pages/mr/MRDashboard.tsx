import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  WifiOff, 
  Wifi, 
  LogOut,
  Calendar,
  ChevronRight,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PunchVisitModal } from '@/components/mr/PunchVisitModal';

// Mock data
const todaysVisits = [
  { id: 1, doctorName: 'Dr. Sharma', time: '9:30 AM', status: 'completed' },
  { id: 2, doctorName: 'Dr. Patel', time: '11:00 AM', status: 'completed' },
  { id: 3, doctorName: 'Dr. Mehta', time: '1:30 PM', status: 'completed' },
];

const lastVisit = { doctorName: 'Dr. Mehta', time: '1:30 PM' };

export default function MRDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = () => {
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You are offline. Visits will sync when connected.</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{getGreeting()}</p>
                <h1 className="font-semibold text-foreground">Rahul Kumar</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-secondary" />
                    <span className="text-muted-foreground">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-destructive" />
                    <span className="text-muted-foreground">Offline</span>
                  </>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 max-w-lg">
        {/* Date and time */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{currentDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{currentTime}</span>
          </div>
        </div>

        {/* Punch Visit Card */}
        <div 
          onClick={() => setIsPunchModalOpen(true)}
          className="pharma-card p-6 mb-6 cursor-pointer group hover:border-primary/30 transition-all"
        >
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-center shadow-pharma-lg group-hover:shadow-pharma-xl transition-shadow">
            <div className="relative mx-auto mb-4">
              <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -inset-2 rounded-full border-2 border-primary-foreground/30 animate-pulse-ring" />
            </div>
            <h2 className="text-xl font-bold text-primary-foreground mb-1">Punch Visit Now</h2>
            <p className="text-primary-foreground/70 text-sm">Tap to record your visit</p>
          </div>
          
          {/* Last visit info */}
          {lastVisit && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last visit:</span>
              <span className="font-medium text-foreground">
                {lastVisit.doctorName} at {lastVisit.time}
              </span>
            </div>
          )}
        </div>

        {/* Today's Visits */}
        <div className="pharma-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Today's Visits</h3>
            <span className="text-sm text-primary font-medium">{todaysVisits.length} visits</span>
          </div>

          {todaysVisits.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No visits recorded today</p>
              <p className="text-sm text-muted-foreground mt-1">Tap above to punch your first visit</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysVisits.map((visit) => (
                <div 
                  key={visit.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{visit.doctorName}</h4>
                    <p className="text-sm text-muted-foreground">{visit.time}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Punch Visit Modal */}
      <PunchVisitModal 
        open={isPunchModalOpen} 
        onClose={() => setIsPunchModalOpen(false)} 
      />
    </div>
  );
}
