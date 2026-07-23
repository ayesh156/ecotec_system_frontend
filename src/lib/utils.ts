import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves a product/shop image URL to a full URL.
 * - If already an absolute URL (http/https/data:) → return as-is
 * - If a relative path (/api/v1/uploads/...) → prepend API base URL
 * - If empty → return empty string
 */
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1')
  .replace('/api/v1', ''); // Strip path, keep just origin: https://api.ecosystemlk.app

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  // Already an absolute URL or data URI
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Relative path — prepend API origin
  return `${API_BASE}${path}`;
}
