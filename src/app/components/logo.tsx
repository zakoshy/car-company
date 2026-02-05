import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type LogoProps = {
  className?: string;
  isLink?: boolean;
}

export function Logo({ className, isLink = false }: LogoProps) {
  const content = (
    <>
      <Car className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-semibold">J-Auto Hub</span>
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
