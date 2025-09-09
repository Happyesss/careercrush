"use client";

import { useState } from 'react';
import { Container, Card, Title, Text, Badge, Button, Stack, Group } from '@mantine/core';
import { IconPackage, IconChartBar, IconCalendarTime, IconUsers, IconTrendingUp, IconMenu2, IconX } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../ThemeContext';
import MentorPackageDashboard from '../MentorshipPackages/Mentor/MentorPackageDashboard';
import MentorAnalyticsComponent from '../MentorAnalytics/MentorAnalyticsComponent';
import MentorAvailabilityManager from '../MentorProfile/MentorAvailabilityManager';

const MentorshipDashboardPage = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const searchParams = useSearchParams();
  const defaultTab = searchParams?.get('tab') || 'packages';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (user.accountType !== 'MENTOR') {
    return (
      <Container size="lg" py="xl">
        <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border text-center p-8`}>
          <Title order={3} mb="md">Access Denied</Title>
          <Text>This dashboard is only available for mentors.</Text>
        </Card>
      </Container>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950' : 'bg-gray-50'}`}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

  <div className="flex">
        {/* Left Navigation Sidebar */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 
          fixed lg:static 
          w-64 min-h-screen 
          ${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} 
          border-r ${isDarkMode ? 'border-cape-cod-800' : 'border-gray-200'} 
          shadow-sm lg:shadow-none
          transition-transform duration-300 ease-in-out
          z-40
        `}>
          <div className="p-6 pt-16 lg:pt-6">
            <Stack gap="md">
              {/* Packages Navigation Item */}
              <Button
                variant={activeTab === 'packages' ? 'filled' : 'subtle'}
                justify="flex-start"
                leftSection={<IconPackage size={18} />}
                fullWidth
                onClick={() => {
                  setActiveTab('packages');
                  setIsMobileMenuOpen(false);
                }}
                className={`h-12 transition-all duration-200 ${
                  activeTab === 'packages' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : `${isDarkMode ? 'hover:bg-cape-cod-800' : 'hover:bg-gray-100'}`
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">Packages</span>
                  <Badge 
                    size="sm" 
                    variant={activeTab === 'packages' ? 'outline' : 'light'} 
                    color={activeTab === 'packages' ? 'white' : 'blue'}
                    className={activeTab === 'packages' ? 'border-white text-white' : ''}
                  >
                    Active
                  </Badge>
                </div>
              </Button>

              {/* Analytics Navigation Item */}
              <Button
                variant={activeTab === 'analytics' ? 'filled' : 'subtle'}
                justify="flex-start"
                leftSection={<IconChartBar size={18} />}
                fullWidth
                onClick={() => {
                  setActiveTab('analytics');
                  setIsMobileMenuOpen(false);
                }}
                className={`h-12 transition-all duration-200 ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : `${isDarkMode ? 'hover:bg-cape-cod-800' : 'hover:bg-gray-100'}`
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">Analytics</span>
                  <Badge 
                    size="sm" 
                    variant={activeTab === 'analytics' ? 'outline' : 'light'} 
                    color={activeTab === 'analytics' ? 'white' : 'green'}
                    className={activeTab === 'analytics' ? 'border-white text-white' : ''}
                  >
                    Insights
                  </Badge>
                </div>
              </Button>

              {/* Sessions Navigation Item */}
              <Button
                variant={activeTab === 'sessions' ? 'filled' : 'subtle'}
                justify="flex-start"
                leftSection={<IconCalendarTime size={18} />}
                fullWidth
                onClick={() => {
                  setActiveTab('sessions');
                  setIsMobileMenuOpen(false);
                }}
                className={`h-12 transition-all duration-200 ${
                  activeTab === 'sessions' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : `${isDarkMode ? 'hover:bg-cape-cod-800' : 'hover:bg-gray-100'}`
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">Trial Sessions</span>
                  <Badge 
                    size="sm" 
                    variant={activeTab === 'sessions' ? 'outline' : 'light'} 
                    color={activeTab === 'sessions' ? 'white' : 'orange'}
                    className={activeTab === 'sessions' ? 'border-white text-white' : ''}
                  >
                    Manage
                  </Badge>
                </div>
              </Button>
            </Stack>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto lg:ml-0">
          <Container size="xl" py="xl" className="max-w-none px-4 lg:px-8">
            {/* Mobile Menu Button (small screens) - placed above the dashboard title */}
            <div className="lg:hidden mb-4">
              <Button
                variant="filled"
                color="blue"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="shadow-lg"
              >
                {isMobileMenuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
              </Button>
            </div>
            {/* Packages Content */}
            {activeTab === 'packages' && (
              <MentorPackageDashboard mentorId={Number(user.id)} />
            )}

            {/* Analytics Content */}
            {activeTab === 'analytics' && (
              <MentorAnalyticsComponent />
            )}

            {/* Sessions Content */}
            {activeTab === 'sessions' && (
              <div>
                <div className="mb-6">
                  <Title order={2} className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    Trial Session Management
                  </Title>
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt="sm">
                    Create and manage your trial session availability. Set up multiple time slots, edit existing sessions, and use templates for recurring availability.
                  </Text>
                </div>
                <MentorAvailabilityManager mentorId={Number(user.id)} />
              </div>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default MentorshipDashboardPage;