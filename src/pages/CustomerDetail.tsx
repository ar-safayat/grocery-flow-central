
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  DollarSign, 
  Calendar, 
  Edit, 
  Plus, 
  Trash2,
  ShoppingCart,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Customer, Address, Order } from '@/types';

// Mock customer data
const mockCustomer: Customer = {
  id: 'c-1001',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '(555) 123-4567',
  type: 'individual',
  addresses: [
    {
      id: 'addr-1001',
      type: 'shipping',
      street: '1234 Main Street',
      city: 'Cityville',
      state: 'State',
      postalCode: '12345',
      country: 'Country',
      isDefault: true,
    },
    {
      id: 'addr-1002',
      type: 'billing',
      street: '1234 Main Street',
      city: 'Cityville',
      state: 'State',
      postalCode: '12345',
      country: 'Country',
      isDefault: true,
    }
  ],
  notes: 'Prefers organic products. Allergic to nuts.',
  createdAt: new Date(2023, 3, 15),
  totalOrders: 12,
  totalSpent: 1250.75,
};

// Mock orders for this customer
const mockOrders: Order[] = Array(5).fill(null).map((_, index) => ({
  id: `o-${2000 + index}`,
  orderNumber: `ORD-${20000 + index}`,
  customer: mockCustomer,
  items: Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, itemIndex) => ({
    id: `oi-${4000 + index * 10 + itemIndex}`,
    productId: `p-${5000 + itemIndex}`,
    productName: [
      'Organic Bananas',
      'Farm Fresh Milk',
      'Whole Wheat Bread',
      'Free Range Eggs',
    ][itemIndex % 4],
    quantity: Math.floor(Math.random() * 3) + 1,
    unitPrice: parseFloat((Math.random() * 10 + 1.99).toFixed(2)),
    tax: parseFloat((Math.random() * 1).toFixed(2)),
    discount: parseFloat((Math.random() * 2).toFixed(2)),
    total: 0, // Calculated below
  })),
  status: ['pending', 'processing', 'delivered', 'cancelled'][index % 4] as any,
  paymentStatus: ['pending', 'paid', 'refunded'][index % 3] as any,
  paymentMethod: ['credit_card', 'cash', 'online'][index % 3],
  shippingAddress: mockCustomer.addresses[0],
  billingAddress: mockCustomer.addresses[1],
  shippingMethod: ['Standard', 'Express', 'Same Day'][index % 3],
  shippingCost: parseFloat((Math.random() * 5 + 3).toFixed(2)),
  tax: parseFloat((Math.random() * 10).toFixed(2)),
  discount: parseFloat((Math.random() * 5).toFixed(2)),
  total: 0, // Calculated below
  notes: index % 2 === 0 ? 'Please leave at the front door.' : '',
  createdAt: new Date(2023, 5 - (index % 3), Math.floor(Math.random() * 28) + 1),
  updatedAt: new Date(),
}));

// Calculate order totals
mockOrders.forEach(order => {
  order.items.forEach(item => {
    item.total = item.quantity * item.unitPrice - item.discount;
  });
  order.total = order.items.reduce((sum, item) => sum + item.total, 0) + 
                order.shippingCost + 
                order.tax - 
                order.discount;
});

function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer] = useState<Customer>(mockCustomer);
  const [orders] = useState<Order[]>(mockOrders);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const deleteCustomer = () => {
    toast({
      title: "Customer Deleted",
      description: "The customer has been successfully deleted.",
    });
    navigate('/customers');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/customers')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Customer Details</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{customer.name}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="capitalize">
                    {customer.type}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={deleteCustomer}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 pt-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Customer since {format(customer.createdAt, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.totalOrders} orders placed</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Addresses</h3>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>
              
              {customer.addresses.map((address) => (
                <div key={address.id} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium capitalize">{address.type} Address</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="pl-6 text-sm text-muted-foreground">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {customer.notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-muted-foreground">{customer.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Total Spent</span>
                <span className="font-medium">${customer.totalSpent.toFixed(2)}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${Math.min((customer.totalSpent / 2000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <span className="font-medium">{customer.totalOrders}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted p-2">
                  <div className="font-semibold">4</div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <div className="font-semibold">15</div>
                  <div className="text-xs text-muted-foreground">Last 6 Months</div>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <div className="font-semibold">{customer.totalOrders}</div>
                  <div className="text-xs text-muted-foreground">All Time</div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h3 className="font-semibold mb-2">Average Order</h3>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${(customer.totalSpent / customer.totalOrders).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Products</span>
                <span className="font-medium">3.2 items</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create New Order
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders History</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View all orders placed by this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-5 p-4 bg-muted/30 text-sm font-medium">
                  <div className="col-span-1">Order #</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1">Items</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-right">Total</div>
                </div>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="grid grid-cols-5 p-4 border-t text-sm">
                      <div className="col-span-1">
                        <Button variant="link" className="p-0 h-auto" onClick={() => navigate(`/sales/orders/${order.id}`)}>
                          {order.orderNumber}
                        </Button>
                      </div>
                      <div className="col-span-1">
                        {format(order.createdAt, 'MMM dd, yyyy')}
                      </div>
                      <div className="col-span-1">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                      <div className="col-span-1">
                        <Badge 
                          variant={
                            order.status === 'delivered' ? 'success' : 
                            order.status === 'cancelled' ? 'destructive' : 
                            'outline'
                          }
                          className="capitalize"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-right font-medium">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No orders found for this customer
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="communication" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>Email, call logs and customer interactions</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10 text-muted-foreground">
              No communication history available
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Preferences</CardTitle>
              <CardDescription>Customer preferences and settings</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10 text-muted-foreground">
              No preferences available
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CustomerDetailPage;
