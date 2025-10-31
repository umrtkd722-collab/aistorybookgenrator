'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black   text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Logo + About (4 columns) */}
          <div className="md:col-span-4">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/logo.png"
                alt="AutoBookMe"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm font-medium text-white mb-1">
              Tell Your Story. We'll Make the Book.
            </p>
            <p className="text-sm leading-relaxed">
              Creating personalized gift books that bring joy and preserve memories for families across the UK.
            </p>
          </div>

          {/* Shop (2 columns) */}
          <div className="md:col-span-2">
            <h5 className="text-white font-semibold text-lg mb-4">Shop</h5>
            <ul className="space-y-2 text-sm">
              {['Funny Books', 'Romantic Books', 'Family Memory', 'Pet Memorial', 'Kids Books'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="hover:text-pink-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support (3 columns) */}
          <div className="md:col-span-3">
            <h5 className="text-white font-semibold text-lg mb-4">Support</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact-us" className="hover:text-pink-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-pink-400 transition-colors">How It Works</Link></li>
              <li><Link href="/faq" className="hover:text-pink-400 transition-colors">FAQ</Link></li>
              <li>
                <a
                  href="mailto:support@autobook-me.co.uk"
                  className="hover:text-pink-400 transition-colors break-all"
                >
                  support@autobook-me.co.uk
                </a>
              </li>
            </ul>
          </div>

          {/* Legal + Payment (3 columns) */}
          <div className="md:col-span-3">
            <h5 className="text-white font-semibold text-lg mb-4">Legal</h5>
            <ul className="space-y-2 text-sm mb-6">
              {['Privacy Policy', 'Terms of Service', 'Cookies Policy', 'Returns & Refunds'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="hover:text-pink-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment Methods */}
            <p className="text-white font-medium mb-2">We Accept Payments</p>
            <div className="flex items-center space-x-2">
              <Image
                src="/cards.png"
                alt="Payment Methods"
                width={200}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-8" />

        {/* Copyright */}
        <p className="text-center text-xs text-gray-500">
          © 2025 AutoBookMe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}