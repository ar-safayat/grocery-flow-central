
import { useState, useEffect } from 'react';
import {
  Truck,
  Bike,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Phone,
  Package,
  Star,
  LocateFixed,
  MapPinned,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Delivery, DeliveryStatus } from '@/types';
import { format } from 'date-fns';

// Mock data for deliveries
const mockDeliveries: Delivery[] = Array(8).fill(null).map((_, index) => ({
  id: `d-${1000 + index}`,
  deliveryNumber: `DEL-${10000 + index}`,
  order: {
    id: `o-${2000 + index}`,
    orderNumber: `ORD-${20000 + index}`,
    customer: {
      id: `c-${3000 + index}`,
      name: [
        'John Smith',
        'Sarah Johnson',
        'Michael Brown',
        'Emily Davis',
        'Robert Wilson',
        'Jennifer Taylor',
        'William Anderson',
        'Elizabeth Thomas',
      ][index],
      email: `customer${index}@example.com`,
      phone: `(555) ${100 + index}-${1000 + index}`,
      type: index % 3 === 0 ? 'business' : 'individual',
      addresses: [
        {
          id: `addr-${1000 + index}`,
          type: 'shipping',
          street: `${1000 + index} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Willow', 'Birch'][index]} Street`,
          city: 'Cityville',
          state: 'State',
          postalCode: `${10000 + index}`,
          country: 'Country',
          isDefault: true,
        }
      ],
      notes: '',
      createdAt: new Date(2023, 0, 1),
      totalOrders: 5,
      totalSpent: 500,
    },
    items: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, itemIndex) => ({
      id: `oi-${4000 + index * 10 + itemIndex}`,
      productId: `p-${5000 + itemIndex}`,
      productName: [
        'Organic Bananas',
        'Farm Fresh Milk',
        'Whole Wheat Bread',
        'Free Range Eggs',
        'Avocado (Ripe)',
        'Chicken Breast',
        'Atlantic Salmon',
        'Greek Yogurt',
      ][itemIndex % 8],
      quantity: Math.floor(Math.random() * 5) + 1,
      unitPrice: parseFloat((Math.random() * 20 + 1.99).toFixed(2)),
      tax: parseFloat((Math.random() * 2).toFixed(2)),
      discount: parseFloat((Math.random() * 5).toFixed(2)),
      total: 0, // Calculated below
    })),
    status: ['pending', 'processing', 'ready-for-delivery', 'out-for-delivery'][index % 4] as any,
    paymentStatus: ['pending', 'partial', 'paid'][index % 3] as any,
    paymentMethod: ['credit_card', 'cash', 'online'][index % 3],
    shippingAddress: {
      id: `addr-${1000 + index}`,
      type: 'shipping',
      street: `${1000 + index} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Willow', 'Birch'][index]} Street`,
      city: 'Cityville',
      state: 'State',
      postalCode: `${10000 + index}`,
      country: 'Country',
      isDefault: true,
    },
    billingAddress: {
      id: `addr-${2000 + index}`,
      type: 'billing',
      street: `${1000 + index} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Willow', 'Birch'][index]} Street`,
      city: 'Cityville',
      state: 'State',
      postalCode: `${10000 + index}`,
      country: 'Country',
      isDefault: true,
    },
    shippingMethod: ['Standard', 'Express', 'Same Day'][index % 3],
    shippingCost: parseFloat((Math.random() * 10 + 5).toFixed(2)),
    tax: parseFloat((Math.random() * 20).toFixed(2)),
    discount: parseFloat((Math.random() * 10).toFixed(2)),
    total: 0, // Calculated below
    notes: index % 2 === 0 ? 'Please leave at the front door.' : '',
    createdAt: new Date(2023, 5, Math.floor(Math.random() * 30) + 1),
    updatedAt: new Date(),
  },
  rider: {
    id: 'r-1001',
    name: 'Alex Johnson',
    phone: '(555) 123-4567',
    email: 'alex@example.com',
    vehicleType: 'motorcycle',
    vehicleNumber: 'MC-45678',
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      lastUpdated: new Date(),
    },
    status: 'available',
    rating: 4.8,
    totalDeliveries: 342,
  },
  status: ['pending', 'assigned', 'in-progress', 'completed', 'failed'][index % 5] as DeliveryStatus,
  scheduledDate: new Date(2023, 5, Math.floor(Math.random() * 30) + 1),
  actualDeliveryDate: index % 3 === 0 ? new Date(2023, 5, Math.floor(Math.random() * 30) + 1) : undefined,
  notes: index % 4 === 0 ? 'Customer may not be home, please call before delivery.' : '',
  customerSignature: index % 5 === 0 ? 'signature.jpg' : undefined,
  proofOfDelivery: index % 5 === 0 ? ['delivery-proof.jpg'] : [],
  createdAt: new Date(2023, 5, Math.floor(Math.random() * 30) + 1),
  updatedAt: new Date(),
}));

