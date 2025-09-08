"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { packageService, packageUtils } from "../../Services/MentorshipPackageService";

interface PricingCardProps {
  mentorId: number;
  packageId: number; // preferred package id
  basePricePerMonth: number;
  packageData?: any; // single package reference
  packagesList?: any[]; // full list to compute maps
}

// Backwards compatibility alias (some files may still expect Props)
interface Props extends PricingCardProps {}

export default function PricingCard({ mentorId, packageId, basePricePerMonth, packageData, packagesList }: Props) {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [selectedPlan, setSelectedPlan] = useState<'1' | '3' | '6'>('6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [internalPackages, setInternalPackages] = useState<any[]>(packagesList || []);
  const [planPriceMap, setPlanPriceMap] = useState<Record<string, number>>({});
  const [discountMap, setDiscountMap] = useState<Record<string, number>>({});
  const [originalPriceMap, setOriginalPriceMap] = useState<Record<string, number>>({});

  const buildMaps = useCallback((pkgs: any[]) => {
    const p: Record<string, number> = {};
    const d: Record<string, number> = {};
    const o: Record<string, number> = {};
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

  // Initial fetch if list not provided
  useEffect(() => {
    const init = async () => {
      if (internalPackages.length === 0) {
        try {
          setLoading(true);
          let pkgs = await packageService.getActivePackagesByMentor(mentorId);
          if (!pkgs || pkgs.length === 0) pkgs = await packageService.getPackagesByMentor(mentorId as any);
          setInternalPackages(pkgs || []);
          buildMaps(pkgs || []);
        } catch (e) {
          console.error('PricingCard package fetch failed', e);
          buildMaps([]); // fallback defaults
        } finally { setLoading(false); }
      } else {
        buildMaps(internalPackages);
      }
    };
    init();
  }, [internalPackages.length, mentorId, buildMaps]);

  const planOptions = useMemo(() => [
    { key: '1', label: '1 Month', discount: discountMap['1'] || 0 },
    { key: '3', label: '3 Months', discount: discountMap['3'] || 0 },
    { key: '6', label: '6 Months', discount: discountMap['6'] || 0 }
  ], [discountMap]);

  const displayedMonthly = planPriceMap[selectedPlan];
  const displayedOriginal = originalPriceMap[selectedPlan];
  const displayedDiscount = discountMap[selectedPlan] || 0;

  const handleBuy = () => {
    const months = Number(selectedPlan);
    const monthly = displayedMonthly || 0;
    const total = monthly * months;
    alert(`Proceed to payment for ${months} months. Total: ₹${total.toLocaleString('en-IN')}`);
  };

  return (
    <div className="border rounded-xl p-4 w-full max-w-md">
      <div className="flex gap-2 mb-3">
        {planOptions.map(p => {
          const active = selectedPlan === p.key;
          const showDisc = p.discount > 0;
          return (
            <button
              key={p.key}
              onClick={() => setSelectedPlan(p.key as any)}
              className={`px-3 py-2 rounded-md text-sm border flex items-center gap-2 ${active? 'bg-black text-white border-black':'bg-white'}`}
            >
              <span>{p.label}</span>
              {showDisc && <span className={`${active? 'bg-white text-black':'bg-green-100 text-green-700'} text-xs font-semibold px-2 py-0.5 rounded-full`}>-{p.discount}%</span>}
            </button>
          );
        })}
      </div>
      <div className="flex items-baseline gap-2">
        {displayedDiscount > 0 && (
          <span className="text-sm text-gray-400 line-through">₹{displayedOriginal?.toLocaleString('en-IN')}</span>
        )}
        <span className="text-3xl font-bold">₹{displayedMonthly?.toLocaleString('en-IN')}</span>
        <span className="text-sm text-gray-500">/mo</span>
      </div>
      {displayedDiscount > 0 && (
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">-{displayedDiscount}%</span>
          <span className="text-xs text-green-600 font-medium">You save ₹{(displayedOriginal - displayedMonthly).toLocaleString('en-IN')} /mo</span>
        </div>
      )}
      <div className="mt-4 text-xs text-gray-500">Prices follow same logic as mentor listing (unified).</div>
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      <button onClick={handleBuy} disabled={loading} className="mt-4 w-full py-3 rounded-lg bg-blue-600 text-white disabled:opacity-60">
        {loading ? 'Loading...' : 'Buy 1:1 Long Term Mentorship →'}
      </button>
    </div>
  );
}
