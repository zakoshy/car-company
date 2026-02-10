'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { VehicleTable } from '@/app/admin/components/vehicle-table';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';


export default function AdminVehiclesPage() {
  const db = useFirestore();
  const vehiclesQuery = useMemo(() => db ? query(collection(db, 'vehicles')) : null, [db]);
  const { data: allVehiclesData, loading } = useCollection<Vehicle>(vehiclesQuery);
  const allVehicles = allVehiclesData || [];

  const { availableVehicles, incomingVehicles, soldVehicles } =
    useMemo(() => {
      return {
        availableVehicles: allVehicles.filter((v) => v.status === 'Available'),
        incomingVehicles: allVehicles.filter((v) => v.status === 'Incoming'),
        soldVehicles: allVehicles.filter((v) => v.status === 'Sold'),
      };
    }, [allVehicles]);

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
          <VehicleTable vehicles={allVehicles} isLoading={loading} />
        </TabsContent>
        <TabsContent value="available">
          <VehicleTable vehicles={availableVehicles} isLoading={loading} />
        </TabsContent>
        <TabsContent value="incoming">
          <VehicleTable vehicles={incomingVehicles} isLoading={loading} />
        </TabsContent>
        <TabsContent value="sold">
          <VehicleTable vehicles={soldVehicles} isLoading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
