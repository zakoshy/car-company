'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VehicleForm } from '@/app/admin/components/vehicle-form';
import { notFound } from 'next/navigation';
import { mockVehicles } from '@/lib/mock-data';

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const vehicle = mockVehicles.find((v) => v.id === params.id);

  if (!vehicle) {
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
