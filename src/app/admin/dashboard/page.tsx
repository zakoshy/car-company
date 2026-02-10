'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Car, DollarSign, PackageCheck, PackageOpen } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import type { Vehicle } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const chartData = [
  { month: 'January', sales: 0 },
  { month: 'February', sales: 0 },
  { month: 'March', sales: 0 },
  { month: 'April', sales: 0 },
  { month: 'May', sales: 0 },
  { month: 'June', sales: 0 },
];

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--primary))',
  },
};

export default function DashboardPage() {
  const db = useFirestore();
  const vehiclesQuery = useMemo(() => (db ? collection(db, 'vehicles') : null), [db]);
  const { data: vehicles, loading } = useCollection<Vehicle>(vehiclesQuery);

  const {
    totalRevenue,
    availableVehicles,
    soldVehicles,
    incomingVehicles,
    salesByMonth
  } = useMemo(() => {
    if (!vehicles) {
      return { totalRevenue: 0, availableVehicles: 0, soldVehicles: 0, incomingVehicles: 0, salesByMonth: chartData };
    }
    
    const sold = vehicles.filter((v) => v.status === 'Sold' && v.finalPrice);
    
    const monthlySales = [...chartData];
    sold.forEach(v => {
        if (v.saleDate) {
            try {
                const saleDate = new Date(v.saleDate);
                const monthIndex = saleDate.getMonth();
                if(monthlySales[monthIndex]) {
                  monthlySales[monthIndex].sales += 1;
                }
            } catch(e) {
                console.warn(`Invalid sale date for vehicle ${v.id}: ${v.saleDate}`);
            }
        }
    });

    return {
      totalRevenue: sold.reduce((acc, v) => acc + (v.finalPrice || 0), 0),
      availableVehicles: vehicles.filter((v) => v.status === 'Available').length,
      soldVehicles: sold.length,
      incomingVehicles: vehicles.filter((v) => v.status === 'Incoming').length,
      salesByMonth: monthlySales,
    };
  }, [vehicles]);


  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: 'Available Vehicles',
      value: availableVehicles,
      icon: PackageCheck,
    },
    { title: 'Sold Vehicles', value: soldVehicles, icon: Car },
    {
      title: 'Incoming Shipments',
      value: incomingVehicles,
      icon: PackageOpen,
    },
  ];

  if (loading) {
    return (
        <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-96" />
        </div>
    )
  }

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
          <CardDescription>
            A summary of vehicle sales over the past 6 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesByMonth}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
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
