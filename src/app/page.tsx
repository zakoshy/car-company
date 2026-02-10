'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/app/components/vehicle-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import type { Vehicle } from '@/lib/types';
import { collection, query, where, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-mercedes');
  const db = useFirestore();

  const featuredQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'vehicles'),
      where('status', '==', 'Available'),
      limit(3)
    );
  }, [db]);

  const { data: featuredVehicles, loading } = useCollection<Vehicle>(featuredQuery);
  const vehicles = featuredVehicles || [];

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-background">
        {heroImage && (
          <>
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority={true}
              data-ai-hint={heroImage.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </>
        )}

        <div className="absolute inset-0 h-full flex flex-col items-center justify-center text-center text-primary-foreground p-4 z-10">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
            Premium Japanese & Thailand Vehicles
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-3xl drop-shadow-md">
            Directly imported for the discerning enthusiast. Quality,
            reliability, and performance delivered.
          </p>
          <Button asChild size="lg" className="mt-8 text-lg">
            <Link href="/vehicles">
              View Inventory <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">
            Featured Vehicles
          </h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            A curated selection of our finest available cars. Explore the best
            of JDM culture.
          </p>
          <div className="mt-10">
            {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                 </div>
            ) : vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
               <div className="text-center py-10">
                  <p className="text-muted-foreground">No featured vehicles available at the moment.</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/vehicles">Explore All Vehicles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
