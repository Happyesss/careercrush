// API Service for Mentorship Packages System
import axios from '../Interceptor/AxiosInterceptor';
import type {
  MentorshipPackage,
  TrialSession,
  PackageFilters,
  CreatePackageRequest,
  CreateTrialSlotRequest,
  TrialBookingRequest,
  PackageStats,
  TrialSessionStats,
  ApiResponse,
} from '../types/mentorshipPackages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Package API endpoints
export const packageService = {
  // Create a new mentorship package
  createPackage: async (packageData: CreatePackageRequest): Promise<MentorshipPackage> => {
    const response = await axios.post(`${API_BASE_URL}/packages/create`, packageData);
    return response.data;
  },

  // Update an existing package
  updatePackage: async (packageData: MentorshipPackage): Promise<MentorshipPackage> => {
    const response = await axios.put(`${API_BASE_URL}/packages/update`, packageData);
    return response.data;
  },

  // Get package by ID
  getPackageById: async (id: number): Promise<MentorshipPackage> => {
    const response = await axios.get(`${API_BASE_URL}/packages/get/${id}`);
    return response.data;
  },

  // Get all packages for a mentor
  getPackagesByMentor: async (mentorId: number): Promise<MentorshipPackage[]> => {
    const response = await axios.get(`${API_BASE_URL}/packages/mentor/${mentorId}`);
    return response.data;
  },

  // Get active packages for a mentor
  getActivePackagesByMentor: async (mentorId: number): Promise<MentorshipPackage[]> => {
    const response = await axios.get(`${API_BASE_URL}/packages/mentor/${mentorId}/active`);
    return response.data;
  },

  // Get all active packages
  getAllActivePackages: async (): Promise<MentorshipPackage[]> => {
    const response = await axios.get(`${API_BASE_URL}/packages/active`);
    return response.data;
  },

  // Get packages by duration
  getPackagesByDuration: async (months: number): Promise<MentorshipPackage[]> => {
    const response = await axios.get(`${API_BASE_URL}/packages/duration/${months}`);
    return response.data;
  },

  // Get packages with free trial
  getPackagesWithFreeTrial: async (): Promise<MentorshipPackage[]> => {
    const response = await axios.get(`${API_BASE_URL}/packages/free-trial`);
    return response.data;
  },

  // Get packages within price range
  getPackagesByPriceRange: async (minPrice: number, maxPrice: number): Promise<MentorshipPackage[]> => {
    const response = await axios.get(`${API_BASE_URL}/packages/price-range`, {
      params: { minPrice, maxPrice }
    });
    return response.data;
  },

  // Get packages by session type
  getPackagesBySessionType: async (sessionType: string): Promise<MentorshipPackage[]> => {
    const response = await axios.get(`${API_BASE_URL}/packages/session-type/${sessionType}`);
    return response.data;
  },

  // Toggle package status (activate/deactivate)
  togglePackageStatus: async (id: number): Promise<MentorshipPackage> => {
    const response = await axios.put(`${API_BASE_URL}/packages/toggle-status/${id}`);
    return response.data;
  },

  // Delete a package
  deletePackage: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/packages/delete/${id}`);
  },

  // Get packages with filters
  getPackagesWithFilters: async (filters: PackageFilters): Promise<MentorshipPackage[]> => {
    const params = new URLSearchParams();
    
    if (filters.durationMonths) {
      return await packageService.getPackagesByDuration(filters.durationMonths);
    }
    
    if (filters.minPrice && filters.maxPrice) {
      return await packageService.getPackagesByPriceRange(filters.minPrice, filters.maxPrice);
    }
    
    if (filters.sessionType) {
      return await packageService.getPackagesBySessionType(filters.sessionType);
    }
    
    if (filters.isFreeTrialIncluded) {
      return await packageService.getPackagesWithFreeTrial();
    }
    
    if (filters.mentorId) {
      return await packageService.getActivePackagesByMentor(filters.mentorId);
    }
    
    // Default to all active packages
    return await packageService.getAllActivePackages();
  },
};

// Trial Session API endpoints
export const trialSessionService = {
  // 🔒 SECURE: Create available trial session slot (requires JWT)
  createAvailableSlot: async (slotData: CreateTrialSlotRequest): Promise<TrialSession> => {
    const response = await axios.post(`${API_BASE_URL}/trial-sessions/create-slot`, slotData);
    return response.data;
  },

  // 🔒 SECURE: Create multiple available slots for authenticated mentor (requires JWT)
  createMultipleAvailableSlots: async (
    dateTimeSlots: string[],
    durationMinutes: number = 30
  ): Promise<TrialSession[]> => {
    const response = await axios.post(
      `${API_BASE_URL}/trial-sessions/create-multiple-slots`,
      dateTimeSlots,
      {
        params: { durationMinutes }
      }
    );
    return response.data;
  },

  // 🔒 SECURE: Get my trial sessions (requires JWT)
  getMyTrialSessions: async (): Promise<TrialSession[]> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/mentor/my-sessions`);
    return response.data;
  },

  // 🔒 SECURE: Get my available sessions (requires JWT)
  getMyAvailableSessions: async (): Promise<TrialSession[]> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/mentor/my-available`);
    return response.data;
  },

  // 🔒 SECURE: Update trial session (requires JWT + ownership validation)
  updateTrialSession: async (id: number, sessionData: Partial<TrialSession>): Promise<TrialSession> => {
    const response = await axios.put(`${API_BASE_URL}/trial-sessions/update/${id}`, sessionData);
    return response.data;
  },

  // 🔒 SECURE: Delete trial session (requires JWT + ownership validation)
  deleteTrialSession: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/trial-sessions/delete/${id}`);
  },

  // 🌐 PUBLIC: Book a trial session (no auth required - for mentees)
  bookTrialSession: async (bookingData: TrialBookingRequest): Promise<TrialSession> => {
    const { sessionId, ...params } = bookingData;
    const response = await axios.post(
      `${API_BASE_URL}/trial-sessions/book/${sessionId}`,
      {},
      { params }
    );
    return response.data;
  },

  // 🌐 PUBLIC: Get trial session by ID
  getTrialSessionById: async (id: number): Promise<TrialSession> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/get/${id}`);
    return response.data;
  },

  // 🌐 PUBLIC: Get available trial sessions for a mentor (for booking by mentees)
  getAvailableSessionsByMentor: async (mentorId: number): Promise<TrialSession[]> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/mentor/${mentorId}/available`);
    return response.data;
  },

  // 🌐 PUBLIC: Get all trial sessions for a mentor (public profile view)
  getTrialSessionsByMentor: async (mentorId: number): Promise<TrialSession[]> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/mentor/${mentorId}`);
    return response.data;
  },

  // Get trial sessions for a mentee
  getTrialSessionsByMentee: async (menteeId: number): Promise<TrialSession[]> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/mentee/${menteeId}`);
    return response.data;
  },

  // Get trial sessions for a package
  getTrialSessionsByPackage: async (packageId: number): Promise<TrialSession[]> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/package/${packageId}`);
    return response.data;
  },

  // Get available sessions for a specific date
  getAvailableSessionsForDate: async (date: string): Promise<TrialSession[]> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/available`, {
      params: { date }
    });
    return response.data;
  },

  // Get booked sessions by mentee email
  getBookedSessionsByEmail: async (email: string): Promise<TrialSession[]> => {
    const response = await axios.get(`${API_BASE_URL}/trial-sessions/booked`, {
      params: { email }
    });
    return response.data;
  },

  // Update trial session status
  updateTrialSessionStatus: async (id: number, status: string): Promise<TrialSession> => {
    const response = await axios.put(`${API_BASE_URL}/trial-sessions/update-status/${id}`, {}, {
      params: { status }
    });
    return response.data;
  },

  // Cancel trial session
  cancelTrialSession: async (id: number): Promise<TrialSession> => {
    const response = await axios.put(`${API_BASE_URL}/trial-sessions/cancel/${id}`);
    return response.data;
  },

  // Complete trial session
  completeTrialSession: async (id: number, notes?: string): Promise<TrialSession> => {
    const response = await axios.put(`${API_BASE_URL}/trial-sessions/complete/${id}`, {}, {
      params: { notes }
    });
    return response.data;
  },
};

