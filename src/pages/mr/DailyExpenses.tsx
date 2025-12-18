import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailyExpenseEntry {
  date: string;
  hqAllowance: number;
  fareAllowance: number;
  otherExpenses: number;
  otherExpensesNote: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

// Mock data for past expenses
const mockExpenseHistory: DailyExpenseEntry[] = [
  { date: '2024-12-17', hqAllowance: 500, fareAllowance: 350, otherExpenses: 0, otherExpensesNote: '', status: 'pending' },
  { date: '2024-12-16', hqAllowance: 500, fareAllowance: 420, otherExpenses: 150, otherExpensesNote: 'Parking fees', status: 'approved' },
  { date: '2024-12-15', hqAllowance: 500, fareAllowance: 280, otherExpenses: 0, otherExpensesNote: '', status: 'approved' },
  { date: '2024-12-14', hqAllowance: 500, fareAllowance: 500, otherExpenses: 200, otherExpensesNote: 'Client lunch', status: 'rejected', rejectionReason: 'Receipt not attached for client lunch' },
  { date: '2024-12-13', hqAllowance: 500, fareAllowance: 380, otherExpenses: 0, otherExpensesNote: '', status: 'approved' },
];

export default function DailyExpenses() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hqAllowance] = useState(500); // Fixed daily allowance
  const [fareAllowance, setFareAllowance] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');
  const [otherExpensesNote, setOtherExpensesNote] = useState('');
  const [expenseHistory] = useState<DailyExpenseEntry[]>(mockExpenseHistory);

  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalExpense = hqAllowance + (parseFloat(fareAllowance) || 0) + (parseFloat(otherExpenses) || 0);

  const handleSave = () => {
    if (!fareAllowance) {
      toast({
        title: 'Enter fare allowance',
        description: 'Please enter your travel/fare allowance for today.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Expense saved',
      description: 'Your daily expense has been submitted for approval.',
    });
    
    setFareAllowance('');
    setOtherExpenses('');
    setOtherExpensesNote('');
  };

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

  // Calculate monthly totals
  const monthlyTotal = expenseHistory.reduce((sum, e) => sum + e.hqAllowance + e.fareAllowance + e.otherExpenses, 0);
  const approvedTotal = expenseHistory.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.hqAllowance + e.fareAllowance + e.otherExpenses, 0);

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
              <h1 className="font-semibold text-foreground">Daily Expenses</h1>
              <p className="text-sm text-muted-foreground">{todayFormatted}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-primary">₹{monthlyTotal.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This Month Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-secondary">₹{approvedTotal.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Expense Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* HQ Allowance - Fixed */}
            <div className="space-y-2">
              <Label>HQ Allowance (Fixed)</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">₹{hqAllowance}</span>
                <Badge variant="secondary" className="ml-auto">Fixed</Badge>
              </div>
            </div>

            {/* Fare Allowance */}
            <div className="space-y-2">
              <Label>Fare / Travel Allowance *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter travel expense"
                  value={fareAllowance}
                  onChange={(e) => setFareAllowance(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Other Expenses */}
            <div className="space-y-2">
              <Label>Other Expenses (Optional)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter other expenses"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                  className="pl-10"
                />
              </div>
              {otherExpenses && (
                <Textarea
                  placeholder="Describe other expenses..."
                  value={otherExpensesNote}
                  onChange={(e) => setOtherExpensesNote(e.target.value)}
                  rows={2}
                />
              )}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <span className="font-medium">Total Expense</span>
              <span className="text-xl font-bold text-primary">₹{totalExpense.toLocaleString()}</span>
            </div>

            <Button variant="hero" className="w-full h-12" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Today's Expense
            </Button>
          </CardContent>
        </Card>

        {/* Expense History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenseHistory.map((expense, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{expense.date}</span>
                  {getStatusBadge(expense.status)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">HQ</p>
                    <p className="font-medium">₹{expense.hqAllowance}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Fare</p>
                    <p className="font-medium">₹{expense.fareAllowance}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Other</p>
                    <p className="font-medium">₹{expense.otherExpenses}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="font-bold">₹{(expense.hqAllowance + expense.fareAllowance + expense.otherExpenses).toLocaleString()}</span>
                </div>
                {expense.status === 'rejected' && expense.rejectionReason && (
                  <div className="mt-2 p-2 rounded bg-destructive/10 text-xs text-destructive">
                    Reason: {expense.rejectionReason}
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
