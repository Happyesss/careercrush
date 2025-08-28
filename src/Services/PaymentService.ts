// API Service for Payments (placeholder integration)
import axios from '../Interceptor/AxiosInterceptor';

export interface PaymentOrderDTO {
  id: number;
  subscriptionId: number;
  gatewayOrderId: string;
  currency: string;
  amountPaise: number;
  status: 'CREATED' | 'PAID' | 'FAILED';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const paymentService = {
  createOrder: async (
    subscriptionId: number,
    amountPaise: number,
    currency: string = 'INR'
  ): Promise<PaymentOrderDTO> => {
    const response = await axios.post(
      `${API_BASE_URL}/payments/create-order`,
      {},
      { params: { subscriptionId, amountPaise, currency } }
    );
    return response.data;
  },

  // Simulated webhook to mark paid in the placeholder backend
  markPaid: async (gatewayOrderId: string): Promise<ApiResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/payments/webhook/paid`,
      {},
      { params: { gatewayOrderId } }
    );
    return response.data;
  }
};

export default paymentService;
