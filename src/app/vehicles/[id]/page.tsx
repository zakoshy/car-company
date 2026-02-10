import { mockVehicles } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { VehicleDetailClient } from './vehicle-detail-client';

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = mockVehicles.find((v) => v.id === params.id);

  if (!vehicle) {
    notFound();
  }

  return <VehicleDetailClient vehicle={vehicle} />;
}
