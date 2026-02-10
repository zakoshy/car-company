'use client';

import { useMemo } from 'react';
import { SalesHistoryTable } from '@/app/admin/components/sales-history-table';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';


export default function SalesHistoryPage() {
  const db = useFirestore();
  
  const soldQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'vehicles'), where('status', '==', 'Sold'));
  }, [db]);
  
  const { data: soldVehicles, loading } = useCollection<Vehicle>(soldQuery);

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Sales History
        </h2>
      </div>
      <SalesHistoryTable vehicles={soldVehicles || []} isLoading={loading} />
    </div>
  );
}
