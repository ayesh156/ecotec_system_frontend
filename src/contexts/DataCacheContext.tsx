import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo, type ReactNode } from 'react';
import type { Customer, Product, Invoice } from '../data/mockData';
import { customerService, convertAPICustomerToFrontend } from '../services/customerService';
import { productService, convertAPIProductToFrontend } from '../services/productService';
import { invoiceService, convertAPIInvoiceToFrontend } from '../services/invoiceService';
import { useAuth } from './AuthContext';
import { getCachedData, getStaleCachedData, setCachedData, clearAllCaches } from '../lib/persistentCache';

interface DataCacheContextType {
  // Customers
  customers: Customer[];
  customersLoading: boolean;
  customersLoaded: boolean;
  loadCustomers: (forceRefresh?: boolean) => Promise<Customer[]>;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  
  // Products
  products: Product[];
  productsLoading: boolean;
  productsLoaded: boolean;
  loadProducts: (forceRefresh?: boolean) => Promise<Product[]>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  // Invoices
  invoices: Invoice[];
  invoicesLoading: boolean;
  invoicesLoaded: boolean;
  loadInvoices: (forceRefresh?: boolean) => Promise<Invoice[]>;
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  
  // Combined loading
  isUsingAPI: boolean;
  
  // Convenience loading flags
  isLoadingCustomers: boolean;
  isLoadingProducts: boolean;
  isLoadingInvoices: boolean;
  
  // Last updated timestamps
  lastCustomersUpdate: number | null;
  lastProductsUpdate: number | null;
  lastInvoicesUpdate: number | null;
  
  // Current shop being viewed (for debugging)
  currentShopId: string | null;
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(undefined);

// Cache expiry time in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

export const DataCacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get viewing shop context for SUPER_ADMIN
  const { user } = useAuth();
  
  // Track the current shop ID for cache invalidation
  const currentShopIdRef = useRef<string | null>(null);
  
  // Request version counter to prevent stale data (race condition fix)
  const requestVersionRef = useRef<{
    customers: number;
    products: number;
    invoices: number;
  }>({ customers: 0, products: 0, invoices: 0 });
  
