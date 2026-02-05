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
import { LayoutDashboard, Car, History, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const avatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/vehicles", icon: Car, label: "Vehicles" },
    { href: "/admin/sales-history", icon: History, label: "Sales History" },
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
                    isActive={pathname === item.href}
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
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {avatar && <AvatarImage src={avatar.imageUrl} alt="Admin" />}
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold">Admin User</span>
                <Link href="/" className="text-xs text-muted-foreground hover:underline">
                  Exit Admin
                </Link>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-secondary/50">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
             <SidebarTrigger className="md:hidden" />
             <h1 className="font-headline text-2xl font-semibold">
                {navItems.find(item => pathname.startsWith(item.href))?.label || "Admin"}
             </h1>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
