/**
 * Image Upload Service
 * Handles local file uploads to backend instead of Supabase
 */

import { fetchWithAuth } from '../lib/fetchWithAuth';

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

  const response = await fetchWithAuth('/api/v1/upload/product-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || 'Failed to upload image');
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

  const response = await fetchWithAuth('/api/v1/upload/shop-logo', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || 'Failed to upload logo');
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
  const response = await fetchWithAuth(`/api/v1/upload/product-image/${filename}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Delete failed' }));
    throw new Error(errorData.message || 'Failed to delete image');
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
    const response = await fetchWithAuth('/api/v1/upload/product-image', {
      method: 'HEAD',
    });
    return response.status !== 404;
  } catch {
    return false;
  }
}