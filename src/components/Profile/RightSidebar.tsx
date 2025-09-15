import React from "react";
import { IconPencil } from "@tabler/icons-react";
import { Divider } from "@mantine/core";
import { useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";
import About from "./About";
import Skills from "./Skills";
import MentorshipDashboardRedirect from "./MentorshipDashboardRedirect";
import ScheduleCalendar from "./ScheduleCalendar";
import UpcomingSessions from "./UpcomingSessions";
import GalleryRedirect from "./GalleryRedirect";

const RightSidebar: React.FC = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);

  // Show About and Skills in right sidebar for mentors
  if (user?.accountType === 'MENTOR') {
    return (
      // Add a right-side gutter so cards don't touch the viewport edge; keep left section untouched
      <aside
        className="hidden lg:block w-80 xl:w-96 flex-shrink-0 pr-3 sm:pr-4 md:pr-6 xl:pr-8 [padding-right:env(safe-area-inset-right)]"
        aria-label="Profile right sidebar"
      >
  <div className="space-y-6 sticky top-6 pb-2">
          {/* About Section */}
          <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            isDarkMode 
              ? 'bg-third border border-gray-700/30 hover:shadow-xl' 
              : 'bg-white border border-gray-200/60 hover:shadow-xl'
          }`}>
            <About />
          </div>
          
          {/* Skills Section */}
          <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            isDarkMode 
              ? 'bg-third border border-gray-700/30 hover:shadow-xl' 
              : 'bg-white border border-gray-200/60 hover:shadow-xl'
          }`}>
            <Skills />
          </div>

          {/* Mentorship Dashboard Shortcut */}
          <div className={`rounded-2xl shadow-lg transition-all duration-300 ${
            isDarkMode 
              ? 'bg-third border border-gray-700/30 hover:shadow-xl' 
              : 'bg-white border border-gray-200/60 hover:shadow-xl'
          }`}>
            <MentorshipDashboardRedirect />
          </div>
       </div>
      </aside>
    );
  }

  return (
    // Add a right-side gutter so cards don't touch the viewport edge; keep left section untouched
    <aside
      className="hidden lg:block w-80 xl:w-96 flex-shrink-0 pr-3 sm:pr-4 md:pr-6 xl:pr-8 [padding-right:env(safe-area-inset-right)]"
      aria-label="Profile right sidebar"
    >
  <div className="space-y-6 sticky top-6 pb-2">
        {/* Schedule Calendar */}
        <div className={`rounded-2xl shadow-lg transition-all duration-300 ${
          isDarkMode 
            ? 'bg-third border border-gray-700/30 hover:shadow-xl' 
            : 'bg-white border border-gray-200/60 hover:shadow-xl'
        }`}>
          <ScheduleCalendar />
        </div>

        {/* Upcoming Sessions */}
        <div className={`rounded-2xl shadow-lg transition-all duration-300 ${
          isDarkMode 
            ? 'bg-third border border-gray-700/30 hover:shadow-xl' 
            : 'bg-white border border-gray-200/60 hover:shadow-xl'
        }`}>
          <UpcomingSessions />
        </div>

        {/* Gallery Redirect */}
        <div className={`rounded-2xl shadow-lg transition-all duration-300 ${
          isDarkMode 
            ? 'bg-third border border-gray-700/30 hover:shadow-xl' 
            : 'bg-white border border-gray-200/60 hover:shadow-xl'
        }`}>
          <GalleryRedirect />
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;