'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-neutral-900 text-white z-50">
      <div className="max-w-screen-2xl mx-auto  px-4 md:px-0">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/logo_dark.svg" alt="Logo" width={300} height={40} />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="hover:bg-neutral-700 px-3 py-2 neutral">Home</Link>
              <Link href="/tournaments" className="hover:bg-neutral-700 px-3 py-2 neutral">Tournaments</Link>
              <Link href="/news" className="hover:bg-neutral-700 px-3 py-2 neutral">News</Link>
              <Link href="/about" className="hover:bg-neutral-700 px-3 py-2 neutral">About</Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 neutral text-neutral-400 hover:text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block hover:bg-neutral-700 px-3 py-2 neutral">Home</Link>
            <Link href="/tournaments" className="block hover:bg-neutral-700 px-3 py-2 neutral">Tournaments</Link>
            <Link href="/news" className="block hover:bg-neutral-700 px-3 py-2 neutral">News</Link>
            <Link href="/about" className="block hover:bg-neutral-700 px-3 py-2 neutral">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;