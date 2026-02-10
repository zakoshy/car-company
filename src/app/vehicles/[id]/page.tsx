'use client';

import { VehicleDetailClient } from './vehicle-detail-client';

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  return <VehicleDetailClient vehicleId={params.id} />;
}
