
"use client";

import React, { useState, useEffect } from "react";
import { Divider, RangeSlider } from "@mantine/core";
import { useDispatch } from "react-redux";
import { UpdateFilter } from "../../Slices/FilterSlice";
import { useTheme } from "../../ThemeContext";
import { IconFilter, IconX, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

// Filter options for checkboxes only
const filterData = [
  {
    title: "Experience",
    options: ["Fresher", "0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"],
  },
  {
    title: "Job Type",
    options: ["Full time", "Part time", "Internship", "Project work", "Volunteering"],
  },
];

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [salary, setSalary] = useState<[number, number]>([0, 200]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [jobTitleInput, setJobTitleInput] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

// Automatically dispatch whenever filters change
React.useEffect(() => {
  dispatch(UpdateFilter({ 
    ...selectedFilters, 
    "Job Title": jobTitles,
    "Location": locations,
    salary 
  }));
}, [selectedFilters, jobTitles, locations, salary, dispatch]);

// Handle checkbox toggle
const handleCheckboxChange = (section: string, option: string) => {
  setSelectedFilters((prev) => {
    const current = prev[section] || [];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option) // remove
      : [...current, option]; // add

    return { ...prev, [section]: updated };
  });
};

// Handle salary change
const handleSalaryChange = (value: [number, number]) => {
  setSalary(value);
};

// Handle adding job title tags
const handleJobTitleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && jobTitleInput.trim()) {
    e.preventDefault();
    if (!jobTitles.includes(jobTitleInput.trim())) {
      setJobTitles([...jobTitles, jobTitleInput.trim()]);
    }
    setJobTitleInput("");
  }
};

// Handle adding location tags
const handleLocationKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && locationInput.trim()) {
    e.preventDefault();
    if (!locations.includes(locationInput.trim())) {
      setLocations([...locations, locationInput.trim()]);
    }
    setLocationInput("");
  }
};

// Remove tag functions
const removeJobTitle = (title: string) => {
  setJobTitles(jobTitles.filter(t => t !== title));
};

const removeLocation = (location: string) => {
  setLocations(locations.filter(l => l !== location));
};




  return (
    <>
      <style jsx global>{`
        /* Custom scrollbar for sidebar and inner scroll areas */
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.04);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          /* use the project's primary color variable so theme matches exactly */
          background: var(--color-primary);
          border-radius: 999px;
          border: 2px solid rgba(0,0,0,0.12);
        }
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary) rgba(255,255,255,0.04);
        }
        /* Hover/focus state */
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          filter: brightness(0.95);
        }
        
        /* Animation for filter panel */
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 1000px; opacity: 1; }
        }
        
        @keyframes slideUp {
          from { max-height: 1000px; opacity: 1; }
          to { max-height: 0; opacity: 0; }
        }
        
        .filter-slide-down {
          animation: slideDown 0.3s forwards;
        }
        
        .filter-slide-up {
          animation: slideUp 0.3s forwards;
        }
      `}</style>
      
      {/* Mobile Toggle Button */}
      {isMobile && (
        <div className="flex justify-center w-full mb-4 px-4 ">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className={`flex items-center justify-center gap-2 px-4 py-2  w-full rounded-lg shadow-md text-white transition-all duration-300 ${
              isDarkMode ? 'bg-primary hover:bg-orange-600' : 'bg-primary hover:bg-orange-600'
            }`}
            aria-label={isMobileFilterOpen ? 'Close filters' : 'Open filters'}
          >
            <IconFilter size={18} />
            <span className="font-medium text-sm">Filters</span>
            {isMobileFilterOpen ? (
              <IconChevronUp size={18} />
            ) : (
              <IconChevronDown size={18} />
            )}
          </button>
        </div>
      )}

      <div
        className={`
          custom-scrollbar w-full lg:w-80 flex flex-col gap-6 tracking-tight shadow-lg rounded-xl border 
          transition-all duration-300 ${
            isDarkMode
              ? "bg-third text-white border-none"
              : "bg-white text-black border-gray-200"
          }
          ${!isMobile ? 'overflow-y-auto sticky top-6 max-h-[calc(100vh-6rem)] p-6' : ''}
          ${isMobile && !isMobileFilterOpen ? 'max-h-0 py-0 px-6 overflow-hidden opacity-0 border-0' : 
            isMobile ? 'max-h-[1000px] p-6 overflow-y-auto opacity-100' : ''}
        `}
      >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconFilter size={20} className="text-primary" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <button
          onClick={() => {
            setSelectedFilters({});
            setSalary([0, 200]);
            setJobTitles([]);
            setLocations([]);
            setJobTitleInput("");
            setLocationInput("");
          }}
          className="text-xs font-medium text-primary hover:text-primary transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Job Title Multi-Tag Input */}
      <div className="space-y-3">
        <div>
          <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Job Title
          </label>
          <input
            value={jobTitleInput}
            onChange={(e) => setJobTitleInput(e.target.value)}
            onKeyDown={handleJobTitleKeyDown}
            placeholder="Type job title and press Enter..."
            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
              isDarkMode 
                ? "                 !bg-secondary  !placeholder-gray-500  focus:!bg-secondary" 

                : "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary"
            } focus:outline-none focus:ring-2 focus:ring-primary/20`}
style={
  isDarkMode
    ? {
        backgroundColor: '#201e1c',
        borderColor: '#201e1c',
        outline: 'none',
        boxShadow: 'none', // removes the ring
      }
    : {}
}
          />
          {/* Job Title Tags */}
          {jobTitles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {jobTitles.map((title, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {title}
                  <button
                    onClick={() => removeJobTitle(title)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <IconX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Location Multi-Tag Input */}
        <div>
          <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Location
          </label>
          <input
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={handleLocationKeyDown}
            placeholder="Type location and press Enter..."
            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
              isDarkMode 
                ? "!bg-secondary  !placeholder-gray-500  focus:!bg-secondary" 
                : "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary"
            } focus:outline-none focus:ring-2 focus:ring-primary/20`}
