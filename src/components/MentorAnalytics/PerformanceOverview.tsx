"use client";

import { Card, Group, Progress } from "@mantine/core";
import { useTheme } from "../../ThemeContext";

interface PerformanceOverviewProps {
  analyticsData: {
    responseRate: number;
    completionRate: number;
    totalMentees: number;
  };
}

const PerformanceOverview = ({ analyticsData }: PerformanceOverviewProps) => {
  const { isDarkMode } = useTheme();

  return (
    <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
      <p className="text-lg font-semibold mb-4">
        Performance Overview
      </p>
      
      <div className="space-y-4">
        <div>
          <Group justify="space-between" className="mb-2">
            <p className="text-sm">Response Rate</p>
            <p className="text-sm font-semibold">{analyticsData.responseRate}%</p>
          </Group>
          <Progress value={analyticsData.responseRate} color="blue" size="lg" />
        </div>

        <div>
          <Group justify="space-between" className="mb-2">
            <p className="text-sm">Session Completion Rate</p>
            <p className="text-sm font-semibold">{analyticsData.completionRate}%</p>
          </Group>
          <Progress value={analyticsData.completionRate} color="green" size="lg" />
        </div>

        <div>
          <Group justify="space-between" className="mb-2">
            <p className="text-sm">Total Mentees</p>
            <p className="text-sm font-semibold">{analyticsData.totalMentees}</p>
          </Group>
          <div className="text-sm text-gray-600">Currently mentoring active students</div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceOverview;