"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { useTheme } from "../../ThemeContext";
import { getMentor, requestMentorshipSession } from "../../Services/MentorService";
import { useSelector } from "react-redux";
import { Mentor } from "../../types/mentor";
import MentorProfileHeader from "./MentorProfileHeader";
import MentorProfileTabs from "./MentorProfileTabs";
import PricingCard from "./PricingCard";
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

  const fetchMentor = async () => {
    try {
      setLoading(true);
      const data = await getMentor(params.id);
      console.log("Fetched mentor data:", data);
      setMentor(data);
      // Fetch an active package for this mentor to power pricing card
      try {
        const pkgList = await packageService.getActivePackagesByMentor(Number(params.id));
        if (pkgList && pkgList.length > 0) {
          const first = pkgList[0] as any;
          setActivePackageId(first.id ?? null);
          setBasePrice(Number(first.pricePerMonth ?? 0));
        }
      } catch (e) {
        console.error("Failed to fetch active packages for mentor", e);
      }
    } catch (error) {
      console.error("Error fetching mentor:", error);
    } finally {
      setLoading(false);
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950 text-gray-200' : 'bg-cape-cod-10 text-black'} font-['poppins']`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} rounded-xl overflow-hidden shadow-lg`}>
            {mentor.profileBackground && (
              <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <img
                  src={`data:image/png;base64,${mentor.profileBackground}`}
                  alt="Profile background"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:items-start">
                <MentorProfileHeader mentor={mentor} />
                
                <div className="xl:w-2/3 w-full flex flex-col">
                  <div className="flex flex-col gap-3 w-full max-w-sm mb-6 xl:self-end">
                    <Button
                      size="lg"
                      disabled={!mentor.isAvailable}
                      onClick={() => setRequestModalOpen(true)}
                      className="w-full"
                    >
                      {mentor.isAvailable ? "Request Mentorship" : "Currently Unavailable"}
                    </Button>
                  </div>
                  
                  {activePackageId && (
                    <div className="mb-6">
                      <PricingCard mentorId={Number(params.id)} packageId={activePackageId} basePricePerMonth={basePrice} />
                    </div>
                  )}

                  <MentorProfileTabs 
                    mentor={mentor} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                </div>
              </div>
            </div>
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