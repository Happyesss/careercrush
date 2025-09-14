"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { packageService } from "../../Services/MentorshipPackageService";
import { useTheme } from "../../ThemeContext";

interface PricingSummaryCardProps {
  mentorId: number;
  packagesList?: any[];
  basePricePerMonth: number;
  selectedPlan: '1' | '3' | '6';
  setSelectedPlanAction: (p: '1' | '3' | '6') => void;
}

export default function PricingSummaryCard({ mentorId, packagesList = [], basePricePerMonth, selectedPlan, setSelectedPlanAction }: PricingSummaryCardProps) {
  const [internalPackages, setInternalPackages] = useState<any[]>(packagesList);
  const [planPriceMap, setPlanPriceMap] = useState<Record<string, number>>({});
  const [discountMap, setDiscountMap] = useState<Record<string, number>>({});
  const [originalPriceMap, setOriginalPriceMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const { isDarkMode } = useTheme();
  const buildMaps = useCallback((pkgs: any[]) => {
    const p: Record<string, number> = {}; const d: Record<string, number> = {}; const o: Record<string, number> = {};
    pkgs.forEach(pkg => {
      if (pkg.durationMonths === 1) { p['1'] = pkg.pricePerMonth; o['1'] = pkg.originalPricePerMonth || pkg.pricePerMonth; d['1'] = 0; }
      if (pkg.durationMonths === 3) { p['3'] = pkg.pricePerMonth; o['3'] = pkg.originalPricePerMonth || pkg.pricePerMonth; d['3'] = pkg.threeMonthDiscount || 0; }
      if (pkg.durationMonths === 6) { p['6'] = pkg.pricePerMonth; o['6'] = pkg.originalPricePerMonth || pkg.pricePerMonth; d['6'] = pkg.sixMonthDiscount || 0; }
    });
    if (Object.keys(p).length === 0) {
      const base = basePricePerMonth || 7000;
      p['1'] = base; p['3'] = Math.round(base * 0.85); p['6'] = Math.round(base * 0.7);
      o['1'] = base; o['3'] = base; o['6'] = base;
      d['1'] = 0; d['3'] = 15; d['6'] = 30;
    } else {
      const base = o['1'] || pkgs[0]?.originalPricePerMonth || pkgs[0]?.pricePerMonth || basePricePerMonth || 7000;
      if (!p['1']) { p['1'] = base; o['1'] = base; d['1'] = 0; }
      if (!p['3']) { const disc = pkgs.find(p2 => p2.threeMonthDiscount)?.threeMonthDiscount || 15; p['3'] = Math.round(base * (1 - disc/100)); o['3'] = base; d['3'] = disc; }
      if (!p['6']) { const disc = pkgs.find(p2 => p2.sixMonthDiscount)?.sixMonthDiscount || 30; p['6'] = Math.round(base * (1 - disc/100)); o['6'] = base; d['6'] = disc; }
    }
    setPlanPriceMap(p); setDiscountMap(d); setOriginalPriceMap(o);
  }, [basePricePerMonth]);

  useEffect(() => {
    const init = async () => {
      if (internalPackages.length === 0) {
        try {
          setLoading(true);
          let pkgs = await packageService.getActivePackagesByMentor(mentorId);
          if (!pkgs || pkgs.length === 0) pkgs = await packageService.getPackagesByMentor(mentorId as any);
          setInternalPackages(pkgs || []);
          buildMaps(pkgs || []);
        } catch {
          buildMaps([]);
        } finally { setLoading(false); }
      } else buildMaps(internalPackages);
    };
    init();
  }, [internalPackages.length, mentorId, buildMaps]);

const planOptions = useMemo(() => [
    { key: '6', label: '6M', discount: discountMap['6'] || 0 },
    { key: '3', label: '3M', discount: discountMap['3'] || 0 },
    { key: '1', label: '1M', discount: discountMap['1'] || 0 }
  ], [discountMap]);

  const selectedPkg = useMemo(() => {
    if (!internalPackages || internalPackages.length === 0) return null;
    const months = Number(selectedPlan);
    return internalPackages.find(p => p.durationMonths === months) || internalPackages[0];
  }, [internalPackages, selectedPlan]);

  const monthly = planPriceMap[selectedPlan];
  const original = originalPriceMap[selectedPlan];
  const discount = discountMap[selectedPlan] || 0;

  const handleBuy = () => {
    const months = Number(selectedPlan);
    const total = (monthly || 0) * months;
    alert(`Proceed to payment for ${months} months. Total: ₹${total.toLocaleString('en-IN')}`);
  };

  return (
    <div className={` tracking-tight   border ${isDarkMode ? 'bg-third text-white border-none' : 'bg-white text-black'} border-gray-200 rounded-2xl p-6 w-full shadow-md sticky top-4`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black mb-2">Choose Your Plan</h3>
        <p className={`text-sm  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select the duration that works best for you</p>
      </div>
      
      <div className="flex gap-2 mb-6 justify-center">
        {planOptions.map(p => {
          const active = selectedPlan === p.key;
          return (
            <button 
              key={p.key} 
              onClick={() => setSelectedPlanAction(p.key as any)} 
              className={`relative px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                active 
                  ? 'bg-primary text-white shadow-lg transform scale-105' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200  hover:shadow-md'
              }  `}
            >
              <span>{p.label}</span>
              {p.discount > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  active 
                    ? 'bg-white text-primary' 
                    : 'bg-[#fcf3ed] text-primary'
                }`}>
                  -{p.discount}%
                </span>
              )}
              {active && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="text-center mb-6">
        <div className="relative">
          {/* {discount > 0 && (
            // <div className="text-sm text-gray-400 line-through mb-1">
            //   ₹{original?.toLocaleString('en-IN')}
            // </div>
          )} */}
          <div className="text-4xl font-bold   text-black">
            ₹{monthly?.toLocaleString('en-IN')}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>per month</div>
          {discount > 0 && (
            <div className=" inline-flex items-center gap-1 mt-2 px-3 py-1 bg-[#fcf3ed] text-primary tracking-normal rounded-full text-xs font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save ₹{(original - monthly).toLocaleString('en-IN')}/month
            </div>
          )}
        </div>
      </div>

  {/* What&#39;s Included Section */}
      <div className="mb-6">
        {/* <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-lg font-semibold text-gray-800">What&#39;s Included</div>
        </div> */}
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#fcf3ed] rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={`text-gray-700 ${isDarkMode ? '!text-gray-300' : '!text-gray-500'} font-medium`}  >1:1 Live Sessions</span>
          </li>
          {/* {selectedPkg?.hasUnlimitedChat && (
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">Unlimited chat with mentor</span>
            </li>
          )} */}
          {/* {selectedPkg?.hasCuratedTasks && (
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">Task & curated resources</span>
            </li>
          )} */}
          {selectedPkg?.hasRegularFollowups && (
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#fcf3ed] rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`text-gray-700 ${isDarkMode ? '!text-gray-300' : '!text-gray-500'} font-medium`}>Regular follow-ups (accountability)</span>
            </li>
          )}
          {selectedPkg?.hasJobReferrals && (
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#fcf3ed] rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`text-gray-700 ${isDarkMode ? '!text-gray-300' : '!text-gray-500'} font-medium`}>Job referrals</span>
            </li>
          )}
          {selectedPkg?.hasCertification && (
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#fcf3ed] rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={` ${isDarkMode ? '!text-gray-300' : '!text-gray-500'} font-medium`}>Certification on completion</span>
            </li>
          )}
          {selectedPkg?.hasRescheduling && (
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#fcf3ed] rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`text-gray-700 ${isDarkMode ? '!text-gray-300' : '!text-gray-500'} font-medium`}>Reschedule anytime</span>
            </li>
          )}
        </ul>
      </div>
      
      <button 
        disabled={loading} 
        onClick={handleBuy} 
        className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg "
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Mentorship
          </div>
        )}
      </button>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Payment
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Cancel Anytime
        </div>
      </div>
    </div>
  );
}
