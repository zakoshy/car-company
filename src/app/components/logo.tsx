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
      <Image src="/logo1.png" alt="AL-ZIA TRADING CO.LTD Logo" width={32} height={32} />
      <span className="font-headline text-xl font-semibold whitespace-nowrap">AL-ZIA TRADING CO.LTD</span>
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
