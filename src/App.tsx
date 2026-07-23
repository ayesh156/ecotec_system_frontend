import './index.css';

import { Suspense, lazy, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, ProtectedRoute, useAuth } from './contexts/AuthContext';
import { WhatsAppSettingsProvider } from './contexts/WhatsAppSettingsContext';
import { TaxSettingsProvider } from './contexts/TaxSettingsContext';
import { DataCacheProvider } from './contexts/DataCacheContext';
import { ShopBrandingProvider } from './contexts/ShopBrandingContext';
import { ShopSectionsProvider } from './contexts/ShopSectionsContext';
import { AdminLayout } from './components/AdminLayout';
import { SectionGuard } from './components/SectionGuard';
import { Toaster } from 'sonner';

// Public Website Imports
import PublicLayout from './website/components/PublicLayout';
import Home from './website/pages/Home';
import ProductsPage from './website/pages/Products';
import ServicesPage from './website/pages/Services';
import About from './website/pages/About';
import Contact from './website/pages/Contact';

// Eager load Dashboard (landing page) and Auth pages
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';

// Lazy load all other pages
const Invoices = lazy(() => import('./pages/Invoices').then(m => ({ default: m.Invoices })));
const CreateInvoice = lazy(() => import('./pages/CreateInvoice').then(m => ({ default: m.CreateInvoice })));
const ViewInvoice = lazy(() => import('./pages/ViewInvoice').then(m => ({ default: m.ViewInvoice })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const ProductForm = lazy(() => import('./pages/ProductForm').then(m => ({ default: m.ProductForm })));
const ProductLabels = lazy(() => import('./pages/ProductLabels').then(m => ({ default: m.ProductLabels })));
const Categories = lazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));
const Brands = lazy(() => import('./pages/Brands').then(m => ({ default: m.Brands })));
const Customers = lazy(() => import('./pages/Customers').then(m => ({ default: m.Customers })));
const Suppliers = lazy(() => import('./pages/Suppliers').then(m => ({ default: m.Suppliers })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Warranties = lazy(() => import('./pages/Warranties').then(m => ({ default: m.Warranties })));
const GoodsReceived = lazy(() => import('./pages/GoodsReceived').then(m => ({ default: m.GoodsReceived })));
const CreateGRN = lazy(() => import('./pages/CreateGRN').then(m => ({ default: m.CreateGRN })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const ServiceForm = lazy(() => import('./pages/ServiceForm').then(m => ({ default: m.ServiceForm })));
const ServiceCategories = lazy(() => import('./pages/ServiceCategories').then(m => ({ default: m.ServiceCategories })));
const Estimates = lazy(() => import('./pages/Estimates').then(m => ({ default: m.Estimates })));
const EstimateForm = lazy(() => import('./pages/EstimateForm').then(m => ({ default: m.EstimateForm })));
const Quotations = lazy(() => import('./pages/Quotations').then(m => ({ default: m.Quotations })));
const QuotationForm = lazy(() => import('./pages/QuotationForm').then(m => ({ default: m.QuotationForm })));
const JobNotes = lazy(() => import('./pages/JobNotes').then(m => ({ default: m.JobNotes })));
const JobNoteForm = lazy(() => import('./pages/JobNoteForm').then(m => ({ default: m.JobNoteForm })));
const Technicians = lazy(() => import('./pages/Technicians').then(m => ({ default: m.Technicians })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Help = lazy(() => import('./pages/Help').then(m => ({ default: m.Help })));
const CashManagement = lazy(() => import('./pages/CashManagement').then(m => ({ default: m.CashManagement })));
const AIChat = lazy(() => import('./pages/AIChat').then(m => ({ default: m.AIChat })));
const Notes = lazy(() => import('./pages/Notes').then(m => ({ default: m.Notes })));
const Calendar = lazy(() => import('./pages/Calendar').then(m => ({ default: m.Calendar })));
const DataExport = lazy(() => import('./pages/DataExport').then(m => ({ default: m.DataExport })));
const ShopAdminPanel = lazy(() => import('./pages/admin').then(m => ({ default: m.ShopAdminPanel })));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

// Lightweight top-progress bar spinner for public website routes
// Inject the loading progress keyframe animation into the document
const loadingProgressStyleId = 'public-route-loader-style';
if (typeof document !== 'undefined' && !document.getElementById(loadingProgressStyleId)) {
  const styleEl = document.createElement('style');
  styleEl.id = loadingProgressStyleId;
  styleEl.textContent = `
@keyframes loading-progress {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(200%); }
  100% { transform: translateX(400%); }
}
`;
  document.head.appendChild(styleEl);
}

// Skeleton loading screen for lazy-loaded pages
function PageSkeleton() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-slate-700/50 rounded-xl" />
          <div className="h-4 w-64 bg-slate-700/30 rounded-lg mt-2" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-700/40 rounded-xl" />
          <div className="h-10 w-36 bg-emerald-500/20 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-800/40 rounded-2xl border border-slate-700/30" />
        ))}
      </div>
      <div className="h-14 bg-slate-800/30 rounded-2xl border border-slate-700/30" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-slate-800/30 rounded-2xl border border-slate-700/30">
            <div className="p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-slate-700/50 rounded-lg" />
                <div className="h-5 w-20 bg-slate-700/30 rounded-lg" />
              </div>
              <div className="h-4 w-full bg-slate-700/20 rounded" />
              <div className="h-4 w-3/4 bg-slate-700/20 rounded" />
              <div className="h-4 w-1/2 bg-slate-700/20 rounded" />
              <div className="flex gap-2 pt-2">
                <div className="h-8 w-20 bg-slate-700/30 rounded-lg" />
                <div className="h-8 w-20 bg-slate-700/30 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Toast provider with theme support
function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1e293b' : '#ffffff',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
        },
      }}
    />
  );
}

