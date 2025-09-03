// "use client";

// import { Divider, RangeSlider, Button } from "@mantine/core";
// import { dropdownData } from "../../assets/Data/JobsData";
// import MultiInput from "./MultiInput";
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { UpdateFilter } from "../../Slices/FilterSlice";
// import { useTheme } from "../../ThemeContext";
// import { IconFilter, IconSearch, IconX } from "@tabler/icons-react";

// const FilterSidebar = () => {
//   const dispatch = useDispatch();
//   const { isDarkMode } = useTheme();
//   const [value, setValue] = useState<[number, number]>([0, 200]);
//   const [isOpen, setIsOpen] = useState(false);

//   const handleSalaryChange = (event: [number, number]) => {
//     dispatch(UpdateFilter({ salary: event }));
//   };

//   const clearAllFilters = () => {
//     setValue([0, 200]);
//     dispatch(UpdateFilter({ 
//       "Job Title": [], 
//       "Location": [], 
//       "Job Type": [], 
//       "Experience": [], 
//       salary: [0, 200] 
//     }));
//   };

//   return (
//     <div className="w-full">
//       {/* Search Bar Section - Always visible */}
//       <div className="mb-6">
//         <Divider color={isDarkMode ? 'dark' : 'gray'} className="mb-4" />
//         <div className={`flex flex-wrap items-center gap-2 px-4 py-3 shadow-lg rounded-xl mx-4 border transition-all duration-300 ${
//           isDarkMode 
//             ? 'bg-third text-primary' 
//             : 'bg-white border-gray-200 shadow-gray-200/50 text-black'
//         }`}>
//           {dropdownData
//             .filter((item) => item.title === "Job Title" || item.title === "Location")
//             .map((item, index) => (
//               <React.Fragment key={index}>
//                 <div className="flex-1 min-w-[200px]">
//                   <MultiInput {...item} />
//                 </div>
//                 {index === 0 && (
//                   <Divider 
//                     className="hidden sm:block" 
//                     mr="xs" 
//                     size="xs" 
//                     orientation="vertical" 
//                     color={isDarkMode ? 'gray' : 'dark'} 
//                   />
//                 )}
//               </React.Fragment>
//             ))}
//           <Button
//             className={`ml-2 rounded-lg px-4 py-2 font-semibold transition-all duration-300 hover:scale-105 ${
//               isDarkMode 
//                 ? 'bg-primary hover:bg-orange-600 text-white' 
//                 : 'bg-primary hover:bg-orange-600 text-white'
//             }`}
//             leftSection={<IconSearch size={16} />}
//           >
//             <span className="hidden sm:inline">Search</span>
//           </Button>
//         </div>
//       </div>

//       {/* Desktop Filters */}
//       <div className={`hidden md:flex flex-col mx-4 px-6 py-6 shadow-lg rounded-xl border transition-all duration-300 ${
//         isDarkMode 
//           ? 'bg-cape-cod-900 text-white border-cape-cod-700 shadow-cape-cod-800/20' 
//           : 'bg-white text-black border-gray-200 shadow-gray-200/50'
//       }`}>
//         {/* Filter Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <IconFilter size={20} className="text-primary" />
//             <h3 className="text-lg font-semibold">Filters</h3>
//           </div>
//           <button
//             onClick={clearAllFilters}
//             className="text-sm text-primary hover:text-orange-600 font-medium transition-colors duration-300"
//           >
//             Clear All
//           </button>
//         </div>

//         {/* Filter Options */}
//         {dropdownData
//           .filter(item => item.title === "Job Type" || item.title === "Experience")
//           .map((item, index) => (
//             <React.Fragment key={index}>
//               <div className="mb-6">
//                 <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
//                   {item.title}
//                 </h4>
//                 <MultiInput {...item} alwaysOpen />
//               </div>
//               {index < 1 && <Divider my="md" size="xs" color={isDarkMode ? 'gray.6' : 'gray.3'} />}
//             </React.Fragment>
//           ))}

//         {/* Salary Range */}
//         <Divider my="md" size="xs" color={isDarkMode ? 'gray.6' : 'gray.3'} />
//         <div className="mb-4">
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Salary Range</h4>
//             <div className="text-sm font-medium text-primary">
//               ₹{value[0]}k - ₹{value[1]}k
//             </div>
//           </div>
//           <RangeSlider 
//             onChangeEnd={handleSalaryChange} 
//             size="sm" 
//             color="orange.5" 
//             max={200} 
//             value={value} 
//             labelTransitionProps={{
//               transition: 'slide-down',
//               duration: 200,
//               timingFunction: 'ease',
//             }} 
//             onChange={setValue}
//             className="mt-2"
//           />
//         </div>
//       </div>

