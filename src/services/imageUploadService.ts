/**
 * Image Upload Service
 * Handles local file uploads to backend instead of Supabase
 */

import { fetchWithAuth } from '../lib/fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export interface UploadResult {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
}

export interface UploadError {
  message: string;
  code?: string;
}

/**
 * Uploads a product image to the local backend
 */
export async function uploadProductImage(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetchWithAuth(`${API_BASE_URL}/upload/product-image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    // The response may be HTML (e.g. a proxy/static server returning index.html), so
    // guard the JSON parse and surface a descriptive error instead of a cryptic
    // "Unexpected token '<'" parse failure.
    const text = await response.text().catch(() => '');
    const isHtml = text.trimStart().startsWith('<!doctype') || text.trimStart().startsWith('<html');
    const message = isHtml
      ? 'Upload endpoint returned an HTML page (bad API route). Check API_BASE_URL / proxy config.'
      : (text || `Upload failed with status ${response.status}`);
    throw new Error(message);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Upload failed');
  }

  return result.data;
}

/**
 * Uploads a shop logo to the local backend
 */
export async function uploadShopLogo(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetchWithAuth(`${API_BASE_URL}/upload/shop-logo`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    // Same HTML-response guard as product images.
    const text = await response.text().catch(() => '');
    const isHtml = text.trimStart().startsWith('<!doctype') || text.trimStart().startsWith('<html');
    const message = isHtml
      ? 'Upload endpoint returned an HTML page (bad API route). Check API_BASE_URL / proxy config.'
      : (text || `Upload failed with status ${response.status}`);
    throw new Error(message);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Upload failed');
  }

  return result.data;
}

/**
 * Deletes an uploaded product image
 */
export async function deleteProductImage(filename: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/upload/product-image/${filename}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const isHtml = text.trimStart().startsWith('<!doctype') || text.trimStart().startsWith('<html');
    const message = isHtml
      ? 'Upload delete endpoint returned an HTML page (bad API route). Check API_BASE_URL / proxy config.'
      : (text || `Delete failed with status ${response.status}`);
    throw new Error(message);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Delete failed');
  }
}

/**
 * Validates if the backend upload service is available
 */
export async function isUploadServiceAvailable(): Promise<boolean> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/upload/product-image`, {
      method: 'HEAD',
    });
    return response.status !== 404;
  } catch {
    return false;
  }
}