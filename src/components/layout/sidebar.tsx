
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth-context';

import { 
  LayoutDashboard, 
  Package2, 
  ShoppingCart, 
  ClipboardList, 
  Users, 
  Truck, 
  DollarSign,
  BarChart3, 
  Settings, 
  Store,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingBag
} from 'lucide-react';

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  children?: Omit<SidebarItem, 'children'>[];
};

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permission: 'inventory.view',
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Package2,
    permission: 'inventory.view',
    children: [
      {
        title: 'Products',
        href: '/inventory/products',
        icon: ShoppingBag,
        permission: 'inventory.view',
      },
      {
        title: 'Categories',
        href: '/inventory/categories',
        icon: Store,
        permission: 'inventory.view',
      },
      {
        title: 'Stock Management',
        href: '/inventory/stock',
        icon: Package2,
        permission: 'inventory.view',
      },
    ],
  },
  {
    title: 'Sales',
    href: '/sales',
    icon: ShoppingCart,
    permission: 'sales.view',
    children: [
      {
        title: 'Orders',
        href: '/sales/orders',
        icon: ShoppingCart,
        permission: 'sales.view',
      },
      {
        title: 'Point of Sale',
        href: '/sales/pos',
        icon: DollarSign,
        permission: 'sales.view',
      },
    ],
  },
  {
    title: 'Purchase Orders',
    href: '/purchase-orders',
    icon: ClipboardList,
    permission: 'purchase.view',
  },
  {
    title: 'Vendors',
    href: '/vendors',
    icon: Store,
    permission: 'vendors.view',
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    permission: 'customers.view',
  },
  {
    title: 'Delivery',
    href: '/delivery',
    icon: Truck,
    permission: 'delivery.view',
    children: [
      {
        title: 'Deliveries',
        href: '/delivery/list',
        icon: Truck,
        permission: 'delivery.view',
      },
      {
        title: 'Riders',
        href: '/delivery/riders',
        icon: User,
        permission: 'rider.view',
      },
    ],
  },
  {
    title: 'Accounting',
    href: '/accounting',
    icon: DollarSign,
    permission: 'accounting.view',
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    permission: 'reports.view',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    permission: 'settings.view',
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();

  if (!user) return null;

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const filteredItems = sidebarItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center h-14 px-4 border-b">
        <div className="flex items-center space-x-2 overflow-hidden">
          {!collapsed && (
            <span className="text-lg font-semibold text-primary">
              GroceryFlow
            </span>
          )}
          {collapsed && (
            <span className="text-lg font-semibold text-primary">GF</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {filteredItems.map((item) => {
            const isGroupActive = item.children?.some((child) =>
              isActive(child.href)
            );
            const isGroupOpen = openGroups[item.title] || isGroupActive;

            if (item.children) {
              return (
                <div key={item.title} className="space-y-1">
                  <Button
                    variant={isGroupActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center p-2"
                    )}
                    onClick={() => toggleGroup(item.title)}
                  >
                    <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
                    {!collapsed && (
                      <>
                        <span>{item.title}</span>
                        <ChevronRight
                          size={16}
                          className={cn(
                            "ml-auto transition-transform",
                            isGroupOpen ? "rotate-90" : ""
                          )}
                        />
                      </>
                    )}
                  </Button>
                  {isGroupOpen && !collapsed && (
                    <div className="grid gap-1 pl-6">
                      {item.children.map((child) => (
                        <Link key={child.href} to={child.href}>
                          <Button
                            variant={isActive(child.href) ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start"
                          >
                            <child.icon className="h-4 w-4 mr-2" />
                            <span>{child.title}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    collapsed && "justify-center p-2"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={logout}
          className={cn("w-full", collapsed ? "justify-center" : "justify-start")}
        >
          <LogOut className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
