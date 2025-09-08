"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { useTheme } from "../../ThemeContext";
import { getMentor, requestMentorshipSession } from "../../Services/MentorService";
import { useSelector } from "react-redux";
import { Mentor } from "../../types/mentor";
import MentorProfileHeader from "./MentorProfileHeader";
import PublicMentorProfileHeader from "./PublicMentorProfileHeader";
import MentorProfileTabs from "./MentorProfileTabs";
import PricingCard from "./PricingCard";
import BookingTrial from "./BookingTrial";
import { packageService } from "../../Services/MentorshipPackageService";
import MentorshipRequestModal from "./MentorshipRequestModal";

const MentorProfileComponent = () => {
  const { isDarkMode } = useTheme();
  const params = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state: any) => state.user);
  const [activePackageId, setActivePackageId] = useState<number | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [mentorshipPackages, setMentorshipPackages] = useState<any[]>([]);
  const [packageLoading, setPackageLoading] = useState(true);
  
  const [requestForm, setRequestForm] = useState({
    menteeName: "",
    menteeEmail: "",
    menteePhone: "",
    menteeBackground: "",
    requestMessage: "",
    goals: "",
    preferredTime: "",
    sessionType: "one-time"
  });

  useEffect(() => {
    if (params.id) {
      fetchMentor();
    }
  }, [params.id]);

  // Listen for public header request event to open the modal when header's Request is clicked
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom?.detail?.mentorId === mentor?.id) {
        setRequestModalOpen(true);
      }
    };
    window.addEventListener('request-mentorship', handler as EventListener);
    return () => window.removeEventListener('request-mentorship', handler as EventListener);
  }, [mentor]);

  const fetchMentor = async () => {
    try {
      setLoading(true);
      const data = await getMentor(params.id);
      console.log("Fetched mentor data:", data);
      setMentor(data);
      
      // Fetch mentorship packages for this mentor
      try {
        setPackageLoading(true);
        let pkgList = await packageService.getActivePackagesByMentor(Number(params.id));
        console.log("Fetched ACTIVE packages for mentor:", pkgList?.length || 0, pkgList);

        // Fallback: if no active packages, fetch all (maybe mentor hasn't activated yet)
        if (!pkgList || pkgList.length === 0) {
          const allPkgs = await packageService.getPackagesByMentor(Number(params.id));
            console.log("No active packages. Fetched ALL packages:", allPkgs?.length || 0, allPkgs);
            pkgList = allPkgs || [];
        }

        // Build pricing maps (reuse logic from FindMentorsComponent)
        const planPriceMap: Record<string, number> = {};
        const discountMap: Record<string, number> = {};
        const originalPriceMap: Record<string, number> = {};

        pkgList.forEach(pkg => {
          if (pkg.durationMonths === 1) {
            planPriceMap["1"] = pkg.pricePerMonth;
            originalPriceMap["1"] = pkg.originalPricePerMonth || pkg.pricePerMonth;
            discountMap["1"] = 0;
          }
          if (pkg.durationMonths === 3) {
            planPriceMap["3"] = pkg.pricePerMonth;
            originalPriceMap["3"] = pkg.originalPricePerMonth || pkg.pricePerMonth;
            discountMap["3"] = pkg.threeMonthDiscount || 0;
          }
          if (pkg.durationMonths === 6) {
            planPriceMap["6"] = pkg.pricePerMonth;
            originalPriceMap["6"] = pkg.originalPricePerMonth || pkg.pricePerMonth;
            discountMap["6"] = pkg.sixMonthDiscount || 0;
          }
        });

        if (Object.keys(planPriceMap).length === 0) {
          const basePrice = 7000;
          planPriceMap["1"] = basePrice;
          planPriceMap["3"] = Math.round(basePrice * 0.85);
            planPriceMap["6"] = Math.round(basePrice * 0.7);
          originalPriceMap["1"] = basePrice;
          originalPriceMap["3"] = basePrice;
          originalPriceMap["6"] = basePrice;
          discountMap["1"] = 0;
          discountMap["3"] = 15;
          discountMap["6"] = 30;
        } else {
          const basePrice = originalPriceMap["1"] || pkgList[0]?.originalPricePerMonth || pkgList[0]?.pricePerMonth || 7000;
          if (!planPriceMap["1"]) { planPriceMap["1"] = basePrice; originalPriceMap["1"] = basePrice; discountMap["1"] = 0; }
          if (!planPriceMap["3"]) {
            const discount = pkgList.find(p => p.threeMonthDiscount)?.threeMonthDiscount || 15;
            planPriceMap["3"] = Math.round(basePrice * (1 - discount / 100));
            originalPriceMap["3"] = basePrice;
            discountMap["3"] = discount;
          }
          if (!planPriceMap["6"]) {
            const discount = pkgList.find(p => p.sixMonthDiscount)?.sixMonthDiscount || 30;
            planPriceMap["6"] = Math.round(basePrice * (1 - discount / 100));
            originalPriceMap["6"] = basePrice;
            discountMap["6"] = discount;
          }
        }

        console.log("Profile pricing maps", { planPriceMap, discountMap, originalPriceMap });

        // Choose preferred package (6 -> 3 -> 1)
        if (pkgList && pkgList.length > 0) {
          const preferred = pkgList.find(p => p.durationMonths === 6) || pkgList.find(p => p.durationMonths === 3) || pkgList.find(p => p.durationMonths === 1) || pkgList[0];
          setActivePackageId(preferred?.id ?? null);
          const baseMonthly = Number(preferred?.originalPricePerMonth ?? preferred?.pricePerMonth ?? 0);
          setBasePrice(baseMonthly);
        } else {
          setActivePackageId(null);
          setBasePrice(0);
        }

        // Store merged data (attach pricing maps to first package for downstream pass)
        const augmented = pkgList.map(p => ({ ...p }));
        setMentorshipPackages(augmented);
      } catch (e) {
        console.error("Failed to fetch active packages for mentor", e);
        setMentorshipPackages([]);
      } finally {
        setPackageLoading(false);
      }
    } catch (error) {
      console.error("Error fetching mentor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTrial = async (selectedDate: string, selectedTime: string) => {
    try {
      // You can integrate with your booking API here
      console.log("Booking trial session:", { mentorId: mentor?.id, date: selectedDate, time: selectedTime });
      
      // For now, just show an alert - replace with actual booking logic
      alert(`Trial session booked with ${mentor?.name} for ${selectedDate} at ${selectedTime}!`);
      
      // Optional: Navigate to booking confirmation or calendar
      // router.push(`/booking-confirmation?mentor=${mentor?.id}&date=${selectedDate}&time=${selectedTime}`);
    } catch (error) {
      console.error("Error booking trial session:", error);
      alert("Failed to book trial session. Please try again.");
    }
  };

  const handleRequestMentorship = async () => {
    try {
      await requestMentorshipSession(params.id, requestForm);
      setRequestModalOpen(false);
      setRequestForm({
        menteeName: "",
        menteeEmail: "",
        menteePhone: "",
        menteeBackground: "",
        requestMessage: "",
        goals: "",
        preferredTime: "",
        sessionType: "one-time"
      });
      alert("Mentorship request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950' : 'bg-cape-cod-10'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950 text-white' : 'bg-cape-cod-10 text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mentor not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950 text-gray-200' : 'bg-cape-cod-10 text-black'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Public-facing profile header matching the provided layout */}
          <PublicMentorProfileHeader mentor={mentor} />

          {/* Booking Trial Component - positioned between header and tabs */}
          <BookingTrial mentor={mentor} onBookTrial={handleBookTrial} />

          {/* Availability and CTA are handled inside the header to form a single combined card */}

          {/* Optional pricing card if package exists */}
          {activePackageId && (
            <div>
              <PricingCard 
                mentorId={Number(params.id)} 
                packageId={activePackageId} 
                basePricePerMonth={basePrice}
                packageData={mentorshipPackages.find(p => p.id === activePackageId)}
                packagesList={mentorshipPackages}
              />
            </div>
          )}

          {/* Keep tabs section below if you still want details on the same page */}
          <div className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <MentorProfileTabs 
              mentor={mentor} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              mentorshipPackages={mentorshipPackages}
              packageLoading={packageLoading}
            />
          </div>
        </div>
      </div>

      <MentorshipRequestModal
        opened={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        onSubmit={handleRequestMentorship}
      />
    </div>
  );
};

export default MentorProfileComponent;