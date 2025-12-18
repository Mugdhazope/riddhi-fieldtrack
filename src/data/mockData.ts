// ============= Mock Data for Riddhi Life Sciences MR Tracker =============

// Types
export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  town: string;
  area: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  description?: string;
}

export interface MR {
  id: string;
  name: string;
  email: string;
  phone: string;
  territory: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface DoctorVisit {
  id: string;
  doctorId: string;
  doctorName: string;
  mrId: string;
  mrName: string;
  date: string;
  time: string;
  location: { lat: number; lng: number };
  notes?: string;
  productsPromoted: string[];
  businessGenerated: number;
  productWiseBusiness?: { productId: string; amount: number }[];
}

export interface ShopVisit {
  id: string;
  shopName: string;
  location: string;
  mrId: string;
  mrName: string;
  date: string;
  time: string;
  notes?: string;
  contactPerson?: string;
}

export interface DailyExpense {
  id: string;
  mrId: string;
  mrName: string;
  date: string;
  hqAllowance: number;
  fareAllowance: number;
  otherExpenses: number;
  otherExpensesNote?: string;
  totalExpense: number;
}

export interface DailyApproval {
  id: string;
  mrId: string;
  mrName: string;
  date: string;
  visitCount: number;
  shopVisitCount: number;
  expense: DailyExpense | null;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Mock Doctors
export const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Rajesh Sharma', qualification: 'MBBS, MD', specialization: 'Cardiologist', town: 'Mumbai', area: 'Andheri West', createdAt: '2024-01-15' },
  { id: 'd2', name: 'Dr. Priya Patel', qualification: 'MBBS, DNB', specialization: 'General Physician', town: 'Mumbai', area: 'Bandra', createdAt: '2024-01-20' },
  { id: 'd3', name: 'Dr. Amit Mehta', qualification: 'MBBS, MD', specialization: 'Pediatrician', town: 'Thane', area: 'Ghodbunder Road', createdAt: '2024-02-01' },
  { id: 'd4', name: 'Dr. Sunita Singh', qualification: 'MBBS, MS', specialization: 'Orthopedic', town: 'Navi Mumbai', area: 'Vashi', createdAt: '2024-02-10' },
  { id: 'd5', name: 'Dr. Vikram Gupta', qualification: 'MBBS, MD', specialization: 'Dermatologist', town: 'Mumbai', area: 'Powai', createdAt: '2024-02-15' },
  { id: 'd6', name: 'Dr. Neha Kapoor', qualification: 'MBBS, DM', specialization: 'Neurologist', town: 'Mumbai', area: 'Goregaon', createdAt: '2024-03-01' },
  { id: 'd7', name: 'Dr. Arjun Reddy', qualification: 'MBBS, MD', specialization: 'Gastroenterologist', town: 'Thane', area: 'Kalyan', createdAt: '2024-03-10' },
  { id: 'd8', name: 'Dr. Kavita Joshi', qualification: 'MBBS, MD', specialization: 'Endocrinologist', town: 'Navi Mumbai', area: 'Nerul', createdAt: '2024-03-15' },
];

// Mock Products
export const mockProducts: Product[] = [
  { id: 'p1', name: 'Cardiocare Plus', category: 'Cardiac', status: 'active', description: 'Heart health supplement' },
  { id: 'p2', name: 'Neurofit 500', category: 'Neurology', status: 'active', description: 'Nerve health supplement' },
  { id: 'p3', name: 'Gastrowell', category: 'Gastro', status: 'active', description: 'Digestive health' },
  { id: 'p4', name: 'Dermashine', category: 'Derma', status: 'active', description: 'Skin care supplement' },
  { id: 'p5', name: 'Orthomax', category: 'Orthopedic', status: 'active', description: 'Joint health' },
  { id: 'p6', name: 'Diabetrol', category: 'Diabetes', status: 'active', description: 'Blood sugar management' },
  { id: 'p7', name: 'Immunoboost', category: 'General', status: 'active', description: 'Immunity booster' },
  { id: 'p8', name: 'Calcivit D3', category: 'General', status: 'inactive', description: 'Calcium and Vitamin D3' },
];

// Mock MRs
export const mockMRs: MR[] = [
  { id: 'mr1', name: 'Rahul Kumar', email: 'rahul@riddhi.com', phone: '9876543210', territory: 'Mumbai West', status: 'active', joinedDate: '2023-06-01' },
  { id: 'mr2', name: 'Sneha Desai', email: 'sneha@riddhi.com', phone: '9876543211', territory: 'Thane', status: 'active', joinedDate: '2023-07-15' },
  { id: 'mr3', name: 'Vikash Yadav', email: 'vikash@riddhi.com', phone: '9876543212', territory: 'Navi Mumbai', status: 'active', joinedDate: '2023-08-01' },
  { id: 'mr4', name: 'Pooja Sharma', email: 'pooja@riddhi.com', phone: '9876543213', territory: 'Mumbai East', status: 'active', joinedDate: '2023-09-10' },
];

// Generate mock visits for the past 30 days
const generateMockVisits = (): DoctorVisit[] => {
  const visits: DoctorVisit[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Each MR makes 2-4 visits per day
    mockMRs.forEach(mr => {
      const visitCount = Math.floor(Math.random() * 3) + 2;
      for (let v = 0; v < visitCount; v++) {
        const doctor = mockDoctors[Math.floor(Math.random() * mockDoctors.length)];
        const promotedProducts = mockProducts
          .filter(() => Math.random() > 0.5)
          .slice(0, 3)
          .map(p => p.id);
        
        visits.push({
          id: `visit-${dateStr}-${mr.id}-${v}`,
          doctorId: doctor.id,
          doctorName: doctor.name,
          mrId: mr.id,
          mrName: mr.name,
          date: dateStr,
          time: `${9 + v * 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          location: { lat: 19.076 + Math.random() * 0.1, lng: 72.877 + Math.random() * 0.1 },
          notes: Math.random() > 0.5 ? 'Discussed new products' : undefined,
          productsPromoted: promotedProducts,
          businessGenerated: Math.floor(Math.random() * 10000) + 1000,
        });
      }
    });
  }
  
  return visits;
};

// Generate mock daily approvals
const generateMockApprovals = (): DailyApproval[] => {
  const approvals: DailyApproval[] = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    mockMRs.forEach(mr => {
      const expense: DailyExpense = {
        id: `exp-${dateStr}-${mr.id}`,
        mrId: mr.id,
        mrName: mr.name,
        date: dateStr,
        hqAllowance: 500,
        fareAllowance: Math.floor(Math.random() * 500) + 200,
        otherExpenses: Math.random() > 0.7 ? Math.floor(Math.random() * 200) : 0,
        totalExpense: 0,
      };
      expense.totalExpense = expense.hqAllowance + expense.fareAllowance + expense.otherExpenses;
      
      let status: 'pending' | 'approved' | 'rejected' = 'pending';
      if (i > 1) {
        status = Math.random() > 0.1 ? 'approved' : 'rejected';
      }
      
      approvals.push({
        id: `approval-${dateStr}-${mr.id}`,
        mrId: mr.id,
        mrName: mr.name,
        date: dateStr,
        visitCount: Math.floor(Math.random() * 3) + 2,
        shopVisitCount: Math.floor(Math.random() * 2),
        expense,
        status,
        rejectionReason: status === 'rejected' ? 'Expense receipts missing' : undefined,
        approvedBy: status === 'approved' ? 'Admin' : undefined,
        approvedAt: status === 'approved' ? dateStr : undefined,
      });
    });
  }
  
  return approvals;
};

export const mockVisits = generateMockVisits();
export const mockApprovals = generateMockApprovals();

// Helper functions
export const getDoctorVisitHistory = (doctorId: string): DoctorVisit[] => {
  return mockVisits.filter(v => v.doctorId === doctorId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getMRVisits = (mrId: string, date?: string): DoctorVisit[] => {
  let visits = mockVisits.filter(v => v.mrId === mrId);
  if (date) {
    visits = visits.filter(v => v.date === date);
  }
  return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getMRMonthlyExpenses = (mrId: string, month: string): DailyExpense[] => {
  return mockApprovals
    .filter(a => a.mrId === mrId && a.date.startsWith(month) && a.expense)
    .map(a => a.expense!);
};

export const getProductPromotionStats = (): { productId: string; productName: string; count: number }[] => {
  const stats: Record<string, number> = {};
  
  mockVisits.forEach(visit => {
    visit.productsPromoted.forEach(productId => {
      stats[productId] = (stats[productId] || 0) + 1;
    });
  });
  
  return Object.entries(stats).map(([productId, count]) => ({
    productId,
    productName: mockProducts.find(p => p.id === productId)?.name || 'Unknown',
    count,
  })).sort((a, b) => b.count - a.count);
};

export const getDoctorBusinessStats = (): { doctorId: string; doctorName: string; totalBusiness: number; visitCount: number }[] => {
  const stats: Record<string, { totalBusiness: number; visitCount: number; name: string }> = {};
  
  mockVisits.forEach(visit => {
    if (!stats[visit.doctorId]) {
      stats[visit.doctorId] = { totalBusiness: 0, visitCount: 0, name: visit.doctorName };
    }
    stats[visit.doctorId].totalBusiness += visit.businessGenerated;
    stats[visit.doctorId].visitCount += 1;
  });
  
  return Object.entries(stats).map(([doctorId, data]) => ({
    doctorId,
    doctorName: data.name,
    totalBusiness: data.totalBusiness,
    visitCount: data.visitCount,
  })).sort((a, b) => b.totalBusiness - a.totalBusiness);
};

export const getMRBusinessStats = (): { mrId: string; mrName: string; totalBusiness: number; visitCount: number; incentive: number }[] => {
  const stats: Record<string, { totalBusiness: number; visitCount: number; name: string }> = {};
  
  mockVisits.forEach(visit => {
    if (!stats[visit.mrId]) {
      stats[visit.mrId] = { totalBusiness: 0, visitCount: 0, name: visit.mrName };
    }
    stats[visit.mrId].totalBusiness += visit.businessGenerated;
    stats[visit.mrId].visitCount += 1;
  });
  
  return Object.entries(stats).map(([mrId, data]) => ({
    mrId,
    mrName: data.name,
    totalBusiness: data.totalBusiness,
    visitCount: data.visitCount,
    incentive: Math.floor(data.totalBusiness * 0.05), // 5% incentive
  })).sort((a, b) => b.totalBusiness - a.totalBusiness);
};
