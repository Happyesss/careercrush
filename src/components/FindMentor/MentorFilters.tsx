"use client";

import { Button, Select, TextInput, Slider, Switch, MultiSelect } from "@mantine/core";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";

interface MentorFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: {
    expertise: string;
    location: string;
    maxRate: number;
    availableOnly: boolean;
    experience: string;
    skills: string[];
  };
  setFilters: (filters: any) => void;
  clearFilters: () => void;
}

const MentorFilters = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  clearFilters,
}: MentorFiltersProps) => {
  const { isDarkMode } = useTheme();

  const skillOptions = [
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
  ];

  const experienceOptions = [
    { value: "0-2", label: "0-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "10+", label: "10+ years" },
  ];

  const expertiseOptions = [
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
  ];

  return (
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
          onClick={() => setShowFilters(!showFilters)}
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
  );
};

export default MentorFilters;