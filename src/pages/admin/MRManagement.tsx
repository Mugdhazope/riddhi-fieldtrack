import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { 
  Search, 
  Plus, 
  Users, 
  Eye, 
  KeyRound, 
  Copy, 
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';
import { mockMRs, getMRCoverageStats, MR } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function MRManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [mrs, setMRs] = useState<MR[]>(mockMRs);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedMR, setSelectedMR] = useState<MR | null>(null);
  const [newMR, setNewMR] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    territory: '',
    hq: '',
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredMRs = mrs.filter(mr =>
    mr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mr.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mr.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateMR = () => {
    if (!newMR.name || !newMR.username || !newMR.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const password = generatePassword();
    const mr: MR = {
      id: `mr${mrs.length + 1}`,
      ...newMR,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      password,
    };

    setMRs(prev => [...prev, mr]);
    setGeneratedPassword(password);
    setNewMR({ name: '', username: '', email: '', phone: '', territory: '', hq: '' });
    
    toast({
      title: 'MR Created Successfully',
      description: `${mr.name} has been added. Share the credentials with them.`,
    });
  };

  const handleToggleStatus = (mrId: string) => {
    setMRs(prev => prev.map(mr => 
      mr.id === mrId ? { ...mr, status: mr.status === 'active' ? 'inactive' : 'active' } : mr
    ));
  };

  const handleResetPassword = (mr: MR) => {
    const newPassword = generatePassword();
    setMRs(prev => prev.map(m => 
      m.id === mr.id ? { ...m, password: newPassword } : m
    ));
    setGeneratedPassword(newPassword);
    setSelectedMR(mr);
    setIsResetPasswordModalOpen(true);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: 'Copied!',
      description: `${field} copied to clipboard`,
    });
  };

  const handleViewMR = (mr: MR) => {
    setSelectedMR(mr);
    setIsViewModalOpen(true);
  };

  const activeMRs = mrs.filter(m => m.status === 'active').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">MR Management</h1>
            <p className="text-muted-foreground">Create and manage Medical Representatives</p>
          </div>
          <Button variant="hero" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create MR
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, username, or territory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mrs.length}</div>
                  <p className="text-sm text-muted-foreground">Total MRs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeMRs}</div>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mrs.length - activeMRs}</div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pharma-blue/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-pharma-blue" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{new Set(mrs.map(m => m.territory)).size}</div>
                  <p className="text-sm text-muted-foreground">Territories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MR Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Username</TableHead>
                    <TableHead>Territory</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMRs.map((mr) => (
                    <TableRow key={mr.id}>
                      <TableCell className="font-medium">{mr.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{mr.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{mr.territory}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{mr.phone}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={mr.status === 'active'}
                            onCheckedChange={() => handleToggleStatus(mr.id)}
                          />
                          <span className={`text-xs ${mr.status === 'active' ? 'text-secondary' : 'text-muted-foreground'}`}>
                            {mr.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewMR(mr)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleResetPassword(mr)}>
                            <KeyRound className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create MR Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New MR</DialogTitle>
              <DialogDescription>
                Add a new Medical Representative to the system
              </DialogDescription>
            </DialogHeader>

            {!generatedPassword ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={newMR.name}
                    onChange={(e) => setNewMR({ ...newMR, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username *</Label>
                  <Input
                    placeholder="e.g., rahul.kumar"
                    value={newMR.username}
                    onChange={(e) => setNewMR({ ...newMR, username: e.target.value.toLowerCase().replace(/\s/g, '.') })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      placeholder="Phone number"
                      value={newMR.phone}
                      onChange={(e) => setNewMR({ ...newMR, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      placeholder="Email (optional)"
                      value={newMR.email}
                      onChange={(e) => setNewMR({ ...newMR, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Territory</Label>
                    <Input
                      placeholder="e.g., Mumbai West"
                      value={newMR.territory}
                      onChange={(e) => setNewMR({ ...newMR, territory: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>HQ</Label>
                    <Input
                      placeholder="e.g., Andheri"
                      value={newMR.hq}
                      onChange={(e) => setNewMR({ ...newMR, hq: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="hero" className="flex-1" onClick={handleCreateMR}>
                    Create MR
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span className="font-medium text-secondary">MR Created Successfully!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share these credentials with the MR:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <div>
                        <p className="text-xs text-muted-foreground">Username</p>
                        <p className="font-mono font-medium">{newMR.username || mrs[mrs.length - 1]?.username}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(newMR.username || mrs[mrs.length - 1]?.username, 'Username')}
                      >
                        {copiedField === 'Username' ? <CheckCircle2 className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <div>
                        <p className="text-xs text-muted-foreground">Password</p>
                        <p className="font-mono font-medium">{generatedPassword}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(generatedPassword, 'Password')}
                      >
                        {copiedField === 'Password' ? <CheckCircle2 className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="hero" 
                  className="w-full" 
                  onClick={() => {
                    setGeneratedPassword('');
                    setIsCreateModalOpen(false);
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View MR Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedMR?.name}</DialogTitle>
              <DialogDescription>MR Details and Coverage Stats</DialogDescription>
            </DialogHeader>

            {selectedMR && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Username</p>
                    <p className="font-medium">{selectedMR.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant={selectedMR.status === 'active' ? 'default' : 'secondary'}>
                      {selectedMR.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Territory</p>
                    <p className="font-medium">{selectedMR.territory}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">HQ</p>
                    <p className="font-medium">{selectedMR.hq || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedMR.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-medium">{selectedMR.joinedDate}</p>
                  </div>
                </div>

                {/* Coverage Stats */}
                {(() => {
                  const stats = getMRCoverageStats(selectedMR.id);
                  return (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Coverage Statistics</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-lg font-bold text-primary">{stats.doctorsCovered}/{stats.totalDoctors}</div>
                            <p className="text-xs text-muted-foreground">Doctors</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-lg font-bold text-secondary">{stats.productSpread}</div>
                            <p className="text-xs text-muted-foreground">Products</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-lg font-bold text-destructive">{stats.missedDoctors.length}</div>
                            <p className="text-xs text-muted-foreground">Missed</p>
                          </CardContent>
                        </Card>
                      </div>
                      {stats.missedDoctors.length > 0 && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-xs font-medium text-destructive mb-2">Missed Doctors:</p>
                          <p className="text-xs text-muted-foreground">{stats.missedDoctors.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reset Password Modal */}
        <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Password Reset</DialogTitle>
              <DialogDescription>New password for {selectedMR?.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-xs text-muted-foreground">New Password</p>
                  <p className="font-mono font-medium text-lg">{generatedPassword}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(generatedPassword, 'Password')}
                >
                  {copiedField === 'Password' ? <CheckCircle2 className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this password with the MR securely. They should change it on first login.
              </p>
              <Button 
                variant="hero" 
                className="w-full" 
                onClick={() => {
                  setGeneratedPassword('');
                  setIsResetPasswordModalOpen(false);
                }}
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
