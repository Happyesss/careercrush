"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '../../../ThemeContext';
import { MentorshipPackage, PackageStats, TrialSessionStats } from '../../../types/mentorshipPackages';
import { packageService, statsService } from '../../../Services/MentorshipPackageService';
import CreatePackageWizard from './CreatePackageWizard';
import PackageCard from './PackageCard';
import PackageStatsCard from './PackageStatsCard';
import TrialSessionManager from './TrialSessionManager';
import { Button, Card, Container, Group, Stack, Text, Title, Tabs, Badge, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconPackage, IconCalendarTime, IconChartBar, IconDots, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface MentorPackageDashboardProps {
  mentorId: number;
}

const MentorPackageDashboard: React.FC<MentorPackageDashboardProps> = ({ mentorId }) => {
  const { isDarkMode } = useTheme();
  const [packages, setPackages] = useState<MentorshipPackage[]>([]);
  const [packageStats, setPackageStats] = useState<PackageStats | null>(null);
  const [trialStats, setTrialStats] = useState<TrialSessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MentorshipPackage | null>(null);
  const [activeTab, setActiveTab] = useState('packages');

  useEffect(() => {
    fetchData();
  }, [mentorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [packagesData, packageStatsData, trialStatsData] = await Promise.all([
        packageService.getPackagesByMentor(mentorId),
        statsService.getPackageStats(mentorId),
        statsService.getTrialSessionStats(mentorId),
      ]);
      
      setPackages(packagesData);
      setPackageStats(packageStatsData);
      setTrialStats(trialStatsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load dashboard data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (packageData: any) => {
    try {
      await packageService.createPackage({
        ...packageData,
        mentorId,
      });
      notifications.show({
        title: 'Success',
        message: 'Package created successfully',
        color: 'green',
      });
      setCreateModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating package:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create package',
        color: 'red',
      });
    }
  };

  const handleTogglePackageStatus = async (packageId: number) => {
    try {
      await packageService.togglePackageStatus(packageId);
      notifications.show({
        title: 'Success',
        message: 'Package status updated',
        color: 'green',
      });
      fetchData();
    } catch (error) {
      console.error('Error updating package status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update package status',
        color: 'red',
      });
    }
  };

  const handleDeletePackage = async (packageId: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await packageService.deletePackage(packageId);
        notifications.show({
          title: 'Success',
          message: 'Package deleted successfully',
          color: 'green',
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting package:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to delete package',
          color: 'red',
        });
      }
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color }: any) => (
    <Card p="md" radius="md" withBorder>
      <Group justify="space-between">
        <div>
          <Text size="sm" c="dimmed" fw={500}>
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed">
              {subtitle}
            </Text>
          )}
        </div>
        <ActionIcon variant="light" color={color} size={38} radius="md">
          {icon}
        </ActionIcon>
      </Group>
    </Card>
  );

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md">
          <Text>Loading dashboard...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={1}>Mentorship Dashboard</Title>
            <Text size="lg" c="dimmed">
              Manage your mentorship packages and trial sessions
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateModalOpen(true)}
            size="md"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Create New Package
          </Button>
        </Group>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Packages"
            value={packageStats?.totalPackages || 0}
            subtitle={`${packageStats?.activePackages || 0} active`}
            icon={<IconPackage size={20} />}
            color="blue"
          />
          <StatCard
            title="Total Sessions"
            value={packageStats?.totalSessions || 0}
            subtitle="Across all packages"
            icon={<IconCalendarTime size={20} />}
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={packageStats ? `₹${packageStats.totalRevenue.toLocaleString()}` : '₹0'}
            subtitle={`Avg: ₹${Math.round(packageStats?.averagePrice || 0).toLocaleString()}`}
            icon={<IconChartBar size={20} />}
            color="yellow"
          />
          <StatCard
            title="Trial Conversion"
            value={`${Math.round(trialStats?.conversionRate || 0)}%`}
            subtitle={`${trialStats?.completedSessions || 0} completed`}
            icon={<IconCalendarTime size={20} />}
            color="violet"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'packages')}>
          <Tabs.List>
            <Tabs.Tab value="packages" leftSection={<IconPackage size={16} />}>
              Packages ({packages.length})
            </Tabs.Tab>
            <Tabs.Tab value="trials" leftSection={<IconCalendarTime size={16} />}>
              Trial Sessions
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="packages" pt="md">
            {packages.length === 0 ? (
              <Card p="xl" radius="md" withBorder>
                <Stack align="center" gap="md">
                  <IconPackage size={48} color="gray" />
                  <div style={{ textAlign: 'center' }}>
                    <Title order={3}>No packages yet</Title>
                    <Text c="dimmed" mb="md">
                      Create your first mentorship package to get started
                    </Text>
                    <Button onClick={() => setCreateModalOpen(true)}>
                      Create Your First Package
                    </Button>
                  </div>
                </Stack>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    package={pkg}
                    onEdit={(id: number) => {
                      const packageToEdit = packages.find(p => p.id === id);
                      setSelectedPackage(packageToEdit || null);
                      setCreateModalOpen(true);
                    }}
                    onToggleStatus={() => pkg.id && handleTogglePackageStatus(pkg.id)}
                    onDelete={(id: number) => handleDeletePackage(id)}
                    showMentorActions={true}
                  />
                ))}
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="trials" pt="md">
            <TrialSessionManager mentorId={mentorId} />
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PackageStatsCard stats={packageStats} />
              <Card p="md" radius="md" withBorder>
                <Title order={4} mb="md">Trial Session Performance</Title>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text>Total Sessions</Text>
                    <Badge color="blue">{trialStats?.totalSessions || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Available</Text>
                    <Badge color="green">{trialStats?.availableSessions || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Booked</Text>
                    <Badge color="yellow">{trialStats?.bookedSessions || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Completed</Text>
                    <Badge color="violet">{trialStats?.completedSessions || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Conversion Rate</Text>
                    <Badge color="indigo">{Math.round(trialStats?.conversionRate || 0)}%</Badge>
                  </Group>
                </Stack>
              </Card>
            </div>
          </Tabs.Panel>
        </Tabs>

        {/* Create/Edit Package Modal */}
        <CreatePackageWizard
          opened={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false);
            setSelectedPackage(null);
          }}
          onSubmit={handleCreatePackage}
          initialData={selectedPackage}
          mentorId={mentorId}
        />
      </Stack>
    </Container>
  );
};

export default MentorPackageDashboard;