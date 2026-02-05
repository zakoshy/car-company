import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getVehicles } from "@/lib/data";
import { VehicleTable } from "@/app/admin/components/vehicle-table";
import type { Vehicle } from "@/lib/types";

export default function AdminVehiclesPage() {
  const vehicles: Vehicle[] = getVehicles();

  const statuses: Vehicle['status'][] = ["Available", "Incoming", "Sold"];
  const allVehicles = [...vehicles];
  const availableVehicles = vehicles.filter(v => v.status === "Available");
  const incomingVehicles = vehicles.filter(v => v.status === "Incoming");
  const soldVehicles = vehicles.filter(v => v.status === "Sold");

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Vehicle Inventory
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/vehicles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <VehicleTable vehicles={allVehicles} />
        </TabsContent>
        <TabsContent value="available">
          <VehicleTable vehicles={availableVehicles} />
        </TabsContent>
        <TabsContent value="incoming">
          <VehicleTable vehicles={incomingVehicles} />
        </TabsContent>
        <TabsContent value="sold">
          <VehicleTable vehicles={soldVehicles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
