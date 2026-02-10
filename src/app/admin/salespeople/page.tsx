'use client';

import { useMemo } from 'react';
import { SalespeopleTable } from './components/salespeople-table';
import { AddSalespersonDialog } from './components/add-salesperson-dialog';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Salesperson } from '@/lib/types';

export default function SalespeoplePage() {
  const db = useFirestore();

  const salespeopleQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'salespeople'));
  }, [db]);

  const { data: salespeople, loading } = useCollection<Salesperson>(salespeopleQuery);

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Manage Salespeople
        </h2>
        <AddSalespersonDialog />
      </div>
      <SalespeopleTable salespeople={salespeople || []} isLoading={loading} />
    </div>
  );
}
