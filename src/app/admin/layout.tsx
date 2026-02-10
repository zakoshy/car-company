"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/app/components/logo";
import { LayoutDashboard, Car, History, User, LogOut, Loader2, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from 'next/link';
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const auth = useAuth();
  const avatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      // Firebase auth state is still loading
      return;
    }

    const demoSessionActive = sessionStorage.getItem('demo-admin-logged-in') === 'true';

    if (user || demoSessionActive) {
      setIsAuthorized(true);
    } else {
      router.replace('/login');
    }
    
    setIsLoading(false);
  }, [user, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    sessionStorage.removeItem('demo-admin-logged-in');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!isAuthorized) {
    return null; // Redirect is handled in useEffect
  }
  
  // Create a display user object for both real and demo sessions
  const displayUser = user || {
      displayName: 'Demo Admin',
      email: 'admin@example.com',
      photoURL: avatar?.imageUrl,
  };

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/vehicles", icon: Car, label: "Vehicles" },
    { href: "/admin/sales-history", icon: History, label: "Sales History" },
    { href: "/admin/salespeople", icon: Users, label: "Salespeople" },
    { href: "/admin/profile", icon: User, label: "Profile" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between w-full">
              <Link href="/admin/profile" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={displayUser.photoURL || avatar?.imageUrl} alt={displayUser.displayName || "Admin"} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold">{displayUser.displayName || displayUser.email}</span>
                   <span className="text-xs text-muted-foreground hover:underline">
                    View Profile
                  </span>
                </div>
              </Link>
               <Button variant="ghost" size="icon" onClick={handleLogout} className="group-data-[collapsible=icon]:hidden">
                  <LogOut className="h-4 w-4" />
               </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-secondary/50">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
             <SidebarTrigger className="md:hidden" />
             <h1 className="font-headline text-2xl font-semibold">
                {navItems.find(item => pathname.startsWith(item.href))?.label || "Admin"}
             </h1>
             <div className="ml-auto">
               <ThemeToggle />
             </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
