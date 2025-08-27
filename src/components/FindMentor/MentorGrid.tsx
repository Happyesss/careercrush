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
    );
  }

  if (mentors.length === 0) {
    return (
      <div className={`${isDarkMode ? "bg-cape-cod-900" : "bg-white"} text-center py-12 rounded-xl`}>
        <h3 className="text-xl font-semibold mb-2">No mentors found</h3>
        <p className={`${isDarkMode ? "text-cape-cod-300" : "text-gray-600"} mb-4`}>
          Try adjusting your search criteria or filters
        </p>
        <Button onClick={clearFilters}>Clear All Filters</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} {...mentor} />
      ))}
    </div>
  );
};

export default MentorGrid;