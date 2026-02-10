'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { VehicleTable } from '@/app/admin/components/vehicle-table';
import { mockVehicles } from '@/lib/mock-data';

export default function AdminVehiclesPage() {
  const { allVehicles, availableVehicles, incomingVehicles, soldVehicles } =
    useMemo(() => {
      const all = mockVehicles;
      return {
        allVehicles: all,
        availableVehicles: all.filter((v) => v.status === 'Available'),
        incomingVehicles: all.filter((v) => v.status === 'Incoming'),
        soldVehicles: all.filter((v) => v.status === 'Sold'),
      };
    }, []);

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Vehicle Inventory
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/vehicles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <VehicleTable vehicles={allVehicles} />
        </TabsContent>
        <TabsContent value="available">
          <VehicleTable vehicles={availableVehicles} />
        </TabsContent>
        <TabsContent value="incoming">
          <VehicleTable vehicles={incomingVehicles} />
        </TabsContent>
        <TabsContent value="sold">
          <VehicleTable vehicles={soldVehicles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
