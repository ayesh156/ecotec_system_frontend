/**
 * Estimate API Service
 * Handles all estimate-related API calls to the backend
 */

import { fetchWithAuth, handleAuthResponse, getAuthHeaders } from '../lib/fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// ===================================
// Type Definitions (matching backend)
// ===================================

export type EstimateStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED';
export type EstimateItemType = 'PRODUCT' | 'SERVICE';
export type FrontendEstimateStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';

export interface APIEstimateItem {
  id: string;
  estimateId: string;
  itemType: EstimateItemType;
  productId?: string | null;
  serviceId?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  product?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface APIEstimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: EstimateStatus;
  notes?: string;
  terms?: string;
  internalNotes?: string;
  validityDate?: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  items: APIEstimateItem[];
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetEstimatesParams {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEstimateData {
  customerId: string;
  items: {
    itemType?: EstimateItemType;
    productId?: string | null;
    serviceId?: string | null;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  status?: EstimateStatus;
  discountTotal?: number;
  taxTotal?: number;
  validityDate?: string;
  notes?: string;
  terms?: string;
  internalNotes?: string;
}

export interface UpdateEstimateData extends Partial<CreateEstimateData> {
  status?: EstimateStatus;
}

export interface EstimateStats {
  totalEstimates: number;
  statusStats: {
    status: EstimateStatus;
    _count: { status: number };
    _sum: { grandTotal: number | null };
  }[];
  revenue: {
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    grandTotal: number;
    averageEstimateValue: number;
  };
  recentEstimates: APIEstimate[];
}

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  return handleAuthResponse<T>(response);
};

// ===================================
// Estimate Service API Functions
// ===================================

export interface FrontendEstimateItem {
  id: string;
  productId?: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface FrontendEstimate {
  id: string;
  apiId?: string;
  estimateNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  estimateDate: string;
  expiryDate: string;
  items: FrontendEstimateItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  status: FrontendEstimateStatus;
  notes?: string;
  terms?: string;
  internalNotes?: string;
  convertedToInvoice?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const estimateService = {
  /**
   * Get all estimates with optional filtering and pagination
   */
  async getAll(params: GetEstimatesParams = {}): Promise<{ estimates: APIEstimate[]; pagination: PaginationInfo }> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status && params.status !== 'all') queryParams.append('status', params.status.toUpperCase());
    if (params.customerId && params.customerId !== 'all') queryParams.append('customerId', params.customerId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${API_BASE_URL}/estimates?${queryParams.toString()}`;
    const response = await fetchWithAuth(url, { headers: getAuthHeaders() });
    const result = await handleResponse<APIResponse<APIEstimate[]>>(response);

    const estimates = Array.isArray(result?.data) ? result.data : [];
    return {
      estimates,
      pagination: result?.pagination || { page: 1, limit: 10, total: estimates.length, totalPages: 1 },
    };
  },

  /**
   * Get a single estimate by ID
   */
  async getById(id: string): Promise<APIEstimate> {
    const response = await fetchWithAuth(`${API_BASE_URL}/estimates/${id}`, { headers: getAuthHeaders() });
    const result = await handleResponse<APIResponse<APIEstimate>>(response);
    return result.data;
  },

  /**
   * Create a new estimate
   */
  async create(data: CreateEstimateData): Promise<APIEstimate> {
    const response = await fetchWithAuth(`${API_BASE_URL}/estimates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse<APIResponse<APIEstimate>>(response);
    return result.data;
  },

  /**
   * Update an existing estimate
   */
  async update(id: string, data: UpdateEstimateData): Promise<APIEstimate> {
    const response = await fetchWithAuth(`${API_BASE_URL}/estimates/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse<APIResponse<APIEstimate>>(response);
    return result.data;
  },

  /**
   * Delete an estimate
   */
  async delete(id: string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/estimates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse<APIResponse<null>>(response);
  },

  /**
   * Convert an accepted estimate to a quotation
   */
  async convertToQuotation(id: string): Promise<{ quotation: unknown; estimate: APIEstimate }> {
    const response = await fetchWithAuth(`${API_BASE_URL}/estimates/${id}/convert-to-quotation`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<APIResponse<{ quotation: unknown; estimate: APIEstimate }>>(response);
    return result.data;
  },

  /**
   * Convert an accepted estimate to an invoice
   */
  async convertToInvoice(id: string): Promise<{ invoice: unknown; estimate: APIEstimate }> {
    const response = await fetchWithAuth(`${API_BASE_URL}/estimates/${id}/convert-to-invoice`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<APIResponse<{ invoice: unknown; estimate: APIEstimate }>>(response);
    return result.data;
  },

  /**
   * Get estimate statistics
   */
  async getStats(): Promise<EstimateStats> {
    const response = await fetchWithAuth(`${API_BASE_URL}/estimates/stats`, { headers: getAuthHeaders() });
    const result = await handleResponse<APIResponse<EstimateStats>>(response);
    return result.data;
  },

  /**
   * Get the next estimate number (10-digit numeric string)
   */
  async getNextNumber(): Promise<string> {
    const response = await fetchWithAuth(`${API_BASE_URL}/estimates/next-number`, { headers: getAuthHeaders() });
    const result = await handleResponse<APIResponse<{ number: string }>>(response);
    return result.data.number;
  },
};

// ===================================
// Utility: Convert API Estimate to Frontend Format
// ===================================

const statusMap: Record<EstimateStatus, FrontendEstimateStatus> = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  CONVERTED: 'converted',
};

export const convertAPIEstimateToFrontend = (apiEstimate: APIEstimate): FrontendEstimate => {
  const estimateDate = apiEstimate.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
  const expiryDate = apiEstimate.validityDate?.split('T')[0] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const toNum = (v: unknown): number => {
    const n = typeof v === 'string' ? parseFloat(v) : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const subtotal = toNum(apiEstimate.subtotal);
  const discountTotal = toNum(apiEstimate.discountTotal);
  const taxTotal = toNum(apiEstimate.taxTotal);
  const grandTotal = toNum(apiEstimate.grandTotal);

  return {
    id: apiEstimate.estimateNumber || apiEstimate.id,
    apiId: apiEstimate.id,
    estimateNumber: apiEstimate.estimateNumber,
    customerId: apiEstimate.customerId,
    customerName: apiEstimate.customer?.name || '',
    customerPhone: apiEstimate.customer?.phone || '',
    customerEmail: apiEstimate.customer?.email,
    customerAddress: apiEstimate.customer?.address,
    estimateDate,
    expiryDate,
    items: (apiEstimate.items || []).map((item): FrontendEstimateItem => ({
      id: item.id,
      productId: item.productId || undefined,
      productName: item.product?.name || item.description,
      description: item.description,
      quantity: item.quantity,
      unitPrice: toNum(item.unitPrice),
      discount: toNum(item.discount),
      total: toNum(item.total),
    })),
    subtotal,
    discountPercent: subtotal > 0 ? Math.round((discountTotal / subtotal) * 100) : 0,
    discountAmount: discountTotal,
    taxPercent: subtotal > 0 ? Math.round((taxTotal / subtotal) * 100) : 0,
    taxAmount: taxTotal,
    total: grandTotal,
    status: statusMap[apiEstimate.status] || 'draft',
    notes: apiEstimate.notes,
    terms: apiEstimate.terms,
    internalNotes: apiEstimate.internalNotes,
    convertedToInvoice: apiEstimate.status === 'CONVERTED',
    createdAt: apiEstimate.createdAt,
    updatedAt: apiEstimate.updatedAt,
  };
};

export default estimateService;