
// User Roles and Permissions
export type UserRole = 'admin' | 'manager' | 'staff' | 'rider' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: Permission[];
}

export type Permission = 
  | 'inventory.view'
  | 'inventory.edit'
  | 'sales.view'
  | 'sales.edit'
  | 'purchase.view'
  | 'purchase.edit'
  | 'vendors.view'
  | 'vendors.edit'
  | 'customers.view'
  | 'customers.edit'
  | 'delivery.view'
  | 'delivery.edit'
  | 'rider.view'
  | 'rider.edit'
  | 'accounting.view'
  | 'accounting.edit'
  | 'reports.view'
  | 'settings.view'
  | 'settings.edit'
  | 'users.view'
  | 'users.edit';

// Product and Inventory Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  description?: string;
  price: number;
  cost: number;
  tax: number;
  stockQuantity: number;
  unit: string;
  minStockLevel: number;
  maxStockLevel: number;
  vendor: string;
  images: string[];
  isActive: boolean;
  dateAdded: Date;
  lastUpdated: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent?: string;
  image?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  date: Date;
  userId: string;
}

// Order and Sales Types
export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'ready-for-delivery'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'business';
  addresses: Address[];
  notes?: string;
  createdAt: Date;
  totalOrders: number;
  totalSpent: number;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Vendor Types
export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  taxId?: string;
  paymentTerms: string;
  notes?: string;
  createdAt: Date;
}

// Purchase Order Types
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: Vendor;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  deliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  total: number;
}

export type PurchaseOrderStatus = 
  | 'draft'
  | 'sent'
  | 'confirmed'
  | 'partial'
  | 'received'
  | 'cancelled';

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  receivedQuantity: number;
}

// Delivery Management Types
export interface Delivery {
  id: string;
  deliveryNumber: string;
  order: Order;
  rider?: Rider;
  status: DeliveryStatus;
  scheduledDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  customerSignature?: string;
  proofOfDelivery?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type DeliveryStatus = 
  | 'pending'
  | 'assigned'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber?: string;
  currentLocation?: GeoLocation;
  status: RiderStatus;
  rating: number;
  totalDeliveries: number;
}

export type RiderStatus = 'available' | 'busy' | 'offline';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  lastUpdated: Date;
}

// Accounting Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  reference: string;
  category: string;
  description?: string;
  date: Date;
  paymentMethod: string;
  createdBy: string;
}

// Dashboard Types
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  lowStockItems: number;
  pendingDeliveries: number;
  monthlyRevenue: {
    month: string;
    amount: number;
  }[];
  topProducts: {
    id: string;
    name: string;
    sold: number;
    revenue: number;
  }[];
}
