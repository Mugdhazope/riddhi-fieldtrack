import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Search, Plus, Eye, MapPin, Calendar, User, Stethoscope } from 'lucide-react';
import { mockDoctors, getDoctorVisitHistory, Doctor, DoctorVisit } from '@/data/mockData';

export default function DoctorMaster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorVisits, setDoctorVisits] = useState<DoctorVisit[]>([]);

  const filteredDoctors = mockDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.town.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDoctorVisits(getDoctorVisitHistory(doctor.id));
  };

  const getLastVisitDate = (doctorId: string): string => {
    const visits = getDoctorVisitHistory(doctorId);
    return visits.length > 0 ? visits[0].date : 'Never';
  };

  const getVisitCount = (doctorId: string): number => {
    return getDoctorVisitHistory(doctorId).length;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Doctor Master</h1>
            <p className="text-muted-foreground">Manage doctor profiles and view visit history</p>
          </div>
          <Button variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialization, or town..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{mockDoctors.length}</div>
              <p className="text-sm text-muted-foreground">Total Doctors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">{new Set(mockDoctors.map(d => d.specialization)).size}</div>
              <p className="text-sm text-muted-foreground">Specializations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-pharma-blue">{new Set(mockDoctors.map(d => d.town)).size}</div>
              <p className="text-sm text-muted-foreground">Towns Covered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-pharma-purple">{mockDoctors.filter(d => getVisitCount(d.id) > 5).length}</div>
              <p className="text-sm text-muted-foreground">Frequently Visited</p>
            </CardContent>
          </Card>
        </div>

        {/* Doctors Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Qualification</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
                    <TableHead className="text-center">Visits</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{doctor.qualification}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doctor.specialization}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-muted-foreground">{doctor.area}, {doctor.town}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {getLastVisitDate(doctor.id)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{getVisitCount(doctor.id)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDoctor(doctor)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Detail Modal */}
        <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                {selectedDoctor?.name}
              </DialogTitle>
              <DialogDescription>
                Doctor profile and complete visit history
              </DialogDescription>
            </DialogHeader>

            {selectedDoctor && (
              <div className="space-y-6">
                {/* Doctor Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Qualification</p>
                    <p className="font-medium">{selectedDoctor.qualification}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Specialization</p>
                    <p className="font-medium">{selectedDoctor.specialization}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Town</p>
                    <p className="font-medium">{selectedDoctor.town}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-medium">{selectedDoctor.area}</p>
                  </div>
                </div>

                {/* Visit Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-xl font-bold text-primary">{doctorVisits.length}</div>
                      <p className="text-xs text-muted-foreground">Total Visits</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-xl font-bold text-secondary">
                        {new Set(doctorVisits.map(v => v.mrId)).size}
                      </div>
                      <p className="text-xs text-muted-foreground">MRs Visited</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-xl font-bold text-pharma-blue">
                        ₹{doctorVisits.reduce((sum, v) => sum + v.businessGenerated, 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Business</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Visit History */}
                <div>
                  <h4 className="font-semibold mb-3">Visit History</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {doctorVisits.slice(0, 20).map((visit) => (
                      <div key={visit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{visit.mrName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {visit.date} at {visit.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-secondary">₹{visit.businessGenerated.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{visit.productsPromoted.length} products</p>
                        </div>
                      </div>
                    ))}
                    {doctorVisits.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No visits recorded</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
