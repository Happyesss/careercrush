"use client";

import { Card, Grid, Group, Progress } from "@mantine/core";
import { IconUsers, IconClock, IconStar, IconTrendingUp } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";

interface AnalyticsMetricsProps {
  analyticsData: {
    totalMentees: number;
    maxMentees: number;
    sessionHours: number;
    avgRating: number;
    monthlyEarnings: number;
  };
}

const AnalyticsMetrics = ({ analyticsData }: AnalyticsMetricsProps) => {
  const { isDarkMode } = useTheme();

  return (
    <Grid mb="xl">
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
          <Group justify="space-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}`}>
                Active Mentees
              </p>
              <p className="text-xl font-bold">
                {analyticsData.totalMentees}/{analyticsData.maxMentees}
              </p>
            </div>
            <IconUsers size={24} className="text-blue-500" />
          </Group>
          <Progress 
            value={(analyticsData.totalMentees / analyticsData.maxMentees) * 100} 
            color="blue" 
            size="sm" 
            className="mt-2"
          />
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 3 }}>
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
          <Group justify="space-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}`}>
                Session Hours
              </p>
              <p className="text-xl font-bold">
                {analyticsData.sessionHours}h
              </p>
            </div>
            <IconClock size={24} className="text-green-500" />
          </Group>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 3 }}>
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
          <Group justify="space-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}`}>
                Average Rating
              </p>
              <p className="text-xl font-bold">
                {analyticsData.avgRating}/5.0
              </p>
            </div>
            <IconStar size={24} className="text-yellow-500" />
          </Group>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 3 }}>
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
          <Group justify="space-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}`}>
                Monthly Earnings
              </p>
              <p className="text-xl font-bold">
                ₹{analyticsData.monthlyEarnings.toLocaleString()}
              </p>
            </div>
            <IconTrendingUp size={24} className="text-purple-500" />
          </Group>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default AnalyticsMetrics;