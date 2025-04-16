
import { 
  BarChart3, 
  ShoppingCart, 
  Package2, 
  Users, 
  Truck, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { InventorySummary } from '@/components/dashboard/inventory-summary';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { DeliveryStatus } from '@/components/dashboard/delivery-status';

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to GroceryFlow Central ERP - Your complete grocery store management solution
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value="$48,294.50"
          description="Revenue this month"
          icon={<BarChart3 />}
          trend={12.5}
          trendLabel="compared to previous month"
        />
        <StatsCard
          title="Total Orders"
          value="362"
          description="Orders this month"
          icon={<ShoppingCart />}
          trend={8.2}
          trendLabel="compared to previous month"
        />
        <StatsCard
          title="Low Stock Items"
          value="8"
          description="Items below minimum threshold"
          icon={<Package2 />}
          trend={-3}
          trendLabel="since last week"
        />
        <StatsCard
          title="Active Deliveries"
          value="24"
          description="Orders out for delivery"
          icon={<Truck />}
          trend={5}
          trendLabel="compared to yesterday"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesChart />
        <RecentActivity />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InventorySummary />
        <DeliveryStatus />
      </div>
    </div>
  );
}

export default Dashboard;
