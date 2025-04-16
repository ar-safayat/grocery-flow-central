
import { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  FolderTree,
  Edit,
  Trash2,
  Loader2,
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
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types';

// Mock categories data
const mockCategories: Category[] = [
  {
    id: 'c-1001',
    name: 'Fresh Produce',
    description: 'Fresh fruits and vegetables',
    image: '/categories/fresh-produce.jpg',
  },
  {
    id: 'c-1002',
    name: 'Dairy',
    description: 'Milk, cheese, and other dairy products',
    image: '/categories/dairy.jpg',
  },
  {
    id: 'c-1003',
    name: 'Bakery',
    description: 'Bread, pastries, and baked goods',
    image: '/categories/bakery.jpg',
  },
  {
    id: 'c-1004',
    name: 'Meat & Seafood',
    description: 'Fresh and frozen meat and seafood',
    image: '/categories/meat-seafood.jpg',
  },
  {
    id: 'c-1005',
    name: 'Pantry',
    description: 'Dry goods, canned goods, and staples',
    image: '/categories/pantry.jpg',
  },
  {
    id: 'c-1006',
    name: 'Beverages',
    description: 'Drinks, juices, and beverages',
    image: '/categories/beverages.jpg',
  },
  {
    id: 'c-1007',
    name: 'Snacks',
    description: 'Chips, cookies, and snack foods',
    image: '/categories/snacks.jpg',
  },
  {
    id: 'c-1008',
    name: 'Frozen Foods',
    description: 'Frozen meals, vegetables, and desserts',
    parent: 'c-1005',
    image: '/categories/frozen.jpg',
  },
  {
    id: 'c-1009',
    name: 'Household',
    description: 'Cleaning supplies and household items',
    image: '/categories/household.jpg',
  },
  {
    id: 'c-1010',
    name: 'Health & Beauty',
    description: 'Personal care and beauty products',
    image: '/categories/health-beauty.jpg',
  },
];

function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredCategories(mockCategories);
      return;
    }
    
    const filtered = mockCategories.filter(
      category => 
        category.name.toLowerCase().includes(term.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredCategories(filtered);
  };

  const handleDelete = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCategories = filteredCategories.filter(category => category.id !== id);
      setFilteredCategories(newCategories);
      setIsLoading(false);
      
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
      });
    }, 800);
  };

  const getParentName = (parentId?: string) => {
    if (!parentId) return '-';
    const parent = mockCategories.find(c => c.id === parentId);
    return parent ? parent.name : '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search categories..."
          className="pl-8"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <Card className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                          <FolderTree className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="font-medium">{category.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {category.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getParentName(category.parent)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Products
                      </Button>
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
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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
      </Card>
    </div>
  );
}

export default CategoriesPage;
