'use client';

import { useState } from 'react';
import { Mail, Headphones, Send } from 'lucide-react';
import { HeroBanner } from '@/app/component/hero';
import Link from 'next/link';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

export default function ContactSection() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    // Add API call here later
    alert('Message sent! We’ll get back to you soon.');
    setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  };

  return (
    <>
    <HeroBanner
    backgroundImage="/inner-banner.png"
    title="We're Here to Help You Create the Perfect Personalized Gift"
    highlightWord='Help You'
    description="Reach out to us with any questions or special requests. Our team is dedicated to making your experience seamless and enjoyable."
    
    bannerText="Contact Us Today"
     buttons={[
            {
              text: 'Start My Book',
              href: '/browse-books',
              variant: 'primary',
              icon: FaShoppingCart,
            },
            {
              text: 'See Examples',
              href: '/examples',
              variant: 'outline',
              icon: FaEye,
            },
        ]}
    />
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get in Touch</h2>
          <p className="mt-2 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? we’re here to help create the perfect personalized gift
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-6">

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#F38DA0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#F38DA0]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <Link href="mailto:hello@autobookme.co.uk" className="text-[#F38DA0] hover:underline">
                    hello@autobookme.co.uk
                  </Link>
                </div>
              </div>

              {/* Support Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#F38DA0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5 text-[#F38DA0]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Support Hours</p>
                  <p className="text-gray-600">Mon-Fri 9am–6pm, Sat 10am–4pm</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-[#F38DA0] rounded-3xl p-8 md:p-10 shadow-xl">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="w-full bg-white px-5 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="w-full px-5 bg-white py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-5 py-3 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />

              {/* Subject */}
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full px-5 py-3 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />

              {/* Message */}
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                rows={4}
                className="w-full px-5 py-3 rounded-3xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 resize-none transition-all"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-white text-[#F38DA0]  font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}