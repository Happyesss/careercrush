"use client";

import { Button } from "@mantine/core";
import { useTheme } from "../../ThemeContext";
import MentorCard from "./MentorCard";
import type { Mentor } from "../../types/mentor";

interface MentorGridProps {
  mentors: Mentor[];
  loading: boolean;
  clearFilters: () => void;
}

const MentorGrid = ({ mentors, loading, clearFilters }: MentorGridProps) => {
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`rounded-2xl p-5 animate-pulse border transform transition-all duration-200 ${isDarkMode ? 'bg-third border-none shadow-sm' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
              </div>
              <div className={`h-8 w-16 rounded-lg ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-3 w-20 rounded ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
              <div className={`h-3 w-12 rounded ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
            </div>
            <div className={`h-6 w-3/4 rounded mb-3 ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
            <div className="flex flex-wrap gap-2 mb-4">
              <div className={`h-6 w-16 rounded-md ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
              <div className={`h-6 w-20 rounded-md ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
              <div className={`h-6 w-14 rounded-md ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
            </div>
            <div className={`h-px ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'} mb-4`} />
            <div className="flex items-end justify-between">
              <div>
                <div className={`h-4 w-24 rounded ${isDarkMode ? "bg-secondary" : "bg-gray-200"} mb-2`} />
                <div className={`h-3 w-16 rounded ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
              </div>
              <div className={`h-8 w-20 rounded-md ${isDarkMode ? "bg-secondary" : "bg-gray-200"}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className={`${isDarkMode ? "bg-third" : "bg-white"} text-center py-12 rounded-2xl border ${isDarkMode ? 'border-none shadow-sm' : 'border-gray-200 shadow-sm'}`}>
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No mentors found</h3>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
          Try adjusting your search criteria or filters
        </p>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-1 w-full ">
  {mentors.map((mentor) => (
    <MentorCard key={mentor.id} {...mentor} />
  ))}
</div>

  );
};

export default MentorGrid;