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
        setMentors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching mentors:", error);
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