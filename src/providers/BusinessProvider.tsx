'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface BusinessContextType {
  isHydrated: boolean;
}

const BusinessContext = createContext<BusinessContextType>({ isHydrated: false });

export const useBusinessContext = () => useContext(BusinessContext);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <BusinessContext.Provider value={{ isHydrated }}>
      {children}
    </BusinessContext.Provider>
  );
}
