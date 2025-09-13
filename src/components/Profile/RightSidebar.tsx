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
  const tags = [
    "c", "css", "express", "firebase", "html", "java", "javascript", "github",
    "mongodb", "mysql", "next.js", "node.js", "php", "python", "reactjs"
  ];
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);

  // Show About and Skills in right sidebar for mentors
  if (user?.accountType === 'MENTOR') {
    return (
      <aside className="hidden lg:block w-80 mt-10 mr-6">
        <div className="space-y-6">
          {/* About Section */}
          <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'}`}>
            <About />
          </div>
          
          {/* Skills Section */}
          <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'}`}>
            <Skills />
          </div>

          {/* Mentorship Dashboard Shortcut */}
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'}`}>
            <MentorshipDashboardRedirect />
          </div>
       </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block w-80 mt-10 mr-6">
      <div className="space-y-6">
        {/* Schedule Calendar */}
        <ScheduleCalendar />

        {/* Upcoming Sessions */}
        <UpcomingSessions />

        {/* Gallery Redirect */}
        <GalleryRedirect />
      </div>
    </aside>
  );
};

export default RightSidebar;