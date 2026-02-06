import { getVehicleById } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, GaugeCircle, ShieldCheck, Tag, Car, CircleDollarSign, Fuel, Fingerprint, Clipboard, Cog, Settings, Palette } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { formatCurrency } from "@/lib/utils";

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = getVehicleById(params.id);

  if (!vehicle) {
    notFound();
  }
  
  const featureImage = vehicle.images.find(img => img.isFeature) || vehicle.images[0];
  const galleryImages = vehicle.images;

  const vehicleDetails = [
    { icon: Car, label: "Make & Model", value: `${vehicle.make} ${vehicle.model}` },
    { icon: Clipboard, label: "Reference No", value: vehicle.referenceNumber },
    { icon: Fingerprint, label: "Chassis No.", value: vehicle.chassisNumber },
    { icon: Calendar, label: "Year", value: vehicle.year },
    { icon: Palette, label: "Color", value: vehicle.color },
    { icon: Cog, label: "Drivetrain", value: vehicle.drivetrain },
    { icon: Settings, label: "Transmission", value: vehicle.transmission },
    { icon: Fuel, label: "Fuel", value: vehicle.fuel },
    { icon: GaugeCircle, label: "Mileage", value: `${vehicle.mileage.toLocaleString()} km` },
    { icon: Tag, label: "Condition", value: vehicle.condition },
    { icon: ShieldCheck, label: "Inspection", value: vehicle.inspectionStatus },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={image.url}
                        alt={`${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-16" />
            <CarouselNext className="mr-16"/>
          </Carousel>
        </div>
        
        <div>
          <Badge>{vehicle.status}</Badge>
          <h1 className="font-headline text-3xl md:text-4xl font-bold mt-2">{vehicle.make} {vehicle.model}</h1>
          <p className="text-lg text-muted-foreground">{vehicle.year}</p>

          <div className="my-6">
            <p className="text-4xl font-bold text-primary flex items-center gap-2">
              <CircleDollarSign className="h-8 w-8"/>
              {formatCurrency(vehicle.price, vehicle.currency)}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              {vehicleDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="text-muted-foreground">{value.toString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Button size="lg" className="w-full mt-6 text-lg">
            Inquire About This Vehicle
          </Button>
        </div>
      </div>
    </div>
  );
}
