import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';
import { WhatsappIcon } from '@/app/components/whatsapp-icon';


export default function ContactPage() {
  const googleMapsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Moi+Avenue+Road,Mombasa,Kenya+Opposite+Airtel+Customer+Care';
  const whatsappUrl = 'https://wa.me/256776754426';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Contact Us
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We're here to help. Get in touch with us for any inquiries about our
          vehicles or services.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Our Location</h3>
                <p className="text-muted-foreground">
                  Moi Avenue Road, Mombasa Kenya Opposite Airtel Customer Care
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+254 70800 5527</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
               <WhatsappIcon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">WhatsApp</h3>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:underline">
                  +256 776 754426
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">alziaauto2030@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sunday & Holidays</span>
              <span>Closed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Find Us On The Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-lg overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.851082531065!2d39.66318937584546!3d-4.058645945416715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184012e453710c79%3A0x8671a53381a8a979!2sAirtel%20Express!5e0!3m2!1sen!2ske!4v1722000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AL ZIA Car Sales Location"
              ></iframe>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
