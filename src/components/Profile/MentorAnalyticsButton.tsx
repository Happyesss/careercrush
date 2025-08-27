"use client";

import { Button } from "@mantine/core";
import { IconChartBar, IconExternalLink } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../ThemeContext";

const MentorAnalyticsButton = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const handleViewAnalytics = () => {
    router.push('/mentor-analytics');
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'}`}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <IconChartBar size={48} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        
        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Mentor Analytics
        </h3>
        
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>
          View detailed insights about your mentoring performance, earnings, ratings, and session analytics.
        </p>
        
        <Button 
          onClick={handleViewAnalytics}
          leftSection={<IconExternalLink size={16} />}
          size="md"
          variant="filled"
          color="blue"
          fullWidth
        >
          View Analytics Dashboard
        </Button>
      </div>
    </div>
  );
};

export default MentorAnalyticsButton;