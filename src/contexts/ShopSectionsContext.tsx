import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

// All available sections with their paths and display names
export interface SectionConfig {
  path: string;
  label: string;
  description: string;
  icon?: string;
  // Related paths that should also be hidden when this section is hidden
  relatedPaths?: string[];
}

// All configurable sections
export const ALL_SECTIONS: SectionConfig[] = [
  {
    path: '/',
    label: 'Dashboard',
    description: 'Main dashboard and overview',
    icon: '📊',
  },
  {
    path: '/invoices',
    label: 'Invoices',
    description: 'Invoice management and creation',
    relatedPaths: ['/invoices/create'],
    icon: '📄',
  },
  {
    path: '/job-notes',
    label: 'Job Notes',
    description: 'Job note tracking for repairs and services',
    relatedPaths: ['/job-notes/create'],
    icon: '🔧',
  },
  {
    path: '/products',
    label: 'All Products',
    description: 'View and manage product inventory',
    relatedPaths: ['/products/add', '/products/labels'],
    icon: '📦',
  },
  {
    path: '/categories',
    label: 'Categories',
    description: 'Product category management',
    icon: '🏷️',
  },
  {
    path: '/brands',
    label: 'Brands',
    description: 'Product brand management',
    icon: '🎨',
  },
  {
    path: '/services',
    label: 'All Services',
    description: 'View and manage service offerings',
    relatedPaths: ['/services/add'],
    icon: '⚙️',
  },
  {
    path: '/service-categories',
    label: 'Service Categories',
    description: 'Service category management',
    icon: '🔖',
  },
  {
    path: '/quotations',
    label: 'Quotations',
    description: 'Customer quotations',
    relatedPaths: ['/quotations/create'],
    icon: '💰',
  },
  {
    path: '/estimates',
    label: 'Estimates',
    description: 'Cost estimates for customers',
    relatedPaths: ['/estimates/create'],
    icon: '📋',
  },
  {
    path: '/warranties',
    label: 'Warranties',
    description: 'Warranty tracking and management',
    icon: '🛡️',
  },
  {
    path: '/customers',
    label: 'Customers',
    description: 'Customer database and management',
    icon: '👥',
  },
  {
    path: '/suppliers',
    label: 'Suppliers',
    description: 'Supplier management',
    icon: '🚚',
  },
  {
    path: '/grn',
    label: 'Goods Received Notes',
    description: 'Track incoming inventory',
    relatedPaths: ['/grn/create'],
    icon: '📥',
  },
  {
    path: '/cash-management/transactions',
    label: 'Transactions',
    description: 'View and manage financial transactions',
    icon: '💳',
  },
  {
    path: '/cash-management/accounts',
    label: 'Manage Accounts',
    description: 'Bank and cash account management',
    icon: '🏦',
  },
  {
    path: '/cash-management/insights',
    label: 'Financial Insights',
    description: 'Financial analytics and insights',
    icon: '📈',
  },
  {
    path: '/reports',
    label: 'Reports',
    description: 'Business analytics and reports',
    icon: '📊',
  },
  {
    path: '/productivity',
    label: 'Productivity',
    description: 'Notes and calendar productivity tools',
    relatedPaths: ['/notes', '/calendar'],
    icon: '💡',
  },
  {
    path: '/technicians',
    label: 'Technicians',
    description: 'Technician management under Job Notes',
    icon: '🔧',
  },
  {
    path: '/users',
    label: 'Users',
    description: 'Shop user management',
    icon: '👤',
  },
  {
    path: '/pricing-proposals',
    label: 'Pricing Proposals',
    description: 'Pricing proposals and templates',
    icon: '💵',
  },
  {
    path: '/notes',
    label: 'Notes',
    description: 'Personal notes and reminders',
    icon: '📝',
  },
  {
    path: '/calendar',
    label: 'Calendar',
    description: 'Event and appointment calendar',
    icon: '📅',
  },
  {
    path: '/data-export',
    label: 'Data Export',
    description: 'Export business data',
    icon: '📤',
  },
  {
    path: '/settings',
    label: 'Settings',
    description: 'System settings and configuration',
    icon: '⚙️',
  },
];

interface ShopSectionsContextType {
  // Hidden section paths (SuperAdmin managed - affects ADMIN + USER)
  hiddenSections: string[];
  
  // Admin hidden section paths (Shop ADMIN managed - affects USER only)
  adminHiddenSections: string[];
  
  // Loading state
  isLoading: boolean;
  
  // Check if a path is hidden by SuperAdmin (completely hidden from ADMIN + USER)
  isSuperAdminHidden: (path: string) => boolean;
  
