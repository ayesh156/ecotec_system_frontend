import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves a product/shop image URL to a full URL.
 * - If already an absolute URL (http/https/blob/data:) → return as-is
 * - If a relative path (/uploads/...) → prepend backend origin
 * - If empty → return placeholder
 */
/**
 * Placeholder used when no product/shop image exists.
 * A small inline SVG that renders a neutral "image coming soon" tile.
 */
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#17171a"/><rect x="150" y="70" width="100" height="80" rx="8" fill="none" stroke="#3a3a40" stroke-width="4"/><circle cx="265" cy="145" r="6" fill="#3a3a40"/><path d="M60 240l80-90 70 60 60-40 70 70" fill="none" stroke="#3a3a40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="215" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6e6e73">No image available</text></svg>`
  );

export function getImageUrl(path: string | null | undefined): string {
  if (!path || typeof path !== 'string' || !path.trim()) {
    return PLACEHOLDER_IMAGE;
  }
  // Already an absolute URL or data URI (blob/base64)
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:image/')) {
    return path;
  }
  // Local file path (e.g. "/uploads/xyz.jpg", "/api/v1/uploads/xyz.jpg", or "product-xyz.jpg")
  // Resolve against the backend origin derived from VITE_API_URL.
  const rawApi = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
  const backendOrigin = rawApi.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
  // Strip leading slashes and any duplicate /api/v1 path segments.
  let cleanPath = path.replace(/^\/+/, '');
  cleanPath = cleanPath.replace(/^api\/v1\/+/, '');
  // Normalize to a /uploads/<filename> style path.
  const normalized = cleanPath.startsWith('uploads/')
    ? cleanPath
    : `uploads/${cleanPath}`;
  return `${backendOrigin}/${normalized}`;
}
