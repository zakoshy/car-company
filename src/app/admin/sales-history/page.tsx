import { getVehicles } from "@/lib/data";
import { SalesHistoryTable } from "@/app/admin/components/sales-history-table";

export default function SalesHistoryPage() {
  const allVehicles = getVehicles();
  const soldVehicles = allVehicles.filter(v => v.status === "Sold");

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