/**
 * SystemRootRedirect - Handles exact /system path
 * Redirects authenticated users to /system/dashboard
 * Redirects guest users to /system/login
 */
function SystemRootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      window.location.href = isAuthenticated ? '/system/dashboard' : '/system/login';
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-16 h-16 mx-auto mb-4 text-emerald-400">
        <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <WhatsAppSettingsProvider>
              <TaxSettingsProvider>
                <DataCacheProvider>
                <ShopBrandingProvider>
                <ShopSectionsProvider>
                <ThemedToaster />
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true
                  }}
                >
                  <Routes>
                    {/* Public Website Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                    </Route>

                    {/* System Auth Routes - No Layout */}
                    <Route path="/system/login" element={<Login />} />
                    <Route path="/system/forgot-password" element={<ForgotPassword />} />

                    {/* Legacy Auth Route Redirect */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* System Root Redirect - Handles exact /system path */}
                    <Route path="/system" element={<SystemRootRedirect />} />

                    {/* Protected System Routes - With AdminLayout under /system/* */}
                    <Route path="/system/*" element={
                      <ProtectedRoute>
                        <AdminLayout>
                          <Suspense fallback={<PageSkeleton />}>
                            <Routes>
                              <Route path="dashboard" element={<Dashboard />} />
                              <Route path="invoices" element={<SectionGuard path="/invoices"><Invoices /></SectionGuard>} />
                              <Route path="invoices/create" element={<SectionGuard path="/invoices"><CreateInvoice /></SectionGuard>} />
                              <Route path="invoices/:id" element={<SectionGuard path="/invoices"><ViewInvoice /></SectionGuard>} />
                              <Route path="products" element={<SectionGuard path="/products"><Products /></SectionGuard>} />
                              <Route path="products/add" element={<SectionGuard path="/products"><ProductForm /></SectionGuard>} />
                              <Route path="products/edit/:id" element={<SectionGuard path="/products"><ProductForm /></SectionGuard>} />
                              <Route path="products/labels" element={<SectionGuard path="/products"><ProductLabels /></SectionGuard>} />
                              <Route path="categories" element={<SectionGuard path="/products"><Categories /></SectionGuard>} />
                              <Route path="brands" element={<SectionGuard path="/products"><Brands /></SectionGuard>} />
                              <Route path="customers" element={<SectionGuard path="/customers"><Customers /></SectionGuard>} />
                              <Route path="suppliers" element={<SectionGuard path="/suppliers"><Suppliers /></SectionGuard>} />
                              <Route path="grn" element={<SectionGuard path="/grn"><GoodsReceived /></SectionGuard>} />
                              <Route path="grn/create" element={<SectionGuard path="/grn"><CreateGRN /></SectionGuard>} />
                              <Route path="warranties" element={<SectionGuard path="/warranties"><Warranties /></SectionGuard>} />
                              <Route path="estimates" element={<SectionGuard path="/estimates"><Estimates /></SectionGuard>} />
                              <Route path="estimates/create" element={<SectionGuard path="/estimates"><EstimateForm /></SectionGuard>} />
                              <Route path="estimates/edit/:id" element={<SectionGuard path="/estimates"><EstimateForm /></SectionGuard>} />
                              <Route path="quotations" element={<SectionGuard path="/quotations"><Quotations /></SectionGuard>} />
                              <Route path="quotations/create" element={<SectionGuard path="/quotations"><QuotationForm /></SectionGuard>} />
                              <Route path="quotations/edit/:id" element={<SectionGuard path="/quotations"><QuotationForm /></SectionGuard>} />
                              <Route path="services" element={<SectionGuard path="/services"><Services /></SectionGuard>} />
                              <Route path="services/add" element={<SectionGuard path="/services"><ServiceForm /></SectionGuard>} />
                              <Route path="services/edit/:id" element={<SectionGuard path="/services"><ServiceForm /></SectionGuard>} />
                              <Route path="service-categories" element={<SectionGuard path="/services"><ServiceCategories /></SectionGuard>} />
                              <Route path="job-notes" element={<SectionGuard path="/job-notes"><JobNotes /></SectionGuard>} />
                              <Route path="job-notes/create" element={<SectionGuard path="/job-notes"><JobNoteForm /></SectionGuard>} />
                              <Route path="job-notes/edit/:id" element={<SectionGuard path="/job-notes"><JobNoteForm /></SectionGuard>} />
                              <Route path="technicians" element={<SectionGuard path="/job-notes"><Technicians /></SectionGuard>} />
                              <Route path="reports" element={<SectionGuard path="/reports"><Reports /></SectionGuard>} />
                              <Route path="cash-management" element={<SectionGuard path="/cash-management"><CashManagement /></SectionGuard>} />
                              <Route path="cash-management/transactions" element={<SectionGuard path="/cash-management"><CashManagement /></SectionGuard>} />
                              <Route path="cash-management/insights" element={<SectionGuard path="/cash-management"><CashManagement /></SectionGuard>} />
                              <Route path="cash-management/accounts" element={<SectionGuard path="/cash-management"><CashManagement /></SectionGuard>} />
                              <Route path="settings" element={<Settings />} />
                              <Route path="help" element={<Help />} />
                              <Route path="ai-chat" element={<AIChat />} />
                              <Route path="notes" element={<SectionGuard path="/notes"><Notes /></SectionGuard>} />
                              <Route path="calendar" element={<SectionGuard path="/calendar"><Calendar /></SectionGuard>} />
                              <Route path="data-export" element={<SectionGuard path="/data-export"><DataExport /></SectionGuard>} />
                              <Route path="shop-admin" element={<ShopAdminPanel />} />
                              <Route path="shop-admin/users" element={<ShopAdminPanel />} />
                              <Route path="shop-admin/branding" element={<ShopAdminPanel />} />
                              <Route path="shop-admin/sections" element={<ShopAdminPanel />} />
                              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                        </AdminLayout>
                      </ProtectedRoute>
                    } />

                    {/* Direct /dashboard access redirect to /system/dashboard */}
                    {/* This catches users typing /dashboard in the URL bar before auth check completes */}
                    <Route path="/dashboard" element={
                      <Navigate to="/system/dashboard" replace />
                    } />

                    {/* Legacy redirect: support old /system path without trailing /system prefix */}
                    <Route path="/*" element={
                      <ProtectedRoute>
                        <AdminLayout>
                          <Suspense fallback={<PageSkeleton />}>
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/dashboard" element={<Dashboard />} />
                              {/* Fallback for any unmatched /system routes */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                        </AdminLayout>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </BrowserRouter>
                </ShopSectionsProvider>
                </ShopBrandingProvider>
                </DataCacheProvider>
              </TaxSettingsProvider>
            </WhatsAppSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;