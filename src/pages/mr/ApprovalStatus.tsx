import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Store,
  IndianRupee,
  AlertCircle
} from 'lucide-react';

interface DailyApprovalStatus {
  date: string;
  visitCount: number;
  shopVisitCount: number;
  expense: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Mock data
const mockApprovalHistory: DailyApprovalStatus[] = [
  { date: '2024-12-18', visitCount: 3, shopVisitCount: 1, expense: 850, status: 'pending' },
  { date: '2024-12-17', visitCount: 4, shopVisitCount: 2, expense: 920, status: 'pending' },
  { date: '2024-12-16', visitCount: 3, shopVisitCount: 1, expense: 780, status: 'approved', approvedBy: 'Admin', approvedAt: '2024-12-17' },
  { date: '2024-12-15', visitCount: 5, shopVisitCount: 0, expense: 650, status: 'approved', approvedBy: 'Admin', approvedAt: '2024-12-16' },
  { date: '2024-12-14', visitCount: 2, shopVisitCount: 1, expense: 1200, status: 'rejected', rejectionReason: 'Expense receipts missing for travel claim exceeding ₹500' },
  { date: '2024-12-13', visitCount: 4, shopVisitCount: 2, expense: 880, status: 'approved', approvedBy: 'Admin', approvedAt: '2024-12-14' },
  { date: '2024-12-12', visitCount: 3, shopVisitCount: 1, expense: 750, status: 'approved', approvedBy: 'Admin', approvedAt: '2024-12-13' },
];

export default function ApprovalStatus() {
  const navigate = useNavigate();
  const [approvalHistory] = useState<DailyApprovalStatus[]>(mockApprovalHistory);

  const pendingCount = approvalHistory.filter(a => a.status === 'pending').length;
  const approvedCount = approvalHistory.filter(a => a.status === 'approved').length;
  const rejectedCount = approvalHistory.filter(a => a.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-amber-600 border-amber-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/mr/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Approval Status</h1>
              <p className="text-sm text-muted-foreground">View your daily approval history</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-4 text-center">
              <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-amber-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-secondary/20 bg-secondary/5">
            <CardContent className="pt-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-secondary mx-auto mb-1" />
              <div className="text-xl font-bold text-secondary">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-4 text-center">
              <XCircle className="w-6 h-6 text-destructive mx-auto mb-1" />
              <div className="text-xl font-bold text-destructive">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Approval History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Daily Approval History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvalHistory.map((day, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  day.status === 'rejected' 
                    ? 'border-destructive/30 bg-destructive/5' 
                    : day.status === 'approved' 
                    ? 'border-secondary/30 bg-secondary/5' 
                    : 'border-border bg-muted/30'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{formatDate(day.date)}</span>
                  {getStatusBadge(day.status)}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{day.visitCount}</p>
                      <p className="text-xs text-muted-foreground">Doctor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-pharma-blue" />
                    <div>
                      <p className="font-medium text-sm">{day.shopVisitCount}</p>
                      <p className="text-xs text-muted-foreground">Shop</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="font-medium text-sm">₹{day.expense}</p>
                      <p className="text-xs text-muted-foreground">Expense</p>
                    </div>
                  </div>
                </div>

                {/* Approval Info */}
                {day.status === 'approved' && day.approvedBy && (
                  <div className="text-xs text-muted-foreground border-t pt-2">
                    Approved by {day.approvedBy} on {formatDate(day.approvedAt!)}
                  </div>
                )}

                {/* Rejection Reason */}
                {day.status === 'rejected' && day.rejectionReason && (
                  <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 mt-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-destructive">Rejection Reason:</p>
                      <p className="text-xs text-muted-foreground">{day.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
