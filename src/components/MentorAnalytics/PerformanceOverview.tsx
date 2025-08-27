"use client";

import { Card, Group, Progress } from "@mantine/core";
import { useTheme } from "../../ThemeContext";

interface PerformanceOverviewProps {
  analyticsData: {
    responseRate: number;
    completionRate: number;
    totalMentees: number;
    maxMentees: number;
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
            <p className="text-sm">Capacity Utilization</p>
            <p className="text-sm font-semibold">{Math.round((analyticsData.totalMentees / analyticsData.maxMentees) * 100)}%</p>
          </Group>
          <Progress value={(analyticsData.totalMentees / analyticsData.maxMentees) * 100} color="purple" size="lg" />
        </div>
      </div>
    </Card>
  );
};

export default PerformanceOverview;