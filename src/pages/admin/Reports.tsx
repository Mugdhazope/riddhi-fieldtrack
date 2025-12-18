import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileSpreadsheet,
  IndianRupee,
  TrendingUp,
  Users,
  Award,
  Calendar
} from 'lucide-react';
import { 
  mockMRs, 
  mockApprovals,
  getMRBusinessStats,
  getDoctorBusinessStats 
} from '@/data/mockData';

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [selectedMR, setSelectedMR] = useState<string>('all');

  const mrBusinessStats = getMRBusinessStats();
  const doctorBusinessStats = getDoctorBusinessStats();

  // Calculate monthly expense summaries
  const getMonthlyExpenses = (mrId?: string) => {
    const monthApprovals = mockApprovals.filter(a => {
      const matchesMonth = a.date.startsWith(selectedMonth);
      const matchesMR = !mrId || mrId === 'all' || a.mrId === mrId;
      return matchesMonth && matchesMR && a.expense;
    });

    const totalHQ = monthApprovals.reduce((sum, a) => sum + (a.expense?.hqAllowance || 0), 0);
    const totalFare = monthApprovals.reduce((sum, a) => sum + (a.expense?.fareAllowance || 0), 0);
    const totalOther = monthApprovals.reduce((sum, a) => sum + (a.expense?.otherExpenses || 0), 0);
    const total = totalHQ + totalFare + totalOther;
    const approved = monthApprovals.filter(a => a.status === 'approved').length;
    const pending = monthApprovals.filter(a => a.status === 'pending').length;
    const rejected = monthApprovals.filter(a => a.status === 'rejected').length;

    return { totalHQ, totalFare, totalOther, total, approved, pending, rejected, days: monthApprovals.length };
  };

  const monthlyExpenses = getMonthlyExpenses(selectedMR);

  const months = [
    { value: '2024-12', label: 'December 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-10', label: 'October 2024' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Monthly expense reports and business insights</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMR} onValueChange={setSelectedMR}>
            <SelectTrigger className="w-48">
              <Users className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select MR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All MRs</SelectItem>
              {mockMRs.map(mr => (
                <SelectItem key={mr.id} value={mr.id}>{mr.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="expenses">Expense Report</TabsTrigger>
            <TabsTrigger value="business">Business Report</TabsTrigger>
            <TabsTrigger value="incentives">Incentives</TabsTrigger>
          </TabsList>

          {/* Expense Report Tab */}
          <TabsContent value="expenses" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">₹{monthlyExpenses.total.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground">Total Expense</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-pharma-blue">₹{monthlyExpenses.totalHQ.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">HQ Allowance</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-pharma-purple">₹{monthlyExpenses.totalFare.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Fare/Travel</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-secondary">₹{monthlyExpenses.totalOther.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Other Expenses</p>
                </CardContent>
              </Card>
            </div>

            {/* Approval Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Approval Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Badge className="bg-secondary/10 text-secondary px-4 py-2">
                    {monthlyExpenses.approved} Approved
                  </Badge>
                  <Badge variant="outline" className="text-amber-600 px-4 py-2">
                    {monthlyExpenses.pending} Pending
                  </Badge>
                  <Badge variant="destructive" className="px-4 py-2">
                    {monthlyExpenses.rejected} Rejected
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* MR-wise Expense Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  MR-wise Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>MR Name</TableHead>
                        <TableHead className="text-right">HQ Allowance</TableHead>
                        <TableHead className="text-right">Fare/Travel</TableHead>
                        <TableHead className="text-right">Other</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Days</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMRs.map(mr => {
                        const mrExpenses = getMonthlyExpenses(mr.id);
                        return (
                          <TableRow key={mr.id}>
                            <TableCell className="font-medium">{mr.name}</TableCell>
                            <TableCell className="text-right">₹{mrExpenses.totalHQ.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{mrExpenses.totalFare.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{mrExpenses.totalOther.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold">₹{mrExpenses.total.toLocaleString()}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{mrExpenses.days}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Report Tab */}
          <TabsContent value="business" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Doctor-wise Business */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Doctor-wise Business</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Doctor</TableHead>
                          <TableHead className="text-center">Visits</TableHead>
                          <TableHead className="text-right">Business</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctorBusinessStats.slice(0, 10).map(stat => (
                          <TableRow key={stat.doctorId}>
                            <TableCell className="font-medium">{stat.doctorName}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{stat.visitCount}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-secondary">
                              ₹{stat.totalBusiness.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* MR-wise Business */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">MR-wise Business</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>MR Name</TableHead>
                          <TableHead className="text-center">Visits</TableHead>
                          <TableHead className="text-right">Business</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mrBusinessStats.map(stat => (
                          <TableRow key={stat.mrId}>
                            <TableCell className="font-medium">{stat.mrName}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{stat.visitCount}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-secondary">
                              ₹{stat.totalBusiness.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Incentives Tab */}
          <TabsContent value="incentives" className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-10 h-10 text-secondary" />
                    <div>
                      <div className="text-2xl font-bold text-secondary">
                        ₹{mrBusinessStats.reduce((sum, s) => sum + s.incentive, 0).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Incentives</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-10 h-10 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">
                        ₹{mrBusinessStats.reduce((sum, s) => sum + s.totalBusiness, 0).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Business</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-pharma-blue">5%</div>
                  <p className="text-sm text-muted-foreground">Incentive Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Incentive Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" />
                  MR-wise Incentive Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>MR Name</TableHead>
                        <TableHead className="text-center">Visits</TableHead>
                        <TableHead className="text-right">Total Business</TableHead>
                        <TableHead className="text-right">Incentive (5%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mrBusinessStats.map((stat, index) => (
                        <TableRow key={stat.mrId}>
                          <TableCell>
                            {index === 0 ? (
                              <Badge className="bg-amber-500">🥇 1st</Badge>
                            ) : index === 1 ? (
                              <Badge variant="secondary">🥈 2nd</Badge>
                            ) : index === 2 ? (
                              <Badge variant="outline">🥉 3rd</Badge>
                            ) : (
                              <span className="text-muted-foreground">#{index + 1}</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{stat.mrName}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{stat.visitCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right">₹{stat.totalBusiness.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-bold text-secondary">
                            ₹{stat.incentive.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
