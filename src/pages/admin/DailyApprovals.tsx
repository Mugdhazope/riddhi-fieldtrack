import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  User,
  MapPin,
  Store,
  IndianRupee,
  AlertCircle
} from 'lucide-react';
import { mockApprovals, mockMRs, DailyApproval } from '@/data/mockData';

export default function DailyApprovals() {
  const [approvals, setApprovals] = useState<DailyApproval[]>(mockApprovals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mrFilter, setMrFilter] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<DailyApproval | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.mrName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    const matchesMR = mrFilter === 'all' || approval.mrId === mrFilter;
    return matchesSearch && matchesStatus && matchesMR;
  });

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  const handleApprove = (approvalId: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === approvalId 
        ? { ...a, status: 'approved', approvedBy: 'Admin', approvedAt: new Date().toISOString().split('T')[0] }
        : a
    ));
    setSelectedApproval(null);
  };

  const handleReject = (approvalId: string) => {
    if (!rejectionReason.trim()) return;
    
    setApprovals(prev => prev.map(a => 
      a.id === approvalId 
        ? { ...a, status: 'rejected', rejectionReason }
        : a
    ));
    setRejectionReason('');
    setSelectedApproval(null);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daily Approvals</h1>
          <p className="text-muted-foreground">Review and approve MR daily submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/20 bg-secondary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
                <div>
                  <div className="text-2xl font-bold text-secondary">{approvedCount}</div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-destructive" />
                <div>
                  <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search MR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={mrFilter} onValueChange={setMrFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="MR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All MRs</SelectItem>
              {mockMRs.map(mr => (
                <SelectItem key={mr.id} value={mr.id}>{mr.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Approvals Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>MR Name</TableHead>
                    <TableHead className="text-center">Doctor Visits</TableHead>
                    <TableHead className="text-center">Shop Visits</TableHead>
                    <TableHead className="text-right">Expense</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-medium">{approval.date}</TableCell>
                      <TableCell>{approval.mrName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{approval.visitCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{approval.shopVisitCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{approval.expense?.totalExpense.toLocaleString() || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(approval.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedApproval(approval)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Review Modal */}
        <Dialog open={!!selectedApproval} onOpenChange={() => { setSelectedApproval(null); setRejectionReason(''); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Daily Report Review
              </DialogTitle>
              <DialogDescription>
                {selectedApproval?.mrName} - {selectedApproval?.date}
              </DialogDescription>
            </DialogHeader>

            {selectedApproval && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedApproval.visitCount}</div>
                      <p className="text-xs text-muted-foreground">Doctor Visits</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <Store className="w-5 h-5 text-pharma-blue mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedApproval.shopVisitCount}</div>
                      <p className="text-xs text-muted-foreground">Shop Visits</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <IndianRupee className="w-5 h-5 text-secondary mx-auto mb-1" />
                      <div className="text-lg font-bold">₹{selectedApproval.expense?.totalExpense || 0}</div>
                      <p className="text-xs text-muted-foreground">Total Expense</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Expense Breakdown */}
                {selectedApproval.expense && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">HQ Allowance</span>
                        <span>₹{selectedApproval.expense.hqAllowance}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fare / Travel</span>
                        <span>₹{selectedApproval.expense.fareAllowance}</span>
                      </div>
                      {selectedApproval.expense.otherExpenses > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Other Expenses</span>
                          <span>₹{selectedApproval.expense.otherExpenses}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-medium pt-2 border-t">
                        <span>Total</span>
                        <span>₹{selectedApproval.expense.totalExpense}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Status / Rejection */}
                {selectedApproval.status === 'rejected' && selectedApproval.rejectionReason && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-2 text-destructive mb-1">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium text-sm">Rejected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedApproval.rejectionReason}</p>
                  </div>
                )}

                {selectedApproval.status === 'approved' && (
                  <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center gap-2 text-secondary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-medium text-sm">Approved by {selectedApproval.approvedBy}</span>
                    </div>
                  </div>
                )}

                {/* Actions for pending */}
                {selectedApproval.status === 'pending' && (
                  <>
                    <div className="space-y-2">
                      <Label>Rejection Reason (required for rejection)</Label>
                      <Textarea
                        placeholder="Enter reason if rejecting..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        disabled={!rejectionReason.trim()}
                        onClick={() => handleReject(selectedApproval.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        variant="hero" 
                        className="flex-1"
                        onClick={() => handleApprove(selectedApproval.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
