'use client';

import Link from 'next/link';
import { WhatsappIcon } from './whatsapp-icon';

export function WhatsappFab({ phoneNumber }: { phoneNumber: string }) {
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:bg-[#128C7E] transition-colors duration-300"
      aria-label="Chat on WhatsApp"
    >
      <WhatsappIcon className="h-8 w-8" />
    </Link>
  );
}
