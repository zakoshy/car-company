'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { SiteFooter } from '@/app/components/site-footer';
import { WhatsappFab } from './whatsapp-fab';
import { TooltipProvider } from '@/components/ui/tooltip';

export function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSpecialPage = pathname.startsWith('/admin') || pathname.startsWith('/login');

  if (isSpecialPage) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsappFab phoneNumber="256776754426" />
      </div>
    </TooltipProvider>
  );
}