style={
  isDarkMode
    ? {
        backgroundColor: '#201e1c',
        borderColor: '#201e1c',
        outline: 'none',
        boxShadow: 'none', // removes the ring
      }
    : {}
}
          />
          {/* Location Tags */}
          {locations.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {locations.map((location, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {location}
                  <button
                    onClick={() => removeLocation(location)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <IconX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Divider className={isDarkMode ? 'border-cape-cod-700' : 'border-gray-300'} />

      {/* Checkbox Filters */}
      {filterData.map((section, idx) => (
        <div key={idx} className="flex flex-col">
          <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {section.title}
          </h4>
      <div className="max-h-28 overflow-y-auto grid grid-cols-2 gap-2 mb-4 pr-1 custom-scrollbar">
            {section.options.map((option, i) => (
        <label key={i} className="flex items-center gap-2 text-sm cursor-pointer rounded p-1 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedFilters[section.title]?.includes(option) || false}
                  onChange={() => handleCheckboxChange(section.title, option)}
                  className="w-4 h-4 accent-primary"
                />
                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  {option}
                </span>
              </label>
            ))}
          </div>
          {idx < filterData.length - 1 && (
            <Divider className={isDarkMode ? 'border-cape-cod-700' : 'border-gray-300'} />
          )}
        </div>
      ))}

      {/* Salary Range */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Salary Range
          </h4>
          <span className="text-sm font-medium text-primary">
            ₹{salary[0]}k - ₹{salary[1]}k
          </span>
        </div>
        <RangeSlider
          size="sm"
          max={200}
          value={salary}
          onChange={setSalary}
          onChangeEnd={handleSalaryChange}
          className="mt-2"
          styles={{
            track: {
              backgroundColor: isDarkMode ? '#3f4950' : '#e5e7eb',
            },
            bar: {
              /* use theme variable so slider matches primary color exactly */
              backgroundColor: 'var(--color-primary)',
            },
            thumb: {
              backgroundColor: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            },
          }}
        />
      </div>

      {/* Done Button - Mobile Only */}
      {isMobile && (
        <button
          onClick={() => setIsMobileFilterOpen(false)}
          className="mt-6 py-3 px-4 bg-primary hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
        >
          Apply Filters
        </button>
      )}
    </div>
    </>
  );
};

export default FilterSidebar;