// Calculate totals
mockDeliveries.forEach(delivery => {
  delivery.order.items.forEach(item => {
    item.total = item.quantity * item.unitPrice - item.discount;
  });
  delivery.order.total = delivery.order.items.reduce((sum, item) => sum + item.total, 0) + 
                          delivery.order.shippingCost + 
                          delivery.order.tax - 
                          delivery.order.discount;
});

function RiderPortalDashboard() {
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [completedDeliveries, setCompletedDeliveries] = useState<Delivery[]>([]);
  const [pendingDeliveries, setPendingDeliveries] = useState<Delivery[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [status, setStatus] = useState<'available' | 'busy' | 'offline'>('offline');
  const { toast } = useToast();

  useEffect(() => {
    // Filter deliveries by status
    setActiveDeliveries(mockDeliveries.filter(d => d.status === 'assigned' || d.status === 'in-progress'));
    setCompletedDeliveries(mockDeliveries.filter(d => d.status === 'completed'));
    setPendingDeliveries(mockDeliveries.filter(d => d.status === 'pending'));
  }, []);

  const updateDeliveryStatus = (deliveryId: string, newStatus: DeliveryStatus) => {
    // Update delivery status (in a real app, this would be an API call)
    const updatedActiveDeliveries = activeDeliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        return { ...delivery, status: newStatus };
      }
      return delivery;
    });

    const delivery = activeDeliveries.find(d => d.id === deliveryId);
    
    if (newStatus === 'completed' && delivery) {
      // Move from active to completed
      setActiveDeliveries(activeDeliveries.filter(d => d.id !== deliveryId));
      setCompletedDeliveries([
        { ...delivery, status: newStatus, actualDeliveryDate: new Date() },
        ...completedDeliveries
      ]);
      
      toast({
        title: "Delivery Completed",
        description: `Delivery #${delivery.deliveryNumber} has been marked as completed.`,
      });
    } else if (newStatus === 'in-progress') {
      setActiveDeliveries(updatedActiveDeliveries);
      
      toast({
        title: "Delivery Started",
        description: `You have started delivery #${delivery?.deliveryNumber}.`,
      });
    }
  };
  
  const toggleStatus = () => {
    const newStatus = status === 'offline' ? 'available' : status === 'available' ? 'busy' : 'offline';
    setStatus(newStatus);
    
    // Get current location when going online
    if (newStatus !== 'offline' && !currentLocation) {
      // In real app, we would use navigator.geolocation
      // For this demo, set a dummy location
      setCurrentLocation({
        latitude: 40.7128,
        longitude: -74.0060
      });
    }
    
    toast({
      title: "Status Updated",
      description: `Your status has been updated to ${newStatus}.`,
    });
  };

  const getStatusBadge = (status: 'available' | 'busy' | 'offline') => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Available</Badge>;
      case 'busy':
        return <Badge variant="warning">Busy</Badge>;
      case 'offline':
        return <Badge variant="outline">Offline</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rider Portal</h1>
          <p className="text-muted-foreground">
            Manage your deliveries and track your performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(status)}
          <Button onClick={toggleStatus}>
            {status === 'offline' ? 'Go Online' : 'Go Offline'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Active Deliveries</div>
              <div className="font-semibold">{activeDeliveries.length}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Completed Today</div>
              <div className="font-semibold">{completedDeliveries.filter(d => 
                d.actualDeliveryDate && 
                d.actualDeliveryDate.toDateString() === new Date().toDateString()
              ).length}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Earnings Today</div>
              <div className="font-semibold">$45.50</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bike className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Vehicle</span>
              </div>
              <div className="font-semibold">Motorcycle - MC-45678</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Current Location</span>
              </div>
              <div className="font-semibold">
                {currentLocation ? 'Tracking' : 'Not Tracking'}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Rating</span>
              </div>
              <div className="font-semibold">4.8/5</div>
            </div>
          </CardContent>
          {status !== 'offline' && (
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" disabled={status === 'offline'}>
                <LocateFixed className="h-4 w-4 mr-2" />
                Update Location
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">On-time Delivery</span>
                <span className="text-sm font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Customer Rating</span>
                <span className="text-sm font-medium">4.8/5</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Acceptance Rate</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Deliveries ({activeDeliveries.length})</TabsTrigger>
          <TabsTrigger value="pending">Available Deliveries ({pendingDeliveries.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Deliveries ({completedDeliveries.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-6">
          {activeDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Active Deliveries</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You don't have any active deliveries at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            activeDeliveries.map((delivery) => (
              <Card key={delivery.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-primary" />
                      Delivery #{delivery.deliveryNumber}
                    </CardTitle>
                    <Badge
                      variant={delivery.status === 'in-progress' ? 'default' : 'outline'}
                    >
                      {delivery.status === 'assigned' ? 'Ready to Start' : 'In Progress'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Customer Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <div>
                            <div>{delivery.order.customer.name}</div>
                            <div className="text-sm text-muted-foreground">{delivery.order.customer.phone}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPinned className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <div>
                            <div>{delivery.order.shippingAddress.street}</div>
                            <div className="text-sm text-muted-foreground">
                              {delivery.order.shippingAddress.city}, {delivery.order.shippingAddress.state} {delivery.order.shippingAddress.postalCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {delivery.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Delivery Notes</h4>
                        <div className="bg-muted/30 p-3 rounded-md text-sm">
                          {delivery.notes}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order ID</span>
                          <span>{delivery.order.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Items</span>
                          <span>{delivery.order.items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Value</span>
                          <span>${delivery.order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment</span>
                          <span className="capitalize">{delivery.order.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Scheduled for</h4>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {delivery.scheduledDate ? format(delivery.scheduledDate, 'PPP') : 'ASAP'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t py-4 flex justify-between">
                  <Button variant="outline" asChild>
                    <a href={`tel:${delivery.order.customer.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </a>
                  </Button>
                  
                  {delivery.status === 'assigned' ? (
                    <Button onClick={() => updateDeliveryStatus(delivery.id, 'in-progress')}>
                      <Package className="h-4 w-4 mr-2" />
                      Start Delivery
                    </Button>
                  ) : (
                    <Button onClick={() => updateDeliveryStatus(delivery.id, 'completed')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Delivery
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Available Deliveries</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There are no pending deliveries available to accept at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingDeliveries.map((delivery) => (
              <Card key={delivery.id}>
                <CardHeader className="py-4 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{delivery.order.shippingAddress.city} Area</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {delivery.scheduledDate ? format(delivery.scheduledDate, 'PPP') : 'ASAP Delivery'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${(5 + Math.random() * 10).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Estimated earnings</p>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Distance:</span> {(1 + Math.random() * 5).toFixed(1)} miles
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Items:</span> {delivery.order.items.length} products
                  </p>
                </CardContent>
                <CardFooter className="border-t py-4">
                  <Button className="w-full">
                    Accept Delivery 
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Completed Deliveries</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You haven't completed any deliveries yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-5 p-4 bg-muted/30 font-medium">
                <div className="col-span-2">Delivery Details</div>
                <div className="col-span-1 hidden md:block">Customer</div>
                <div className="col-span-1">Date Completed</div>
                <div className="col-span-1 text-right">Status</div>
              </div>
              
              {completedDeliveries.map((delivery) => (
                <div key={delivery.id} className="border-t grid grid-cols-5 p-4">
                  <div className="col-span-2">
                    <div className="font-medium">#{delivery.deliveryNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {delivery.order.shippingAddress.street}, {delivery.order.shippingAddress.city}
                    </div>
                  </div>
                  <div className="col-span-1 hidden md:block">
                    {delivery.order.customer.name}
                  </div>
                  <div className="col-span-1">
                    {delivery.actualDeliveryDate ? format(delivery.actualDeliveryDate, 'MMM dd, yyyy') : '-'}
                  </div>
                  <div className="col-span-1 text-right">
                    <Badge variant="success" className="ml-auto">Completed</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RiderPortalDashboard;
