"use client";

import { Card, Text, Progress, Badge, SimpleGrid } from "@mantine/core";
import { IconTrendingUp, IconUsers, IconClock, IconStar, IconCalendar, IconMessageCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";
import { getMentorByEmail } from "../../Services/MentorService";

const MentorAnalytics = () => {
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
      // Handle 404 (mentor not found) as normal case
      if (error.response?.status === 404) {
        console.log("No mentor profile found - this is normal for new mentors");
        setMentor(null);
      } else {
        console.error("Error fetching mentor data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mentor) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className={`h-8 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'} rounded animate-pulse`}></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className={`h-24 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'} rounded animate-pulse`}></div>
          ))}
        </div>
      </div>
    );
  }

  const currentMentees = mentor.currentMentees || 0;
  const maxMentees = mentor.maxMentees || 5;
  const capacityPercentage = (currentMentees / maxMentees) * 100;
  
  const totalRequests = mentor.mentorshipRequests?.length || 0;
  const pendingRequests = mentor.mentorshipRequests?.filter((req: any) => req.status === 'PENDING').length || 0;
  const acceptedRequests = mentor.mentorshipRequests?.filter((req: any) => req.status === 'ACCEPTED').length || 0;
  const acceptanceRate = totalRequests > 0 ? (acceptedRequests / totalRequests) * 100 : 0;

  // Mock data for demonstration - in real app, this would come from backend analytics
  const weeklyStats = {
    sessionsThisWeek: 3,
    hoursThisWeek: 4.5,
    responseTime: "2 hours",
    satisfactionScore: 4.8
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <IconTrendingUp size={24} className="text-blue-500" />
        <Text size="xl" fw={700} className={isDarkMode ? 'text-white' : 'text-black'}>
          Mentor Analytics
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" className="mb-6">
        {/* Capacity Utilization */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconUsers size={20} className="text-blue-500" />
              <Text size="sm" fw={500}>Capacity</Text>
            </div>
            <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
              {currentMentees}/{maxMentees}
            </Text>
          </div>
          <Progress 
            value={capacityPercentage} 
            size="sm" 
            color={capacityPercentage > 80 ? 'red' : capacityPercentage > 60 ? 'yellow' : 'blue'} 
            className="mb-2"
          />
          <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
            {capacityPercentage.toFixed(0)}% utilized
          </Text>
        </Card>

        {/* Request Stats */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconMessageCircle size={20} className="text-green-500" />
              <Text size="sm" fw={500}>Requests</Text>
            </div>
            <Badge size="sm" color="yellow">
              {pendingRequests} pending
            </Badge>
          </div>
          <Text size="lg" fw={700} className="mb-1">
            {totalRequests}
          </Text>
          <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
            Total mentorship requests
          </Text>
        </Card>

        {/* Acceptance Rate */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconStar size={20} className="text-yellow-500" />
              <Text size="sm" fw={500}>Acceptance Rate</Text>
            </div>
            <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
              {acceptedRequests}/{totalRequests}
            </Text>
          </div>
          <Text size="lg" fw={700} className="mb-1">
            {acceptanceRate.toFixed(0)}%
          </Text>
          <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
            Requests accepted
          </Text>
        </Card>

        {/* Weekly Sessions */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`}>
          <div className="flex items-center gap-2 mb-3">
            <IconCalendar size={20} className="text-purple-500" />
            <Text size="sm" fw={500}>This Week</Text>
          </div>
          <Text size="lg" fw={700} className="mb-1">
            {weeklyStats.sessionsThisWeek}
          </Text>
          <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
            Sessions completed
          </Text>
        </Card>

        {/* Weekly Hours */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`}>
          <div className="flex items-center gap-2 mb-3">
            <IconClock size={20} className="text-orange-500" />
            <Text size="sm" fw={500}>Time Invested</Text>
          </div>
          <Text size="lg" fw={700} className="mb-1">
            {weeklyStats.hoursThisWeek}h
          </Text>
          <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
            This week
          </Text>
        </Card>

        {/* Response Time */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`}>
          <div className="flex items-center gap-2 mb-3">
            <IconMessageCircle size={20} className="text-cyan-500" />
            <Text size="sm" fw={500}>Response Time</Text>
          </div>
          <Text size="lg" fw={700} className="mb-1">
            {weeklyStats.responseTime}
          </Text>
          <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
            Average response
          </Text>
        </Card>
      </SimpleGrid>

      {/* Performance Insights */}
      <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`}>
        <Text size="lg" fw={600} mb="md">Performance Insights</Text>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Text size="sm" fw={500}>Mentee Satisfaction</Text>
              <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                Based on feedback ratings
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <IconStar size={16} className="text-yellow-500" />
              <Text size="lg" fw={700}>{weeklyStats.satisfactionScore}</Text>
              <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>/5.0</Text>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Text size="sm" fw={500}>Profile Completion</Text>
              <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                Complete your profile for better visibility
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={85} size="sm" className="w-24" />
              <Text size="sm" fw={600}>85%</Text>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Text size="sm" fw={500}>Availability Status</Text>
              <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                Current mentoring availability
              </Text>
            </div>
            <Badge color={mentor.isAvailable ? 'green' : 'red'} variant="light">
              {mentor.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MentorAnalytics;