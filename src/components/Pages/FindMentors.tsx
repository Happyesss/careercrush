"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Select, TextInput, Slider, Switch, MultiSelect } from "@mantine/core";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";

import { useTheme } from "../../ThemeContext";
import MentorCard from "../FindMentor/MentorCard";
import { getAllMentors } from "../../Services/MentorService";
import type { Mentor } from "../../types/mentor";

const FindMentors = () => {
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

  const skillOptions = useMemo(
    () => [
      "React",
      "Node.js",
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "AWS",
      "Docker",
      "Kubernetes",
      "MongoDB",
      "PostgreSQL",
      "Redis",
    ],
    []
  );

  const experienceOptions = useMemo(
    () => [
      { value: "0-2", label: "0-2 years" },
      { value: "3-5", label: "3-5 years" },
      { value: "6-10", label: "6-10 years" },
      { value: "10+", label: "10+ years" },
    ],
    []
  );

  const expertiseOptions = useMemo(
    () => [
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "Data Science",
      "Machine Learning",
      "DevOps",
      "UI/UX Design",
      "Product Management",
      "Mobile Development",
      "Cloud Computing",
    ],
    []
  );

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data: Mentor[] = await getAllMentors();
        setMentors(Array.isArray(data) ? data : []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Note: experience filter is declared but not applied here due to unclear mapping.
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

        <div className={`rounded-xl p-6 mb-8 ${isDarkMode ? "bg-cape-cod-900" : "bg-white"}`}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <TextInput
              placeholder="Search mentors by name, skills, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              className="flex-1"
            />
            <Button
              variant={showFilters ? "filled" : "outline"}
              leftSection={<IconFilter size={16} />}
              onClick={() => setShowFilters((s) => !s)}
            >
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border-t border-gray-200">
              <Select
                label="Expertise Area"
                placeholder="Select area"
                value={filters.expertise}
                onChange={(value) => setFilters({ ...filters, expertise: value || "" })}
                data={expertiseOptions}
                searchable
                clearable
              />
              <Select
                label="Experience Level"
                placeholder="Select experience"
                value={filters.experience}
                onChange={(value) => setFilters({ ...filters, experience: value || "" })}
                data={experienceOptions}
                clearable
              />
              <TextInput
                label="Location"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.currentTarget.value })}
              />
              <MultiSelect
                label="Skills"
                placeholder="Select skills"
                value={filters.skills}
                onChange={(value) => setFilters({ ...filters, skills: value })}
                data={skillOptions}
                searchable
                clearable
              />

              <div className="col-span-full">
                <label className="block text-sm font-medium mb-2">
                  Max Hourly Rate: {filters.maxRate === 5000 ? "5000+" : filters.maxRate}
                </label>
                <Slider
                  value={filters.maxRate}
                  onChange={(value) => setFilters({ ...filters, maxRate: value })}
                  min={0}
                  max={5000}
                  step={100}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 1000, label: "1K" },
                    { value: 2500, label: "2.5K" },
                    { value: 5000, label: "5K+" },
                  ]}
                />
              </div>

              <div className="col-span-full flex items-center justify-between">
                <Switch
                  label="Available mentors only"
                  checked={filters.availableOnly}
                  onChange={(e) => setFilters({ ...filters, availableOnly: e.currentTarget.checked })}
                />
                <Button variant="subtle" leftSection={<IconX size={16} />} onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className={`text-lg ${isDarkMode ? "text-cape-cod-300" : "text-gray-600"}`}>
            Found {filteredMentors.length} mentors
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className={`rounded-xl p-6 animate-pulse ${isDarkMode ? "bg-cape-cod-800" : "bg-white"}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`${isDarkMode ? "bg-cape-cod-700" : "bg-gray-200"} w-16 h-16 rounded-full`} />
                  <div className="flex-1">
                    <div className={`${isDarkMode ? "bg-cape-cod-700" : "bg-gray-200"} h-4 rounded mb-2`} />
                    <div className={`${isDarkMode ? "bg-cape-cod-700" : "bg-gray-200"} h-3 rounded w-3/4`} />
                  </div>
                </div>
                <div className={`${isDarkMode ? "bg-cape-cod-800" : "bg-gray-200"} h-3 rounded mb-2`} />
                <div className={`${isDarkMode ? "bg-cape-cod-800" : "bg-gray-200"} h-3 rounded w-2/3`} />
              </div>
            ))}
          </div>
        ) : filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} {...mentor} />
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? "bg-cape-cod-900" : "bg-white"} text-center py-12 rounded-xl`}>
            <h3 className="text-xl font-semibold mb-2">No mentors found</h3>
            <p className={`${isDarkMode ? "text-cape-cod-300" : "text-gray-600"} mb-4`}>
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMentors;
