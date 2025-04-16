
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  User, 
  Mail, 
  Phone,
  MoreHorizontal, 
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
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
import { format } from 'date-fns';
import { Customer } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock customers data
const mockCustomers: Customer[] = Array(15).fill(null).map((_, index) => ({
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
    'David Martinez',
    'Lisa Garcia',
    'James Rodriguez',
    'Mary Lee',
    'Richard Hernandez',
    'Patricia Lopez',
    'Joseph Gonzalez'
  ][index],
  email: `customer${index}@example.com`,
  phone: `(555) ${100 + index}-${1000 + index}`,
  type: index % 3 === 0 ? 'business' : 'individual',
  addresses: [
    {
      id: `addr-${1000 + index}`,
      type: 'shipping',
      street: `${1000 + index} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine'][index % 5]} Street`,
      city: 'Cityville',
      state: 'State',
      postalCode: `${10000 + index}`,
      country: 'Country',
      isDefault: true,
    },
    {
      id: `addr-${2000 + index}`,
      type: 'billing',
      street: `${1000 + index} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine'][index % 5]} Street`,
      city: 'Cityville',
      state: 'State',
      postalCode: `${10000 + index}`,
      country: 'Country',
      isDefault: true,
    }
  ],
  notes: index % 4 === 0 ? 'Prefers delivery in the evening' : '',
  createdAt: new Date(2023, Math.floor(index / 3), 1 + (index % 28)),
  totalOrders: Math.floor(Math.random() * 20) + 1,
  totalSpent: parseFloat((Math.random() * 2000 + 50).toFixed(2)),
}));

function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setCustomers(mockCustomers);
      return;
    }
    
    const filtered = mockCustomers.filter(
      customer => 
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.phone.includes(term)
    );
    
    setCustomers(filtered);
  };

  const handleDeleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
    
    toast({
      title: "Customer Deleted",
      description: "The customer has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <Button variant="outline" className="flex-shrink-0">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Link 
                          to={`/customers/${customer.id}`} 
                          className="font-medium hover:underline flex items-center"
                        >
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {customer.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{customer.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {customer.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.totalOrders}
                      </TableCell>
                      <TableCell>
                        ${customer.totalSpent.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {format(customer.createdAt, 'MMM dd, yyyy')}
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
                              <Link to={`/customers/${customer.id}`} className="flex items-center w-full">
                                <User className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ClipboardCheck className="h-4 w-4 mr-2" />
                              New Order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)}>
                              Delete Customer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomersPage;
