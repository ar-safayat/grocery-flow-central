
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventorySummaryProps {
  className?: string;
}

export function InventorySummary({ className }: InventorySummaryProps) {
  // Demo data for the inventory summary
  const inventory = {
    totalProducts: 156,
    lowStock: 8,
    outOfStock: 3,
    categories: 12,
    recentlyAdded: [
      {
        id: '1',
        name: 'Organic Bananas',
        sku: 'PRD-345',
        stock: 15,
        price: 2.99,
        status: 'normal',
      },
      {
        id: '2',
        name: 'Fresh Apples',
        sku: 'PRD-346',
        stock: 8,
        price: 3.49,
        status: 'low',
      },
      {
        id: '3',
        name: 'Whole Milk',
        sku: 'PRD-347',
        stock: 0,
        price: 4.29,
        status: 'out',
      },
      {
        id: '4',
        name: 'Free Range Eggs',
        sku: 'PRD-348',
        stock: 24,
        price: 5.99,
        status: 'normal',
      },
    ],
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'low':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Low Stock</Badge>;
      case 'out':
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30">Out of Stock</Badge>;
      default:
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">In Stock</Badge>;
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Inventory Summary</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              {inventory.totalProducts} Products
            </Badge>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
              {inventory.lowStock} Low Stock
            </Badge>
            <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30">
              {inventory.outOfStock} Out of Stock
            </Badge>
          </div>
        </div>
        <CardDescription>Overview of your current inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-2 text-xs font-medium text-muted-foreground bg-muted/50">
              <div className="col-span-4">Product</div>
              <div className="col-span-2 text-center">SKU</div>
              <div className="col-span-2 text-center">Stock</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Status</div>
            </div>
            {inventory.recentlyAdded.map((product) => (
              <div 
                key={product.id} 
                className="grid grid-cols-12 items-center p-2 text-sm border-t"
              >
                <div className="col-span-4 font-medium truncate">{product.name}</div>
                <div className="col-span-2 text-center text-xs text-muted-foreground">{product.sku}</div>
                <div className="col-span-2 text-center">{product.stock}</div>
                <div className="col-span-2 text-center">${product.price.toFixed(2)}</div>
                <div className="col-span-2 flex justify-center">
                  {getStockBadge(product.status)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="link" size="sm" className="text-xs" asChild>
              <a href="/inventory">
                View All Products <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
