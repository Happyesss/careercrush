"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '../../../ThemeContext';
import { MentorshipPackage, PackageStats } from '../../../types/mentorshipPackages';
import { packageService, statsService } from '../../../Services/MentorshipPackageService';
import CreatePackageWizard from './CreatePackageWizard';
import PackageCard from './PackageCard';
import HorizontalPackageCard from './HorizontalPackageCard';
import PackageStatsCard from './PackageStatsCard';
import { Button, Card, Container, Group, Stack, Text, Title, Tabs, Badge, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconPackage, IconChartBar, IconDots, IconEdit, IconTrash, IconEye, IconUsers, IconTrendingUp } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface MentorPackageDashboardProps {
  mentorId: number;
}

const MentorPackageDashboard: React.FC<MentorPackageDashboardProps> = ({ mentorId }) => {
  const { isDarkMode } = useTheme();
  const [packages, setPackages] = useState<MentorshipPackage[]>([]);
  const [packageStats, setPackageStats] = useState<PackageStats | null>(null);
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
      const [packagesData, packageStatsData] = await Promise.all([
        packageService.getPackagesByMentor(mentorId),
        statsService.getPackageStats(mentorId)
      ]);
      
      setPackages(packagesData);
      setPackageStats(packageStatsData);
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

  const handleCreateOrUpdatePackage = async (packageData: any) => {
    try {
      if (packageData.id) {
        // Update flow
        await packageService.updatePackage({
          ...packageData,
          mentorId,
        });
        notifications.show({
          title: 'Success',
          message: 'Package updated successfully',
          color: 'green',
        });
      } else {
        // Create flow
        await packageService.createPackage({
          ...packageData,
          mentorId,
        });
        notifications.show({
          title: 'Success',
          message: 'Package created successfully',
          color: 'green',
        });
      }
      setCreateModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving package:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save package',
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
            icon={<IconUsers size={20} />}
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
            title="Average Price"
            value={packageStats ? `₹${Math.round(packageStats.averagePrice || 0).toLocaleString()}` : '₹0'}
            subtitle="Per package"
            icon={<IconTrendingUp size={20} />}
            color="violet"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'packages')}>
          <Tabs.List>
            <Tabs.Tab value="packages" leftSection={<IconPackage size={16} />}>
              Packages ({packages.length})
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
              <Stack gap="xl">
                {packages.map((pkg) => (
                  <HorizontalPackageCard
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
              </Stack>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PackageStatsCard stats={packageStats} />
              <Card p="md" radius="md" withBorder>
                <Title order={4} mb="md">Package Performance</Title>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text>Total Packages</Text>
                    <Badge color="blue">{packageStats?.totalPackages || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Active Packages</Text>
                    <Badge color="green">{packageStats?.activePackages || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Average Price</Text>
                    <Badge color="purple">${Math.round(packageStats?.averagePrice || 0)}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Total Revenue</Text>
                    <Badge color="orange">${Math.round(packageStats?.totalRevenue || 0)}</Badge>
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
          onSubmit={handleCreateOrUpdatePackage}
          initialData={selectedPackage}
          mentorId={mentorId}
        />
      </Stack>
    </Container>
  );
};

export default MentorPackageDashboard;