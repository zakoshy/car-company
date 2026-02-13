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
import { Logo } from "@/app/components/logo";
import { LayoutDashboard, Car, History, User, LogOut, Loader2, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      // Firebase auth state is still loading
      return;
    }

    if (!user) {
      router.replace('/login');
    }
    
    setIsLoading(false);
  }, [user, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              <Link href="/admin/profile" className="flex items-center gap-2 group">
                 <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                   <User className="h-5 w-5" />
                 </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold">{user.displayName || user.email}</span>
                   <span className="text-xs text-muted-foreground group-hover:underline">
                    View Profile
                  </span>
                </div>
              </Link>
               <Button variant="ghost" size="icon" onClick={handleLogout} className="group-data-[collapsible=icon]:flex">
                  <LogOut className="h-4 w-4" />
               </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-secondary/50 grid grid-rows-[auto_1fr] h-screen">
          <header className="flex-shrink-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
             <SidebarTrigger className="md:hidden" />
             <h1 className="font-headline text-2xl font-semibold">
                {navItems.find(item => pathname.startsWith(item.href))?.label || "Admin"}
             </h1>
             <div className="ml-auto">
               <ThemeToggle />
             </div>
          </header>
          <main className="overflow-y-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