  // Check if a path is hidden by Shop ADMIN (hidden from USER only)
  isAdminHidden: (path: string) => boolean;
  
  // Check if a path is hidden for the current user
  isSectionHidden: (path: string) => boolean;
  
  // Update hidden sections (Super Admin only - affects everyone)
  updateHiddenSections: (sections: string[]) => Promise<void>;
  
  // Update admin hidden sections (Shop ADMIN - affects USER only)
  updateAdminHiddenSections: (sections: string[]) => Promise<void>;
  
  // Refresh from server
  refreshSections: () => Promise<void>;
  
  // Get all sections with visibility status
  getAllSections: () => (SectionConfig & { isHidden: boolean; isAdminHidden: boolean })[];
  
  // Get sections visible to Shop ADMIN (not hidden by SuperAdmin)
  getAdminVisibleSections: () => (SectionConfig & { isHidden: boolean })[];
}

const ShopSectionsContext = createContext<ShopSectionsContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Normalize a route path so section keys (e.g. `/invoices` or `job-notes`)
// reliably match sidebar hrefs (e.g. `/system/job-notes`). Strips `/system`
// prefix, leading slashes, and lowercases/trims for case-insensitivity.
export const normalizePath = (path: string): string => {
  if (!path) return path;
  let p = path;
  // Strip leading `/system` prefix (case-insensitive)
  if (p.toLowerCase().startsWith('/system')) {
    p = p.slice('/system'.length) || '/';
  }
  return p.replace(/^\//, '').toLowerCase().trim();
};

export const ShopSectionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, getAccessToken } = useAuth();

  // Hydrate hiddenSections directly from localStorage on mount for zero-delay
  // persistence across page refreshes (F5). Falls back to empty array safely.
  const [hiddenSections, setHiddenSections] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotec_hidden_sections') || '[]');
    } catch {
      return [];
    }
  });
  const [adminHiddenSections, setAdminHiddenSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to prevent flash
  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastFetchedShopId, setLastFetchedShopId] = useState<string | null>(null);

  // Get effective shop ID from the user's shop
  const effectiveShopId = user?.shop?.id;

  // Fetch hidden sections from API (with localStorage fast-path for offline/reliability)
  const fetchHiddenSections = useCallback(async (forceRefresh = false) => {
    const token = getAccessToken();
    
    if (!effectiveShopId || !token) {
      setHiddenSections([]);
      setAdminHiddenSections([]);
      setIsLoading(false);
      setHasInitialized(true);
      return;
    }

    // Skip if we already fetched for this shop (unless forcing refresh)
    if (!forceRefresh && hasInitialized && lastFetchedShopId === effectiveShopId) {
      return;
    }

    setIsLoading(true);

    // Fast-path: hydrate from localStorage immediately so sidebar is correct
    // even before the network resolves (keeps Section Control synced reactively).
    try {
      const cachedHidden = localStorage.getItem(`shop_hidden_sections_${effectiveShopId}`);
      const cachedAdminHidden = localStorage.getItem(`shop_admin_hidden_sections_${effectiveShopId}`);
      if (cachedHidden) setHiddenSections(JSON.parse(cachedHidden));
      if (cachedAdminHidden) setAdminHiddenSections(JSON.parse(cachedAdminHidden));
    } catch {
      // Ignore malformed cache
    }

    try {
      // Use standard shop fetch endpoint which includes full shop details
      const url = `${API_BASE_URL}/shops/current/sections`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Use cache: 'no-store' to prevent caching instead of headers (avoids CORS preflight issues)
        cache: 'no-store',
      });

      if (response.ok) {
        const responseData = await response.json();
        // Safe fallback chaining: tolerate any shape (nested .data, flat, settings) and undefined.
        const hidden =
          responseData?.data?.hiddenSections ??
          responseData?.hiddenSections ??
          responseData?.data?.settings?.hiddenSections ??
          responseData?.settings?.hiddenSections ??
          [];
        const adminHidden =
          responseData?.data?.adminHiddenSections ??
          responseData?.adminHiddenSections ??
          responseData?.data?.settings?.adminHiddenSections ??
          responseData?.settings?.adminHiddenSections ??
          [];
        setHiddenSections(hidden);
        setAdminHiddenSections(adminHidden);
        // Persist fetched values to localStorage (global + shop-scoped keys)
        localStorage.setItem('ecotec_hidden_sections', JSON.stringify(hidden));
        localStorage.setItem(`shop_hidden_sections_${effectiveShopId}`, JSON.stringify(hidden));
        localStorage.setItem(`shop_admin_hidden_sections_${effectiveShopId}`, JSON.stringify(adminHidden));
        setLastFetchedShopId(effectiveShopId);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn('⚠️ [ShopSections] Failed to fetch - Status:', response.status, 'Error:', errorData);
        // Fallback safely to localStorage instead of wiping to empty arrays.
        setHiddenSections(JSON.parse(localStorage.getItem('ecotec_hidden_sections') || '[]'));
        setAdminHiddenSections(JSON.parse(localStorage.getItem(`shop_admin_hidden_sections_${effectiveShopId}`) || '[]'));
      }
    } catch (error) {
      console.warn('⚠️ Error fetching hidden sections:', error);
      // Fallback safely to localStorage without throwing an uncaught error.
      try {
        setHiddenSections(JSON.parse(localStorage.getItem('ecotec_hidden_sections') || '[]'));
        setAdminHiddenSections(JSON.parse(localStorage.getItem(`shop_admin_hidden_sections_${effectiveShopId}`) || '[]'));
      } catch {
        setHiddenSections([]);
        setAdminHiddenSections([]);
      }
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
    }
  }, [effectiveShopId, getAccessToken, hasInitialized, lastFetchedShopId]);

  // Load sections when shop changes - use effectiveShopId directly to trigger re-fetch
  useEffect(() => {
    // Force refresh if shop changed
    if (effectiveShopId && effectiveShopId !== lastFetchedShopId) {
      fetchHiddenSections(true);
    } else if (effectiveShopId && !hasInitialized) {
      fetchHiddenSections(false);
    } else if (!effectiveShopId) {
      // No shop/auth - clear loading state so UI doesn't hang on login page
      setHiddenSections([]);
      setAdminHiddenSections([]);
      setIsLoading(false);
      setHasInitialized(true);
    }
  }, [effectiveShopId, lastFetchedShopId, hasInitialized, fetchHiddenSections]);

  // Helper to check if path matches any in a list (including related paths).
  // Normalizes paths (strips `/system` prefix) so sidebar hrefs (`/system/invoices`)
  // reliably match section keys (`/invoices`).
  const isPathInList = useCallback((path: string, list: string[]): boolean => {
    const normalizedPath = normalizePath(path);
    const normalizedList = list.map(normalizePath);

    // Direct match
    if (normalizedList.includes(normalizedPath)) {
      return true;
    }

    // Check if path starts with a hidden section (boundary-safe: avoids
    // `/products` matching `/productivity`)
    for (const hiddenPath of normalizedList) {
      if (hiddenPath !== '' && normalizedPath.startsWith(hiddenPath + '/')) {
        return true;
      }
    }

    // Check related paths
    for (const section of ALL_SECTIONS) {
      if (list.includes(section.path)) {
        const relatedList = (section.relatedPaths || []).map(normalizePath);
        if (relatedList.some(rp => normalizedPath === rp || normalizedPath.startsWith(rp + '/'))) {
          return true;
        }
      }
    }

    return false;
  }, []);

  // Check if a section is hidden by SuperAdmin (hidden from ADMIN + USER)
  const isSuperAdminHidden = useCallback((path: string): boolean => {
    return isPathInList(path, hiddenSections);
  }, [hiddenSections, isPathInList]);

  // Check if a section is hidden by Shop ADMIN (hidden from USER only)
  const isAdminHidden = useCallback((path: string): boolean => {
    return isPathInList(path, adminHiddenSections);
  }, [adminHiddenSections, isPathInList]);

  // Check if a path is hidden for the CURRENT USER.
  // Both SuperAdmin-hidden and Admin-hidden sections apply universally to ALL
  // shop users (ADMIN, MANAGER, and regular USER) - no role bypass.
  const isSectionHidden = useCallback((path: string): boolean => {
    // Dashboard (`/` or `/system`, incl. `/system/dashboard`) must ALWAYS be
    // visible as the root fallback route. Hiding it would trigger a redirect
    // loop between the router and AdminLayout, trapping users on an infinite
    // spinner. This guard overrides both hidden lists.
    const normalized = normalizePath(path);
    if (normalized === '' || normalized === 'dashboard') {
      return false;
    }

    // SuperAdmins viewing the ecosystem (no shop) see their own nav untouched,
    // but shop users (ADMIN/MANAGER/STAFF) always respect both hidden lists.
    if (user?.role === 'SUPER_ADMIN' && !user?.shop) {
      return false;
    }
    
    // Both SuperAdmin and Shop Admin hidden lists must apply universally
    return isSuperAdminHidden(path) || isAdminHidden(path);
  }, [user?.role, user?.shop, isSuperAdminHidden, isAdminHidden]);

  // Update hidden sections (Super Admin only - affects ADMIN + USER).
  // Persists to localStorage + state immediately for instant reactive sidebar sync,
  // then dispatches the backend settings update.
  const updateHiddenSections = useCallback(async (sections: string[]): Promise<void> => {
    const token = getAccessToken();
    
    if (!effectiveShopId || !token) {
      throw new Error('No shop selected');
    }

    if (user?.role !== 'SUPER_ADMIN') {
      throw new Error('Only Super Admin can update section visibility');
    }

    // 1. Instantly update global state + persist to localStorage (reactive sidebar sync)
    setHiddenSections(sections);
    localStorage.setItem('ecotec_hidden_sections', JSON.stringify(sections));
    localStorage.setItem(`shop_hidden_sections_${effectiveShopId}`, JSON.stringify(sections));

    // 2. Dispatch backend persistence (fire and await for error reporting)
    const url = `${API_BASE_URL}/shops/current/sections`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hiddenSections: sections }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to update sections:', error);
      throw new Error(error.message || error.error || 'Failed to update sections');
    }

    // Sync authoritative server response (backend wraps in `data`)
    const responseData = await response.json();
    const syncedHidden = responseData?.data?.hiddenSections ?? responseData?.hiddenSections;
    if (Array.isArray(syncedHidden)) {
      setHiddenSections(syncedHidden);
      localStorage.setItem('ecotec_hidden_sections', JSON.stringify(syncedHidden));
      localStorage.setItem(`shop_hidden_sections_${effectiveShopId}`, JSON.stringify(syncedHidden));
    }
  }, [effectiveShopId, getAccessToken, user?.role]);

  // Update admin hidden sections (Shop ADMIN - affects USER only).
  // Persists to localStorage + state immediately for instant reactive sidebar sync.
  const updateAdminHiddenSections = useCallback(async (sections: string[]): Promise<void> => {
    const token = getAccessToken();
    
    if (!effectiveShopId || !token) {
      throw new Error('No shop selected');
    }

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      throw new Error('Only Shop Admin can update user section visibility');
    }

    // 1. Instantly update global state + persist to localStorage (reactive sidebar sync)
    setAdminHiddenSections(sections);
    localStorage.setItem(`shop_admin_hidden_sections_${effectiveShopId}`, JSON.stringify(sections));

    // 2. Dispatch backend persistence
    const url = `${API_BASE_URL}/shops/current/sections`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminHiddenSections: sections }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to update admin sections:', error);
      throw new Error(error.message || error.error || 'Failed to update admin sections');
    }

    // Sync authoritative server response (backend wraps in `data`)
    const responseData = await response.json();
    const syncedAdminHidden = responseData?.data?.adminHiddenSections ?? responseData?.adminHiddenSections;
    if (Array.isArray(syncedAdminHidden)) {
      setAdminHiddenSections(syncedAdminHidden);
      localStorage.setItem(`shop_admin_hidden_sections_${effectiveShopId}`, JSON.stringify(syncedAdminHidden));
    }
  }, [effectiveShopId, getAccessToken, user?.role]);

  // Get all sections with visibility status (for SuperAdmin view)
  const getAllSections = useCallback(() => {
    return ALL_SECTIONS.map(section => ({
      ...section,
      isHidden: hiddenSections.includes(section.path),
      isAdminHidden: adminHiddenSections.includes(section.path),
    }));
  }, [hiddenSections, adminHiddenSections]);

  // Get sections visible to Shop ADMIN (only those NOT hidden by SuperAdmin)
  // This is what ADMIN sees in their Sections tab
  const getAdminVisibleSections = useCallback(() => {
    return ALL_SECTIONS
      .filter(section => !hiddenSections.includes(section.path))
      .map(section => ({
        ...section,
        isHidden: adminHiddenSections.includes(section.path),
      }));
  }, [hiddenSections, adminHiddenSections]);

  return (
    <ShopSectionsContext.Provider
      value={{
        hiddenSections,
        adminHiddenSections,
        isLoading,
        isSuperAdminHidden,
        isAdminHidden,
        isSectionHidden,
        updateHiddenSections,
        updateAdminHiddenSections,
        refreshSections: () => fetchHiddenSections(true), // Force refresh when called manually
        getAllSections,
        getAdminVisibleSections,
      }}
    >
      {children}
    </ShopSectionsContext.Provider>
  );
};

export const useShopSections = () => {
  const context = useContext(ShopSectionsContext);
  if (!context) {
    throw new Error('useShopSections must be used within ShopSectionsProvider');
  }
  return context;
};
