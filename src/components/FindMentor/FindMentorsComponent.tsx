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
    maxRate: 5000,
    availableOnly: false,
    experience: "",
    skills: [] as string[],
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

    if (filters.maxRate < 5000) {
      filtered = filtered.filter((m) => !m.hourlyRate || (m.hourlyRate as number) <= filters.maxRate);
    }

    if (filters.skills.length > 0) {
      const skillsLower = filters.skills.map((s) => s.toLowerCase());
      filtered = filtered.filter((m) =>
        (m.skills || []).some((skill) => skillsLower.some((fs) => skill.toLowerCase().includes(fs)))
      );
    }

    setFilteredMentors(filtered);
  };

  const clearFilters = () => {
    setFilters({ expertise: "", location: "", maxRate: 5000, availableOnly: false, experience: "", skills: [] });
    setSearchQuery("");
  };

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? "bg-cape-cod-950 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Mentor</h1>
          <p className={`text-lg ${isDarkMode ? "text-cape-cod-300" : "text-gray-600"} max-w-2xl mx-auto`}>
            Connect with experienced professionals who can guide your career journey
          </p>
        </div>

        <MentorFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
        />

        <div className="mb-6">
          <p className={`text-lg ${isDarkMode ? "text-cape-cod-300" : "text-gray-600"}`}>
            Found {filteredMentors.length} mentors
          </p>
        </div>

        <MentorGrid mentors={filteredMentors} loading={loading} clearFilters={clearFilters} />
      </div>
    </div>
  );
};

export default FindMentorsComponent;