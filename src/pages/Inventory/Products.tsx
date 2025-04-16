import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Package2,
  Tag,
  DollarSign,
  AlertCircle,
  Edit,
  Trash2,
  ListFilter,
  ArrowDownUp,
  Loader2
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
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { ProductForm } from '@/components/inventory/ProductForm';

const mockProducts: Product[] = Array(20).fill(null).map((_, index) => ({
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
    'Red Apples',
    'Basmati Rice',
    'Coconut Water',
    'Olive Oil',
    'Black Beans',
    'Tomatoes',
    'Pasta',
    'Cereal',
    'Orange Juice',
    'Ground Coffee',
  ][index],
  sku: `SKU-${1000 + index}`,
  barcode: `BAR${10000000 + index}`,
  category: ['Fresh Produce', 'Dairy', 'Bakery', 'Proteins', 'Beverages', 'Pantry'][index % 6],
  description: `High quality ${['organic', 'fresh', 'premium', 'healthy', 'natural'][index % 5]} product.`,
  price: parseFloat((Math.random() * 20 + 1.99).toFixed(2)),
  cost: parseFloat((Math.random() * 15 + 0.99).toFixed(2)),
  tax: parseFloat((Math.random() * 0.1).toFixed(2)),
  stockQuantity: Math.floor(Math.random() * 200),
  unit: ['kg', 'g', 'lb', 'oz', 'pcs', 'pack', 'bottle', 'box'][index % 8],
  minStockLevel: 10,
  maxStockLevel: 200,
  vendor: [`Vendor-${100 + index % 5}`],
  images: [`/product-${index + 1}.jpg`],
  isActive: Math.random() > 0.1,
  dateAdded: new Date(2023, 0, Math.floor(Math.random() * 30) + 1),
  lastUpdated: new Date(),
}));

function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredProducts(mockProducts);
      return;
    }
    
    const filtered = mockProducts.filter(
      product => 
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.sku.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };

  const handleDelete = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newProducts = filteredProducts.filter(product => product.id !== id);
      setFilteredProducts(newProducts);
      setIsLoading(false);
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    }, 800);
  };

  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity <= 0) {
      return { status: 'Out of Stock', badge: 'destructive' };
    } else if (quantity <= minLevel) {
      return { status: 'Low Stock', badge: 'warning' };
    } else {
      return { status: 'In Stock', badge: 'success' };
    }
  };

  const handleAddProduct = () => {
    setCurrentProduct(undefined);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setFormOpen(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (currentProduct) {
        // Update existing product
        const updated = filteredProducts.map(p => 
          p.id === currentProduct.id ? { ...currentProduct, ...productData } as Product : p
        );
        setFilteredProducts(updated);
      } else {
        // Add new product
        const newProduct: Product = {
          id: `p-${1000 + filteredProducts.length + 1}`,
          dateAdded: new Date(),
          lastUpdated: new Date(),
          images: ['/placeholder.svg'],
          ...productData as any
        } as Product;
        
        setFilteredProducts([newProduct, ...filteredProducts]);
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory products
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ListFilter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Category
            </DropdownMenuItem>
            <DropdownMenuItem>
              Stock status
            </DropdownMenuItem>
            <DropdownMenuItem>
              Price range
            </DropdownMenuItem>
            <DropdownMenuItem>
              Vendor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline">
          <ArrowDownUp className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>
      
      <Card className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stockQuantity, product.minStockLevel);
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                            <Package2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          {product.category}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-0.5 text-muted-foreground" />
                          {product.price.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {product.stockQuantity} {product.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.badge}>
                          {stockStatus.status}
                        </Badge>
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
                              <Package2 className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Manage Stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ProductForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        product={currentProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

export default ProductsPage;