// Stats and Analytics API endpoints
export const statsService = {
  // Get package statistics for a mentor
  getPackageStats: async (mentorId: number): Promise<PackageStats> => {
    const packages = await packageService.getPackagesByMentor(mentorId);
    
    const stats: PackageStats = {
      totalPackages: packages.length,
      activePackages: packages.filter(p => p.isActive).length,
      totalSessions: packages.reduce((sum, p) => sum + p.totalSessions, 0),
      totalRevenue: packages.reduce((sum, p) => sum + p.totalPrice, 0),
      averagePrice: packages.length > 0 
        ? packages.reduce((sum, p) => sum + p.totalPrice, 0) / packages.length 
        : 0,
    };
    
    return stats;
  },

  // Get trial session statistics for a mentor
  getTrialSessionStats: async (mentorId: number): Promise<TrialSessionStats> => {
    const sessions = await trialSessionService.getTrialSessionsByMentor(mentorId);
    
    const availableSessions = sessions.filter(s => s.status === 'AVAILABLE').length;
    const bookedSessions = sessions.filter(s => s.status === 'BOOKED').length;
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
    
    const stats: TrialSessionStats = {
      totalSessions: sessions.length,
      availableSessions,
      bookedSessions,
      completedSessions,
      conversionRate: completedSessions > 0 ? (completedSessions / (bookedSessions + completedSessions)) * 100 : 0,
    };
    
    return stats;
  },
};

// Utility functions
export const packageUtils = {
  // Format price for display
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  },

  // Calculate total price from monthly price and duration
  calculateTotalPrice: (monthlyPrice: number, durationMonths: number): number => {
    return monthlyPrice * durationMonths;
  },

  // Format duration for display
  formatDuration: (months: number): string => {
    if (months === 1) return '1 Month';
    if (months < 12) return `${months} Months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return years === 1 ? '1 Year' : `${years} Years`;
    return `${years} Year${years > 1 ? 's' : ''} ${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`;
  },

  // Format date for display
  formatDateTime: (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  // Get package difficulty level based on duration and sessions
  getPackageDifficulty: (durationMonths: number, totalSessions: number): string => {
    const sessionsPerMonth = totalSessions / durationMonths;
    if (sessionsPerMonth <= 4) return 'Beginner';
    if (sessionsPerMonth <= 8) return 'Intermediate';
    return 'Advanced';
  },
};

const MentorshipPackageService = {
  packageService,
  trialSessionService,
  statsService,
  packageUtils,
};

export default MentorshipPackageService;