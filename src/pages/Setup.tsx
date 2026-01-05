import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill, Building2, User, Lock, Mail, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

export default function Setup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'company' | 'admin' | 'success'>('company');
  const [showPassword, setShowPassword] = useState(false);
  
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    tagline: '',
  });
  
  const [adminInfo, setAdminInfo] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyInfo.name) {
      toast({
        title: 'Company name required',
        description: 'Please enter your company name.',
        variant: 'destructive',
      });
      return;
    }
    setStep('admin');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminInfo.name || !adminInfo.email || !adminInfo.username || !adminInfo.password) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (adminInfo.password !== adminInfo.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (adminInfo.password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate setup completion
    setStep('success');
  };

  const handleFinish = () => {
    toast({
      title: 'Setup complete',
      description: 'Your company has been configured. You can now log in.',
    });
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Initial Setup - MR Visit Tracker</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-pharma-lg">
                <Pill className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Initial Setup</h1>
            <p className="text-muted-foreground mt-1">Configure your company and create admin account</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 'company' ? 'text-primary' : step === 'admin' || step === 'success' ? 'text-secondary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'company' ? 'bg-primary text-primary-foreground' : step === 'admin' || step === 'success' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}`}>
                {step === 'admin' || step === 'success' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Company</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === 'admin' ? 'text-primary' : step === 'success' ? 'text-secondary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'admin' ? 'bg-primary text-primary-foreground' : step === 'success' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}`}>
                {step === 'success' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Admin</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === 'success' ? 'text-secondary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'success' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="text-sm font-medium hidden sm:inline">Done</span>
            </div>
          </div>

          {/* Company Form */}
          {step === 'company' && (
            <div className="pharma-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Company Information</h2>
                  <p className="text-sm text-muted-foreground">Set up your company branding</p>
                </div>
              </div>

              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    placeholder="e.g., Riddhi Life Sciences"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="company-tagline">Tagline (Optional)</Label>
                  <Input
                    id="company-tagline"
                    placeholder="e.g., Pharma Excellence"
                    value={companyInfo.tagline}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, tagline: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  Continue
                </Button>
              </form>
            </div>
          )}

          {/* Admin Form */}
          {step === 'admin' && (
            <div className="pharma-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Create Admin Account</h2>
                  <p className="text-sm text-muted-foreground">This will be your super admin account</p>
                </div>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="admin-name">Full Name *</Label>
                  <Input
                    id="admin-name"
                    placeholder="Your full name"
                    value={adminInfo.name}
                    onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-email">Email *</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@company.com"
                      value={adminInfo.email}
                      onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="admin-username">Username *</Label>
                  <Input
                    id="admin-username"
                    placeholder="admin"
                    value={adminInfo.username}
                    onChange={(e) => setAdminInfo({ ...adminInfo, username: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Password *</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={adminInfo.password}
                      onChange={(e) => setAdminInfo({ ...adminInfo, password: e.target.value })}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="admin-confirm-password">Confirm Password *</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={adminInfo.confirmPassword}
                      onChange={(e) => setAdminInfo({ ...adminInfo, confirmPassword: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('company')}>
                    Back
                  </Button>
                  <Button type="submit" variant="hero" className="flex-1">
                    Create Account
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="pharma-card p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Setup Complete!</h2>
              <p className="text-muted-foreground mb-2">
                <strong>{companyInfo.name}</strong> has been configured successfully.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Admin account created for <strong>{adminInfo.name}</strong>
              </p>
              <Button variant="hero" className="w-full" onClick={handleFinish}>
                Go to Login
              </Button>
            </div>
          )}

          {/* Security notice */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            This page is for initial setup only. Keep this URL private.
          </p>
        </div>
      </div>
    </>
  );
}
