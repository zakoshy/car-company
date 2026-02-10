'use client';

import { SalesHistoryTable } from '@/app/admin/components/sales-history-table';
import { mockVehicles } from '@/lib/mock-data';


export default function SalesHistoryPage() {
  const soldVehicles = mockVehicles.filter(v => v.status === 'Sold');

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Sales History
        </h2>
      </div>
      <SalesHistoryTable vehicles={soldVehicles} />
    </div>
  );
}
