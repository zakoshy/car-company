import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Building, Globe, Target } from "lucide-react";

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-hero');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">About AL-ZIA TRADING CO.LTD</h1>
        <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
          Your trusted partner in importing and exporting high-quality Japanese and Thailand vehicles worldwide.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative aspect-video rounded-lg overflow-hidden border">
           {aboutImage && (
            <Image
                src={aboutImage.imageUrl}
                alt="AL-ZIA TRADING showroom"
                fill
                className="object-cover"
                data-ai-hint={aboutImage.imageHint}
            />
           )}
        </div>
        <div className="space-y-6">
            <h2 className="font-headline text-3xl font-semibold">Our Story</h2>
            <p className="text-muted-foreground">
             AL-ZIA TRADING CO. LTD is a premier vehicle import and export management platform specializing in high-quality Japanese and Thailand vehicles. We are dedicated to providing a transparent and efficient service, offering clear visibility of our inventory from the moment it arrives until it is sold. Our focus is on quality, reliability, and customer satisfaction.
            </p>
             <p className="text-muted-foreground">
             We manage everything from inventory tracking and mileage management to handling all necessary documentation, ensuring a smooth process for our clients.
            </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16 text-center">
        <Card>
          <CardHeader>
             <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                <Target className="h-8 w-8" />
             </div>
            <CardTitle className="mt-4">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide enthusiasts around the globe with access to top-tier Japanese and Thailand vehicles, backed by a commitment to transparency, quality, and exceptional service.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                <Building className="h-8 w-8" />
            </div>
            <CardTitle className="mt-4">Our Company</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We are a team of passionate automotive experts with deep roots in the Japanese and Thailand car markets, dedicated to connecting buyers with their dream cars.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                <Globe className="h-8 w-8" />
             </div>
            <CardTitle className="mt-4">Global Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We facilitate the import and export process to numerous countries, handling logistics and documentation to deliver vehicles safely to your doorstep.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
