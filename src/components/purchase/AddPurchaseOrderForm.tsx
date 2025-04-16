
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, CalendarIcon, Store, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Vendor } from '@/types';

// Mock vendors for the select dropdown
const mockVendors: Vendor[] = Array(5).fill(null).map((_, index) => ({
  id: `v-${1000 + index}`,
  name: [
    'Farm Fresh Produce',
    'Dairy Delights Inc.',
    'Bakery Supplies Co.',
    'Organic Foods Ltd.',
    'Meat & Poultry Experts',
  ][index],
  contactPerson: [
    'John Smith',
    'Sarah Johnson',
    'Michael Brown',
    'Emily Davis',
    'Robert Wilson',
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

// Mock products for the select dropdown
const mockProducts = Array(10).fill(null).map((_, index) => ({
  id: `p-${1000 + index}`,
  name: [
    'Organic Bananas',
    'Farm Fresh Milk',
    'Whole Wheat Bread',
    'Free Range Eggs',
    'Avocado (Ripe)',
    'Chicken Breast',
    'Atlantic Salmon',
    'Greek Yogurt',
    'Kale Bunch',
    'Sweet Potatoes',
  ][index],
  price: parseFloat((Math.random() * 20 + 1.99).toFixed(2)),
}));

const formSchema = z.object({
  vendorId: z.string().min(1, { message: "Vendor is required" }),
  deliveryDate: z.date().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1, { message: "Product is required" }),
      quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
      unitPrice: z.coerce.number().min(0.01, { message: "Unit price must be greater than 0" }),
    })
  ).min(1, { message: "At least one item is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPurchaseOrderFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddPurchaseOrderForm({ onSuccess, onCancel }: AddPurchaseOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorId: '',
      notes: '',
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const addItem = () => {
    const items = form.getValues().items;
    form.setValue('items', [...items, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    const items = form.getValues().items;
    if (items.length > 1) {
      form.setValue('items', items.filter((_, i) => i !== index));
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      const items = form.getValues().items;
      items[index].unitPrice = product.price;
      form.setValue('items', items);
    }
  };

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Calculate total
    const total = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Purchase Order Data:", { ...data, total });
      
      toast({
        title: "Purchase Order Created",
        description: `PO created successfully with ${data.items.length} items.`,
      });
      
      setIsSubmitting(false);
      onSuccess?.();
    }, 1500);
  };
  
  const calculateSubtotal = () => {
    const items = form.getValues().items;
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="vendorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockVendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        <div className="flex items-center">
                          <Store className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vendor.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the vendor for this purchase order.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expected Delivery Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When you expect to receive this order.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Order Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {form.getValues().items.map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-md">
              <div className="md:col-span-5">
                <FormField
                  control={form.control}
                  name={`items.${index}.productId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleProductSelect(index, value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name={`items.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="number" step="0.01" min="0" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2 flex items-end justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={form.getValues().items.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional information for this purchase order..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-lg font-medium">
            Subtotal: <span className="text-primary">${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>Create Purchase Order</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
