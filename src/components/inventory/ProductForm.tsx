
import { useState } from 'react';
import { Plus, X, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSave: (product: Partial<Product>) => void;
}

const categoryOptions = ['Fresh Produce', 'Dairy', 'Bakery', 'Proteins', 'Beverages', 'Pantry'];
const unitOptions = ['kg', 'g', 'lb', 'oz', 'pcs', 'pack', 'bottle', 'box'];
const vendorOptions = ['Vendor-100', 'Vendor-101', 'Vendor-102', 'Vendor-103', 'Vendor-104'];

export function ProductForm({ open, onOpenChange, product, onSave }: ProductFormProps) {
  const isEditing = !!product;
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      sku: '',
      barcode: '',
      category: '',
      description: '',
      price: 0,
      cost: 0,
      tax: 0,
      stockQuantity: 0,
      unit: 'pcs',
      minStockLevel: 10,
      maxStockLevel: 100,
      vendor: '',
      isActive: true,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' || name === 'tax' || 
               name === 'stockQuantity' || name === 'minStockLevel' || 
               name === 'maxStockLevel'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
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
        title: isEditing ? "Product updated" : "Product created",
        description: `Product ${isEditing ? "updated" : "added"} successfully.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Edit the information for this product.' 
                : 'Add a new product to your inventory.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input 
                  id="barcode" 
                  name="barcode" 
                  value={formData.barcode} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Select 
                  name="vendor" 
                  value={formData.vendor} 
                  onValueChange={(value) => handleSelectChange('vendor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorOptions.map(vendor => (
                      <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
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
              />
            </div>
            
            <Separator />
            
            <h3 className="text-lg font-medium">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Sale Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={formData.price} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Cost Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input 
                    id="cost" 
                    name="cost" 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={formData.cost} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax">Tax Rate</Label>
                <div className="relative">
                  <Input 
                    id="tax" 
                    name="tax" 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.tax} 
                    onChange={handleChange}
                  />
                  <span className="absolute right-3 top-2.5">%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Current Stock</Label>
                <Input 
                  id="stockQuantity" 
                  name="stockQuantity" 
                  type="number" 
                  min="0"
                  step="1"
                  value={formData.stockQuantity} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  name="unit" 
                  value={formData.unit} 
                  onValueChange={(value) => handleSelectChange('unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Min Stock Level</Label>
                <Input 
                  id="minStockLevel" 
                  name="minStockLevel" 
                  type="number" 
                  min="0"
                  step="1"
                  value={formData.minStockLevel} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                <Input 
                  id="maxStockLevel" 
                  name="maxStockLevel" 
                  type="number" 
                  min="0"
                  step="1"
                  value={formData.maxStockLevel} 
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={formData.isActive} 
                onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Product is active</Label>
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
                  Update Product
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
