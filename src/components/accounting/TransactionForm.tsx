
import { useState } from 'react';
import { Save, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types';

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  onSave: (transaction: Partial<Transaction>) => void;
}

const paymentMethods = ['Cash', 'Credit Card', 'Bank Transfer', 'PayPal', 'Check'];
const categories = [
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
  'Taxes',
  'Miscellaneous',
];

export function TransactionForm({ open, onOpenChange, transaction, onSave }: TransactionFormProps) {
  const isEditing = !!transaction;
  const [formData, setFormData] = useState<Partial<Transaction>>(
    transaction || {
      type: 'income',
      amount: 0,
      reference: '',
      category: '',
      description: '',
      date: new Date(),
      paymentMethod: 'Cash',
      createdBy: 'Admin',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      date: new Date(e.target.value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onOpenChange(false);
      
      toast({
        title: isEditing ? "Transaction updated" : "Transaction created",
        description: `Transaction ${isEditing ? "updated" : "added"} successfully.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Edit the information for this transaction.' 
                : 'Add a new transaction to your accounting records.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={formData.type === 'income' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleSelectChange('type', 'income')}
                  >
                    Income
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === 'expense' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleSelectChange('type', 'expense')}
                  >
                    Expense
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={formData.amount} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  name="category" 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} 
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input 
                  id="reference" 
                  name="reference" 
                  value={formData.reference} 
                  onChange={handleChange}
                  required
                  placeholder="e.g., INV-1001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  name="paymentMethod" 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                rows={3}
                placeholder="Provide details about this transaction"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>Processing...</>
              ) : isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Transaction
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
