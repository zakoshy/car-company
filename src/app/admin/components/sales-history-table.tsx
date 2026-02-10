import type { Vehicle } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export function SalesHistoryTable({ vehicles, isLoading }: { vehicles: Pick<Vehicle, 'id' | 'make' | 'model' | 'year' | 'saleDate' | 'buyerDetails' | 'finalPrice' | 'currency'>[], isLoading: boolean }) {

   if (isLoading) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Completed Sales</CardTitle>
          <CardDescription>A log of all vehicles that have been sold.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    )
   }

   if (vehicles.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold">No Sales Recorded</h2>
        <p className="text-muted-foreground mt-2">There are no vehicles marked as sold in the system.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed Sales</CardTitle>
        <CardDescription>A log of all vehicles that have been sold.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead className="hidden md:table-cell">Sale Date</TableHead>
              <TableHead className="hidden lg:table-cell">Buyer Details</TableHead>
              <TableHead className="text-right">Final Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  <div>{vehicle.year} {vehicle.make}</div>
                  <div className="text-sm text-muted-foreground">{vehicle.model}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {vehicle.saleDate ? format(typeof (vehicle.saleDate as any).toDate === 'function' ? (vehicle.saleDate as any).toDate() : new Date(vehicle.saleDate as string), 'PPP') : 'N/A'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{vehicle.buyerDetails}</TableCell>
                <TableCell className="text-right">{formatCurrency(vehicle.finalPrice || 0, vehicle.currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
