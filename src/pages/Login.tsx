
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/context/auth-context';

function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">GroceryFlow Central</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Complete ERP Solution for Online Grocery Stores
        </p>
      </div>
      <div className="w-full max-w-md bg-background p-8 rounded-lg shadow-lg border">
        <LoginForm />
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          GroceryFlow Central ERP System
          <br />
          Inventory • Sales • Purchase Orders • Vendors • Customers • Delivery • Accounting
        </p>
      </div>
    </div>
  );
}

export default Login;
