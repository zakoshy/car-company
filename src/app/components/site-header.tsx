import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/app/components/logo';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo isLink={true} />
        <nav className="ml-10 hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/vehicles" className="text-foreground/80 transition-colors hover:text-foreground">
            Vehicles
          </Link>
          <Link href="#" className="text-foreground/80 transition-colors hover:text-foreground">
            About
          </Link>
           <Link href="#" className="text-foreground/80 transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild>
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
