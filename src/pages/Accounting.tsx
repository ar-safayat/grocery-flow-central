import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  DollarSign,
  CalendarIcon,
  FileText,
  UserCheck,
  MoreHorizontal,
  Download,
  ArrowUpDown,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types';
import { TransactionForm } from '@/components/accounting/TransactionForm';

const mockTransactions: Transaction[] = Array(20).fill(null).map((_, index) => ({
  id: `t-${1000 + index}`,
  type: index % 3 === 0 ? 'expense' : 'income',
  amount: parseFloat((Math.random() * 2000 + 50).toFixed(2)),
  reference: `REF-${10000 + index}`,
  category: [
    'Sales',
    'Inventory Purchase',
    'Rent',
    'Utilities',
    'Salary',
    'Marketing',
    'Shipping',
    'Office Supplies',
    'Insurance',
    'Refund',
  ][index % 10],
  description: `${[
    'Monthly sale revenue',
    'Grocery inventory purchase',
    'Office rent payment',
    'Electricity and water bill',
    'Staff salary',
    'Online advertising campaign',
    'Shipping charges',
    'Office supplies purchase',
    'Business insurance premium',
    'Customer refund',
  ][index % 10]}`,
  date: new Date(2023, Math.floor(index / 4), 1 + (index % 28)),
  paymentMethod: ['Cash', 'Credit Card', 'Bank Transfer', 'PayPal'][index % 4],
  createdBy: ['Admin', 'Manager', 'Accountant'][index % 3],
}));

function AccountingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [formOpen, setFormOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | undefined>(undefined);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredTransactions(mockTransactions);
      return;
    }
    
    const filtered = mockTransactions.filter(
      transaction => 
        transaction.description.toLowerCase().includes(term.toLowerCase()) ||
        transaction.category.toLowerCase().includes(term.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredTransactions(filtered);
  };

  const exportTransactions = () => {
    toast({
      title: "Export Started",
      description: "Transactions are being exported to CSV.",
    });
    
    // In a real app, this would generate and download a CSV file
  };

  const handleAddTransaction = () => {
    setCurrentTransaction(undefined);
    setFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setFormOpen(true);
  };

  const handleSaveTransaction = (transactionData: Partial<Transaction>) => {
    if (currentTransaction) {
      const updated = filteredTransactions.map(t => 
        t.id === currentTransaction.id ? { ...currentTransaction, ...transactionData } as Transaction : t
      );
      setFilteredTransactions(updated);
      
      toast({
        title: "Transaction Updated",
        description: "The transaction has been successfully updated.",
      });
    } else {
      const newTransaction: Transaction = {
        id: `t-${1000 + filteredTransactions.length + 1}`,
        ...transactionData as any
      } as Transaction;
      
      setFilteredTransactions([newTransaction, ...filteredTransactions]);
      
      toast({
        title: "Transaction Added",
        description: "The new transaction has been successfully added.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounting</h1>
          <p className="text-muted-foreground">
            Manage transactions and financial records
          </p>
        </div>
        <Button onClick={handleAddTransaction}>
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </div>
      
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4 mt-4">
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
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button variant="outline" className="flex-shrink-0" onClick={exportTransactions}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        Date
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(transaction.date, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'income' ? 'success' : 'destructive'}>
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.reference}</TableCell>
                        <TableCell className={`text-right font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
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
                              <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                                <DollarSign className="h-4 w-4 mr-2" />
                                Edit Transaction
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredTransactions.length}</strong> of <strong>{mockTransactions.length}</strong> transactions
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Manage your customer and vendor invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Invoice Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Track, create and send invoices to customers and vendors
                  </p>
                  <Button>Create New Invoice</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Generate detailed financial reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Financial Reporting</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate profit & loss statements, balance sheets, and more
                  </p>
                  <Button>Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={currentTransaction}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}

export default AccountingPage;
