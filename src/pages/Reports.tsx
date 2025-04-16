
import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';

// Mock data for charts
const salesData = [
  { name: 'Jan', sales: 4000, expenses: 2400 },
  { name: 'Feb', sales: 3000, expenses: 1398 },
  { name: 'Mar', sales: 2000, expenses: 9800 },
  { name: 'Apr', sales: 2780, expenses: 3908 },
  { name: 'May', sales: 1890, expenses: 4800 },
  { name: 'Jun', sales: 2390, expenses: 3800 },
  { name: 'Jul', sales: 3490, expenses: 4300 },
  { name: 'Aug', sales: 2490, expenses: 2300 },
  { name: 'Sep', sales: 3490, expenses: 3300 },
  { name: 'Oct', sales: 4490, expenses: 2300 },
  { name: 'Nov', sales: 3490, expenses: 1900 },
  { name: 'Dec', sales: 5490, expenses: 3700 },
];

const categoryData = [
  { name: 'Fresh Produce', value: 400 },
  { name: 'Dairy', value: 300 },
  { name: 'Bakery', value: 300 },
  { name: 'Meat', value: 200 },
  { name: 'Beverages', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock reports list
const reportsList = [
  { 
    id: 1, 
    name: 'Monthly Sales Report', 
    description: 'Shows sales performance for the month',
    lastGenerated: '2023-11-15',
    type: 'sales'
  },
  { 
    id: 2, 
    name: 'Inventory Status', 
    description: 'Current inventory levels and alerts',
    lastGenerated: '2023-11-14',
    type: 'inventory'
  },
  { 
    id: 3, 
    name: 'Customer Analysis', 
    description: 'Customer purchase behavior analysis',
    lastGenerated: '2023-11-10',
    type: 'customer'
  },
  { 
    id: 4, 
    name: 'Vendor Performance', 
    description: 'Evaluation of vendor delivery and quality',
    lastGenerated: '2023-11-08',
    type: 'vendor'
  },
  { 
    id: 5, 
    name: 'Profit & Loss', 
    description: 'Financial performance overview',
    lastGenerated: '2023-11-05',
    type: 'finance'
  },
];

function Reports() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const generateReport = (reportId: number) => {
    console.log('Generating report:', reportId);
    // In a real app, this would trigger a report generation process
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view business reports
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Report Type</DropdownMenuLabel>
            <DropdownMenuItem>Sales Report</DropdownMenuItem>
            <DropdownMenuItem>Inventory Report</DropdownMenuItem>
            <DropdownMenuItem>Customer Report</DropdownMenuItem>
            <DropdownMenuItem>Vendor Report</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Financial Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>
                  Last 12 months sales and expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                    <Bar dataKey="expenses" fill="#82ca9d" name="Expenses ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  Monthly revenue performance
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Sales ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>
                Access previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsList.map((report) => (
                  <div key={report.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.description}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Last generated: {report.lastGenerated}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create customized reports based on your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Build Your Custom Report</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
                  Choose from various metrics, date ranges, and visualization options to create your customized report.
                </p>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Start Building
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Reports;
