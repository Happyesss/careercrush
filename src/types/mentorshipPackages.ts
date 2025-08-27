// TypeScript interfaces for Mentorship Packages System

export interface PackageModule {
  id?: number;
  monthNumber: number;
  moduleNumber: number;
  moduleTitle: string;
  moduleName: string;
  moduleDescription: string;
  description: string;
  sessionsInMonth: number;
  sessionsCount: number;
  durationWeeks: number;
  topicsInMonth: string[];
  learningObjectives: string[];
  deliverables: string[];
}

export interface MentorshipPackage {
  id?: number;
  mentorId: number;
  mentorName?: string;
  packageName: string;
  description: string;
  durationMonths: number;
  totalSessions: number;
  sessionsPerMonth: number;
  pricePerMonth: number;
  totalPrice: number;
  topicsCovered: string[];
  modules: PackageModule[];
  isActive: boolean;
  isFreeTrialIncluded: boolean;
  sessionType: string;
  sessionDurationMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum TrialSessionStatus {
  AVAILABLE = 'AVAILABLE',
  SCHEDULED = 'SCHEDULED',
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface TrialSession {
  id?: number;
  mentorId: number;
  menteeId?: number;
  packageId?: number;
  scheduledDateTime: Date;
  durationMinutes: number;
  status: TrialSessionStatus;
  sessionType: 'video' | 'audio' | 'chat';
  meetingLink?: string;
  notes?: string;
  menteeEmail?: string;
  menteeName?: string;
  menteePhone?: string;
  menteeMessage?: string;
  availableTimeSlots?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageFilters {
  durationMonths?: number;
  minPrice?: number;
  maxPrice?: number;
  sessionType?: string;
  isFreeTrialIncluded?: boolean;
  mentorId?: number;
  searchQuery?: string;
  topicsCovered?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'duration_asc' | 'duration_desc' | 'sessions_asc' | 'sessions_desc' | 'created_desc' | 'created_asc';
  minSessions?: number;
  maxSessions?: number;
  packageStatus?: 'active' | 'popular' | 'new';
  mentorLevel?: 'junior' | 'mid' | 'senior' | 'expert';
  companyType?: 'startup' | 'bigtech' | 'enterprise' | 'consulting' | 'freelance';
}

export interface TrialBookingRequest {
  sessionId: number;
  menteeEmail: string;
  menteeName: string;
  menteePhone?: string;
}

export interface CreatePackageRequest {
  mentorId: number;
  packageName: string;
  description: string;
  durationMonths: number;
  totalSessions: number;
  sessionsPerMonth: number;
  pricePerMonth: number;
  totalPrice: number;
  topicsCovered: string[];
  modules: PackageModule[];
  isActive?: boolean;
  isFreeTrialIncluded?: boolean;
  sessionType: string;
  sessionDurationMinutes: number;
}

export interface CreateTrialSlotRequest {
  mentorId: number;
  packageId?: number;
  scheduledDateTime: string;
  durationMinutes: number;
  sessionType: string;
}

export interface PackageStats {
  totalPackages: number;
  activePackages: number;
  totalSessions: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface TrialSessionStats {
  totalSessions: number;
  availableSessions: number;
  bookedSessions: number;
  completedSessions: number;
  conversionRate: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form state types
export interface PackageFormData {
  packageName: string;
  description: string;
  durationMonths: number;
  sessionsPerMonth: number;
  pricePerMonth: number;
  topicsCovered: string[];
  sessionType: string;
  sessionDurationMinutes: number;
  isFreeTrialIncluded: boolean;
  modules: PackageModule[];
}

export interface TrialBookingFormData {
  menteeEmail: string;
  menteeName: string;
  menteePhone: string;
  selectedSessionId: number | null;
}

// UI State types
export interface PackageListState {
  packages: MentorshipPackage[];
  loading: boolean;
  error: string | null;
  filters: PackageFilters;
  selectedPackage: MentorshipPackage | null;
}

export interface TrialSessionState {
  sessions: TrialSession[];
  loading: boolean;
  error: string | null;
  selectedSession: TrialSession | null;
  bookingModalOpen: boolean;
}

// Component Props types
export interface PackageCardProps {
  package: MentorshipPackage;
  onView: (packageId: number) => void;
  onBookTrial?: (packageId: number) => void;
  onEdit?: (packageId: number) => void;
  onDelete?: (packageId: number) => void;
  showBookingActions?: boolean;
  showMentorActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export interface TrialSessionCardProps {
  session: TrialSession;
  onBook?: (sessionId: number) => void;
  onEdit?: (sessionId: number) => void;
  onCancel?: (sessionId: number) => void;
  showActions?: boolean;
  variant?: 'available' | 'booked' | 'completed';
}

export interface PackageFilterProps {
  filters: PackageFilters;
  onFiltersChange: (filters: PackageFilters) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export interface TrialCalendarProps {
  mentorId: number;
  onSlotSelect: (dateTime: string) => void;
  selectedSlots: string[];
  availableSessions: TrialSession[];
  loading?: boolean;
}