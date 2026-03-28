'use client';
import { useState } from 'react';

interface HamburgerMenuProps {
  basePath?: string;
}

export function HamburgerMenu({ basePath = '' }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { label: 'Our Coffee', href: `${basePath}#our-coffee` },
    { label: 'How It Works', href: `${basePath}#how-our-coffee-works` },
    { label: 'Bulk Orders', href: `${basePath}#bulk-orders` },
    { label: 'Why Café Reyna', href: `${basePath}#why-cafe-reyna` },
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 cursor-pointer flex-col items-center justify-center gap-[5px]"
      >
        <span className={`h-0.5 w-5 bg-[#2a2a2a] transition-all duration-200${isOpen ? ' translate-y-[7px] rotate-45' : ''}`} />
        <span className={`h-0.5 w-5 bg-[#2a2a2a] transition-all duration-200${isOpen ? ' opacity-0' : ''}`} />
        <span className={`h-0.5 w-5 bg-[#2a2a2a] transition-all duration-200${isOpen ? ' -translate-y-[7px] -rotate-45' : ''}`} />
      </button>

      <div
        className={`absolute left-0 right-0 top-full overflow-hidden border-b border-[#e3d7c5] bg-[#f4ede4]/95 backdrop-blur-md transition-[max-height] duration-300 ease-in-out${isOpen ? ' max-h-48' : ' max-h-0'}`}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="block border-b border-[#e3d7c5]/50 px-6 py-3 text-base text-[#2a2a2a] last:border-0 hover:bg-[#ede3d8]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
