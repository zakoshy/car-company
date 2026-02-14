'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type LogoProps = {
  className?: string;
  isLink?: boolean;
}

export function Logo({ className, isLink = false }: LogoProps) {
  const content = (
    <>
      <Image src="/logo1.jpg" alt="AL-ZIA AUTOCARE LTD Logo" width={80} height={50} className="rounded-md" />
      <span className="font-headline text-sm md:text-base font-semibold whitespace-nowrap group-data-[collapsible=icon]:hidden">
        AL-ZIA AUTOCARE LTD
      </span>
    </>
  );

  if (isLink) {
    return (
      <Link href="/" className={cn("flex items-center gap-2", className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn("flex items-center gap-2", className)}>{content}</div>;
}
