
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package2, Users, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2">GroceryFlow Central</h1>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, show welcome page with login option
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 p-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-primary">GroceryFlow Central</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Complete ERP Solution for Online Grocery Stores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-background p-6 rounded-lg shadow-md border flex flex-col items-center text-center">
              <ShoppingCart size={36} className="text-primary mb-4" />
              <h3 className="font-semibold text-lg">Sales Management</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Track orders, process payments, and manage customer relationships
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-md border flex flex-col items-center text-center">
              <Package2 size={36} className="text-primary mb-4" />
              <h3 className="font-semibold text-lg">Inventory Control</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Monitor stock levels, manage products, and automate reordering
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-md border flex flex-col items-center text-center">
              <Users size={36} className="text-primary mb-4" />
              <h3 className="font-semibold text-lg">Vendor & Customer</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Manage suppliers, track customer data, and build relationships
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-md border flex flex-col items-center text-center">
              <Settings size={36} className="text-primary mb-4" />
              <h3 className="font-semibold text-lg">Complete System</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Accounting, reporting, delivery management, and much more
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Button size="lg" onClick={() => navigate('/login')}>
              Login to Get Started
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Demo Credentials: admin@groceryflow.com / any password
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default redirect behavior
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">GroceryFlow Central</h1>
        <p className="mt-2">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
