'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  GaugeCircle,
  ShieldCheck,
  Tag,
  Car,
  CircleDollarSign,
  Fuel,
  Fingerprint,
  Clipboard,
  Cog,
  Settings,
  Palette,
  Loader2,
  Zap,
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { formatCurrency } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { WhatsappIcon } from '@/app/components/whatsapp-icon';


export function VehicleDetailClient({ vehicleId }: { vehicleId: string }) {
  const db = useFirestore();

  const vehicleRef = useMemo(
    () => (db ? doc(db, 'vehicles', vehicleId) : null),
    [db, vehicleId]
  );
  
  const { data: vehicle, loading, error } = useDoc<Vehicle>(vehicleRef);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    notFound();
  }

  const galleryImages = vehicle.images?.length > 0 ? vehicle.images : [];

  const vehicleDetails = [
    {
      icon: Car,
      label: 'Make & Model',
      value: `${vehicle.make} ${vehicle.model}`,
    },
    { icon: Clipboard, label: 'Reference No', value: vehicle.referenceNumber },
    { icon: Fingerprint, label: 'Chassis No.', value: vehicle.chassisNumber },
    ...(vehicle.vin ? [{ icon: Fingerprint, label: 'VIN', value: vehicle.vin }] : []),
    { icon: Car, label: 'Vehicle Type', value: vehicle.vehicleType },
    { icon: Calendar, label: 'Year', value: vehicle.year },
    { icon: Palette, label: 'Color', value: vehicle.color },
    { icon: Cog, label: 'Drivetrain', value: vehicle.drivetrain },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
    { icon: Fuel, label: 'Fuel', value: vehicle.fuel },
    ...(vehicle.engineSize ? [{
      icon: Zap,
      label: 'Engine Size',
      value: `${vehicle.engineSize.toLocaleString()} CC`,
    }] : []),
    {
      icon: GaugeCircle,
      label: 'Mileage',
      value: `${vehicle.mileage.toLocaleString()} km`,
    },
    { icon: Tag, label: 'Condition', value: vehicle.condition },
    { icon: ShieldCheck, label: 'Inspection', value: vehicle.inspectionStatus },
  ];

  const inquiryText = `Hello, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Ref: ${vehicle.referenceNumber}).`;
  const whatsappUrl = `https://wa.me/256776754426?text=${encodeURIComponent(inquiryText)}`;


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          {galleryImages.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <Card className="overflow-hidden">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={image.url}
                          alt={`${vehicle.make} ${vehicle.model} - Image ${
                            index + 1
                          }`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-16" />
              <CarouselNext className="mr-16" />
            </Carousel>
          ) : (
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] relative bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No Image Available</p>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Badge>{vehicle.status}</Badge>
          <h1 className="font-headline text-3xl md:text-4xl font-bold mt-2">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-lg text-muted-foreground">{vehicle.year}</p>

          <div className="my-6">
             {vehicle.status === 'Sold' && typeof vehicle.finalPrice === 'number' ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sold For</p>
                  <p className="text-4xl font-bold text-primary flex items-center gap-2">
                    <CircleDollarSign className="h-8 w-8" />
                    {formatCurrency(vehicle.finalPrice, vehicle.currency)}
                  </p>
                </div>
              ) : (
                <p className="text-4xl font-bold text-primary flex items-center gap-2">
                  <CircleDollarSign className="h-8 w-8" />
                  {formatCurrency(vehicle.price, vehicle.currency)}
                </p>
              )}
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

          {vehicle.features && vehicle.features.length > 0 && (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 list-disc list-inside text-muted-foreground">
                        {vehicle.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          )}

           {vehicle.status !== 'Sold' ? (
              <Button size="lg" className="w-full mt-6 text-lg bg-[#25D366] text-white hover:bg-[#128C7E]" asChild>
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon className="h-6 w-6 mr-2" />
                    Inquire via WhatsApp
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="w-full mt-6 text-lg" disabled>
                This vehicle has been sold
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
