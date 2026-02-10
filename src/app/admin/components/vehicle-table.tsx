'use client';

import type { Vehicle } from '@/lib/types';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteVehicle } from '@/lib/mutations';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export function VehicleTable({ vehicles, isLoading }: { vehicles: Vehicle[], isLoading: boolean }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const db = useFirestore();

  if (isLoading) {
     return (
       <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
       </div>
     )
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold">No Vehicles Found</h2>
        <p className="text-muted-foreground mt-2">
          There are no vehicles matching the current filter.
        </p>
      </div>
    );
  }

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle || !db) return;

    await deleteVehicle(db, selectedVehicle.id);
    toast({
      title: 'Vehicle Deleted',
      description: `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} has been removed.`,
    });
    router.refresh();
    setIsDeleteDialogOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Make/Model</TableHead>
            <TableHead className="hidden md:table-cell">Year</TableHead>
            <TableHead className="hidden lg:table-cell">Mileage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Inspection</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">
                <div>{vehicle.make}</div>
                <div className="text-sm text-muted-foreground">
                  {vehicle.model}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {vehicle.year}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {vehicle.mileage.toLocaleString()} km
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn({
                    'border-green-500 text-green-600':
                      vehicle.status === 'Available',
                    'border-yellow-500 text-yellow-600':
                      vehicle.status === 'Incoming',
                    'border-gray-500 text-gray-600': vehicle.status === 'Sold',
                  })}
                >
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge
                  variant={
                    vehicle.inspectionStatus === 'Passed'
                      ? 'default'
                      : 'secondary'
                  }
                  className={cn({
                    'bg-green-100 text-green-800':
                      vehicle.inspectionStatus === 'Passed',
                    'bg-yellow-100 text-yellow-800':
                      vehicle.inspectionStatus === 'Pending',
                    'bg-red-100 text-red-800':
                      vehicle.inspectionStatus === 'Failed',
                  })}
                >
                  {vehicle.inspectionStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(vehicle.price, vehicle.currency)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteClick(vehicle)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              vehicle data from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
