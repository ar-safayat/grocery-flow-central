
import { Line } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const dailyData = [
  { name: "Mon", sales: 4500, orders: 34 },
  { name: "Tue", sales: 5300, orders: 41 },
  { name: "Wed", sales: 6200, orders: 48 },
  { name: "Thu", sales: 5100, orders: 39 },
  { name: "Fri", sales: 8700, orders: 67 },
  { name: "Sat", sales: 9400, orders: 72 },
  { name: "Sun", sales: 6800, orders: 52 },
];

const weeklyData = [
  { name: "Week 1", sales: 34500, orders: 265 },
  { name: "Week 2", sales: 32300, orders: 248 },
  { name: "Week 3", sales: 38200, orders: 294 },
  { name: "Week 4", sales: 42100, orders: 324 },
];

const monthlyData = [
  { name: "Jan", sales: 145000, orders: 1118 },
  { name: "Feb", sales: 132000, orders: 1017 },
  { name: "Mar", sales: 157000, orders: 1210 },
  { name: "Apr", sales: 148000, orders: 1140 },
  { name: "May", sales: 162000, orders: 1248 },
  { name: "Jun", sales: 178000, orders: 1370 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-background border p-3 rounded-md shadow-sm">
        <p className="label font-medium">{`${label}`}</p>
        <p className="sales text-sm text-primary">{`Sales: $${payload[0].value.toLocaleString()}`}</p>
        <p className="orders text-sm text-info">{`Orders: ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>
          Compare sales performance across different periods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--info))"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="weekly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  fill="hsl(var(--primary))"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="hsl(var(--info))"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--info))"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
