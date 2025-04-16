
import { useState } from 'react';
import { 
  Package, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  Search, 
  AlertTriangle, 
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { StockMovement, Product } from '@/types';
import { format } from 'date-fns';

// Mock products
const mockProducts: Product[] = Array(20).fill(null).map((_, index) => ({
  id: `p-${1000 + index}`,
  name: [
    'Organic Bananas',
    'Fresh Milk',
    'Whole Wheat Bread',
    'Free Range Eggs',
    'Avocado',
    'Chicken Breast',
    'Atlantic Salmon',
    'Greek Yogurt',
    'Rice',
    'Pasta',
    'Tomato Sauce',
    'Olive Oil',
    'Coffee Beans',
    'Cereal',
    'Orange Juice',
    'Apples',
    'Carrots',
    'Spinach',
    'Onions',
    'Potatoes'
  ][index],
  sku: `SKU-${10000 + index}`,
  barcode: `BARCODE-${100000 + index}`,
  category: index % 5 === 0 ? 'Fruits' : index % 5 === 1 ? 'Dairy' : index % 5 === 2 ? 'Meat' : index % 5 === 3 ? 'Vegetables' : 'Groceries',
  description: `Description for ${[
    'Organic Bananas',
    'Fresh Milk',
    'Whole Wheat Bread',
    'Free Range Eggs',
    'Avocado',
    'Chicken Breast',
    'Atlantic Salmon',
    'Greek Yogurt',
    'Rice',
    'Pasta',
    'Tomato Sauce',
    'Olive Oil',
    'Coffee Beans',
    'Cereal',
    'Orange Juice',
    'Apples',
    'Carrots',
    'Spinach',
    'Onions',
    'Potatoes'
  ][index]}`,
  price: parseFloat((Math.random() * 20 + 1.99).toFixed(2)),
  cost: parseFloat((Math.random() * 15 + 0.99).toFixed(2)),
  tax: parseFloat((Math.random() * 2).toFixed(2)),
  stockQuantity: Math.floor(Math.random() * 100),
  unit: index % 3 === 0 ? 'kg' : index % 3 === 1 ? 'unit' : 'lb',
  minStockLevel: 10,
  maxStockLevel: 100,
  vendor: index % 3 === 0 ? 'Fresh Farms' : index % 3 === 1 ? 'Daily Distributors' : 'Organic Suppliers',
  images: [`product-${index}.jpg`],
  isActive: Math.random() > 0.1,
  dateAdded: new Date(2023, 0, Math.floor(Math.random() * 30) + 1),
  lastUpdated: new Date(),
}));

// Mock stock movements
const mockMovements: StockMovement[] = Array(40).fill(null).map((_, index) => ({
  id: `sm-${1000 + index}`,
  productId: `p-${1000 + (index % 20)}`,
  type: index % 3 === 0 ? 'in' : index % 3 === 1 ? 'out' : 'adjustment',
  quantity: Math.floor(Math.random() * 20) + 1 * (index % 3 === 1 ? -1 : 1),
  reason: index % 3 === 0 ? 'Purchase' : index % 3 === 1 ? 'Sale' : 'Inventory Adjustment',
  reference: index % 3 === 0 ? `PO-${5000 + index}` : index % 3 === 1 ? `SO-${7000 + index}` : `ADJ-${9000 + index}`,
  date: new Date(2023, Math.floor(index / 10), Math.floor(Math.random() * 30) + 1),
  userId: 'user-001',
}));

export default function StockManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('');
  const [isStockAdjustDialogOpen, setIsStockAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Inventory count');
  const { toast } = useToast();

  const filteredProducts = products
    .filter(product => 
      (searchQuery === '' || 
       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(product => 
      categoryFilter === '' || 
      product.category === categoryFilter
    )
    .filter(product => {
      if (stockFilter === '') return true;
      if (stockFilter === 'low') return product.stockQuantity <= product.minStockLevel;
      if (stockFilter === 'out') return product.stockQuantity === 0;
      if (stockFilter === 'overstock') return product.stockQuantity > product.maxStockLevel;
      return true;
    });

  const productMovements = (productId: string) => {
    return movements.filter(m => m.productId === productId);
  };

  const handleStockAdjustment = () => {
    if (!selectedProduct || adjustmentQuantity === 0) {
      toast({
        title: "Invalid Adjustment",
        description: "Please select a product and enter a quantity.",
        variant: "destructive",
      });
      return;
    }

    const newMovement: StockMovement = {
      id: `sm-${Date.now()}`,
      productId: selectedProduct.id,
      type: adjustmentQuantity > 0 ? 'in' : 'out',
      quantity: Math.abs(adjustmentQuantity),
      reason: adjustmentReason,
      reference: `ADJ-${Date.now()}`,
      date: new Date(),
      userId: 'user-001',
    };

    setMovements([newMovement, ...movements]);

    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          stockQuantity: p.stockQuantity + adjustmentQuantity,
          lastUpdated: new Date(),
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    setIsStockAdjustDialogOpen(false);
    setSelectedProduct(null);
    setAdjustmentQuantity(0);
    setAdjustmentReason('Inventory count');

    toast({
      title: "Stock Adjusted",
      description: `${selectedProduct.name} stock has been adjusted by ${adjustmentQuantity}.`,
    });
  };

  const openStockAdjustDialog = (product: Product) => {
    setSelectedProduct(product);
    setAdjustmentQuantity(0);
    setIsStockAdjustDialogOpen(true);
  };

  const getStockStatusBadge = (product: Product) => {
    if (product.stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (product.stockQuantity <= product.minStockLevel) {
      return <Badge variant="warning">Low Stock</Badge>;
    }
    if (product.stockQuantity > product.maxStockLevel) {
      return <Badge variant="secondary">Overstock</Badge>;
    }
    return <Badge variant="success">In Stock</Badge>;
  };

  const lowStockCount = products.filter(p => p.stockQuantity <= p.minStockLevel).length;
  const outOfStockCount = products.filter(p => p.stockQuantity === 0).length;
  const overstockCount = products.filter(p => p.stockQuantity > p.maxStockLevel).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground">
            Monitor inventory levels and manage stock movements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Low Stock Items
            </CardTitle>
            <CardDescription>Items below minimum stock level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowStockCount}</div>
            <Button 
              variant="outline" 
              className="mt-4 w-full border-yellow-500 text-yellow-700 hover:bg-yellow-100"
              onClick={() => setStockFilter('low')}
            >
              View Low Stock
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Out of Stock
            </CardTitle>
            <CardDescription>Items with zero stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{outOfStockCount}</div>
            <Button 
              variant="outline" 
              className="mt-4 w-full border-red-500 text-red-700 hover:bg-red-100"
              onClick={() => setStockFilter('out')}
            >
              View Out of Stock
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-500" />
              Overstock
            </CardTitle>
            <CardDescription>Items above maximum stock level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overstockCount}</div>
            <Button 
              variant="outline" 
              className="mt-4 w-full border-blue-500 text-blue-700 hover:bg-blue-100"
              onClick={() => setStockFilter('overstock')}
            >
              View Overstock
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Dairy">Dairy</SelectItem>
            <SelectItem value="Meat">Meat</SelectItem>
            <SelectItem value="Groceries">Groceries</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Stock Status</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
            <SelectItem value="overstock">Overstock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4 mt-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-7 p-4 bg-muted/30 font-medium">
                <div className="col-span-2">Product</div>
                <div className="text-center">SKU</div>
                <div className="text-center">Current Stock</div>
                <div className="text-center">Min/Max</div>
                <div className="text-center">Status</div>
                <div className="text-center">Actions</div>
              </div>
              
              {filteredProducts.map((product) => (
                <div key={product.id} className="border-t grid grid-cols-7 p-4 items-center">
                  <div className="col-span-2">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.category}</div>
                  </div>
                  <div className="text-center">{product.sku}</div>
                  <div className="text-center font-medium">{product.stockQuantity} {product.unit}</div>
                  <div className="text-center">{product.minStockLevel} / {product.maxStockLevel}</div>
                  <div className="text-center">{getStockStatusBadge(product)}</div>
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openStockAdjustDialog(product)}
                    >
                      Adjust
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="movements" className="space-y-4 mt-6">
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-6 p-4 bg-muted/30 font-medium">
              <div className="col-span-2">Product</div>
              <div className="text-center">Date</div>
              <div className="text-center">Type</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Reason</div>
            </div>
            
            {movements
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 20)
              .map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                return (
                  <div key={movement.id} className="border-t grid grid-cols-6 p-4 items-center">
                    <div className="col-span-2">
                      <div className="font-medium">{product?.name}</div>
                      <div className="text-xs text-muted-foreground">{product?.sku}</div>
                    </div>
                    <div className="text-center">{format(movement.date, 'MMM dd, yyyy')}</div>
                    <div className="text-center">
                      {movement.type === 'in' ? (
                        <Badge variant="success" className="flex items-center justify-center w-16 mx-auto">
                          <ArrowUp className="h-3 w-3 mr-1" /> In
                        </Badge>
                      ) : movement.type === 'out' ? (
                        <Badge variant="destructive" className="flex items-center justify-center w-16 mx-auto">
                          <ArrowDown className="h-3 w-3 mr-1" /> Out
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="w-16 mx-auto">Adjust</Badge>
                      )}
                    </div>
                    <div className="text-center font-medium">
                      {movement.type === 'in' ? '+' : '-'}{Math.abs(movement.quantity)} {product?.unit}
                    </div>
                    <div className="text-center">
                      <span className="text-sm">{movement.reason}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isStockAdjustDialogOpen} onOpenChange={setIsStockAdjustDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              {selectedProduct && (
                <>Update stock quantity for {selectedProduct.name}.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedProduct && (
              <>
                <div className="grid grid-cols-2 items-center gap-4">
                  <div className="text-right">Current Stock:</div>
                  <div className="font-medium">{selectedProduct.stockQuantity} {selectedProduct.unit}</div>
                </div>
                
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Adjustment:
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value || '0', 10))}
                    className="col-span-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 items-center gap-4">
                  <div className="text-right">New Stock:</div>
                  <div className="font-medium">
                    {(selectedProduct.stockQuantity + adjustmentQuantity)} {selectedProduct.unit}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Reason:
                  </Label>
                  <Select
                    value={adjustmentReason}
                    onValueChange={setAdjustmentReason}
                  >
                    <SelectTrigger className="col-span-1" id="reason">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inventory count">Inventory count</SelectItem>
                      <SelectItem value="Damaged goods">Damaged goods</SelectItem>
                      <SelectItem value="Return to vendor">Return to vendor</SelectItem>
                      <SelectItem value="Donation">Donation</SelectItem>
                      <SelectItem value="Sample">Sample</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStockAdjustment}>Adjust Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
