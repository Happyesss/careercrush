// API Service for Subscriptions (Mentorship Plans)
import axios from '../Interceptor/AxiosInterceptor';

export interface QuoteRequest {
  mentorId: number;
  packageId: number;
  planMonths: number; // 1, 3, 6
  checkoutPercent?: number; // e.g. 30
  studentPercent?: number; // e.g. 5
}

export interface SubscriptionDTO {
  id?: number;
  menteeId?: number;
  mentorId: number;
  packageId: number;
  planMonths: number;
  startDate?: string;
  endDate?: string;
  basePricePerMonth: number;
  planDiscountPercent: number;
  checkoutDiscountPercent?: number;
  studentDiscountPercent?: number;
  effectivePricePerMonth: number;
  totalPriceBeforeDiscounts: number;
  totalDiscountAmount: number;
  totalPayable: number;
  status?: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'REFUNDED' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const subscriptionService = {
  quote: async (params: QuoteRequest): Promise<SubscriptionDTO> => {
    const { mentorId, packageId, planMonths, checkoutPercent = 0, studentPercent = 0 } = params;
    const response = await axios.get(`${API_BASE_URL}/subscriptions/quote`, {
      params: { mentorId, packageId, planMonths, checkoutPercent, studentPercent }
    });
    return response.data;
  },
  create: async (payload: SubscriptionDTO): Promise<SubscriptionDTO> => {
    const response = await axios.post(`${API_BASE_URL}/subscriptions/create`, payload);
    return response.data;
  },
  getByMentee: async (menteeId: number): Promise<SubscriptionDTO[]> => {
    const response = await axios.get(`${API_BASE_URL}/subscriptions/mentee/${menteeId}`);
    return response.data;
  },
  getByMentor: async (mentorId: number): Promise<SubscriptionDTO[]> => {
    const response = await axios.get(`${API_BASE_URL}/subscriptions/mentor/${mentorId}`);
    return response.data;
  }
};

export default subscriptionService;