
import { useState } from "react";
import {
  Check,
  FileText,
  MapPin,
  Navigation,
  Package,
  Phone,
  ShoppingBag,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function RiderPortal() {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);

  // Mock rider data
  const rider = {
    name: "Mike Johnson",
    id: "RID-1001",
    phone: "(555) 123-4567",
    vehicleType: "Motorcycle",
    vehicleNumber: "ABC-1234",
    rating: 4.8,
    totalDeliveries: 145,
    status: "available" as const,
    avatar: "",
    earnings: {
      today: 54.75,
      week: 320.50,
      month: 1250.25
    }
  };

  // Mock deliveries
  const deliveries = [
    {
      id: "DEL-10001",
      orderId: "ORD-56789",
      status: "assigned" as const,
      customer: {
        name: "John Smith",
        phone: "(555) 987-6543",
        address: "123 Main St, Apt 4B, Anytown, ST 12345",
        avatar: "",
      },
      scheduledTime: new Date(Date.now() + 1800000), // 30 min from now
      items: [
        { name: "Organic Bananas", quantity: 1, price: 4.99 },
        { name: "Whole Milk", quantity: 2, price: 3.49 },
        { name: "Free Range Eggs", quantity: 1, price: 5.99 },
        { name: "Sliced Bread", quantity: 1, price: 3.29 },
      ],
      total: 21.25,
      paymentMethod: "Paid Online",
      distance: "2.3 km",
      estimatedTime: "15 min",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: "DEL-10002",
      orderId: "ORD-56790",
      status: "in-progress" as const,
      customer: {
        name: "Emily Davis",
        phone: "(555) 234-5678",
        address: "456 Oak Ave, Somewhere, ST 23456",
        avatar: "",
      },
      scheduledTime: new Date(), // now
      items: [
        { name: "Fresh Apples", quantity: 3, price: 5.97 },
        { name: "Chicken Breast", quantity: 1, price: 9.99 },
        { name: "Greek Yogurt", quantity: 2, price: 7.98 },
        { name: "Orange Juice", quantity: 1, price: 4.49 },
      ],
      total: 28.43,
      paymentMethod: "Cash on Delivery",
      distance: "1.5 km",
      estimatedTime: "8 min",
      coordinates: { lat: 40.7282, lng: -74.0051 },
      startTime: new Date(Date.now() - 600000), // 10 min ago
    },
    {
      id: "DEL-10003",
      orderId: "ORD-56791",
      status: "completed" as const,
      customer: {
        name: "Sarah Wilson",
        phone: "(555) 345-6789",
        address: "789 Pine St, Nowhere, ST 34567",
        avatar: "",
      },
      scheduledTime: new Date(Date.now() - 3600000), // 1 hour ago
      items: [
        { name: "Baby Spinach", quantity: 1, price: 3.99 },
        { name: "Ground Coffee", quantity: 2, price: 15.98 },
        { name: "Sparkling Water", quantity: 6, price: 11.94 },
      ],
      total: 31.91,
      paymentMethod: "Paid Online",
      distance: "3.2 km",
      estimatedTime: "20 min",
      coordinates: { lat: 40.7211, lng: -74.0089 },
      startTime: new Date(Date.now() - 4800000), // 1hr 20min ago
      deliveryTime: new Date(Date.now() - 3600000), // 1 hour ago
      customerSignature: "signature-placeholder.png",
    },
    {
      id: "DEL-10004",
      orderId: "ORD-56792",
      status: "cancelled" as const,
      customer: {
        name: "Robert Wilson",
        phone: "(555) 456-7890",
        address: "1010 Elm Rd, Anyplace, ST 45678",
        avatar: "",
      },
      scheduledTime: new Date(Date.now() - 7200000), // 2 hours ago
      items: [
        { name: "Frozen Pizza", quantity: 2, price: 13.98 },
        { name: "Ice Cream", quantity: 1, price: 6.49 },
        { name: "Potato Chips", quantity: 3, price: 8.97 },
      ],
      total: 29.44,
      paymentMethod: "Cash on Delivery",
      distance: "4.5 km",
      estimatedTime: "25 min",
      coordinates: { lat: 40.7311, lng: -74.0123 },
      cancellationReason: "Customer requested cancellation",
      cancelledAt: new Date(Date.now() - 6900000), // 1hr 55min ago
    },
  ];

  const selectedDelivery = deliveries.find(d => d.id === selectedDeliveryId);

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge variant="outline" className="bg-info/10 text-info border-info/30"><Clock className="mr-1 h-3 w-3" />Pickup Ready</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30"><Navigation className="mr-1 h-3 w-3" />In Transit</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30"><CheckCircle className="mr-1 h-3 w-3" />Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatusStep = (status: string) => {
    switch (status) {
      case "assigned": return 1;
      case "in-progress": return 2;
      case "completed": return 3;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Rider Portal</h1>
          <p className="text-muted-foreground">
            Manage your deliveries and track your performance
          </p>
        </div>
        <Card className="md:w-64">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Current Status</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                Available
              </Badge>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Go Offline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Rider Info & Stats */}
        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rider Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{rider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{rider.name}</h3>
                  <p className="text-muted-foreground text-sm">{rider.id}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="mr-2">
                      {rider.rating} ★
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {rider.totalDeliveries} deliveries
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="font-medium">Vehicle Type</div>
                <div>{rider.vehicleType}</div>
                
                <div className="font-medium">Vehicle Number</div>
                <div>{rider.vehicleNumber}</div>
                
                <div className="font-medium">Contact</div>
                <div>{rider.phone}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Earnings Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-2 rounded-md border">
                  <span className="text-xs text-muted-foreground">Today</span>
                  <span className="font-bold text-lg">${rider.earnings.today}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md border">
                  <span className="text-xs text-muted-foreground">This Week</span>
                  <span className="font-bold text-lg">${rider.earnings.week}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md border">
                  <span className="text-xs text-muted-foreground">This Month</span>
                  <span className="font-bold text-lg">${rider.earnings.month}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Full Earnings
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Deliveries */}
        <div className="flex-1">
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Deliveries</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 mt-4">
              {deliveries
                .filter(d => d.status === "assigned" || d.status === "in-progress")
                .map(delivery => (
                  <Card
                    key={delivery.id}
                    className={cn(
                      "cursor-pointer hover:border-muted-foreground/20 transition-colors",
                      selectedDeliveryId === delivery.id && "border-primary"
                    )}
                    onClick={() => setSelectedDeliveryId(delivery.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <span className="font-semibold">{delivery.id}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                            <span className="text-sm text-muted-foreground">{delivery.orderId}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {getDeliveryStatusBadge(delivery.status)}
                            <span className="text-xs text-muted-foreground ml-2">
                              {delivery.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${delivery.total.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{delivery.paymentMethod}</div>
                        </div>
                      </div>

                      <div className="flex items-center mt-4">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium truncate max-w-xs">
                            {delivery.customer.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {delivery.customer.address.split(',')[0]}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            {delivery.items.length} items
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <Navigation className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">{delivery.distance}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">{delivery.estimatedTime}</span>
                          </div>
                        </div>
                      </div>

                      {delivery.status === "assigned" && (
                        <Button className="w-full mt-4">
                          Start Delivery
                        </Button>
                      )}

                      {delivery.status === "in-progress" && (
                        <Button className="w-full mt-4">
                          <Check className="mr-2 h-4 w-4" /> Mark as Delivered
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              
              {deliveries.filter(d => d.status === "assigned" || d.status === "in-progress").length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Active Deliveries</h3>
                  <p className="text-muted-foreground">
                    You don't have any active deliveries at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4 mt-4">
              {deliveries
                .filter(d => d.status === "completed" || d.status === "cancelled")
                .map(delivery => (
                  <Card
                    key={delivery.id}
                    className="cursor-pointer hover:border-muted-foreground/20 transition-colors"
                    onClick={() => setSelectedDeliveryId(delivery.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <span className="font-semibold">{delivery.id}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                            <span className="text-sm text-muted-foreground">{delivery.orderId}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {getDeliveryStatusBadge(delivery.status)}
                            <span className="text-xs text-muted-foreground ml-2">
                              {delivery.status === "completed" && delivery.deliveryTime
                                ? delivery.deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : delivery.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${delivery.total.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{delivery.paymentMethod}</div>
                        </div>
                      </div>

                      <div className="flex items-center mt-3">
                        <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="ml-2 text-sm">{delivery.customer.name}</div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            {delivery.items.length} items
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Navigation className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">{delivery.distance}</span>
                        </div>
                      </div>

                      {delivery.status === "cancelled" && (
                        <div className="mt-3 p-2 bg-danger/5 border border-danger/20 rounded-md">
                          <div className="text-xs text-danger flex items-start">
                            <AlertTriangle className="h-3.5 w-3.5 mr-1 mt-0.5" />
                            <span>{delivery.cancellationReason}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

              {deliveries.filter(d => d.status === "completed" || d.status === "cancelled").length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Completed Deliveries</h3>
                  <p className="text-muted-foreground">
                    Your completed deliveries will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delivery Detail Dialog */}
      <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDeliveryId(null)}>
        {selectedDelivery && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
              <DialogDescription>
                {selectedDelivery.id} • {selectedDelivery.orderId}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                {getDeliveryStatusBadge(selectedDelivery.status)}
              </div>
              
              {selectedDelivery.status !== "cancelled" && (
                <div className="relative">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm font-medium">Pickup</div>
                    <div className="text-sm font-medium">In Transit</div>
                    <div className="text-sm font-medium">Delivered</div>
                  </div>
                  <Progress 
                    value={getDeliveryStatusStep(selectedDelivery.status) * 33.33} 
                    className="h-2" 
                  />
                  <div className="absolute top-0 left-0 w-full mt-1 flex justify-between">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                      getDeliveryStatusStep(selectedDelivery.status) >= 1 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      1
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs -ml-3",
                      getDeliveryStatusStep(selectedDelivery.status) >= 2 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      2
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                      getDeliveryStatusStep(selectedDelivery.status) >= 3 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      3
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Customer Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Name</div>
                    <div>{selectedDelivery.customer.name}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Phone</div>
                    <div className="flex items-center">
                      <span>{selectedDelivery.customer.phone}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Delivery Address</div>
                    <div className="flex items-start">
                      <span className="flex-1">{selectedDelivery.customer.address}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-3">Order Items</h3>
                <div className="border rounded-md divide-y">
                  {selectedDelivery.items.map((item, i) => (
                    <div key={i} className="flex justify-between p-3">
                      <div>
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                      </div>
                      <div>${(item.price).toFixed(2)}</div>
                    </div>
                  ))}
                  <div className="flex justify-between p-3 bg-muted/50">
                    <div className="font-semibold">Total</div>
                    <div className="font-semibold">${selectedDelivery.total.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {selectedDelivery.status === "assigned" && (
                  <Button className="flex-1">
                    Start Delivery
                  </Button>
                )}
                
                {selectedDelivery.status === "in-progress" && (
                  <Button className="flex-1">
                    <Check className="mr-2 h-4 w-4" /> Mark as Delivered
                  </Button>
                )}
                
                <Button variant="outline" className="flex-1" onClick={() => setSelectedDeliveryId(null)}>
                  Close
                </Button>
                
                <Button variant="outline" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

export default RiderPortal;
