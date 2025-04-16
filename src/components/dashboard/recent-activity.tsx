
import { useState } from 'react';
import { 
  Activity, 
  ArrowDownUp, 
  ShoppingCart, 
  Package2, 
  Truck, 
  AlertCircle 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'inventory' | 'delivery' | 'alert';
  priority?: 'low' | 'medium' | 'high';
}

const demoActivities: ActivityItem[] = [
  {
    id: '1',
    title: 'New Order #34562',
    description: 'John Smith placed an order for $156.98',
    time: '5 minutes ago',
    type: 'order',
  },
  {
    id: '2',
    title: 'Low Stock Alert',
    description: 'Organic Bananas are below minimum stock level (3 units left)',
    time: '22 minutes ago',
    type: 'alert',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Delivery Completed',
    description: 'Order #34556 was delivered successfully by Mike Johnson',
    time: '45 minutes ago',
    type: 'delivery',
  },
  {
    id: '4',
    title: 'Inventory Updated',
    description: '25 units of Fresh Apples were added to inventory',
    time: '1 hour ago',
    type: 'inventory',
  },
  {
    id: '5',
    title: 'Order Status Changed',
    description: 'Order #34551 status changed to Ready for Delivery',
    time: '2 hours ago',
    type: 'order',
  },
];

export function RecentActivity() {
  const [filter, setFilter] = useState<string | null>(null);
  
  const filteredActivities = filter 
    ? demoActivities.filter(activity => activity.type === filter)
    : demoActivities;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'inventory':
        return <Package2 className="h-4 w-4" />;
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getPriorityClass = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger/10 text-danger border-danger/30';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'low':
        return 'bg-info/10 text-info border-info/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs",
                filter === null ? "bg-muted" : "bg-transparent"
              )}
              onClick={() => setFilter(null)}
            >
              All
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs",
                filter === 'order' ? "bg-muted" : "bg-transparent"
              )}
              onClick={() => setFilter('order')}
            >
              Orders
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs",
                filter === 'alert' ? "bg-muted" : "bg-transparent"
              )}
              onClick={() => setFilter('alert')}
            >
              Alerts
            </Button>
          </div>
        </div>
        <CardDescription>Monitor real-time system activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <div className={cn(
                "rounded-full p-2",
                activity.type === 'alert' && activity.priority === 'high' 
                  ? 'bg-danger/10 text-danger' 
                  : 'bg-muted text-muted-foreground'
              )}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-sm">
                    {activity.title}
                  </h4>
                  {activity.priority && (
                    <Badge variant="outline" className={cn(getPriorityClass(activity.priority))}>
                      {activity.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs font-medium">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