  // Track if we're transitioning shops (prevents flickering)
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ---- STATE (kept for reactivity in children) ----
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersLoaded, setCustomersLoaded] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoicesLoaded, setInvoicesLoaded] = useState(false);
  
  const [isUsingAPI, setIsUsingAPI] = useState(false);

  // ---- REFS (mirror state so loader callbacks stay STABLE, preventing effect re-fetch loops) ----
  const customersRef = useRef<Customer[]>([]);
  const productsRef = useRef<Product[]>([]);
  const invoicesRef = useRef<Invoice[]>([]);
  const customersLoadedRef = useRef(false);
  const productsLoadedRef = useRef(false);
  const invoicesLoadedRef = useRef(false);
  const lastCustomersUpdateRef = useRef<number | null>(null);
  const lastProductsUpdateRef = useRef<number | null>(null);
  const lastInvoicesUpdateRef = useRef<number | null>(null);

  // Keep refs and state in sync
  const syncCustomers = (data: Customer[]) => { customersRef.current = data; setCustomers(data); };
  const syncProducts = (data: Product[]) => { productsRef.current = data; setProducts(data); };
  const syncInvoices = (data: Invoice[]) => { invoicesRef.current = data; setInvoices(data); };
  
  // Get the effective shop ID (viewing shop for SUPER_ADMIN, own shop otherwise)
  // Memoize to prevent unnecessary re-renders
  const effectiveShopId = useMemo(() => {
    return user?.shop?.id || null;
  }, [user?.shop?.id]);

  // Clear cache when switching shops (SUPER_ADMIN viewing different shops)
  useEffect(() => {
    const newShopId = effectiveShopId || null;
    const previousShopId = currentShopIdRef.current;
    
    // Clear cache when shop changes (including first selection from null)
    // Skip if both are null (initial state before any shop is selected)
    const shopChanged = previousShopId !== newShopId && (previousShopId !== null || newShopId !== null);
    
    if (shopChanged) {
      // Start transition - prevents showing stale data
      setIsTransitioning(true);
      
      // Increment request versions to invalidate any in-flight requests
      requestVersionRef.current = {
        customers: requestVersionRef.current.customers + 1,
        products: requestVersionRef.current.products + 1,
        invoices: requestVersionRef.current.invoices + 1,
      };
      
      // Clear all cached data atomically (including persistent cache)
      clearAllCaches();
      
      syncCustomers([]);
      customersLoadedRef.current = false;
      setCustomersLoaded(false);
      lastCustomersUpdateRef.current = null;
      
      syncProducts([]);
      productsLoadedRef.current = false;
      setProductsLoaded(false);
      lastProductsUpdateRef.current = null;
      
      syncInvoices([]);
      invoicesLoadedRef.current = false;
      setInvoicesLoaded(false);
      lastInvoicesUpdateRef.current = null;
      
      // End transition after a brief delay to let React batch updates
      setTimeout(() => setIsTransitioning(false), 50);
    }
    
    currentShopIdRef.current = newShopId;
  }, [effectiveShopId]);

  // Load customers with caching and race condition protection.
  // STABLE useCallback: only depends on effectiveShopId + isTransitioning state,
  // reads data/loaded flags from refs so changing data does NOT re-create this
  // function (which would re-trigger consumer useEffect fetch loops).
  const loadCustomers = useCallback(async (forceRefresh = false): Promise<Customer[]> => {
    const now = Date.now();
    const cacheValid = lastCustomersUpdateRef.current && 
                       (now - lastCustomersUpdateRef.current) < CACHE_EXPIRY;
    
    // Get current shop ID for this request
    const shopIdParam = effectiveShopId || undefined;
    
    // Skip if already loaded and cache is valid (unless force refresh)
    if (customersLoadedRef.current && cacheValid && !forceRefresh && !isTransitioning) {
      return customersRef.current;
    }
    
    // Try persistent cache first (instant load from localStorage).
    // NOTE: We intentionally do NOT schedule a self-refreshing setTimeout here,
    // as that re-triggered fetch loops. Fresh data is obtained on expiry/refresh.
    if (!forceRefresh && !isTransitioning && !customersLoadedRef.current) {
      const persistedCustomers = getCachedData<Customer[]>('customers', effectiveShopId);
      if (persistedCustomers && persistedCustomers.length > 0) {
        syncCustomers(persistedCustomers);
        customersLoadedRef.current = true;
        setCustomersLoaded(true);
        setIsUsingAPI(true);
        lastCustomersUpdateRef.current = now;
        return persistedCustomers;
      }
    }
    
    // Capture the request version at start
    const requestVersion = ++requestVersionRef.current.customers;
    
    // Try stale persistent cache as instant fallback while loading
    if (!customersLoadedRef.current) {
      const staleCustomers = getStaleCachedData<Customer[]>('customers', effectiveShopId);
      if (staleCustomers && staleCustomers.length > 0) {
        syncCustomers(staleCustomers);
        setIsUsingAPI(true);
      }
    }
    
    setCustomersLoading(true);
    try {
      const { customers: apiCustomers } = await customerService.getAll({ limit: 1000, shopId: shopIdParam });
      
      // Check if this request is still valid (shop hasn't changed)
      if (requestVersion !== requestVersionRef.current.customers) {
        return customersRef.current;
      }
      
      const converted = apiCustomers.map(convertAPICustomerToFrontend);
      if (converted.length > 0 || forceRefresh) {
        syncCustomers(converted);
        setIsUsingAPI(true);
        // Persist to localStorage for next visit
        setCachedData('customers', converted, effectiveShopId);
        customersLoadedRef.current = true;
        setCustomersLoaded(true);
        lastCustomersUpdateRef.current = now;
        return converted;
      }
      return customersRef.current;
    } catch (error) {
      console.warn('⚠️ Failed to load customers from API:', error);
      throw error;
    } finally {
      // Only clear loading if this is still the current request
      if (requestVersion === requestVersionRef.current.customers) {
        setCustomersLoading(false);
      }
    }
  }, [effectiveShopId, isTransitioning]);

  // Load products with caching and race condition protection (STABLE callback).
  const loadProducts = useCallback(async (forceRefresh = false): Promise<Product[]> => {
    const now = Date.now();
    const cacheValid = lastProductsUpdateRef.current && 
                       (now - lastProductsUpdateRef.current) < CACHE_EXPIRY;
    
    // Get current shop ID for this request
    const shopIdParam = effectiveShopId || undefined;
    
    // Skip if already loaded and cache is valid (unless force refresh)
    if (productsLoadedRef.current && cacheValid && !forceRefresh && !isTransitioning) {
      return productsRef.current;
    }
    
    // Try persistent cache first (instant load from localStorage).
    // NOTE: No self-scheduling background refresh here (avoided fetch loop).
    if (!forceRefresh && !isTransitioning && !productsLoadedRef.current) {
      const persistedProducts = getCachedData<Product[]>('products', effectiveShopId);
      if (persistedProducts && persistedProducts.length > 0) {
        syncProducts(persistedProducts);
        productsLoadedRef.current = true;
        setProductsLoaded(true);
        setIsUsingAPI(true);
        lastProductsUpdateRef.current = now;
        return persistedProducts;
      }
    }
    
    // Capture the request version at start
    const requestVersion = ++requestVersionRef.current.products;
    
    // Try stale persistent cache as instant fallback while loading
    if (!productsLoadedRef.current) {
      const staleProducts = getStaleCachedData<Product[]>('products', effectiveShopId);
      if (staleProducts && staleProducts.length > 0) {
        syncProducts(staleProducts);
        setIsUsingAPI(true);
      }
    }
    
    setProductsLoading(true);
    try {
      const { products: apiProducts } = await productService.getAll({ limit: 1000, shopId: shopIdParam });
      
      // Check if this request is still valid (shop hasn't changed)
      if (requestVersion !== requestVersionRef.current.products) {
        return productsRef.current;
      }
      
      const converted = apiProducts.map(convertAPIProductToFrontend);
      if (converted.length > 0 || forceRefresh) {
        syncProducts(converted);
        setIsUsingAPI(true);
        // Persist to localStorage for next visit
        setCachedData('products', converted, effectiveShopId);
        productsLoadedRef.current = true;
        setProductsLoaded(true);
        lastProductsUpdateRef.current = now;
        return converted;
      }
      return productsRef.current;
    } catch (error) {
      console.warn('⚠️ Failed to load products from API:', error);
      throw error;
    } finally {
      // Only clear loading if this is still the current request
      if (requestVersion === requestVersionRef.current.products) {
        setProductsLoading(false);
      }
    }
  }, [effectiveShopId, isTransitioning]);

  // Load invoices with caching and race condition protection (STABLE callback).
  const loadInvoices = useCallback(async (forceRefresh = false): Promise<Invoice[]> => {
    const now = Date.now();
    const cacheValid = lastInvoicesUpdateRef.current && 
                       (now - lastInvoicesUpdateRef.current) < CACHE_EXPIRY;
    
    // Get current shop ID for this request
    const shopIdParam = effectiveShopId || undefined;
    
    // Skip if already loaded and cache is valid (unless force refresh)
    if (invoicesLoadedRef.current && cacheValid && !forceRefresh && !isTransitioning) {
      return invoicesRef.current;
    }
    
    // Try persistent cache first (instant load from localStorage).
    // NOTE: No self-scheduling background refresh here (avoided fetch loop).
    if (!forceRefresh && !isTransitioning && !invoicesLoadedRef.current) {
      const persistedInvoices = getCachedData<Invoice[]>('invoices', effectiveShopId);
      if (persistedInvoices && persistedInvoices.length > 0) {
        syncInvoices(persistedInvoices);
        invoicesLoadedRef.current = true;
        setInvoicesLoaded(true);
        setIsUsingAPI(true);
        lastInvoicesUpdateRef.current = now;
        return persistedInvoices;
      }
    }
    
    // Capture the request version at start
    const requestVersion = ++requestVersionRef.current.invoices;
    
    // Try stale persistent cache as instant fallback while loading
    if (!invoicesLoadedRef.current) {
      const staleInvoices = getStaleCachedData<Invoice[]>('invoices', effectiveShopId);
      if (staleInvoices && staleInvoices.length > 0) {
        syncInvoices(staleInvoices);
        setIsUsingAPI(true);
      }
    }
    
    setInvoicesLoading(true);
    try {
      const { invoices: apiInvoices } = await invoiceService.getAll({
        page: 1,
        limit: 1000,
        sortBy: 'date',
        sortOrder: 'desc',
        shopId: shopIdParam,
      });
      
      // Check if this request is still valid (shop hasn't changed)
      if (requestVersion !== requestVersionRef.current.invoices) {
        return invoicesRef.current;
      }
      
      const converted = apiInvoices.map(convertAPIInvoiceToFrontend);
      syncInvoices(converted);
      setIsUsingAPI(true);
      // Persist to localStorage for next visit
      setCachedData('invoices', converted, effectiveShopId);
      invoicesLoadedRef.current = true;
      setInvoicesLoaded(true);
      lastInvoicesUpdateRef.current = now;
      return converted;
    } catch (error) {
      console.warn('⚠️ Failed to load invoices from API:', error);
      throw error;
    } finally {
      // Only clear loading if this is still the current request
      if (requestVersion === requestVersionRef.current.invoices) {
        setInvoicesLoading(false);
      }
    }
  }, [effectiveShopId, isTransitioning]);

  return (
    <DataCacheContext.Provider value={{
      customers,
      customersLoading,
      customersLoaded,
      loadCustomers,
      setCustomers,
      products,
      productsLoading,
      productsLoaded,
      loadProducts,
      setProducts,
      invoices,
      invoicesLoading,
      invoicesLoaded,
      loadInvoices,
      setInvoices,
      isUsingAPI,
      isLoadingCustomers: customersLoading,
      isLoadingProducts: productsLoading,
      isLoadingInvoices: invoicesLoading,
      lastCustomersUpdate: lastCustomersUpdateRef.current,
      lastProductsUpdate: lastProductsUpdateRef.current,
      lastInvoicesUpdate: lastInvoicesUpdateRef.current,
      currentShopId: effectiveShopId,
    }}>
      {children}
    </DataCacheContext.Provider>
  );
};

export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (!context) {
    throw new Error('useDataCache must be used within DataCacheProvider');
  }
  return context;
};