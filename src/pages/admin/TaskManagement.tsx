import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, Clock, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockMRs, mockDoctors } from '@/data/mockData';

interface Task {
  id: string;
  mrId: string;
  mrName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time?: string;
  notes?: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

const initialTasks: Task[] = [
  {
    id: 'task-1',
    mrId: 'mr1',
    mrName: 'Rahul Kumar',
    doctorId: 'd1',
    doctorName: 'Dr. Rajesh Sharma',
    doctorSpecialty: 'Cardiologist',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    notes: 'Discuss new cardiac medication samples',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    mrId: 'mr1',
    mrName: 'Rahul Kumar',
    doctorId: 'd2',
    doctorName: 'Dr. Priya Patel',
    doctorSpecialty: 'General Physician',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    mrId: 'mr2',
    mrName: 'Sneha Desai',
    doctorId: 'd3',
    doctorName: 'Dr. Amit Mehta',
    doctorSpecialty: 'Pediatrician',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00',
    notes: 'Product demo for pediatric supplements',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

export default function TaskManagement() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMR, setFilterMR] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [newTask, setNewTask] = useState({
    mrId: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: '',
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.mrName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMR = filterMR === 'all' || task.mrId === filterMR;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesMR && matchesStatus;
  });

  const handleCreateTask = () => {
    if (!newTask.mrId || !newTask.doctorId || !newTask.date) {
      toast({
        title: 'Missing information',
        description: 'Please select MR, doctor, and date.',
        variant: 'destructive',
      });
      return;
    }

    const mr = mockMRs.find(m => m.id === newTask.mrId);
    const doctor = mockDoctors.find(d => d.id === newTask.doctorId);

    if (!mr || !doctor) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      mrId: newTask.mrId,
      mrName: mr.name,
      doctorId: newTask.doctorId,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialization,
      date: newTask.date,
      time: newTask.time || undefined,
      notes: newTask.notes || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTasks([task, ...tasks]);
    setIsCreateModalOpen(false);
    setNewTask({ mrId: '', doctorId: '', date: new Date().toISOString().split('T')[0], time: '', notes: '' });
    
    toast({
      title: 'Task created',
      description: `Task assigned to ${mr.name}`,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    toast({
      title: 'Task deleted',
      description: 'The task has been removed.',
    });
  };

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Task Management</h1>
            <p className="text-muted-foreground">Create and manage MR tasks</p>
          </div>
          <Button variant="hero" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="pharma-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </div>
          <div className="pharma-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="pharma-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="pharma-card p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterMR} onValueChange={setFilterMR}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by MR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All MRs</SelectItem>
                {mockMRs.filter(m => m.status === 'active').map(mr => (
                  <SelectItem key={mr.id} value={mr.id}>{mr.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="pharma-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MR</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No tasks found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.mrName}</TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{task.doctorName}</span>
                          <p className="text-xs text-muted-foreground">{task.doctorSpecialty}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(task.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        {task.time ? (
                          <span className="flex items-center gap-1 text-sm">
                            <Clock className="w-3 h-3" />
                            {task.time}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Flexible</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {task.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Assign to MR *</Label>
              <Select value={newTask.mrId} onValueChange={(v) => setNewTask({ ...newTask, mrId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select MR" />
                </SelectTrigger>
                <SelectContent>
                  {mockMRs.filter(m => m.status === 'active').map(mr => (
                    <SelectItem key={mr.id} value={mr.id}>{mr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Doctor to Visit *</Label>
              <Select value={newTask.doctorId} onValueChange={(v) => setNewTask({ ...newTask, doctorId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex flex-col">
                        <span>{doctor.name}</span>
                        <span className="text-xs text-muted-foreground">{doctor.specialization}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={newTask.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Time (Optional)</Label>
                <Input
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add task notes..."
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="hero" className="flex-1" onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
