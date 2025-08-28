"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { subscriptionService, QuoteRequest, SubscriptionDTO } from "../../Services/SubscriptionService";
import { packageService, packageUtils } from "../../Services/MentorshipPackageService";
import { paymentService } from "../../Services/PaymentService";
import { MentorshipPackage } from "../../types/mentorshipPackages";

interface Props {
  mentorId: number;
  packageId: number;
  basePricePerMonth: number; // for display fallback
}

const plans = [
  { label: "Monthly Plan", months: 1, badge: undefined },
  { label: "3 Months", months: 3, badge: "-20%" },
  { label: "6 Months", months: 6, badge: "-40%" }
];

export default function PricingCard({ mentorId, packageId, basePricePerMonth }: Props) {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [active, setActive] = useState(6); // default to 6 months
  const [quote, setQuote] = useState<SubscriptionDTO | null>(null);
  const [checkoutPercent] = useState<number>(30); // mimic Preplaced extra discount
  const [student, setStudent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<MentorshipPackage | null>(null);

  const studentPercent = student ? 5 : 0;

  const request: QuoteRequest = useMemo(() => ({
    mentorId,
    packageId,
    planMonths: active,
    checkoutPercent,
    studentPercent
  }), [mentorId, packageId, active, checkoutPercent, studentPercent]);

  useEffect(() => {
    let mounted = true;
    const fetchQuote = async () => {
      setLoading(true);
      try {
        const q = await subscriptionService.quote(request);
        if (mounted) setQuote(q);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
    return () => { mounted = false; };
  }, [request]);

  // Fetch package details for inclusions
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const pkg = await packageService.getPackageById(packageId);
        setPackageData(pkg);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };
    if (packageId) {
      fetchPackage();
    }
  }, [packageId]);

  const displayPerMonth = quote?.effectivePricePerMonth ?? basePricePerMonth;

  const handleBuy = async () => {
    setError(null);
    if (!user || !user.id) {
      router.push("/login");
      return;
    }
    if (!quote) return;

    try {
      setPurchasing(true);
      // 1) Create subscription in PENDING with pricing snapshot from quote
      const subscriptionPayload: SubscriptionDTO = {
        menteeId: Number(user.id),
        mentorId,
        packageId,
        planMonths: quote.planMonths,
        startDate: undefined,
        endDate: undefined,
        basePricePerMonth: quote.basePricePerMonth,
        planDiscountPercent: quote.planDiscountPercent,
        checkoutDiscountPercent: quote.checkoutDiscountPercent,
        studentDiscountPercent: quote.studentDiscountPercent,
        effectivePricePerMonth: quote.effectivePricePerMonth,
        totalPriceBeforeDiscounts: quote.totalPriceBeforeDiscounts,
        totalDiscountAmount: quote.totalDiscountAmount,
        totalPayable: quote.totalPayable,
        status: 'PENDING'
      };
      const created = await subscriptionService.create(subscriptionPayload);

      // 2) Create payment order for total payable
      const amountPaise = Math.round((created.totalPayable || 0) * 100);
      const order = await paymentService.createOrder(Number(created.id), amountPaise, 'INR');

      // 3) Simulate successful payment via webhook (placeholder)
      await paymentService.markPaid(order.gatewayOrderId);

      // 4) Redirect to mentorship dashboard or success page
      router.push("/mentorship-dashboard?tab=packages");
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 w-full max-w-md">
      <div className="flex gap-2 mb-3">
        {plans.map(p => (
          <button
            key={p.months}
            onClick={() => setActive(p.months)}
            className={`px-3 py-2 rounded-md text-sm border ${active===p.months? 'bg-black text-white':'bg-white'}`}
          >
            <div className="flex items-center gap-2">
              <span>{p.label}</span>
              {p.badge && <span className="text-green-600">{p.badge}</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="text-3xl font-semibold">{packageUtils.formatPrice(displayPerMonth)}<span className="text-base font-normal">/month</span></div>
      <div className="text-gray-600 text-sm mt-1">Additional 30% discount is available at checkout</div>

      <div className="mt-4 flex items-center gap-2">
        <input id="student" type="checkbox" checked={student} onChange={(e)=>setStudent(e.target.checked)} />
        <label htmlFor="student" className="text-sm">I am a student (extra 5% off)</label>
      </div>

      {/* Package Inclusions - Preplaced style */}
      {packageData && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-sm text-gray-800">Package Inclusions:</h4>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm">2 sessions/week (1:1 Sessions)</span>
          </div>

          {packageData.hasUnlimitedChat && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Unlimited Chat with Mentor (Chat Support)</span>
            </div>
          )}

          {packageData.hasCuratedTasks && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Tasks & Followup (Every Week)</span>
            </div>
          )}

          {packageData.hasJobReferrals && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Job Referrals (Community Lead)</span>
            </div>
          )}

          {packageData.hasCertification && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Certification of Completion</span>
            </div>
          )}

          {packageData.hasRescheduling && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Reschedule Anytime</span>
            </div>
          )}
        </div>
      )}

      {quote && (
        <div className="mt-3 text-sm text-gray-700">
          <div>Total before discounts: {packageUtils.formatPrice(quote.totalPriceBeforeDiscounts)}</div>
          <div>Total discount: -{packageUtils.formatPrice(quote.totalDiscountAmount)}</div>
          <div className="font-medium">Total payable ({quote.planMonths} months): {packageUtils.formatPrice(quote.totalPayable)}</div>
        </div>
      )}

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      <button onClick={handleBuy} disabled={loading || purchasing} className="mt-4 w-full py-3 rounded-lg bg-blue-600 text-white disabled:opacity-60">
        {loading ? 'Calculating...' : purchasing ? 'Processing...' : 'Buy 1:1 Long Term Mentorship →'}
      </button>
    </div>
  );
}
