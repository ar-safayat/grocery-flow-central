
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/context/auth-context";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Vendors from "./pages/Vendors";
import Customers from "./pages/Customers";
import PurchaseOrders from "./pages/PurchaseOrders";
import Delivery from "./pages/Delivery";
import RiderPortal from "./pages/RiderPortal";
import RiderPortalDashboard from "./pages/RiderPortalDashboard";
import Accounting from "./pages/Accounting";
import AccountingDashboard from "./pages/Accounting/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import ProductsPage from "./pages/Inventory/Products";
import CategoriesPage from "./pages/Inventory/Categories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route index element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes inside MainLayout */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Inventory Routes */}
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/products" element={<ProductsPage />} />
              <Route path="inventory/categories" element={<CategoriesPage />} />
              
              {/* Sales Routes */}
              <Route path="sales" element={<Sales />} />
              <Route path="sales/orders" element={<Sales />} />
              <Route path="sales/pos" element={<Sales />} />
              
              {/* Vendor & Customer Routes */}
              <Route path="vendors" element={<Vendors />} />
              <Route path="customers" element={<Customers />} />
              
              {/* Purchase Order Routes */}
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              
              {/* Delivery Management Routes */}
              <Route path="delivery" element={<Delivery />} />
              <Route path="delivery/list" element={<Delivery />} />
              <Route path="delivery/riders" element={<Delivery />} />
              
              {/* Rider Portal */}
              <Route path="rider-portal" element={<RiderPortal />} />
              <Route path="rider-portal/dashboard" element={<RiderPortalDashboard />} />
              
              {/* Accounting Routes */}
              <Route path="accounting" element={<AccountingDashboard />} />
              <Route path="accounting/dashboard" element={<AccountingDashboard />} />
              <Route path="accounting/transactions" element={<Accounting />} />
              <Route path="accounting/invoices" element={<Accounting />} />
              
              {/* Reports */}
              <Route path="reports" element={<Reports />} />
              
              {/* Settings */}
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
