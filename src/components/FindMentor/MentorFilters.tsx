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
    <div
      className={` w-full lg:w-80 flex flex-col gap-6 tracking-tight shadow-lg rounded-xl border transition-all duration-300
        ${isDarkMode ? "bg-third text-white border-none" : "bg-white text-black border-gray-200"}
         sticky top-6  p-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconFilter size={20} className="text-primary" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-xs font-medium text-primary hover:text-primary transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Search</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search mentors by name, skills, or company..."
            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors pl-9
              ${isDarkMode ? '!bg-secondary !placeholder-gray-500 focus:!bg-secondary border-gray-600 text-white' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary'}`}
            style={isDarkMode ? { backgroundColor: '#201e1c', borderColor: '#201e1c', outline: 'none', boxShadow: 'none' } : {}}
          />
          <IconSearch size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
      </div>

      <Divider className={isDarkMode ? 'border-cape-cod-700' : 'border-gray-300'} />

      {/* Domain Chips */}
      <div>
        <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Domain</label>
        <div className="flex flex-wrap gap-2">
          {[
            "Frontend",
            "Backend",
            "Fullstack",
            "DevOps / SRE / Cloud",
            "QA / Automation Testing",
            "Data Scientist / AI/ML",
            "Data Analyst",
          ].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setFilters({ ...filters, expertise: filters.expertise === d ? "" : d })}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors
                ${filters.expertise === d ? 'bg-primary/10 text-primary border-primary' : isDarkMode ? 'bg-secondary text-white border-gray-600' : 'bg-white text-black border-gray-300'}
                hover:bg-primary/20`}
            >
              {d}
              {filters.expertise === d && (
                <IconX size={12} className="ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Location Input */}
      <div>
        <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Location</label>
        <input
          type="text"
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
          placeholder="Enter location"
          className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors
            ${isDarkMode ? '!bg-secondary !placeholder-gray-500 focus:!bg-secondary border-gray-600 text-white' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary'}`}
          style={isDarkMode ? { backgroundColor: '#201e1c', borderColor: '#201e1c', outline: 'none', boxShadow: 'none' } : {}}
        />
      </div>

      {/* Skills Multi-Tag Input */}
      <div>
        <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Skills</label>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => {
                setFilters({
                  ...filters,
                  skills: filters.skills.includes(skill)
                    ? filters.skills.filter((s) => s !== skill)
                    : [...filters.skills, skill],
                });
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors
                ${filters.skills.includes(skill) ? 'bg-primary/10 text-primary border-primary' : isDarkMode ? 'bg-secondary text-white border-gray-600' : 'bg-white text-black border-gray-300'}
                hover:bg-primary/20`}
            >
              {skill}
              {filters.skills.includes(skill) && (
                <IconX size={12} className="ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      <Divider className={isDarkMode ? 'border-cape-cod-700' : 'border-gray-300'} />

      {/* Experience Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Experience</label>
        <RangeSlider
          value={(filters.expRange || [0, 15]) as [number, number]}
          onChange={(value: [number, number]) => setFilters({ ...filters, expRange: value })}
          min={0}
          max={15}
          step={1}
         
          size="sm"
          styles={{
            track: {
              backgroundColor: isDarkMode ? '#3f4950' : '#e5e7eb',
            },
            bar: {
              backgroundColor: 'var(--color-primary)',
            },
            thumb: {
              backgroundColor: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            },
          }}
        />
      </div>

      {/* Available Only Switch */}
      <div className="flex items-center justify-between">
        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Available mentors only</label>
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={e => setFilters({ ...filters, availableOnly: e.target.checked })}
          className="w-4 h-4 accent-primary"
        />
      </div>
    </div>
  );
};

export default MentorFilters;