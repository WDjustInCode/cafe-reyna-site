'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CartButton } from './CartContext';
import { HamburgerMenu } from './HamburgerMenu';

export function StickyHeader() {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let pastHero = false;

    const heroEl = document.getElementById('hero');
    const observer = heroEl
      ? new IntersectionObserver(([entry]) => { pastHero = !entry.isIntersecting; }, { threshold: 0 })
      : null;
    observer?.observe(heroEl!);

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingUp = currentY < lastScrollY.current;
      setVisible(pastHero && scrollingUp);
      lastScrollY.current = currentY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#f4ede4]/75 backdrop-blur-md transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 md:px-10">
        <div className="relative flex items-center justify-between border-b border-[#e3d7c5] py-4">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              const header = document.getElementById('header');
              if (header) {
                window.scrollTo({ top: header.offsetTop, behavior: 'smooth' });
              }
            }}
          >
            <Image
              src="/crown-logo.png"
              alt="Café Reyna"
              width={105}
              height={35}
              className="h-[35px] w-auto object-contain"
            />
          </button>
          <nav className="hidden gap-8 text-base md:flex">
            <a href="#our-coffee">Our Coffee</a>
            <a href="#how-our-coffee-works">How It Works</a>
            <a href="#bulk-orders">Bulk Orders</a>
            <a href="#why-cafe-reyna">Why Café Reyna</a>
          </nav>
          <div className="flex items-center gap-3">
            <CartButton />
            <HamburgerMenu basePath="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
