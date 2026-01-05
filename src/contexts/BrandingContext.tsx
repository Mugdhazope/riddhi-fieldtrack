import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CompanyBranding {
  name: string;
  logo?: string;
  primaryColor?: string;
  tagline?: string;
}

interface BrandingContextType {
  branding: CompanyBranding;
  setBranding: (branding: CompanyBranding) => void;
}

const defaultBranding: CompanyBranding = {
  name: 'Riddhi Life Sciences',
  tagline: 'MR Visit Tracker',
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<CompanyBranding>(defaultBranding);

  return (
    <BrandingContext.Provider value={{ branding, setBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