//       {/* Mobile Filter Button */}
//       <button
//         className={`md:hidden fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 ${
//           isDarkMode ? 'bg-primary hover:bg-orange-600' : 'bg-primary hover:bg-orange-600'
//         }`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <IconFilter className="h-6 w-6 text-white" />
//       </button>

//       {/* Mobile Filter Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 md:hidden">
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//             onClick={() => setIsOpen(false)}
//           />
//           <div
//             className={`fixed left-1/2 bottom-0 transform -translate-x-1/2 w-full max-w-lg rounded-t-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
//               isDarkMode ? 'bg-cape-cod-900 text-white' : 'bg-white text-black'
//             }`}
//             style={{ maxHeight: '80vh' }}
//           >
//             {/* Handle */}
//             <div className="flex justify-center py-3">
//               <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
//             </div>

//             {/* Header */}
//             <div className="flex justify-between items-center px-6 pb-4">
//               <h2 className="text-xl font-bold flex items-center gap-2">
//                 <IconFilter size={20} className="text-primary" />
//                 Filters & Search
//               </h2>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cape-cod-800 transition-colors duration-200"
//               >
//                 <IconX size={20} className="text-gray-500 dark:text-gray-400" />
//               </button>
//             </div>

//             <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
//               {/* Search Section */}
//               <div className="mb-6">
//                 <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Search Jobs</h3>
//                 <div className="space-y-3">
//                   {dropdownData
//                     .filter((item) => item.title === "Job Title" || item.title === "Location")
//                     .map((item, index) => (
//                       <div key={index} className="w-full">
//                         <MultiInput {...item} />
//                       </div>
//                     ))}
//                 </div>
//               </div>

//               <Divider my="lg" size="xs" color={isDarkMode ? 'gray.6' : 'gray.3'} />

//               {/* Filter Options */}
//               {dropdownData
//                 .filter(item => item.title === "Job Type" || item.title === "Experience")
//                 .map((item, index) => (
//                   <div key={index} className="mb-6">
//                     <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
//                       {item.title}
//                     </h4>
//                     <MultiInput {...item} alwaysOpen />
//                   </div>
//                 ))}

//               {/* Salary Range */}
//               <div className="mb-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Salary Range</h4>
//                   <div className="text-sm font-medium text-primary">
//                     ₹{value[0]}k - ₹{value[1]}k
//                   </div>
//                 </div>
//                 <RangeSlider
//                   onChangeEnd={handleSalaryChange}
//                   size="sm"
//                   color="orange.5"
//                   max={200}
//                   value={value}
//                   labelTransitionProps={{
//                     transition: 'slide-down',
//                     duration: 200,
//                     timingFunction: 'ease',
//                   }}
//                   onChange={setValue}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-cape-cod-700">
//                 <Button
//                   onClick={clearAllFilters}
//                   variant="outline"
//                   className={`flex-1 ${
//                     isDarkMode
//                       ? 'border-cape-cod-600 text-cape-cod-300 hover:bg-cape-cod-800'
//                       : 'border-gray-300 text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   Clear All
//                 </Button>
//                 <Button
//                   onClick={() => setIsOpen(false)}
//                   className="flex-1 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-red-500 text-white font-semibold transition-all duration-300"
//                 >
//                   Apply Filters
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterSidebar;



"use client";

import React, { useState } from "react";
import { Divider, RangeSlider } from "@mantine/core";
import { useDispatch } from "react-redux";
import { UpdateFilter } from "../../Slices/FilterSlice";
import { useTheme } from "../../ThemeContext";
import { IconFilter, IconX } from "@tabler/icons-react";

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
      `}</style>

    <div
      className={`custom-scrollbar w-full lg:w-80 flex flex-col gap-6 tracking-tight p-6 shadow-lg rounded-xl border overflow-y-auto sticky top-6 max-h-[calc(100vh-6rem)] ${
        isDarkMode
          ? "bg-third text-white border-none"
          : "bg-white text-black border-gray-200"
      }`}
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
    </div>
    </>
  );
};

export default FilterSidebar;
