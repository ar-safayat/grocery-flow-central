
import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Map,
  Navigation,
  Truck,
  FileText,
  PackageOpen,
  User,
  CalendarClock,
  ClipboardCheck,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Delivery as DeliveryType, DeliveryStatus } from '@/types';
import { cn } from "@/lib/utils";
import { Progress } from '@/components/ui/progress';

// Generate mock deliveries data
const generateDeliveries = (count: number): DeliveryType[] => {
  const statuses: DeliveryStatus[] = ['pending', 'assigned', 'in-progress', 'completed', 'failed', 'cancelled'];
  const riders = [
    { id: 'r1', name: 'Mike Johnson', phone: '(555) 123-4567', vehicle: 'Motorcycle' },
    { id: 'r2', name: 'Sarah Davis', phone: '(555) 234-5678', vehicle: 'Car' },
    { id: 'r3', name: 'Alex Wilson', phone: '(555) 345-6789', vehicle: 'Scooter' },
    { id: 'r4', name: 'Jessica Brown', phone: '(555) 456-7890', vehicle: 'Bicycle' },
  ];
  
  return Array(count).fill(null).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const today = new Date();
    const rider = status !== 'pending' ? riders[i % riders.length] : undefined;
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - Math.floor(Math.random() * 7)); // Order from last week
    
    let scheduledDate = new Date(orderDate);
    scheduledDate.setHours(scheduledDate.getHours() + Math.floor(Math.random() * 48)); // Scheduled within 48 hours of order
    
    let actualDeliveryDate;
    if (status === 'completed') {
      actualDeliveryDate = new Date(scheduledDate);
      actualDeliveryDate.setMinutes(actualDeliveryDate.getMinutes() + (Math.random() < 0.7 ? -30 : 30) * Math.random()); // +/- 30 min from scheduled
    }
    
    return {
      id: `del-${1000 + i}`,
      deliveryNumber: `DEL-${10000 + i}`,
      order: {
        id: `ord-${1000 + i}`,
        orderNumber: `ORD-${10000 + i}`,
        customer: {
          id: `cust-${200 + i}`,
          name: [
            'John Smith',
            'Sarah Johnson',
            'Michael Brown',
            'Emily Davis',
            'Robert Wilson',
            'Jennifer Taylor',
            'William Anderson',
            'Elizabeth Thomas',
            'David Moore',
            'Lisa Jackson',
          ][i % 10],
          email: `customer${i}@example.com`,
          phone: `(555) ${100 + i}-${1000 + i}`,
          type: 'individual',
          addresses: [{
            id: `addr-${i}`,
            type: 'shipping',
            street: `${1000 + i} ${['Main St', 'Oak Ave', 'Maple Rd', 'Cedar Ln'][i % 4]}`,
            city: 'Anytown',
            state: 'ST',
            postalCode: `${10000 + i}`,
            country: 'USA',
            isDefault: true,
          }],
          notes: '',
          createdAt: new Date(),
          totalOrders: 0,
          totalSpent: 0,
        },
        items: [],
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: '',
        shippingAddress: {
          id: `addr-${i}`,
          type: 'shipping',
          street: `${1000 + i} ${['Main St', 'Oak Ave', 'Maple Rd', 'Cedar Ln'][i % 4]}`,
          city: 'Anytown',
          state: 'ST',
          postalCode: `${10000 + i}`,
          country: 'USA',
          isDefault: true,
        },
        billingAddress: {
          id: `addr-${i}`,
          type: 'billing',
          street: `${1000 + i} ${['Main St', 'Oak Ave', 'Maple Rd', 'Cedar Ln'][i % 4]}`,
          city: 'Anytown',
          state: 'ST',
          postalCode: `${10000 + i}`,
          country: 'USA',
          isDefault: true,
        },
        shippingMethod: '',
        shippingCost: 0,
        tax: 0,
        discount: 0,
        total: parseFloat((Math.random() * 100 + 20).toFixed(2)),
        notes: '',
        createdAt: orderDate,
        updatedAt: orderDate,
      },
      rider: rider ? {
        id: rider.id,
        name: rider.name,
        phone: rider.phone,
        email: `rider${i}@example.com`,
        vehicleType: rider.vehicle,
        vehicleNumber: `VEH-${100 + i}`,
        status: 'available',
        rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
        totalDeliveries: Math.floor(Math.random() * 100) + 50,
      } : undefined,
      status,
      scheduledDate,
      actualDeliveryDate,
      notes: '',
      createdAt: orderDate,
      updatedAt: new Date(),
    };
  });
};

const mockDeliveries = generateDeliveries(15);

function DeliveryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredDeliveries, setFilteredDeliveries] = useState(mockDeliveries);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, statusFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (search: string, status: string) => {
    let filtered = mockDeliveries;
    
    if (search) {
      filtered = filtered.filter(
        delivery => 
          delivery.deliveryNumber.toLowerCase().includes(search.toLowerCase()) ||
          delivery.order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          delivery.order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
          (delivery.rider?.name && delivery.rider.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === status);
    }
    
    setFilteredDeliveries(filtered);
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-muted text-muted-foreground"><AlertTriangle className="mr-1 h-3 w-3" /> Pending Assignment</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-info/10 text-info border-info/30"><CalendarClock className="mr-1 h-3 w-3" /> Assigned</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30"><Truck className="mr-1 h-3 w-3" /> In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30"><ClipboardCheck className="mr-1 h-3 w-3" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30"><AlertTriangle className="mr-1 h-3 w-3" /> Failed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30"><AlertTriangle className="mr-1 h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryProgress = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'assigned': return 25;
      case 'in-progress': return 60;
      case 'completed': return 100;
      case 'failed': return 75;
      case 'cancelled': return 25;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <p className="text-muted-foreground">
            Track and manage order deliveries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Map className="mr-2 h-4 w-4" />
            Delivery Map
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Delivery
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search deliveries..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending Assignment</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Delivery ID</TableHead>
              <TableHead>Customer & Order</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell className="font-medium">{delivery.deliveryNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{delivery.order.customer.name}</span>
                    <span className="text-xs text-muted-foreground">Order: {delivery.order.orderNumber}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {delivery.order.shippingAddress.street}, {delivery.order.shippingAddress.city}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {delivery.rider ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback>{delivery.rider.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{delivery.rider.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {delivery.rider.vehicleType}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Unassigned
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Scheduled:</span> {delivery.scheduledDate?.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {delivery.scheduledDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {delivery.actualDeliveryDate && (
                      <div className="text-xs text-success">
                        Delivered: {delivery.actualDeliveryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(delivery.status)}
                </TableCell>
                <TableCell>
                  <Progress value={getDeliveryProgress(delivery.status)} className="h-2" />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {delivery.status === 'pending' && (
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" />
                          Assign Rider
                        </DropdownMenuItem>
                      )}
                      {(delivery.status === 'assigned' || delivery.status === 'in-progress') && (
                        <DropdownMenuItem>
                          <Navigation className="h-4 w-4 mr-2" />
                          Track Location
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PackageOpen className="h-4 w-4 mr-2" />
                        View Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>{filteredDeliveries.length}</strong> deliveries
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryPage;
