"use client";

import { Button, Card, Text, Title, Stack, Group, Badge, ActionIcon } from "@mantine/core";
import { 
  IconChartBar, 
  IconPackage, 
  IconCalendarTime, 
  IconExternalLink, 
  IconTrendingUp,
  IconUsers,
  IconStar
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../ThemeContext";
import { useSelector } from "react-redux";

const MentorshipDashboardRedirect = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  const handleRedirectToDashboard = () => {
    router.push('/mentorship-dashboard');
  };

  if (user.accountType !== 'MENTOR') {
    return null;
  }

  return (
    <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`} p="lg">
      <div className="text-center">
        {/* Icon and Header */}
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <IconTrendingUp size={32} className="text-blue-500" />
          </div>
        </div>
        
        <Title order={3} className={`${isDarkMode ? 'text-white' : 'text-black'} mb-2`}>
          Mentorship Dashboard
        </Title>
        
        <Text size="sm" className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} mb-6`}>
          Manage your mentorship packages, view analytics, and track your mentoring performance
        </Text>

        {/* Quick Stats Preview */}
        <Stack gap="sm" className="mb-6">
          <Group justify="space-between" className={`p-3 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
            <Group gap="xs">
              <IconPackage size={16} className="text-blue-500" />
              <Text size="xs" fw={500}>Active Packages</Text>
            </Group>
            <Badge size="sm" variant="light" color="blue">3</Badge>
          </Group>

          <Group justify="space-between" className={`p-3 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
            <Group gap="xs">
              <IconUsers size={16} className="text-green-500" />
              <Text size="xs" fw={500}>Active Mentees</Text>
            </Group>
            <Badge size="sm" variant="light" color="green">8</Badge>
          </Group>

          <Group justify="space-between" className={`p-3 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
            <Group gap="xs">
              <IconStar size={16} className="text-yellow-500" />
              <Text size="xs" fw={500}>Rating</Text>
            </Group>
            <Badge size="sm" variant="light" color="yellow">4.8/5</Badge>
          </Group>
        </Stack>

        {/* Action Buttons */}
        <Stack gap="sm">
          <Button 
            onClick={handleRedirectToDashboard}
            leftSection={<IconExternalLink size={16} />}
            size="md"
            variant="filled"
            color="blue"
            fullWidth
          >
            Open Dashboard
          </Button>

          <Group grow gap="xs">
            <Button 
              onClick={() => router.push('/mentorship-dashboard?tab=packages')}
              leftSection={<IconPackage size={14} />}
              size="xs"
              variant="light"
              color="blue"
            >
              Packages
            </Button>
            
            <Button 
              onClick={() => router.push('/mentorship-dashboard?tab=analytics')}
              leftSection={<IconChartBar size={14} />}
              size="xs"
              variant="light"
              color="green"
            >
              Analytics
            </Button>
          </Group>
        </Stack>

        {/* Quick Access Menu */}
        <Text size="xs" className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'} mt-4`}>
          Access all your mentorship tools and insights in one place
        </Text>
      </div>
    </Card>
  );
};

export default MentorshipDashboardRedirect;