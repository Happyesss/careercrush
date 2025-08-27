"use client";

import { useEffect } from 'react';
import MentorPackageDashboard from '../../../components/MentorshipPackages/Mentor/MentorPackageDashboard';
import { Container, Title, Text, Stack } from '@mantine/core';
import { useTheme } from '../../../ThemeContext';

const MentorPackagesPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    document.title = 'Manage Packages - CareerCrush';
  }, []);

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-cape-cod-950 text-gray-200' : 'bg-gray-50 text-gray-900'}`}>
      <Container size="xl">
        <Stack gap="xl">
          {/* Page Header */}
          <div className="text-center">
            <Title order={1} mb="md">Mentorship Package Management</Title>
            <Text size="lg" c="dimmed" maw={600} mx="auto">
              Create, manage, and track your mentorship packages. 
              Set up structured learning paths for your mentees.
            </Text>
          </div>

          {/* Dashboard Component */}
          <MentorPackageDashboard mentorId={1} />
        </Stack>
      </Container>
    </div>
  );
};

export default MentorPackagesPage;