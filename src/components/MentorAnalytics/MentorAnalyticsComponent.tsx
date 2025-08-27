"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Text, Grid } from "@mantine/core";
import { useTheme } from "../../ThemeContext";
import { getMentorByEmail } from "../../Services/MentorService";
import AnalyticsMetrics from "./AnalyticsMetrics";
import PerformanceOverview from "./PerformanceOverview";
import RecentActivity from "./RecentActivity";

const MentorAnalyticsComponent = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMentorData();
  }, [user]);

  const fetchMentorData = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const data = await getMentorByEmail(user.email);
      if (data) {
        setMentor(data);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log("No mentor profile found");
        setMentor(null);
      } else {
        console.error("Error fetching mentor data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mentor) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950 text-white' : 'bg-gray-50 text-black'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center py-16 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} mx-4`}>
              <Text size="xl" fw={600} mb="md">
                No Mentor Profile Found
              </Text>
              <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                Please set up your mentor profile first to view analytics.
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950 text-white' : 'bg-gray-50 text-black'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className={`h-32 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'} rounded-lg animate-pulse`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock analytics data (replace with real data from API)
  const analyticsData = {
    totalMentees: mentor.currentMentees || 0,
    maxMentees: mentor.maxMentees || 5,
    totalSessions: 24,
    avgRating: 4.8,
    responseRate: 95,
    sessionHours: 48,
    monthlyEarnings: 12500,
    completionRate: 92
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <Text size="xl" fw={700} className="text-xl sm:text-2xl">
              Mentor Analytics Dashboard
            </Text>
          </div>

          {/* Key Metrics */}
          <AnalyticsMetrics analyticsData={analyticsData} />

          {/* Detailed Analytics */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <PerformanceOverview analyticsData={analyticsData} />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <RecentActivity />
            </Grid.Col>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default MentorAnalyticsComponent;