import React from "react";
import { IconPencil } from "@tabler/icons-react";
import { Divider } from "@mantine/core";
import { useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";
import About from "./About";
import Skills from "./Skills";
import MentorshipDashboardRedirect from "./MentorshipDashboardRedirect";

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

  // Show a simple placeholder for other users while profile widgets are being prepared
  return (
    <aside className="hidden lg:block w-72 mt-10 mr-6 text-sm">
      <div className={`mb-6 shadow-md rounded-2xl p-6 text-center ${isDarkMode ? 'bg-cape-cod-900 text-white' : 'bg-white text-gray-700'}`}>
        <h4 className="text-lg font-semibold mb-2">Coming soon</h4>
        <p className="text-sm opacity-80">We&apos;re working on profile widgets to enhance your experience. Check back soon for updates.</p>
      </div>
    </aside>
  );
};

export default RightSidebar;