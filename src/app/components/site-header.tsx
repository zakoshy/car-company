"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/app/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/vehicles", label: "Vehicles" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Logo isLink={true} />
           {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Desktop Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col p-0">
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <div className="p-6 border-b">
                <Logo isLink={true} />
              </div>
              <nav className="flex-1 flex flex-col gap-4 text-lg font-medium p-6">
                 {navItems.map((item) => (
                   <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                          "flex items-center gap-4",
                          pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                  >
                      {item.label}
                  </Link>
                 ))}
              </nav>
              <div className="p-6 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Theme</p>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
