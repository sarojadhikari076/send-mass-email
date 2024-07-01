import Image from 'next/image';
import React from 'react';

function Footer() {
  return (
    <footer className="flex items-center justify-center gap-2 flex-wrap">
      <p className="text-gray-600 text-xs">Powered by</p>
      <Image src="/logo.svg" alt="Logo" width={40} height={40} className="inline h-4 ml-2" />
      <a href="https://ticketpulse.co.uk" className="text-center text-xs underline text-gray-600">
        Learn more about us
      </a>
    </footer>
  );
}

export default Footer;
