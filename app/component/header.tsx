// components/Header.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '@/lib/context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, signout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="h-3 bg-[#F38DA0]"></div>

      <header className="bg-black text-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" height={600} width={150} alt="logo" className="h-10 w-auto" />
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

            {/* Right Side: User + CTA */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="w-32 h-6 bg-gray-800 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Profile Trigger */}
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 text-sm font-medium hover:text-[#F38DA0] transition-colors"
                  >
                    <FaUser className="text-[#F38DA0]" />
                    <span>Hi, {user.user.name?.split(' ')[0]}</span>
                    <FaChevronDown className={`text-xs transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user.user.name}</p>
                        <p className="text-xs text-gray-500">{user.user.email}</p>
                        <p className="text-xs text-[#F38DA0] font-medium mt-1">({planName} Plan)</p>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/home/dashboard"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#F38DA0] transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/home/mybooks"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#F38DA0] transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          My Books
                        </Link>
                        <Link
                          href="/home/settings"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#F38DA0] transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-gray-200 pt-2">
                        <button
                          onClick={() => {
                            signout();
                            setProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <FaSignOutAlt />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
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

            {/* Mobile User Section */}
            <div className="space-y-3 pt-2 border-t border-gray-700">
              {loading ? null : user ? (
                <div className="space-y-3">
                  <div className="text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                    <FaUser className="text-[#F38DA0]" />
                    <div>
                      <span>{user.user.name?.split(' ')[0]}</span>
                      <span className="block text-xs">({planName})</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/home/dashboard"
                      className="block text-center py-2 text-sm text-white hover:text-[#F38DA0]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/home/mybooks"
                      className="block text-center py-2 text-sm text-white hover:text-[#F38DA0]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Books
                    </Link>
                    <Link
                      href="/home/settings"
                      className="block text-center py-2 text-sm text-white hover:text-[#F38DA0]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
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
                </div>
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