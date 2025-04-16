
import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Filter,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Truck,
  X,
  AlertCircle,
  FileText,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Order, OrderStatus } from '@/types';

// Mock data for orders
const generateOrders = (count: number): Order[] => {
  return Array(count)
    .fill(null)
    .map((_, i) => {
      const statuses: OrderStatus[] = ['pending', 'processing', 'ready-for-delivery', 'out-for-delivery', 'delivered', 'cancelled'];
      const paymentStatuses = ['pending', 'partial', 'paid'];
      const paymentMethods = ['Credit Card', 'Cash on Delivery', 'PayPal', 'Bank Transfer'];
      const shippingMethods = ['Standard Delivery', 'Express Delivery', 'Store Pickup'];
      const status = statuses[Math.floor(Math.random() * statuses.length)] as OrderStatus;
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)] as any;
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
      
      const itemCount = Math.floor(Math.random() * 5) + 1;
      const items = Array(itemCount).fill(null).map((_, j) => {
        const price = parseFloat((Math.random() * 20 + 1).toFixed(2));
        const quantity = Math.floor(Math.random() * 5) + 1;
        return {
          id: `item-${i}-${j}`,
          productId: `prod-${100 + j}`,
          productName: [
            'Organic Bananas',
            'Fresh Apples',
            'Whole Milk',
            'Free Range Eggs',
            'Sliced Bread',
            'Orange Juice',
            'Chicken Breast',
            'Greek Yogurt',
            'Baby Spinach',
            'Ground Coffee',
          ][j % 10],
          quantity,
          unitPrice: price,
          tax: parseFloat((price * 0.1).toFixed(2)),
          discount: 0,
          total: parseFloat((price * quantity).toFixed(2)),
        };
      });
      
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = parseFloat((subtotal * 0.1).toFixed(2));
      const shipping = parseFloat((Math.random() * 15 + 5).toFixed(2));
      const total = parseFloat((subtotal + tax + shipping).toFixed(2));

      return {
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
          type: Math.random() > 0.3 ? 'individual' : 'business',
          addresses: [
            {
              id: `addr-${i}`,
              type: 'shipping',
              street: `${1000 + i} Main Street`,
              city: 'Anytown',
              state: 'ST',
              postalCode: `${10000 + i}`,
              country: 'USA',
              isDefault: true,
            },
          ],
          notes: '',
          createdAt: new Date(2023, 0, 1),
          totalOrders: Math.floor(Math.random() * 10) + 1,
          totalSpent: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
        },
        items,
        status,
        paymentStatus,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        shippingAddress: {
          id: `addr-ship-${i}`,
          type: 'shipping',
          street: `${1000 + i} Main Street`,
          city: 'Anytown',
          state: 'ST',
          postalCode: `${10000 + i}`,
          country: 'USA',
          isDefault: true,
        },
        billingAddress: {
          id: `addr-bill-${i}`,
          type: 'billing',
          street: `${1000 + i} Main Street`,
          city: 'Anytown',
          state: 'ST',
          postalCode: `${10000 + i}`,
          country: 'USA',
          isDefault: true,
        },
        shippingMethod: shippingMethods[Math.floor(Math.random() * shippingMethods.length)],
        shippingCost: shipping,
        tax,
        discount: 0,
        total,
        notes: '',
        createdAt: orderDate,
        updatedAt: new Date(),
      };
    });
};

const orders = generateOrders(20);

function Sales() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Update filtered orders when filters change
  const updateFilters = () => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateFilters();
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    updateFilters();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-muted text-muted-foreground"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-info/10 text-info border-info/30"><Clock className="mr-1 h-3 w-3" /> Processing</Badge>;
      case 'ready-for-delivery':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30"><Check className="mr-1 h-3 w-3" /> Ready</Badge>;
      case 'out-for-delivery':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30"><Truck className="mr-1 h-3 w-3" /> Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30"><Check className="mr-1 h-3 w-3" /> Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30"><X className="mr-1 h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Pending</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-info/10 text-info border-info/30">Partial</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Paid</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Orders</h1>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders by ID or customer..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="ready-for-delivery">Ready for Delivery</SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.items.length} items
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {order.createdAt.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.createdAt.toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
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
                      <DropdownMenuItem>
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Truck className="h-4 w-4 mr-2" />
                        Assign to Delivery
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
          Showing <strong>1-10</strong> of <strong>{filteredOrders.length}</strong> orders
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

export default Sales;
