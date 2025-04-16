
import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  ClipboardList,
  Store,
  Calendar,
  Check,
  Ban,
  FileText,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Package2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchaseOrder, PurchaseOrderStatus, Vendor } from '@/types';

// Generate mock vendors for reference
const mockVendors: Vendor[] = Array(5).fill(null).map((_, index) => ({
  id: `v-${1000 + index}`,
  name: [
    'Farm Fresh Produce',
    'Dairy Delights Inc.',
    'Bakery Supplies Co.',
    'Organic Foods Ltd.',
    'Meat & Poultry Experts',
  ][index],
  contactPerson: `Contact ${index}`,
  email: `vendor${index}@example.com`,
  phone: `(555) ${100 + index}-${1000 + index}`,
  address: `Address ${index}`,
  website: `https://vendor${index}.com`,
  taxId: `TAX-${1000 + index}`,
  paymentTerms: ['Net 30', 'Net 15', 'COD', 'Net 45', 'Net 60'][index],
  notes: '',
  createdAt: new Date()
}));

// Generate mock purchase orders data
const mockPurchaseOrders: PurchaseOrder[] = Array(15).fill(null).map((_, index) => {
  const vendor = mockVendors[index % mockVendors.length];
  const status: PurchaseOrderStatus = ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled'][index % 6] as PurchaseOrderStatus;
  const total = parseFloat((Math.random() * 5000 + 500).toFixed(2));
  
  return {
    id: `po-${1000 + index}`,
    poNumber: `PO-${10000 + index}`,
    vendor,
    items: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, itemIndex) => ({
      id: `poi-${1000 + index}-${itemIndex}`,
      productId: `prod-${1000 + itemIndex}`,
      productName: `Product ${itemIndex + 1}`,
      quantity: Math.floor(Math.random() * 50) + 1,
      unitPrice: parseFloat((Math.random() * 100 + 5).toFixed(2)),
      tax: parseFloat((Math.random() * 5).toFixed(2)),
      total: parseFloat((Math.random() * 500 + 50).toFixed(2)),
      receivedQuantity: status === 'received' ? Math.floor(Math.random() * 50) + 1 : 0,
    })),
    status,
    deliveryDate: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)),
    notes: '',
    createdAt: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)),
    updatedAt: new Date(),
    total
  };
});

function PurchaseOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredPOs, setFilteredPOs] = useState(mockPurchaseOrders);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterPOs(term, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterPOs(searchTerm, status);
  };

  const filterPOs = (term: string, status: string) => {
    let filtered = mockPurchaseOrders;

    if (term.trim()) {
      filtered = filtered.filter(
        po => 
          po.poNumber.toLowerCase().includes(term.toLowerCase()) ||
          po.vendor.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(po => po.status === status);
    }
    
    setFilteredPOs(filtered);
  };

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    const variants: Record<PurchaseOrderStatus, { variant: "default" | "destructive" | "outline" | "secondary" | null, label: string }> = {
      'draft': { variant: "outline", label: "Draft" },
      'sent': { variant: "secondary", label: "Sent" },
      'confirmed': { variant: "default", label: "Confirmed" },
      'partial': { variant: "secondary", label: "Partially Received" },
      'received': { variant: "outline", label: "Received" },
      'cancelled': { variant: "destructive", label: "Cancelled" }
    };

    const { variant, label } = variants[status];
    
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Manage your inventory purchase orders
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create PO
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search POs..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="partial">Partially Received</SelectItem>
              <SelectItem value="received">Received</SelectItem>
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
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.map((po) => (
              <TableRow key={po.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="font-medium">{po.poNumber}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span>{po.vendor.name}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(po.status)}</TableCell>
                <TableCell>
                  {po.deliveryDate ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{po.deliveryDate.toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${po.total.toFixed(2)}
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
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit PO
                      </DropdownMenuItem>
                      {po.status === 'sent' && (
                        <DropdownMenuItem>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Confirmed
                        </DropdownMenuItem>
                      )}
                      {(po.status === 'confirmed' || po.status === 'sent') && (
                        <DropdownMenuItem>
                          <Package2 className="h-4 w-4 mr-2" />
                          Receive Items
                        </DropdownMenuItem>
                      )}
                      {po.status !== 'cancelled' && po.status !== 'received' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Cancel PO
                          </DropdownMenuItem>
                        </>
                      )}
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
          Showing <strong>1-10</strong> of <strong>{filteredPOs.length}</strong> purchase orders
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

export default PurchaseOrders;
