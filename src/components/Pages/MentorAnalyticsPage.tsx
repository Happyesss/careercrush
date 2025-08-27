"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Text, Card, Grid, Group, Badge, Progress, Divider } from "@mantine/core";
import { IconArrowLeft, IconUsers, IconClock, IconStar, IconTrendingUp, IconCalendar, IconMessageCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../ThemeContext";
import { getMentorByEmail } from "../../Services/MentorService";
import SocialLink from "../common/SocialLink";

const MentorAnalyticsPage = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const router = useRouter();
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <button 
                onClick={() => router.back()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-cape-cod-800 hover:bg-cape-cod-700' : 'bg-white hover:bg-gray-100'} transition-colors`}
              >
                <IconArrowLeft size={16} />
                Back to Profile
              </button>
            </div>
            
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
            <button 
              onClick={() => router.back()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-cape-cod-800 hover:bg-cape-cod-700' : 'bg-white hover:bg-gray-100'} transition-colors`}
            >
              <IconArrowLeft size={16} />
              Back to Profile
            </button>
            <Text size="xl" fw={700} className="text-xl sm:text-2xl">
              Mentor Analytics Dashboard
            </Text>
          </div>

        {/* Key Metrics */}
        <Grid mb="xl">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
              <Group justify="space-between">
                <div>
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    Active Mentees
                  </Text>
                  <Text size="xl" fw={700}>
                    {analyticsData.totalMentees}/{analyticsData.maxMentees}
                  </Text>
                </div>
                <IconUsers size={24} className="text-blue-500" />
              </Group>
              <Progress 
                value={(analyticsData.totalMentees / analyticsData.maxMentees) * 100} 
                color="blue" 
                size="sm" 
                mt="sm" 
              />
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
              <Group justify="space-between">
                <div>
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    Session Hours
                  </Text>
                  <Text size="xl" fw={700}>
                    {analyticsData.sessionHours}h
                  </Text>
                </div>
                <IconClock size={24} className="text-green-500" />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
              <Group justify="space-between">
                <div>
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    Average Rating
                  </Text>
                  <Text size="xl" fw={700}>
                    {analyticsData.avgRating}/5.0
                  </Text>
                </div>
                <IconStar size={24} className="text-yellow-500" />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
              <Group justify="space-between">
                <div>
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    Monthly Earnings
                  </Text>
                  <Text size="xl" fw={700}>
                    ₹{analyticsData.monthlyEarnings.toLocaleString()}
                  </Text>
                </div>
                <IconTrendingUp size={24} className="text-purple-500" />
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Detailed Analytics */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
              <Text size="lg" fw={600} mb="md">
                Performance Overview
              </Text>
              
              <div className="space-y-4">
                <div>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm">Response Rate</Text>
                    <Text size="sm" fw={600}>{analyticsData.responseRate}%</Text>
                  </Group>
                  <Progress value={analyticsData.responseRate} color="blue" size="lg" />
                </div>

                <div>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm">Session Completion Rate</Text>
                    <Text size="sm" fw={600}>{analyticsData.completionRate}%</Text>
                  </Group>
                  <Progress value={analyticsData.completionRate} color="green" size="lg" />
                </div>

                <div>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm">Capacity Utilization</Text>
                    <Text size="sm" fw={600}>{Math.round((analyticsData.totalMentees / analyticsData.maxMentees) * 100)}%</Text>
                  </Group>
                  <Progress value={(analyticsData.totalMentees / analyticsData.maxMentees) * 100} color="purple" size="lg" />
                </div>
              </div>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md`}>
              <Text size="lg" fw={600} mb="md">
                Recent Activity
              </Text>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <IconMessageCircle size={16} className="text-blue-500" />
                  <div>
                    <Text size="sm" fw={500}>New mentorship request</Text>
                    <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                      2 hours ago
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IconCalendar size={16} className="text-green-500" />
                  <div>
                    <Text size="sm" fw={500}>Session completed</Text>
                    <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                      1 day ago
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IconStar size={16} className="text-yellow-500" />
                  <div>
                    <Text size="sm" fw={500}>Received 5-star rating</Text>
                    <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                      3 days ago
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Mentor Profile Summary */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md mt-6`}>
          <Text size="lg" fw={600} mb="md">
            Profile Summary
          </Text>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" fw={500} mb="xs">Expertise</Text>
              <Text size="sm" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-700'} mb="md">
                {mentor.expertise || "Not specified"}
              </Text>

              <Text size="sm" fw={500} mb="xs">Hourly Rate</Text>
              <Text size="sm" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-700'} mb="md">
                ₹{mentor.hourlyRate || 0}/hour
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" fw={500} mb="xs">Mentorship Areas</Text>
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.mentorshipAreas && mentor.mentorshipAreas.length > 0 ? (
                  mentor.mentorshipAreas.map((area: string, index: number) => (
                    <Badge key={index} variant="light" color="blue" size="sm">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    No areas specified
                  </Text>
                )}
              </div>

              <Text size="sm" fw={500} mb="xs">Availability Status</Text>
              <Badge color={mentor.isAvailable ? "green" : "red"} variant="light">
                {mentor.isAvailable ? "Available" : "Busy"}
              </Badge>

              {/* Social Links */}
              {(mentor.linkedinUrl || mentor.portfolioUrl) && (
                <div className="mt-4">
                  <Text size="sm" fw={500} mb="xs">Connect & Portfolio</Text>
                  <div className="flex flex-wrap gap-2">
                    {mentor.linkedinUrl && (
                      <SocialLink 
                        url={mentor.linkedinUrl} 
                        type="linkedin"
                      />
                    )}
                    {mentor.portfolioUrl && (
                      <SocialLink 
                        url={mentor.portfolioUrl} 
                        type="portfolio"
                      />
                    )}
                  </div>
                </div>
              )}
            </Grid.Col>
          </Grid>
        </Card>

        {/* Experience Section */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md mt-6`}>
          <Text size="lg" fw={600} mb="md">
            Professional Experience
          </Text>
          
          <div className="space-y-4">
            {mentor.experiences && mentor.experiences.length > 0 ? (
              mentor.experiences.map((exp: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'border-cape-cod-700 bg-cape-cod-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{exp.title || exp.position}</h4>
                      <p className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} font-medium`}>
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                        {exp.startDate && exp.endDate 
                          ? `${new Date(exp.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - ${exp.working ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}`
                          : exp.duration || "Duration not specified"
                        }
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className={`mt-2 ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Text className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                  No experience information available
                </Text>
              </div>
            )}
          </div>
        </Card>

        {/* Certifications Section */}
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md mt-6`}>
          <Text size="lg" fw={600} mb="md">
            Certifications
          </Text>
          
          <div className="space-y-4">
            {mentor.certifications && mentor.certifications.length > 0 ? (
              mentor.certifications.map((cert: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'border-cape-cod-700 bg-cape-cod-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{cert.name}</h4>
                      <p className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} font-medium`}>
                        {cert.issuer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                        {cert.issueDate 
                          ? new Date(cert.issueDate).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
                          : 'Issue date not specified'
                        }
                      </p>
                    </div>
                  </div>
                  {cert.certificateID && (
                    <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                      Certificate ID: {cert.certificateID}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Text className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                  No certifications available
                </Text>
              </div>
            )}
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorAnalyticsPage;