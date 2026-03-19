'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tier } from '../types/subscription';

interface TiersContextType {
  tiers: Tier[];
  loading: boolean;
  error: string | null;
  refreshTiers: () => Promise<void>;
  getTierById: (id: number) => Tier | undefined;
}

const TiersContext = createContext<TiersContextType | undefined>(undefined);

export function TiersProvider({ children }: { children: React.ReactNode }) {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tiers');
      const data = await response.json();
      
      if (data.success) {
        setTiers(data.tiers);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch tiers');
      }
    } catch (err) {
      setError('Network error while fetching tiers');
      console.error('Error fetching tiers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const getTierById = (id: number) => {
    return tiers.find(tier => tier.id === id);
  };

  return (
    <TiersContext.Provider value={{
      tiers,
      loading,
      error,
      refreshTiers: fetchTiers,
      getTierById
    }}>
      {children}
    </TiersContext.Provider>
  );
}

export function useTiers() {
  const context = useContext(TiersContext);
  if (context === undefined) {
    throw new Error('useTiers must be used within a TiersProvider');
  }
  return context;
}