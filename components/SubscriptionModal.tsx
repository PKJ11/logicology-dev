'use client';

import { useSubscription } from '@/app/contexts/SubscriptionContext';
import { useTiers } from '@/app/contexts/TiersContext';
import { useToast } from '@/app/contexts/ToastContext';
import { initiateRazorpayPayment } from '@/app/lib/razorpay';
import { TierId } from '@/app/types/subscription';
import React, { useState, useEffect } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: TierId;
}

interface CurrentSubscriptionData {
  subscription?: {
    tierId: number;
    isFree?: boolean;
    startDate?: string;
    endDate?: string;
  };
  currentMonth?: {
    startDate: string;
    endDate: string;
    daysRemaining: number;
  };
  canUpgrade?: boolean;
  canDowngrade?: boolean;
}

export default function SubscriptionModal({ isOpen, onClose, initialTier }: SubscriptionModalProps) {
  const { tiers, loading: tiersLoading } = useTiers();
  const { currentTier, setCurrentTier } = useSubscription();
  const { showToast } = useToast();
  const [selectedTier, setSelectedTier] = useState<TierId>(initialTier || (currentTier as TierId));
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscriptionData | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  // Update selected tier when currentTier changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTier(initialTier || (currentTier as TierId));
      fetchUserData();
      fetchCurrentSubscription();
    }
  }, [isOpen, initialTier, currentTier]);

  const fetchUserData = () => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCurrentSubscription = async () => {
    setIsLoadingSubscription(true);
    try {
      const token = localStorage.getItem('communityToken');
      if (!token) return;

      const response = await fetch('/api/subscription/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setCurrentSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  if (!isOpen) return null;

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleSubscribe = async () => {
    if (selectedTier === 1) {
      // Free tier - just update
      setCurrentTier(1);
      onClose();
      showToast(`✨ Switched to Free plan`, 'success');
      refreshPage();
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('communityToken');
      if (!token) {
        setError('Please login first');
        setIsProcessing(false);
        return;
      }

      const selectedTierData = tiers.find(t => t.id === selectedTier);
      if (!selectedTierData) {
        setError('Tier not found');
        setIsProcessing(false);
        return;
      }

      // Check if user already has this tier for current month
      if (currentSubscription?.subscription?.tierId === selectedTier && 
          !currentSubscription.subscription.isFree) {
        setError('You already have this plan for the current month');
        setIsProcessing(false);
        return;
      }

      let amount = selectedTierData.price * 100; // Convert to paise
      let isUpgrade = false;
      let currentTierId = currentSubscription?.subscription?.tierId;

      // If user has active subscription and is upgrading to a higher tier
      if (currentSubscription?.subscription && 
          currentSubscription.subscription.tierId < selectedTier && 
          !currentSubscription.subscription.isFree) {
        
        // Calculate pro-rated upgrade amount
        const currentTierData = tiers.find(t => t.id === currentSubscription.subscription?.tierId);
        if (currentTierData && currentSubscription.currentMonth) {
          const daysRemaining = currentSubscription.currentMonth.daysRemaining || 0;
          const endDate = new Date(currentSubscription.currentMonth.endDate);
          const daysInMonth = endDate.getDate();
          
          // Calculate upgrade amount (in rupees)
          const remainingValue = (currentTierData.price ) ;
          const newValue = (selectedTierData.price );
          const upgradeAmount = Math.max(0, Math.round(newValue - remainingValue));
          
          amount = upgradeAmount * 100; // Convert to paise
          isUpgrade = true;
          
          // If upgrade amount is 0 or negative, show error
          if (upgradeAmount <= 0) {
            setError('Invalid upgrade amount');
            setIsProcessing(false);
            return;
          }
        }
      }

      // Check if trying to downgrade (but allow switching to free tier)
      if (currentSubscription?.subscription && 
          currentSubscription.subscription.tierId > selectedTier) {
        
        // Allow switching to free tier (tierId === 1) anytime
        if (Number(selectedTier) === 1) {
  // This is a downgrade to free - allowed anytime
  console.log('Downgrading to free tier - allowed');
}else {
          // Trying to downgrade to another paid tier - not allowed mid-month
          setError('Downgrades to other paid plans are only allowed at the end of your current billing cycle');
          setIsProcessing(false);
          return;
        }
      }

      // Create Razorpay order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          tierId: selectedTier
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const { order } = await orderResponse.json();

      // Initialize payment
      const paymentResult = await initiateRazorpayPayment({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        name: 'Mathology / Logicology',
        description: isUpgrade 
          ? `${selectedTierData.name} Upgrade (Pro-rated for current month)`
          : `${selectedTierData.name} Subscription`,
        prefill: {
          name: userData?.name || '',
          email: userData?.email || '',
          contact: userData?.phone || ''
        },
        handler: async (response) => {
          try {
            // Verify payment and activate subscription
            const verifyResponse = await fetch('/api/subscription/activate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                tierId: selectedTier,
                amount: amount / 100, // Send amount in rupees
                isUpgrade,
                currentTierId: currentSubscription?.subscription?.tierId
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              const oldTier = tiers.find(t => t.id === currentTier);
              const newTier = tiers.find(t => t.id === selectedTier);
              
              setCurrentTier(selectedTier);
              onClose();
              
              if (isUpgrade) {
                const daysRemaining = currentSubscription?.currentMonth?.daysRemaining || 0;
                showToast(
                  `✨ Upgraded to ${newTier?.name}! Your subscription is valid until ${new Date(currentSubscription?.currentMonth?.endDate || '').toLocaleDateString()}.`,
                  'success'
                );
              } else if (Number(selectedTier) === 1) {
                showToast(
                  `✨ Switched to Free plan`,
                  'success'
                );
              } else {
                showToast(
                  `✨ Your plan has been changed from ${oldTier?.name || 'Unknown'} to ${newTier?.name}!`,
                  'success'
                );
              }
              
              refreshPage();
            } else {
              setError(verifyData.error || 'Payment verification failed');
              setIsProcessing(false);
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            setError('Payment verification failed');
            setIsProcessing(false);
          }
        }
      });

      if (!paymentResult.success) {
        setError(paymentResult.error || 'Payment failed');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

  const getUpgradeInfo = (tierId: number) => {
    if (!currentSubscription?.subscription || currentSubscription.subscription.isFree) {
      return null;
    }

    const currentTierData = tiers.find(t => t.id === currentSubscription.subscription?.tierId);
    const selectedTierData = tiers.find(t => t.id === tierId);
    
    if (!currentTierData || !selectedTierData || selectedTierData.price <= currentTierData.price) {
      return null;
    }

    const daysRemaining = currentSubscription.currentMonth?.daysRemaining || 0;
    const endDate = currentSubscription.currentMonth?.endDate 
      ? new Date(currentSubscription.currentMonth.endDate).toLocaleDateString() 
      : 'end of month';
    
    const daysInMonth = currentSubscription.currentMonth?.endDate 
      ? new Date(currentSubscription.currentMonth.endDate).getDate() 
      : 30;
    
    const upgradeAmount = Math.round(
      ((selectedTierData.price - currentTierData.price) ) 
    );

    return {
      amount: upgradeAmount,
      daysRemaining,
      endDate
    };
  };

  const isTierSelectable = (tierId: number) => {
    // Free tier is always selectable
    if (tierId === 1) return true;
    
    // If no active subscription, all tiers are selectable
    if (!currentSubscription?.subscription || currentSubscription.subscription.isFree) return true;
    
    // Can select higher tiers (upgrade)
    if (tierId > currentSubscription.subscription.tierId) return true;
    
    // Can select current tier
    if (tierId === currentSubscription.subscription.tierId) return true;
    
    // Cannot select lower paid tiers (downgrade)
    return false;
  };

  const getTierSelectMessage = (tierId: number) => {
    if (tierId === 1) return null;
    if (!currentSubscription?.subscription || currentSubscription.subscription.isFree) return null;
    if (tierId > currentSubscription.subscription.tierId) return null;
    if (tierId === currentSubscription.subscription.tierId) return null;
    return 'Downgrades available at month end';
  };

  if (tiersLoading || isLoadingSubscription) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="rounded-2xl bg-white p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[60vw] rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Choose Your Plan</h2>
              {currentSubscription?.currentMonth && (
                <p className="text-sm text-gray-500 mt-1">
                  Current billing period: {new Date(currentSubscription.currentMonth.startDate).toLocaleDateString()} - {new Date(currentSubscription.currentMonth.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Current Plan Info */}
          {currentSubscription?.subscription && !currentSubscription.subscription.isFree && (
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  ℹ️
                </div>
                <div>
                  <p className="text-sm text-blue-800">
                    You are currently on <span className="font-bold">{tiers.find(t => t.id === currentSubscription.subscription?.tierId)?.name}</span> plan
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Valid until {new Date(currentSubscription.currentMonth?.endDate || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tier Cards */}
          <div className="mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {tiers.map((tier) => {
              const upgradeInfo = getUpgradeInfo(tier.id);
              const isCurrentTier = currentTier === tier.id;
              const isSelectable = isTierSelectable(tier.id);
              const selectMessage = getTierSelectMessage(tier.id);
              
              return (
                <div
                  key={tier.id}
                  onClick={() => {
                    if (!isSelectable) {
                      showToast(selectMessage || 'This option is not available', 'info');
                      return;
                    }
                    setSelectedTier(tier.id as TierId);
                  }}
                  className={`relative rounded-xl md:rounded-2xl border-2 p-4 md:p-6 transition-all hover:shadow-xl ${
                    selectedTier === tier.id
                      ? `border-orange-500 bg-gradient-to-br ${tier.color} text-white`
                      : isSelectable
                      ? 'border-gray-200 hover:border-orange-200 cursor-pointer'
                      : 'border-gray-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Lock overlay for non-selectable tiers */}
                  {!isSelectable && (
                    <div className="absolute inset-0 bg-gray-100/50 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                      <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                        🔒 Month end only
                      </span>
                    </div>
                  )}

                  <div className="mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold">{tier.name}</h3>
                    <div className="mt-1 md:mt-2">
                      <span className="text-2xl md:text-3xl font-bold">₹{tier.price}</span>
                      {tier.price > 0 && <span className="text-xs md:text-sm opacity-80">/month</span>}
                    </div>
                    <p className={`mt-1 md:mt-2 text-xs md:text-sm ${selectedTier === tier.id ? 'text-white/80' : 'text-gray-500'}`}>
                      {tier.description}
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    {tier.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <svg
                          className={`mt-0.5 h-3 w-3 md:h-4 md:w-4 flex-shrink-0 ${
                            selectedTier === tier.id ? 'text-white' : 'text-green-500'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-xs md:text-sm ${selectedTier === tier.id ? 'text-white' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                    {tier.features.length > 4 && (
                      <div className={`text-xs opacity-75 ${selectedTier === tier.id ? 'text-white' : 'text-gray-500'}`}>
                        +{tier.features.length - 4} more features
                      </div>
                    )}
                  </div>

                  {isCurrentTier && (
                    <div className="mt-3 md:mt-4">
                      <span className="inline-block rounded-full bg-green-100 px-2 py-1 md:px-3 md:py-1 text-xs font-semibold text-green-800">
                        Current Plan
                      </span>
                    </div>
                  )}

                  {upgradeInfo && selectedTier === tier.id && (
                    <div className="mt-3 text-xs bg-white/20 rounded-lg p-2">
                      <p className="font-medium">Upgrade for this month:</p>
                      <p className="text-lg font-bold">₹{upgradeInfo.amount}</p>
                      <p className="text-xs opacity-75">Valid until {upgradeInfo.endDate}</p>
                    </div>
                  )}

                  {!isSelectable && selectMessage && (
                    <div className="mt-3 text-xs bg-gray-100 text-gray-600 rounded-lg p-2">
                      <p className="text-center">{selectMessage}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Billing Info */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                💡
              </div>
              <div className="text-xs text-gray-600">
                <p>• Subscriptions are valid from 1st to last day of the month</p>
                <p>• Upgrades are pro-rated for the remaining days</p>
                <p>• Downgrades to other paid plans take effect at the start of next month</p>
                <p>• Switching to Free plan is allowed anytime</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 rounded-lg border border-gray-300 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubscribe}
              disabled={isProcessing || selectedTier === currentTier}
              className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 rounded-lg bg-orange-500 font-medium text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 hover:shadow-xl disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </span>
              ) : selectedTier === currentTier ? (
                'Current Plan'
              ) : selectedTier === 1 ? (
                'Switch to Free'
              ) : (
                `Subscribe for ₹${tiers.find(t => t.id === selectedTier)?.price}/month`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}