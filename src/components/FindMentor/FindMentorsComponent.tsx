"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../ThemeContext";
import { getAllMentors } from "../../Services/MentorService";
import type { Mentor } from "../../types/mentor";
import MentorFilters from "./MentorFilters";
import MentorGrid from "./MentorGrid";

const FindMentorsComponent = () => {
  const { isDarkMode } = useTheme();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    expertise: "",
    location: "",
    availableOnly: false,
    experience: "",
    skills: [] as string[],
    offering: "",
    expRange: [0, 15] as [number, number],
  });

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data: Mentor[] = await getAllMentors();
        
        // Fetch mentorship packages for each mentor
        const mentorsWithPackages = await Promise.all(
          (Array.isArray(data) ? data : []).map(async (mentor) => {
            try {
              // Import the package service properly
              const packageService = (await import("../../Services/MentorshipPackageService")).packageService;
              
              // Convert mentor.id to number if it's a string
              const mentorId = typeof mentor.id === 'string' ? parseInt(mentor.id) : mentor.id;
              
              // Fetch active packages for this mentor
              const packages = await packageService.getActivePackagesByMentor(mentorId);
              
              // Create price map from packages (1, 3, 6 month plans)
              const planPriceMap: Record<string, number> = {};
              const discountMap: Record<string, number> = {};
              const originalPriceMap: Record<string, number> = {};
              
              // Find packages by duration and use their monthly price
              packages.forEach(pkg => {
                if (pkg.durationMonths === 1) {
                  planPriceMap["1"] = pkg.pricePerMonth;
                  originalPriceMap["1"] = pkg.originalPricePerMonth || pkg.pricePerMonth;
                  discountMap["1"] = 0; // No discount for 1 month
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
              
              // If no packages found or missing durations, use fallback pricing
              if (Object.keys(planPriceMap).length === 0) {
                console.log(`No packages found for mentor ${mentor.id}, using default pricing`);
                const basePrice = 7000;
                planPriceMap["1"] = basePrice;
                planPriceMap["3"] = Math.round(basePrice * 0.85); // 15% off
                planPriceMap["6"] = Math.round(basePrice * 0.7); // 30% off
                originalPriceMap["1"] = basePrice;
                originalPriceMap["3"] = basePrice;
                originalPriceMap["6"] = basePrice;
                discountMap["1"] = 0;
                discountMap["3"] = 15;
                discountMap["6"] = 30;
              } else {
                // Fill in missing durations with calculated prices based on base price
                const basePrice = originalPriceMap["1"] || packages[0]?.originalPricePerMonth || packages[0]?.pricePerMonth || 7000;
                if (!planPriceMap["1"]) {
                  planPriceMap["1"] = basePrice;
                  originalPriceMap["1"] = basePrice;
                  discountMap["1"] = 0;
                }
                if (!planPriceMap["3"]) {
                  const discount = packages.find(p => p.threeMonthDiscount)?.threeMonthDiscount || 15;
                  planPriceMap["3"] = Math.round(basePrice * (1 - discount / 100));
                  originalPriceMap["3"] = basePrice;
                  discountMap["3"] = discount;
                }
                if (!planPriceMap["6"]) {
                  const discount = packages.find(p => p.sixMonthDiscount)?.sixMonthDiscount || 30;
                  planPriceMap["6"] = Math.round(basePrice * (1 - discount / 100));
                  originalPriceMap["6"] = basePrice;
                  discountMap["6"] = discount;
                }
              }
              
              console.log(`Mentor ${mentor.id} packages:`, packages.length, 'planPriceMap:', planPriceMap, 'discountMap:', discountMap);
              
              return {
                ...mentor,
                mentorshipPackages: packages,
                planPriceMap,
                discountMap,
                originalPriceMap,
                hasTrialSlots: packages.some(pkg => pkg.isFreeTrialIncluded)
              };
            } catch (error) {
              console.error(`Error fetching packages for mentor ${mentor.id}:`, error);
              // Return mentor with default pricing if package fetch fails
              const basePrice = 7000;
              return {
                ...mentor,
                mentorshipPackages: [],
                planPriceMap: {
                  "1": basePrice,
                  "3": Math.round(basePrice * 0.85),
                  "6": Math.round(basePrice * 0.7)
                },
                discountMap: {
                  "1": 0,
                  "3": 15,
                  "6": 30
                },
                originalPriceMap: {
                  "1": basePrice,
                  "3": basePrice,
                  "6": basePrice
                },
                hasTrialSlots: false
              };
            }
          })
        );
        
        setMentors(mentorsWithPackages);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [mentors, searchQuery, filters]);

  const applyFilters = () => {
    let filtered = [...mentors];

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((m) =>
        [m.name, m.jobTitle, m.company, m.bio]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }

    if (filters.expertise) {
      const exp = filters.expertise.toLowerCase();
      filtered = filtered.filter((m) => m.mentorshipAreas?.some((a) => a.toLowerCase().includes(exp)));
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((m) => (m.location || "").toLowerCase().includes(loc));
    }

    if (filters.availableOnly) {
      filtered = filtered.filter((m) => m.isAvailable);
    }

    if (filters.skills.length > 0) {
      const skillsLower = filters.skills.map((s) => s.toLowerCase());
      filtered = filtered.filter((m) =>
        (m.skills || []).some((skill) => skillsLower.some((fs) => skill.toLowerCase().includes(fs)))
      );
    }

    if (filters.expRange) {
      const [minY, maxY] = filters.expRange;
      filtered = filtered.filter((m) => {
        const years = Number(m.totalExp ?? 0);
        return years >= minY && years <= maxY;
      });
    }

    setFilteredMentors(filtered);
  };

  const clearFilters = () => {
    setFilters({
      expertise: "",
      location: "",
      availableOnly: false,
      experience: "",
      skills: [],
      offering: "",
      expRange: [0, 15],
    });
    setSearchQuery("");
  };

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? "bg-cape-cod-950 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-6">
              <MentorFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Right content */}
          <main className="lg:col-span-8 xl:col-span-9">
            <MentorGrid mentors={filteredMentors} loading={loading} clearFilters={clearFilters} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindMentorsComponent;