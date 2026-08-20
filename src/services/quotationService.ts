/**
 * Quotation API Service
 * Handles all quotation-related API calls to the backend
 */

import { fetchWithAuth, handleAuthResponse, getAuthHeaders } from '../lib/fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// ===================================
// Type Definitions (matching backend)
// ===================================

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED';
export type QuotationItemType = 'PRODUCT' | 'SERVICE';

export interface APIQuotationItem {
  id: string;
  quotationId: string;
  itemType: QuotationItemType;
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

export interface APIQuotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: QuotationStatus;
  notes?: string;
  terms?: string;
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
  items: APIQuotationItem[];
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

export interface GetQuotationsParams {
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

export interface CreateQuotationData {
  customerId: string;
  items: {
    itemType?: QuotationItemType;
    productId?: string | null;
    serviceId?: string | null;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  status?: QuotationStatus;
  discountTotal?: number;
  taxTotal?: number;
  validityDate?: string;
  notes?: string;
  terms?: string;
}

export interface UpdateQuotationData extends Partial<CreateQuotationData> {
  status?: QuotationStatus;
}

export interface QuotationStats {
  totalQuotations: number;
  statusStats: {
    status: QuotationStatus;
    _count: { status: number };
    _sum: { grandTotal: number | null };
  }[];
  revenue: {
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    grandTotal: number;
    averageQuotationValue: number;
  };
  recentQuotations: APIQuotation[];
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
// Quotation Service API Functions
// ===================================

export const quotationService = {
  /**
   * Get all quotations with optional filtering and pagination
   */
  async getAll(params: GetQuotationsParams = {}): Promise<{ quotations: APIQuotation[]; pagination: PaginationInfo }> {
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

    const url = `${API_BASE_URL}/quotations?${queryParams.toString()}`;
    const response = await fetchWithAuth(url, { headers: getAuthHeaders() });
    const result = await handleResponse<APIResponse<APIQuotation[]>>(response);

    return {
      quotations: result.data,
      pagination: result.pagination || { page: 1, limit: 10, total: result.data.length, totalPages: 1 },
    };
  },

  /**
   * Get a single quotation by ID
   */
  async getById(id: string): Promise<APIQuotation> {
    const response = await fetchWithAuth(`${API_BASE_URL}/quotations/${id}`, { headers: getAuthHeaders() });
    const result = await handleResponse<APIResponse<APIQuotation>>(response);
    return result.data;
  },

  /**
   * Create a new quotation
   */
  async create(data: CreateQuotationData): Promise<APIQuotation> {
    const response = await fetchWithAuth(`${API_BASE_URL}/quotations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse<APIResponse<APIQuotation>>(response);
    return result.data;
  },

  /**
   * Update an existing quotation
   */
  async update(id: string, data: UpdateQuotationData): Promise<APIQuotation> {
    const response = await fetchWithAuth(`${API_BASE_URL}/quotations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse<APIResponse<APIQuotation>>(response);
    return result.data;
  },

  /**
   * Delete a quotation
   */
  async delete(id: string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/quotations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse<APIResponse<null>>(response);
  },

  /**
   * Convert an accepted quotation into an invoice
   */
  async convertToInvoice(id: string): Promise<{ invoice: unknown; quotation: APIQuotation }> {
    const response = await fetchWithAuth(`${API_BASE_URL}/quotations/${id}/convert-to-invoice`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<APIResponse<{ invoice: unknown; quotation: APIQuotation }>>(response);
    return result.data;
  },

  /**
   * Get quotation statistics
   */
  async getStats(): Promise<QuotationStats> {
    const response = await fetchWithAuth(`${API_BASE_URL}/quotations/stats`, { headers: getAuthHeaders() });
    const result = await handleResponse<APIResponse<QuotationStats>>(response);
    return result.data;
  },
};

// ===================================
// Utility: Convert API Quotation to Frontend Format
// ===================================

import type { Quotation, QuotationItem, QuotationStatus as FrontendQuotationStatus } from '../data/mockData';

export const convertAPIQuotationToFrontend = (apiQuotation: APIQuotation): Quotation => {
  const statusMap: Record<QuotationStatus, FrontendQuotationStatus> = {
    DRAFT: 'draft',
    SENT: 'sent',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    CONVERTED: 'converted',
  };

  return {
    id: apiQuotation.quotationNumber || apiQuotation.id,
    apiId: apiQuotation.id,
    quotationNumber: apiQuotation.quotationNumber,
    customerId: apiQuotation.customerId,
    customerName: apiQuotation.customer?.name || '',
    customerPhone: apiQuotation.customer?.phone || '',
    customerEmail: apiQuotation.customer?.email,
    customerAddress: apiQuotation.customer?.address,
    quotationDate: apiQuotation.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    expiryDate: apiQuotation.validityDate?.split('T')[0] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    validityDays: apiQuotation.validityDate
      ? Math.round((new Date(apiQuotation.validityDate).getTime() - new Date(apiQuotation.createdAt).getTime()) / (24 * 60 * 60 * 1000))
      : 30,
    items: (apiQuotation.items || []).map((item): QuotationItem => ({
      id: item.id,
      productId: item.productId || undefined,
      productName: item.product?.name || item.description,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      taxRate: 0,
      total: item.total,
    })),
    subtotal: apiQuotation.subtotal,
    discountPercent: apiQuotation.discountTotal > 0 && apiQuotation.subtotal > 0
      ? Math.round((apiQuotation.discountTotal / apiQuotation.subtotal) * 100)
      : 0,
    discountAmount: apiQuotation.discountTotal,
    taxPercent: apiQuotation.taxTotal > 0 && apiQuotation.subtotal > 0
      ? Math.round((apiQuotation.taxTotal / apiQuotation.subtotal) * 100)
      : 0,
    taxAmount: apiQuotation.taxTotal,
    shippingCost: 0,
    total: apiQuotation.grandTotal,
    status: statusMap[apiQuotation.status] || 'draft',
    priority: 'normal',
    notes: apiQuotation.notes,
    terms: apiQuotation.terms,
    viewCount: 0,
    activities: [],
    createdAt: apiQuotation.createdAt,
    updatedAt: apiQuotation.updatedAt,
  };
};

export default quotationService;