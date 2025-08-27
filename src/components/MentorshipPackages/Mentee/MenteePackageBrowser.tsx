"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '../../../ThemeContext';
import { MentorshipPackage, PackageFilters } from '../../../types/mentorshipPackages';
import { packageService } from '../../../Services/MentorshipPackageService';
import PackageCard from '../Mentor/PackageCard';
import PackageFiltersComponent from './PackageFilters';
import PackageDetailsModal from './PackageDetailsModal';
import TrialBookingModal from './TrialBookingModal';
import { Container, Group, Text, Title, Stack, Button, Grid, Badge, Card, Skeleton } from '@mantine/core';
import { IconSearch, IconFilter, IconPackage } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const MenteePackageBrowser: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [packages, setPackages] = useState<MentorshipPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<MentorshipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MentorshipPackage | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PackageFilters>({
    durationMonths: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sessionType: undefined,
    isFreeTrialIncluded: undefined,
    searchQuery: '',
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [packages, filters, searchQuery]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getAllActivePackages();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load mentorship packages',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...packages];

    // Text search
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(pkg =>
        pkg.packageName.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query) ||
        pkg.topicsCovered.some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Duration filter
    if (filters.durationMonths) {
      filtered = filtered.filter(pkg => pkg.durationMonths === filters.durationMonths);
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(pkg => pkg.totalPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(pkg => pkg.totalPrice <= filters.maxPrice!);
    }

    // Session type filter
    if (filters.sessionType) {
      filtered = filtered.filter(pkg => pkg.sessionType === filters.sessionType);
    }

    // Free trial filter
    if (filters.isFreeTrialIncluded !== undefined) {
      filtered = filtered.filter(pkg => pkg.isFreeTrialIncluded === filters.isFreeTrialIncluded);
    }

    setFilteredPackages(filtered);
  };

  const handleViewDetails = (packageId: number) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setDetailsModalOpen(true);
    }
  };

  const handleBookTrial = (packageId: number) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setTrialModalOpen(true);
    }
  };

  const clearFilters = () => {
    setFilters({
      durationMonths: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sessionType: undefined,
      isFreeTrialIncluded: undefined,
      searchQuery: '',
    });
    setSearchQuery('');
  };

  const PackageSkeletons = () => (
    <Grid>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid.Col key={item} span={{ base: 12, md: 6, lg: 4 }}>
          <Card p="lg" radius="md" withBorder>
            <Skeleton height={20} mb="md" />
            <Skeleton height={60} mb="md" />
            <Skeleton height={40} mb="md" />
            <Skeleton height={30} />
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-cape-cod-950 text-gray-200' : 'bg-gray-50 text-gray-900'}`}>
      <Container size="xl">
        <Stack gap="xl">
          {/* Header */}
          <div className="text-center">
            <Title order={1} mb="md">Explore Mentorship Packages</Title>
            <Text size="lg" c="dimmed" maw={600} mx="auto">
              Find the perfect mentorship program to accelerate your career growth. 
              Choose from various durations, topics, and price ranges.
            </Text>
          </div>

          {/* Filters and Search */}
          <Card p="md" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Group>
                <Button
                  variant={showFilters ? 'filled' : 'light'}
                  leftSection={<IconFilter size={16} />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
                {(Object.values(filters).some(v => v !== undefined && v !== '') || searchQuery) && (
                  <Button variant="subtle" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </Group>
              
              <Group>
                <Badge variant="light" size="lg">
                  {filteredPackages.length} packages found
                </Badge>
              </Group>
            </Group>

            {showFilters && (
              <PackageFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                packages={packages}
              />
            )}
          </Card>

          {/* Quick Filter Chips */}
          <Group>
            <Text size="sm" fw={500}>Quick Filters:</Text>
            <Button
              variant={filters.durationMonths === 1 ? 'filled' : 'light'}
              size="sm"
              onClick={() => setFilters({ ...filters, durationMonths: filters.durationMonths === 1 ? undefined : 1 })}
            >
              1 Month
            </Button>
            <Button
              variant={filters.durationMonths === 3 ? 'filled' : 'light'}
              size="sm"
              onClick={() => setFilters({ ...filters, durationMonths: filters.durationMonths === 3 ? undefined : 3 })}
            >
              3 Months
            </Button>
            <Button
              variant={filters.durationMonths === 6 ? 'filled' : 'light'}
              size="sm"
              onClick={() => setFilters({ ...filters, durationMonths: filters.durationMonths === 6 ? undefined : 6 })}
            >
              6 Months
            </Button>
            <Button
              variant={filters.isFreeTrialIncluded === true ? 'filled' : 'light'}
              size="sm"
              onClick={() => setFilters({ 
                ...filters, 
                isFreeTrialIncluded: filters.isFreeTrialIncluded === true ? undefined : true 
              })}
            >
              Free Trial
            </Button>
          </Group>

          {/* Packages Grid */}
          {loading ? (
            <PackageSkeletons />
          ) : filteredPackages.length === 0 ? (
            <Card p="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <IconPackage size={64} color="gray" />
                <div style={{ textAlign: 'center' }}>
                  <Title order={3}>No packages found</Title>
                  <Text c="dimmed" mb="md">
                    {packages.length === 0 
                      ? 'No mentorship packages are currently available'
                      : 'Try adjusting your filters to see more results'
                    }
                  </Text>
                  {(Object.values(filters).some(v => v !== undefined && v !== '') || searchQuery) && (
                    <Button onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </Stack>
            </Card>
          ) : (
            <Grid>
              {filteredPackages.map((pkg) => (
                <Grid.Col key={pkg.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <PackageCard
                    package={pkg}
                    onView={handleViewDetails}
                    onBookTrial={handleBookTrial}
                    showBookingActions={true}
                    variant="detailed"
                  />
                </Grid.Col>
              ))}
            </Grid>
          )}

          {/* Load More */}
          {filteredPackages.length > 0 && filteredPackages.length >= 12 && (
            <Group justify="center">
              <Button variant="outline" size="lg">
                Load More Packages
              </Button>
            </Group>
          )}
        </Stack>

        {/* Modals */}
        {selectedPackage && (
          <>
            <PackageDetailsModal
              package={selectedPackage}
              opened={detailsModalOpen}
              onClose={() => {
                setDetailsModalOpen(false);
                setSelectedPackage(null);
              }}
              onBookTrial={() => {
                setDetailsModalOpen(false);
                setTrialModalOpen(true);
              }}
            />

            <TrialBookingModal
              package={selectedPackage}
              opened={trialModalOpen}
              onClose={() => {
                setTrialModalOpen(false);
                setSelectedPackage(null);
              }}
              onBookingSuccess={() => {
                setTrialModalOpen(false);
                setSelectedPackage(null);
                notifications.show({
                  title: 'Success!',
                  message: 'Your trial session has been booked successfully',
                  color: 'green',
                });
              }}
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default MenteePackageBrowser;