// components/Header.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, signout } = useAuth();

  const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'Browse Books', href: '/home/browsBooks' },
    { name: 'How It Works', href: '/home/howitswork' },
    { name: 'Pricing', href: '/home/pricing' },
    { name: 'Contact Us', href: '/home/contactus' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const ctaHref = user ? '/home/howitswork' : '/home/authPage';
  const ctaText = user ? 'Continue Writing' : 'Start My Book';
  const planName = user?.user.plan?.name || 'Free';

  return (
    <>
      <div className="h-3 bg-[#F38DA0]"></div>

      <header className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" height={600} width={150} alt="logo" />
            </Link>

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

            {/* Right Side: User + CTA + Logout */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="w-32 h-6 bg-gray-800 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  {/* User Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <FaUser className="text-[#F38DA0]" />
                    <div>
                      <span className="font-medium">Hi, {user.user.name?.split(' ')[0]}</span>
                      <span className="block text-xs text-gray-400">({planName})</span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={signout}
                    className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <FaSignOutAlt />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              ) : null}

              {/* CTA Button */}
              <Link
                href={ctaHref}
                className="flex items-center gap-2 bg-[#F38DA0] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-0.5"
              >
                <FaShoppingCart />
                {ctaText}
              </Link>
            </div>

            {/* Mobile Toggle */}
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

            {/* Mobile User + CTA + Logout */}
            <div className="space-y-3 pt-2">
              {loading ? null : user ? (
                <>
                  <div className="text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                    <FaUser className="text-[#F38DA0]" />
                    <div>
                      <span>Hi, {user.user.name?.split(' ')[0]}</span>
                      <span className="block text-xs">({planName})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      signout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 py-2"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : null}

              <Link
                href={ctaHref}
                className="flex items-center justify-center gap-2 bg-[#F38DA0] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-pink-600 transition-all w-full shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingCart />
                {ctaText}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}