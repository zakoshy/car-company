'use client';

import Link from 'next/link';
import { WhatsappIcon } from './whatsapp-icon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function WhatsappFab({ phoneNumber }: { phoneNumber: string }) {
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          aria-label="Chat on WhatsApp"
        >
          <WhatsappIcon className="h-7 w-7" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Chat on WhatsApp</p>
      </TooltipContent>
    </Tooltip>
  );
}
