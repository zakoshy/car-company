import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Car, DollarSign, PackageCheck, PackageOpen } from "lucide-react";
import { getVehicles } from "@/lib/data";

const chartData = [
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 273 },
  { month: "May", sales: 209 },
  { month: "June", sales: 214 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  const vehicles = getVehicles();
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === "Available").length;
  const soldVehicles = vehicles.filter(v => v.status === "Sold").length;
  const incomingVehicles = vehicles.filter(v => v.status === "Incoming").length;
  const totalRevenue = vehicles
    .filter(v => v.status === 'Sold' && v.finalPrice)
    .reduce((acc, v) => acc + (v.finalPrice || 0), 0);

  const stats = [
    { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { title: "Available Vehicles", value: availableVehicles, icon: PackageCheck },
    { title: "Sold Vehicles", value: soldVehicles, icon: Car },
    { title: "Incoming Shipments", value: incomingVehicles, icon: PackageOpen },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>A summary of vehicle sales over the past 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
