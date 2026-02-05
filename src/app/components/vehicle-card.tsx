import type { Vehicle } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const featureImage = vehicle.images.find(img => img.isFeature);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {featureImage ? (
              <Image
                src={featureImage.url}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
             <Badge 
              className={cn("absolute top-3 right-3", {
                "bg-blue-600": vehicle.status === "Available",
                "bg-yellow-500": vehicle.status === "Incoming",
                "bg-gray-500": vehicle.status === "Sold",
              })}
            >
              {vehicle.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg tracking-tight">
            {vehicle.make} {vehicle.model}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{vehicle.year}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-xl font-bold text-primary">{formatCurrency(vehicle.price)}</p>
          <div className="text-sm text-muted-foreground">{vehicle.mileage.toLocaleString()} km</div>
        </CardFooter>
      </Card>
    </Link>
  );
}
