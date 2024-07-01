import Image from 'next/image';
import React from 'react';

function Footer() {
  return (
    <footer className="max-w-sm">
      <p className="text-center text-gray-600">
        Powered by
        <Image src="/logo.svg" alt="Logo" width={50} height={50} className="inline h-4 ml-2" />
      </p>
      <p className="text-center text-gray-600 text-sm">
        Learn more about this feature on{' '}
        <a href="https://ticketpulse.co.uk" className="text-green-500">
          Ticket Pulse
        </a>
        .
      </p>
    </footer>
  );
}

export default Footer;
