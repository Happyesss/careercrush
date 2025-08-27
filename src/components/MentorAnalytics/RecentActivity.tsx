"use client";

import { Card } from "@mantine/core";
import { IconMessageCircle, IconCalendar, IconStar } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";

const RecentActivity = () => {
  const { isDarkMode } = useTheme();

  return (
    <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
      <p className="text-lg font-semibold mb-4">
        Recent Activity
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <IconMessageCircle size={16} className="text-blue-500" />
          <div>
            <p className="text-sm font-medium">New mentorship request</p>
            <p className={`text-xs ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}`}>
              2 hours ago
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IconCalendar size={16} className="text-green-500" />
          <div>
            <p className="text-sm font-medium">Session completed</p>
            <p className={`text-xs ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}`}>
              1 day ago
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IconStar size={16} className="text-yellow-500" />
          <div>
            <p className="text-sm font-medium">Received 5-star rating</p>
            <p className={`text-xs ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}`}>
              3 days ago
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;