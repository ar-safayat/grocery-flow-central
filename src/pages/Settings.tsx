
import { useState } from 'react';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Lock, 
  Bell, 
  CreditCard,
  Users,
  Laptop,
  Save,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// Mock company data
const companyData = {
  name: 'GroceryFlow Store',
  email: 'info@groceryflow.com',
  phone: '(555) 123-4567',
  website: 'www.groceryflow.com',
  address: '123 Main Street, Suite 100, City, State, 12345',
  description: 'Premium online grocery store with fresh products delivered to your doorstep.',
  logo: '/placeholder.svg',
  taxId: 'TAX-12345678',
  currency: 'USD',
  timezone: 'America/New_York',
};

function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [companyInfo, setCompanyInfo] = useState({ ...companyData });
  
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
  };
  
  const handleSave = () => {
    // In a real app, this would send the data to an API
    console.log('Saving settings:', companyInfo);
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store preferences and settings
        </p>
      </div>
      
      <Tabs defaultValue="general" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <div className="relative">
                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="storeName"
                      name="name"
                      className="pl-9"
                      value={companyInfo.name}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      className="pl-9"
                      value={companyInfo.email}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      className="pl-9"
                      value={companyInfo.phone}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      name="website"
                      className="pl-9"
                      value={companyInfo.website}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={companyInfo.taxId}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={companyInfo.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      name="address"
                      className="pl-9"
                      value={companyInfo.address}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={companyInfo.description}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Store Logo</CardTitle>
              <CardDescription>
                Upload your store logo for branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={companyInfo.logo} />
                  <AvatarFallback>
                    <Building className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: 512x512 pixels. Max file size: 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage staff accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Admin User</div>
                      <div className="text-sm text-muted-foreground">admin@groceryflow.com</div>
                      <div className="text-xs mt-1 inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-primary">
                        Administrator
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>MM</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Manager Mike</div>
                      <div className="text-sm text-muted-foreground">manager@groceryflow.com</div>
                      <div className="text-xs mt-1 inline-flex items-center rounded-md bg-secondary/10 px-2 py-0.5 text-secondary-foreground">
                        Manager
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>SS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Staff Sarah</div>
                      <div className="text-sm text-muted-foreground">staff@groceryflow.com</div>
                      <div className="text-xs mt-1 inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-blue-800">
                        Staff
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Total Users: 3
              </div>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="orderNotifications">New Orders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for new orders
                        </p>
                      </div>
                      <Switch id="orderNotifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when products are low in stock
                        </p>
                      </div>
                      <Switch id="inventoryAlerts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="customerMessages">Customer Messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when customers send messages
                        </p>
                      </div>
                      <Switch id="customerMessages" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reportSummaries">Report Summaries</Label>
                        <p className="text-sm text-muted-foreground">
                          Weekly and monthly sales report summaries
                        </p>
                      </div>
                      <Switch id="reportSummaries" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Notifications</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browserNotifications">Browser Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Show notifications in your browser
                        </p>
                      </div>
                      <Switch id="browserNotifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="soundAlerts">Sound Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sound when new notifications arrive
                        </p>
                      </div>
                      <Switch id="soundAlerts" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Notification Settings Saved",
                  description: "Your notification preferences have been updated.",
                });
              }}>
                <Bell className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure payment options for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Credit Card Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept Visa, Mastercard, and other credit cards
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">PayPal</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect your PayPal account to accept payments
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cash on Delivery</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to pay when their order is delivered
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to pay via direct bank transfer
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input id="taxRate" defaultValue="7.5" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
                    <Input id="minOrderAmount" defaultValue="10.00" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Payment Settings Saved",
                  description: "Your payment settings have been updated.",
                });
              }}>
                <CreditCard className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect with external services and platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/woocommerce.svg"
                        alt="WooCommerce"
                        className="h-6 w-6"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">WooCommerce</h3>
                      <p className="text-sm text-muted-foreground">
                        Sync inventory and orders with WooCommerce
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                        alt="Stripe"
                        className="h-6 w-6"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-muted-foreground">
                        Process payments with Stripe
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/google-icon.svg"
                        alt="Google Analytics"
                        className="h-6 w-6"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Google Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Track website traffic and customer behavior
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Access</h3>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="apiKey" value="••••••••••••••••••••••••••••••" readOnly />
                    <Button variant="outline">Generate New</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use this API key to connect your own applications
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Laptop className="h-4 w-4 mr-2" />
                Save Integration Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
