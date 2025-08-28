"use client";

import { Button, TextInput, RangeSlider, Switch, MultiSelect, Chip, Group, Divider } from "@mantine/core";
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
    availableOnly: boolean;
    experience: string;
    skills: string[];
    offering?: string;
    expRange?: [number, number];
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
    <div className={`rounded-xl p-5 ${isDarkMode ? "bg-cape-cod-900" : "bg-white"}`}>
      {/* Search */}
      <TextInput
        placeholder="Search mentors by name, skills, or company..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
      />

      <Divider className="my-4" />

      {/* Domain chips */}
      <div className="mb-3">
        <div className="text-sm font-medium mb-2">Domain</div>
        <Group gap="xs">
          {[
            "Frontend",
            "Backend",
            "Fullstack",
            "DevOps / SRE / Cloud",
            "QA / Automation Testing",
            "Data Scientist / AI/ML",
            "Data Analyst",
          ].map((d) => (
            <Chip
              key={d}
              checked={filters.expertise === d}
              onChange={() => setFilters({ ...filters, expertise: filters.expertise === d ? "" : d })}
              variant="outline"
              color="blue"
            >
              {d}
            </Chip>
          ))}
        </Group>
      </div>

      {/* 'Offering mentorship for' filter removed as requested */}

      <TextInput
        label="Location"
        placeholder="Enter location"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.currentTarget.value })}
        className="mb-4"
      />

      <MultiSelect
        label="Skills"
        placeholder="Select skills"
        value={filters.skills}
        onChange={(value) => setFilters({ ...filters, skills: value })}
        data={skillOptions}
        searchable
        clearable
        className="mb-5"
      />



      {/* Experience range */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Experience</label>
        <RangeSlider
          value={(filters.expRange || [0, 15]) as [number, number]}
          onChange={(value: [number, number]) => setFilters({ ...filters, expRange: value })}
          min={0}
          max={15}
          step={1}
          marks={[
            { value: 0, label: "0 Years" },
            { value: 15, label: "15+ Years" },
          ]}
        />
      </div>

      <div className="flex items-center justify-between">
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
  );
};

export default MentorFilters;