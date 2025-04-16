
import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  ArrowDown,
  ArrowUp,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CreditCard
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Transaction } from '@/types';

// Generate mock transactions data
const mockTransactions: Transaction[] = Array(20).fill(null).map((_, index) => {
  const type = index % 3 === 0 ? 'expense' : 'income';
  const amount = parseFloat((Math.random() * (type === 'expense' ? 500 : 1000) + 50).toFixed(2));
  
  return {
    id: `tx-${1000 + index}`,
    type,
    amount,
    reference: `REF-${10000 + index}`,
    category: [
      'Sales',
      'Inventory Purchase',
      'Rent',
      'Utilities',
      'Salaries',
      'Marketing',
      'Delivery',
      'Taxes',
      'Maintenance',
      'Other',
    ][index % 10],
    description: `Transaction description ${index + 1}`,
    date: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)),
    paymentMethod: ['Cash', 'Credit Card', 'Bank Transfer', 'Check', 'PayPal'][index % 5],
    createdBy: 'Admin User',
  };
});

function Accounting() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterTransactions(term, typeFilter);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    filterTransactions(searchTerm, type);
  };

  const filterTransactions = (term: string, type: string) => {
    let filtered = mockTransactions;

    if (term.trim()) {
      filtered = filtered.filter(
        tx => 
          tx.reference.toLowerCase().includes(term.toLowerCase()) ||
          tx.category.toLowerCase().includes(term.toLowerCase()) ||
          tx.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (type !== 'all') {
      filtered = filtered.filter(tx => tx.type === type);
    }
    
    setFilteredTransactions(filtered);
  };

  // Calculate totals
  const totalIncome = mockTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpense = mockTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const netAmount = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounting</h1>
          <p className="text-muted-foreground">
            Manage your financial transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowDown className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-2xl font-bold">${totalIncome.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-2xl font-bold">${totalExpense.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className={`h-4 w-4 mr-2 ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                ${netAmount.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Button 
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={typeFilter === 'income' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('income')}
            >
              <ArrowDown className="h-4 w-4 mr-2 text-green-500" />
              Income
            </Button>
            <Button 
              variant={typeFilter === 'expense' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('expense')}
            >
              <ArrowUp className="h-4 w-4 mr-2 text-red-500" />
              Expense
            </Button>
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.type === 'income' ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      <ArrowDown className="h-3.5 w-3.5 mr-1" />
                      Income
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      <ArrowUp className="h-3.5 w-3.5 mr-1" />
                      Expense
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{transaction.reference}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>{transaction.category}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{transaction.date.toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{transaction.paymentMethod}</span>
                  </div>
                </TableCell>
                <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                  ${transaction.amount.toFixed(2)}
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
                        Edit Transaction
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
          Showing <strong>1-10</strong> of <strong>{filteredTransactions.length}</strong> transactions
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

export default Accounting;
