'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TierId, UserSubscription } from '../types/subscription';
import { useTiers } from './TiersContext';

interface SubscriptionContextType {
  currentTier: TierId;
  setCurrentTier: (tier: TierId) => void;
  isSubscribed: boolean;
  canAccessTier: (requiredTier: TierId) => boolean;
  userSubscription: UserSubscription | null;
  isLoading: boolean;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  initiateUpgrade: (tierId: TierId) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [currentTier, setCurrentTier] = useState<TierId>(1); // Default to free tier
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<TierId | null>(null);
  const { tiers } = useTiers();

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      const token = localStorage.getItem('communityToken');
      if (!token) {
        setCurrentTier(1);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/subscription/current', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserSubscription(data.subscription);
        setCurrentTier(data.subscription?.tierId || 1);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canAccessTier = (requiredTier: TierId): boolean => {
    return currentTier >= requiredTier;
  };

  const initiateUpgrade = (tierId: TierId) => {
    setPendingUpgrade(tierId);
    setShowSubscriptionModal(true);
  };

  const isSubscribed = currentTier > 1;

  return (
    <SubscriptionContext.Provider value={{
      currentTier,
      setCurrentTier,
      isSubscribed,
      canAccessTier,
      userSubscription,
      isLoading,
      showSubscriptionModal,
      setShowSubscriptionModal,
      initiateUpgrade
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}