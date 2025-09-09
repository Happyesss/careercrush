"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { packageService, packageUtils } from "../../Services/MentorshipPackageService";

interface PricingCardProps {
  mentorId: number;
  packageId: number;
  basePricePerMonth: number;
  packageData?: any;
  packagesList?: any[]; 
}

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
  const [showAllTopics, setShowAllTopics] = useState(false);

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

  // Selected package object matching current plan (fallback to provided packageData)
  const selectedPkg = useMemo(() => {
    if (!internalPackages || internalPackages.length === 0) return packageData;
    const months = Number(selectedPlan);
    return internalPackages.find((p: any) => p?.durationMonths === months) || packageData || internalPackages[0];
  }, [internalPackages, packageData, selectedPlan]);

  const handleBuy = () => {
    const months = Number(selectedPlan);
    const monthly = displayedMonthly || 0;
    const total = monthly * months;
    alert(`Proceed to payment for ${months} months. Total: ₹${total.toLocaleString('en-IN')}`);
  };

  return (
    <div className="border rounded-xl p-4 w-full max-w-2xl">
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

      {/* Show detailed package info for the selected plan */}
      {selectedPkg && (
        <div className="mt-5 space-y-4">
          {/* Package Description */}
          {selectedPkg.description && (
            <div className="rounded-lg border p-4 bg-blue-50">
              <div className="text-sm font-medium text-blue-900 mb-2">About this package</div>
              <p className="text-sm text-blue-800">{selectedPkg.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick facts */}
            <div className="rounded-lg border p-3">
              <div className="text-sm text-gray-500 mb-2">Package details</div>
              <ul className="space-y-2 text-sm">
                {typeof selectedPkg.durationMonths === 'number' && (
                  <li className="flex items-center gap-2"><span>•</span><span>Duration: {packageUtils.formatDuration(selectedPkg.durationMonths)}</span></li>
                )}
                {typeof selectedPkg.sessionsPerMonth === 'number' && (
                  <li className="flex items-center gap-2"><span>•</span><span>Sessions per month: {selectedPkg.sessionsPerMonth}</span></li>
                )}
                {typeof selectedPkg.totalSessions === 'number' && (
                  <li className="flex items-center gap-2"><span>•</span><span>Total sessions: {selectedPkg.totalSessions}</span></li>
                )}
                {selectedPkg.sessionDurationMinutes && (
                  <li className="flex items-center gap-2"><span>•</span><span>Session duration: {selectedPkg.sessionDurationMinutes} min</span></li>
                )}
                {selectedPkg.sessionType && (
                  <li className="flex items-center gap-2"><span>•</span><span>Session type: {selectedPkg.sessionType}</span></li>
                )}
                {selectedPkg.isFreeTrialIncluded && (
                  <li className="flex items-center gap-2 text-green-600 font-medium"><span>✓</span><span>Free trial included</span></li>
                )}
              </ul>
            </div>

            {/* Inclusions */}
            <div className="rounded-lg border p-3">
              <div className="text-sm text-gray-500 mb-2">What&apos;s included</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-green-600"><span>✓</span><span>1:1 Live Sessions</span></li>
                {selectedPkg.hasUnlimitedChat && <li className="flex items-center gap-2 text-green-600"><span>✓</span><span>Unlimited chat with mentor</span></li>}
                {selectedPkg.hasCuratedTasks && <li className="flex items-center gap-2 text-green-600"><span>✓</span><span>Task & curated resources</span></li>}
                {selectedPkg.hasRegularFollowups && <li className="flex items-center gap-2 text-green-600"><span>✓</span><span>Regular follow-ups (accountability)</span></li>}
                {selectedPkg.hasJobReferrals && <li className="flex items-center gap-2 text-green-600"><span>✓</span><span>Job referrals</span></li>}
                {selectedPkg.hasCertification && <li className="flex items-center gap-2 text-green-600"><span>✓</span><span>Certification on completion</span></li>}
                {selectedPkg.hasRescheduling && <li className="flex items-center gap-2 text-green-600"><span>✓</span><span>Reschedule anytime</span></li>}
              </ul>
            </div>
          </div>

          {/* Topics covered */}
          {Array.isArray(selectedPkg.topicsCovered) && selectedPkg.topicsCovered.length > 0 && (
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">Topics covered in this package</div>
                {selectedPkg.topicsCovered.length > 8 && (
                  <button onClick={() => setShowAllTopics(v => !v)} className="text-xs text-blue-600 hover:text-blue-800">
                    {showAllTopics ? 'Show less' : `Show all (${selectedPkg.topicsCovered.length})`}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllTopics ? selectedPkg.topicsCovered : selectedPkg.topicsCovered.slice(0, 8)).map((t: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-xs border bg-gray-50 hover:bg-gray-100">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Breakdown Modules */}
          {Array.isArray(selectedPkg.modules) && selectedPkg.modules.length > 0 && (
            <div className="rounded-lg border p-3">
              <div className="text-sm text-gray-500 mb-3">Monthly learning breakdown</div>
              <div className="space-y-3">
                {selectedPkg.modules.slice(0, selectedPkg.durationMonths || 6).map((module: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-gray-50 border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {module.moduleTitle || `Month ${module.monthNumber || idx + 1}`}
                      </h4>
                      {module.sessionsInMonth && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {module.sessionsInMonth} sessions
                        </span>
                      )}
                    </div>
                    
                    {module.moduleDescription && (
                      <p className="text-xs text-gray-600 mb-2">{module.moduleDescription}</p>
                    )}

                    {/* Learning Objectives */}
                    {Array.isArray(module.learningObjectives) && module.learningObjectives.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 mb-1">Learning objectives:</div>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {module.learningObjectives.map((obj: string, objIdx: number) => (
                            <li key={objIdx} className="flex items-start gap-1">
                              <span className="text-blue-500">→</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Deliverables */}
                    {Array.isArray(module.deliverables) && module.deliverables.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 mb-1">Deliverables:</div>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {module.deliverables.map((del: string, delIdx: number) => (
                            <li key={delIdx} className="flex items-start gap-1">
                              <span className="text-green-500">✓</span>
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Topics in Month */}
                    {Array.isArray(module.topicsInMonth) && module.topicsInMonth.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Topics covered:</div>
                        <div className="flex flex-wrap gap-1">
                          {module.topicsInMonth.map((topic: string, topicIdx: number) => (
                            <span key={topicIdx} className="px-2 py-0.5 rounded text-xs bg-white text-gray-600 border">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      <button onClick={handleBuy} disabled={loading} className="mt-4 w-full py-3 rounded-lg bg-blue-600 text-white disabled:opacity-60">
        {loading ? 'Loading...' : 'Buy 1:1 Long Term Mentorship →'}
      </button>
    </div>
  );
}
