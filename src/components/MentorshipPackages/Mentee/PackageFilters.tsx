"use client";

import { useState } from 'react';
import { PackageFilters, MentorshipPackage } from '../../../types/mentorshipPackages';
import { 
  Group, 
  Stack, 
  TextInput, 
  Select, 
  NumberInput, 
  Switch, 
  Card, 
  Text,
  Collapse,
  Chip,
  Button,
  RangeSlider,
  MultiSelect
} from '@mantine/core';
import { IconSearch, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface PackageFiltersProps {
  filters: PackageFilters;
  onFiltersChange: (filters: PackageFilters) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  packages: MentorshipPackage[];
}

const PackageFiltersComponent: React.FC<PackageFiltersProps> = ({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  packages
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  // Extract unique topics from packages
  const allTopics = Array.from(
    new Set(packages.flatMap(pkg => pkg.topicsCovered))
  ).map(topic => ({ value: topic, label: topic }));

  // Get price range from packages
  const minPrice = Math.min(...packages.map(p => p.totalPrice), 0);
  const maxPrice = Math.max(...packages.map(p => p.totalPrice), 100000);

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    onFiltersChange({
      ...filters,
      minPrice: range[0] === minPrice ? undefined : range[0],
      maxPrice: range[1] === maxPrice ? undefined : range[1],
    });
  };

  const resetPriceRange = () => {
    setPriceRange([minPrice, maxPrice]);
    onFiltersChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <Card p="md" radius="md" withBorder>
      <Stack gap="md">
        {/* Search */}
        <TextInput
          placeholder="Search packages, topics, or descriptions..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="md"
        />

        {/* Basic Filters */}
        <Group grow>
          <Select
            placeholder="Duration"
            value={filters.durationMonths?.toString() || ''}
            onChange={(value) => 
              onFiltersChange({
                ...filters,
                durationMonths: value ? parseInt(value) : undefined
              })
            }
            data={[
              { value: '1', label: '1 Month' },
              { value: '3', label: '3 Months' },
              { value: '6', label: '6 Months' },
              { value: '12', label: '12 Months' },
            ]}
            clearable
          />

          <Select
            placeholder="Session Type"
            value={filters.sessionType || ''}
            onChange={(value) => 
              onFiltersChange({
                ...filters,
                sessionType: (value as 'individual' | 'group') || undefined
              })
            }
            data={[
              { value: 'individual', label: 'Individual Sessions' },
              { value: 'group', label: 'Group Sessions' },
            ]}
            clearable
          />
        </Group>

        {/* Price Range */}
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </Text>
            <Button variant="subtle" size="xs" onClick={resetPriceRange}>
              Reset
            </Button>
          </Group>
          <RangeSlider
            min={minPrice}
            max={maxPrice}
            step={1000}
            value={priceRange}
            onChange={handlePriceRangeChange}
            marks={[
              { value: minPrice, label: `₹${(minPrice/1000)}k` },
              { value: maxPrice/2, label: `₹${(maxPrice/2000)}k` },
              { value: maxPrice, label: `₹${(maxPrice/1000)}k` },
            ]}
          />
        </div>

        {/* Free Trial Toggle */}
        <Switch
          label="Has Free Trial"
          checked={filters.isFreeTrialIncluded === true}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              isFreeTrialIncluded: event.currentTarget.checked ? true : undefined
            })
          }
        />

        {/* Advanced Filters Toggle */}
        <Button
          variant="subtle"
          leftSection={showAdvanced ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </Button>

        {/* Advanced Filters */}
        <Collapse in={showAdvanced}>
          <Stack gap="md">
            {/* Topics Filter */}
            <MultiSelect
              label="Topics Covered"
              placeholder="Select topics you're interested in"
              data={allTopics}
              value={filters.topicsCovered || []}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  topicsCovered: value.length > 0 ? value : undefined
                })
              }
              searchable
              clearable
              maxValues={5}
            />

            {/* Sort Options */}
            <Select
              label="Sort By"
              placeholder="Choose sorting option"
              value={filters.sortBy || ''}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sortBy: value as any || undefined
                })
              }
              data={[
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'duration_asc', label: 'Duration: Short to Long' },
                { value: 'duration_desc', label: 'Duration: Long to Short' },
                { value: 'sessions_asc', label: 'Sessions: Few to Many' },
                { value: 'sessions_desc', label: 'Sessions: Many to Few' },
                { value: 'created_desc', label: 'Newest First' },
                { value: 'created_asc', label: 'Oldest First' },
              ]}
              clearable
            />

            {/* Session Count Range */}
            <Group grow>
              <NumberInput
                label="Min Sessions"
                placeholder="0"
                min={0}
                value={filters.minSessions || ''}
                onChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    minSessions: typeof value === 'number' ? value : undefined
                  })
                }
              />
              <NumberInput
                label="Max Sessions"
                placeholder="100"
                min={0}
                value={filters.maxSessions || ''}
                onChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    maxSessions: typeof value === 'number' ? value : undefined
                  })
                }
              />
            </Group>

            {/* Package Status */}
            <Select
              label="Package Status"
              placeholder="All packages"
              value={filters.packageStatus || ''}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  packageStatus: value as any || undefined
                })
              }
              data={[
                { value: 'active', label: 'Active Packages' },
                { value: 'popular', label: 'Popular Packages' },
                { value: 'new', label: 'New Packages' },
              ]}
              clearable
            />

            {/* Mentor Level */}
            <Chip.Group
              value={filters.mentorLevel ? [filters.mentorLevel] : []}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  mentorLevel: value[0] as any || undefined
                })
              }
            >
              <Group>
                <Text size="sm" fw={500}>Mentor Experience Level:</Text>
                <Chip value="junior">Junior (1-3 years)</Chip>
                <Chip value="mid">Mid-level (3-7 years)</Chip>
                <Chip value="senior">Senior (7-12 years)</Chip>
                <Chip value="expert">Expert (12+ years)</Chip>
              </Group>
            </Chip.Group>

            {/* Company Type */}
            <Chip.Group
              value={filters.companyType ? [filters.companyType] : []}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  companyType: value[0] as any || undefined
                })
              }
            >
              <Group>
                <Text size="sm" fw={500}>Mentor Company Type:</Text>
                <Chip value="startup">Startup</Chip>
                <Chip value="bigtech">Big Tech</Chip>
                <Chip value="enterprise">Enterprise</Chip>
                <Chip value="consulting">Consulting</Chip>
                <Chip value="freelance">Freelance</Chip>
              </Group>
            </Chip.Group>
          </Stack>
        </Collapse>

        {/* Active Filters Summary */}
        {(Object.values(filters).some(v => v !== undefined && v !== '') || searchQuery) && (
          <Card p="sm" bg="blue.0" radius="sm">
            <Group gap="xs">
              <Text size="xs" fw={500}>Active filters:</Text>
              {searchQuery && (
                <Chip size="xs" checked={false}>{`Search: "${searchQuery}"`}</Chip>
              )}
              {filters.durationMonths && (
                <Chip size="xs" checked={false}>{filters.durationMonths} months</Chip>
              )}
              {filters.sessionType && (
                <Chip size="xs" checked={false}>{filters.sessionType}</Chip>
              )}
              {filters.isFreeTrialIncluded && (
                <Chip size="xs" checked={false}>Free trial</Chip>
              )}
              {filters.topicsCovered && filters.topicsCovered.length > 0 && (
                <Chip size="xs" checked={false}>
                  {filters.topicsCovered.length} topics
                </Chip>
              )}
            </Group>
          </Card>
        )}
      </Stack>
    </Card>
  );
};

export default PackageFiltersComponent;