
import { useEffect, useState } from 'react';
import {
  Package2,
  Search,
  Plus,
  Filter,
  Settings,
  Download,
  ArrowUpDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/types';

// Mock data
const categories = [
  'Fresh Produce',
  'Dairy',
  'Bakery',
  'Meat & Seafood',
  'Frozen Foods',
  'Beverages',
  'Snacks',
  'Canned Goods',
  'Dry Goods',
  'Household',
];

const inventoryData: Product[] = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: `PRD-${1000 + i}`,
    name: [
      'Organic Bananas',
      'Fresh Apples',
      'Whole Milk',
      'Free Range Eggs',
      'Sliced Bread',
      'Orange Juice',
      'Chicken Breast',
      'Greek Yogurt',
      'Baby Spinach',
      'Ground Coffee',
    ][i % 10],
    sku: `SKU-${10000 + i}`,
    barcode: `BAR-${900000 + i}`,
    category: categories[i % categories.length],
    description: 'Product description goes here',
    price: parseFloat((Math.random() * 20 + 1).toFixed(2)),
    cost: parseFloat((Math.random() * 15 + 0.5).toFixed(2)),
    tax: parseFloat((Math.random() * 5).toFixed(2)),
    stockQuantity: Math.floor(Math.random() * 100),
    unit: ['kg', 'lb', 'pcs', 'box', 'bottle'][Math.floor(Math.random() * 5)],
    minStockLevel: 10,
    maxStockLevel: 100,
    vendor: ['Farm Fresh Inc.', 'Grocery Wholesale Co.', 'Organic Foods Ltd.', 'Local Farmers Market'][
      Math.floor(Math.random() * 4)
    ],
    images: ['/placeholder.svg'],
    isActive: Math.random() > 0.1,
    dateAdded: new Date(Date.now() - Math.random() * 10000000000),
    lastUpdated: new Date(Date.now() - Math.random() * 1000000000),
  }));

function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<Product[]>(inventoryData);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let filtered = inventoryData;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredData(filtered);
  }, [searchTerm, selectedCategory]);
  
  const getStockStatus = (qty: number) => {
    if (qty === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (qty < 15) {
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="bg-success/10 text-success border-success/30">In Stock</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your products and inventory levels
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                      <Package2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sku}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">{product.stockQuantity}</TableCell>
                <TableCell>{getStockStatus(product.stockQuantity)}</TableCell>
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
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package2 className="h-4 w-4 mr-2" />
                        Update Stock
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
          Showing <strong>1-10</strong> of <strong>{filteredData.length}</strong> products
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

export default Inventory;
