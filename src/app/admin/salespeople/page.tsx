'use client';

import { SalespeopleClient } from './components/salespeople-client';
import { mockSalespeople } from '@/lib/mock-data';

export default function SalespeoplePage() {
  return <SalespeopleClient initialSalespeople={mockSalespeople} />;
}
