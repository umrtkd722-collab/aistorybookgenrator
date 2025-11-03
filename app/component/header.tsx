'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Add this
import React, { useState } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // <-- Get current route

  const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'Browse Books', href: '/home/browsBooks' },
    { name: 'How It Works', href: '/home/howitswork' },
    { name: 'Pricing', href: '/home/pricing' },
    { name: 'Contact Us', href: '/home/contactus' },
  ];

  // Helper: Check if current path matches href
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Pink Line */}
      <div className="h-3 bg-[#F38DA0]"></div>

      {/* Main Header */}
      <header className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <div className="flex flex-col">
              <Link href="/" className="flex items-center space-x-1">
                <Image src="/logo.png" height={600} width={150} alt="logo" />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 no-underline ${
                    isActive(item.href)
                      ? 'text-[#F38DA0] font-bold'
                      : 'text-white hover:text-[#F38DA0]/80'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex">
              <Link
                href="/home/authPage"
                className="flex items-center gap-2 bg-[#F38DA0] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-0.5"
              >
                <FaShoppingCart />
                Start My Book
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden bg-black border-t border-gray-800 ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-center text-sm font-medium py-2 transition-colors no-underline ${
                  isActive(item.href)
                    ? 'text-[#F38DA0] font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/home/authPage"
                className="flex items-center justify-center gap-2 bg-[#F38DA0] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-pink-600 transition-all w-full shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingCart />
                Start My Book
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}