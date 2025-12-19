import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MRDashboard from "./pages/mr/MRDashboard";
import DailyExpenses from "./pages/mr/DailyExpenses";
import ApprovalStatus from "./pages/mr/ApprovalStatus";
import DoctorList from "./pages/mr/DoctorList";
import ProductList from "./pages/mr/ProductList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MRTracking from "./pages/admin/MRTracking";
import MRDetail from "./pages/admin/MRDetail";
import Analytics from "./pages/admin/Analytics";
import Reports from "./pages/admin/Reports";
import DoctorMaster from "./pages/admin/DoctorMaster";
import ProductMaster from "./pages/admin/ProductMaster";
import DailyApprovals from "./pages/admin/DailyApprovals";
import MRManagement from "./pages/admin/MRManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mr" element={<MRDashboard />} />
            <Route path="/mr/dashboard" element={<MRDashboard />} />
            <Route path="/mr/expenses" element={<DailyExpenses />} />
            <Route path="/mr/approvals" element={<ApprovalStatus />} />
            <Route path="/mr/doctors" element={<DoctorList />} />
            <Route path="/mr/products" element={<ProductList />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/mr-tracking" element={<MRTracking />} />
            <Route path="/admin/mr/:id" element={<MRDetail />} />
            <Route path="/admin/mr-management" element={<MRManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/doctors" element={<DoctorMaster />} />
            <Route path="/admin/products" element={<ProductMaster />} />
            <Route path="/admin/approvals" element={<DailyApprovals />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
