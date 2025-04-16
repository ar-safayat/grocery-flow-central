
import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Store,
  Phone,
  Mail,
  Home,
  FileText,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building,
  User
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
import { Vendor } from '@/types';

// Generate mock vendors data
const mockVendors: Vendor[] = Array(15).fill(null).map((_, index) => ({
  id: `v-${1000 + index}`,
  name: [
    'Farm Fresh Produce',
    'Dairy Delights Inc.',
    'Bakery Supplies Co.',
    'Organic Foods Ltd.',
    'Meat & Poultry Experts',
    'Global Imports',
    'Local Farmers Association',
    'Premium Seafood Distributors',
    'Gourmet Ingredients Supply',
    'Eco-Friendly Packaging',
    'Wholesale Beverages',
    'Fresh Herbs & Spices',
    'Quality Frozen Foods',
    'Snack Foods Distributor',
    'Ethnic Foods Specialist',
  ][index],
  contactPerson: [
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
    'James White',
    'Mary Garcia',
    'Richard Martinez',
    'Patricia Robinson',
    'Charles Lewis',
  ][index],
  email: `vendor${index}@example.com`,
  phone: `(555) ${100 + index}-${1000 + index}`,
  address: `${1000 + index} Business Ave, Suite ${100 + index}, Industry City, IC ${10000 + index}`,
  website: `https://www.vendor${index}.example.com`,
  taxId: `TAX-${10000 + index}`,
  paymentTerms: ['Net 30', 'Net 15', 'Net 45', 'COD'][index % 4],
  notes: '',
  createdAt: new Date(2023, 0, 1),
}));

function Vendors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVendors, setFilteredVendors] = useState(mockVendors);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredVendors(mockVendors);
      return;
    }
    
    const filtered = mockVendors.filter(
      vendor => 
        vendor.name.toLowerCase().includes(term.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(term.toLowerCase()) ||
        vendor.email.toLowerCase().includes(term.toLowerCase()) ||
        vendor.phone.includes(term)
    );
    
    setFilteredVendors(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">
            Manage your supplier relationships
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Payment Terms</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      {vendor.website && (
                        <div className="text-xs text-muted-foreground">
                          {vendor.website.replace('https://www.', '').replace('.example.com', '')}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.contactPerson}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{vendor.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{vendor.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{vendor.paymentTerms}</Badge>
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
                        Edit Vendor
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Store className="h-4 w-4 mr-2" />
                        View Products
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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
          Showing <strong>1-10</strong> of <strong>{filteredVendors.length}</strong> vendors
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

export default Vendors;
