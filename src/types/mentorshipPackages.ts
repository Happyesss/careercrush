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
  
  // Package Inclusions (as per Preplaced documentation)
  hasUnlimitedChat?: boolean; // Unlimited chat with mentor
  hasCuratedTasks?: boolean; // Task & Curated Resources
  hasRegularFollowups?: boolean; // Regular follow-ups (accountability)
  hasJobReferrals?: boolean; // Job referrals from mentor community
  hasCertification?: boolean; // Certification of mentorship completion
  hasRescheduling?: boolean; // Reschedule anytime capability
  
  // Discount fields for pricing strategy
  threeMonthDiscount?: number; // Discount percentage for 3-month plan
  sixMonthDiscount?: number; // Discount percentage for 6-month plan
  originalPricePerMonth?: number; // Original price before discounts
  
  createdAt?: string;
  updatedAt?: string;
}

export enum TrialSessionStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED'
}

export interface TrialSession {
  id?: number;
  mentorId: number;
  menteeId?: number;
  packageId?: number;
  scheduledDateTime: Date | string; // Accept both Date and string format
  durationMinutes: number;
  status: TrialSessionStatus;
  sessionType: string; // Changed to string to match backend
  
  // Enhanced scheduling fields
  timeZone?: string;                 // Time zone for the session
  bufferTimeMinutes?: number;        // Buffer time between sessions
  preparationTimeMinutes?: number;   // Preparation time before session
  recurringPattern?: string;         // DAILY, WEEKLY, MONTHLY, CUSTOM
  recurringEndDate?: Date | string;  // When recurring pattern ends
  isRecurring?: boolean;             // Is this part of a recurring series
  parentSessionId?: number;          // Reference to original session if recurring
  availabilityTemplate?: string;     // Template name for reusing patterns
  
  // Session configuration
  sessionTitle?: string;             // Custom title for the session
  sessionDescription?: string;       // Brief description
  allowRescheduling?: boolean;       // Allow mentees to reschedule
  maxReschedulingHours?: number;     // Max hours before session to reschedule
  requireConfirmation?: boolean;     // Require manual confirmation
  specialInstructions?: string;      // Special instructions for mentees
  
  // Meeting details
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  notes?: string;
  menteeEmail?: string;
  menteeName?: string;
  menteePhone?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
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
  
  // Package Inclusions (as per Preplaced documentation)
  hasUnlimitedChat?: boolean;
  hasCuratedTasks?: boolean;
  hasRegularFollowups?: boolean;
  hasJobReferrals?: boolean;
  hasCertification?: boolean;
  hasRescheduling?: boolean;

  // Discount fields
  threeMonthDiscount?: number;
  sixMonthDiscount?: number;
  originalPricePerMonth?: number;
  // If updating existing package
  id?: number;
}

export interface CreateTrialSlotRequest {
  // mentorId is automatically set from JWT token in backend
  packageId?: number;
  scheduledDateTime: string;
  durationMinutes: number;
  sessionType: string;
  timeZone?: string;
  bufferTimeMinutes?: number;
  preparationTimeMinutes?: number;
  allowRescheduling?: boolean;
  maxReschedulingHours?: number;
  requireConfirmation?: boolean;
  specialInstructions?: string;
  sessionTitle?: string;
  sessionDescription?: string;
}

// 🆕 NEW INTERFACES FOR ENHANCED FUNCTIONALITY

export interface BulkTrialSessionRequest {
  packageId?: number;
  startDate: string;
  endDate: string;
  timeSlots: TimeSlotRequest[];
  daysOfWeek?: number[]; // 1=Monday, 7=Sunday
  sessionType?: string;
  timeZone?: string;
  bufferTimeMinutes?: number;
  preparationTimeMinutes?: number;
  allowRescheduling?: boolean;
  maxReschedulingHours?: number;
  requireConfirmation?: boolean;
  specialInstructions?: string;
  availabilityTemplate?: string;
  createRecurring?: boolean;
  recurringPattern?: string;
  recurringWeeks?: number;
}

export interface TimeSlotRequest {
  startTime: string; // LocalTime format HH:MM
  durationMinutes: number;
  sessionTitle?: string;
  sessionDescription?: string;
}

export interface AvailabilityTemplate {
  id?: number;
  mentorId?: number;
  templateName: string;
  description?: string;
  dailyAvailabilities: DailyAvailability[];
  defaultDurationMinutes?: number;
  defaultSessionType?: string;
  bufferTimeMinutes?: number;
  preparationTimeMinutes?: number;
  allowRescheduling?: boolean;
  maxReschedulingHours?: number;
  requireConfirmation?: boolean;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface DailyAvailability {
  dayOfWeek: number; // 1=Monday, 7=Sunday
  isAvailable: boolean;
  timeSlots?: TimeSlotTemplate[];
}

export interface TimeSlotTemplate {
  startTime: string; // LocalTime format HH:MM
  endTime: string;   // LocalTime format HH:MM
  sessionDurationMinutes?: number;
  sessionTitle?: string;
  sessionDescription?: string;
}

export interface BulkUpdateRequest {
  sessionIds: number[];
  updates: Partial<TrialSession>;
}

export interface RescheduleRequest {
  sessionId: number;
  newDateTime: string;
  reason?: string;
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