// Secure Trial Session Service - Aligned with Backend Security Implementation
import axiosInstance from '../Interceptor/AxiosInterceptor';
import type {
  TrialSession,
  TrialSessionStatus,
  CreateTrialSlotRequest,
  TrialBookingRequest,
} from '../types/mentorshipPackages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 🔒 SECURE TRIAL SESSION SERVICE
 * 
 * This service implements the secure trial session functionality where:
 * - Mentors can only manage their own trial sessions
 * - JWT authentication is required for all write operations
 * - Ownership is automatically validated by the backend
 */
export const trialSessionService = {
  
  // 🔒 SECURE ENDPOINTS (Require JWT Authentication)
  
  /**
   * Create an available trial session slot
   * Backend automatically assigns mentorId from JWT token
   */
  createAvailableSlot: async (slotData: CreateTrialSlotRequest): Promise<TrialSession> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/trial-sessions/create-slot`, slotData);
    return response.data;
  },

  /**
   * Create multiple available slots for authenticated mentor
   * Backend automatically assigns mentorId from JWT token
   */
  createMultipleAvailableSlots: async (
    dateTimeSlots: string[],
    durationMinutes: number = 30
  ): Promise<TrialSession[]> => {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/trial-sessions/create-multiple-slots`,
      dateTimeSlots,
      {
        params: { durationMinutes }
      }
    );
    return response.data;
  },

  /**
   * Get trial sessions for authenticated mentor only
   * Backend filters by mentorId from JWT token
   */
  getMyTrialSessions: async (): Promise<TrialSession[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/mentor/my-sessions`);
    return response.data;
  },

  /**
   * Get available sessions for authenticated mentor only
   * Backend filters by mentorId from JWT token
   */
  getMyAvailableSessions: async (): Promise<TrialSession[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/mentor/my-available`);
    return response.data;
  },

  /**
   * Update trial session with ownership validation
   * Backend validates that the requesting user owns the session
   */
  updateTrialSession: async (id: number, sessionData: Partial<TrialSession>): Promise<TrialSession> => {
    const response = await axiosInstance.put(`${API_BASE_URL}/trial-sessions/update/${id}`, sessionData);
    return response.data;
  },

  /**
   * Delete trial session with ownership validation
   * Backend validates that the requesting user owns the session
   */
  deleteTrialSession: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE_URL}/trial-sessions/delete/${id}`);
  },

  // 🌐 PUBLIC ENDPOINTS (No Authentication Required)

  /**
   * Get trial session by ID (public access)
   */
  getTrialSessionById: async (id: number): Promise<TrialSession> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/get/${id}`);
    return response.data;
  },

  /**
   * Get available trial sessions for a mentor (for booking by mentees)
   * This is public so mentees can see available slots for booking
   */
  getAvailableSessionsByMentor: async (mentorId: number): Promise<TrialSession[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/mentor/${mentorId}/available`);
    return response.data;
  },

  /**
   * Get all trial sessions for a mentor (public profile view)
   * This is public for mentor profile display
   */
  getTrialSessionsByMentor: async (mentorId: number): Promise<TrialSession[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/mentor/${mentorId}`);
    return response.data;
  },

  /**
   * Book a trial session (public - for mentees)
   * Mentees can book available sessions without authentication
   */
  bookTrialSession: async (bookingData: TrialBookingRequest): Promise<TrialSession> => {
    const { sessionId, ...params } = bookingData;
    const response = await axiosInstance.post(
      `${API_BASE_URL}/trial-sessions/book/${sessionId}`,
      {},
      { params }
    );
    return response.data;
  },

  // UTILITY ENDPOINTS

  /**
   * Get trial sessions for a mentee
   */
  getTrialSessionsByMentee: async (menteeId: number): Promise<TrialSession[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/mentee/${menteeId}`);
    return response.data;
  },

  /**
   * Get trial sessions for a package
   */
  getTrialSessionsByPackage: async (packageId: number): Promise<TrialSession[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/package/${packageId}`);
    return response.data;
  },

  /**
   * Get available sessions for a specific date
   */
  getAvailableSessionsForDate: async (date: string): Promise<TrialSession[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/available`, {
      params: { date }
    });
    return response.data;
  },

  /**
   * Get booked sessions by mentee email
   */
  getBookedSessionsByEmail: async (email: string): Promise<TrialSession[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/trial-sessions/booked`, {
      params: { email }
    });
    return response.data;
  },

  /**
   * Update trial session status
   */
  updateTrialSessionStatus: async (id: number, status: TrialSessionStatus): Promise<TrialSession> => {
    const response = await axiosInstance.put(`${API_BASE_URL}/trial-sessions/update-status/${id}`, {}, {
      params: { status }
    });
    return response.data;
  },

  /**
   * Cancel trial session
   */
  cancelTrialSession: async (id: number): Promise<TrialSession> => {
    const response = await axiosInstance.put(`${API_BASE_URL}/trial-sessions/cancel/${id}`);
    return response.data;
  },

  /**
   * Complete trial session
   */
  completeTrialSession: async (id: number, notes?: string): Promise<TrialSession> => {
    const response = await axiosInstance.put(`${API_BASE_URL}/trial-sessions/complete/${id}`, {}, {
      params: { notes }
    });
    return response.data;
  },
};

export default trialSessionService;
