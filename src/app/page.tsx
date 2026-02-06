"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/app/components/vehicle-card";
import { getVehicles } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

export default function Home() {
  const allVehicles = getVehicles();
  const featuredVehicles = allVehicles.filter(v => v.status === 'Available').slice(0, 3);
  
  const heroImages = PlaceHolderImages.filter(p => p.id.startsWith('hero'));

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-background">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {heroImages.map((image) => (
              <CarouselItem key={image.id}>
                <div className="relative w-full h-[60vh] md:h-[80vh]">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    priority={true}
                    data-ai-hint={image.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute inset-0 h-full flex flex-col items-center justify-center text-center text-primary-foreground p-4 z-10">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
            Premium Japanese Vehicles
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-3xl drop-shadow-md">
            Directly imported for the discerning enthusiast. Quality, reliability, and performance delivered.
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
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">Featured Vehicles</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            A curated selection of our finest available cars. Explore the best of JDM culture.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/vehicles">
                Explore All Vehicles
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
