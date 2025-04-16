
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Bike, 
  User, 
  Lock, 
  LogIn, 
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function RiderPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      toast({
        title: "Success",
        description: "You've successfully logged in to the Rider Portal.",
      });
    }, 1500);
  };
  
  if (isLoggedIn) {
    return <Navigate to="/rider-portal/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-3">
            <Bike className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Rider Portal</h1>
          <p className="text-muted-foreground mt-2">
            Log in to access your delivery assignments
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleLogin}>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    placeholder="you@example.com" 
                    type="email"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    type="password" 
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground mt-4">
                Demo Login: rider@example.com / password
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default RiderPortal;
