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

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.77.46 3.44 1.28 4.92L2 22l5.25-1.38c1.41.76 3.02 1.18 4.75 1.18h.01c5.46 0 9.91-4.45 9.91-9.91 0-5.55-4.45-9.9-9.91-9.9zM12.04 20.1c-1.48 0-2.92-.39-4.19-1.12l-.3-.18-3.12.82.83-3.04-.2-.31c-.8-1.33-1.22-2.84-1.22-4.39 0-4.54 3.69-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.55-3.69 8.24-8.23 8.24zm4.52-6.15c-.25-.12-1.47-.73-1.7-.82-.23-.09-.39-.12-.56.12-.17.25-.64.82-.79.98-.14.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.26-1.48-1.4-1.73-.14-.25-.01-.38.11-.5.11-.11.25-.28.37-.42.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.42-.14 0-.3 0-.46.01-.16 0-.42.06-.64.31-.22.25-.86.85-1.06 2.07s-1.09 2.4-1.09 2.4c0 .01 1.7 2.58 4.13 3.6 2.42 1.02 2.42.68 2.86.62.43-.06 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.12-.22-.19-.47-.31z" />
    </svg>
  );

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
