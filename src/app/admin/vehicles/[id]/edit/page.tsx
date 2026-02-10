'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VehicleForm } from '@/app/admin/components/vehicle-form';
import { notFound, useParams } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditVehiclePage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();

  const vehicleRef = useMemo(
    () => (db && id ? doc(db, 'vehicles', id) : null),
    [db, id]
  );
  
  const { data: vehicle, loading, error } = useDoc<Vehicle>(vehicleRef);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vehicle || error) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Vehicle</CardTitle>
        <CardDescription>
          Update the details for the {vehicle.year} {vehicle.make}{' '}
          {vehicle.model}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VehicleForm vehicle={vehicle} />
      </CardContent>
    </Card>
  );
}
