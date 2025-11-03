"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';


// app/page.tsx;
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { Check } from 'lucide-react';
import { HeroBanner } from '../component/hero';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {  FaStar } from 'react-icons/fa';
import { Truck } from 'lucide-react';

interface BookStyle {
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

const bookStyles: BookStyle[] = [
  {
    title: 'Classic',
    description: 'Hilarious stories that will make them laugh out loud',
    image: '/bookstye(1).jpg',
    alt: 'Classic Book',
    link: '/personalize/classic',
  },
  {
    title: 'Modern',
    description: 'Love stories personalized just for your special someone',
    image: '/bookstye(4).jpg',
    alt: 'Modern Book',
    link: '/personalize/modern',
  },
  {
    title: 'Funny',
    description: 'Capture precious family moments and memories forever',
    image: '/bookstye(2).jpg',
    alt: 'Funny Book',
    link: '/bookstye (2).jpg',
  },
  {
    title: 'Kids',
    description: 'Celebrate your furry friend’s adventures and memories',
    image: '/bookstye (3).jpg',
    alt: 'Kids Book',
    link: '/personalize/kids',
  },
  {
    title: 'Romantic',
    description: 'Make them the hero of their very own adventure story',
    image: '/bookstye(1).jpg',
    alt: 'Romantic Book',
    link: '/personalize/romantic',
  },
];

export default function Home() {
  return (
<>

    {/* <HeroBanner
      backgroundImage="/inner-banner.png"
      title="Discover Unique Books for Every Moment"
      highlightWord="Books"
      description="Funny stories, romantic tales, family memories, pet adventures, and kids' books. Make every gift unique and unforgettable."
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
    bannerText="Limited Time: Buy 2 Books and Get 15% Off! Use code GIFT15"
    /> */}
    <HeroSection/>
    <BookStylesSection/>

   <HowItWorks/>
    <PricingSection/>
    <NewsletterSection/>
    </>
    
  );
}




 export function BookStylesSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <section className="py-16  from-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Choose Your Perfect Book Styles
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-12">
          Every book is completely personalized with your names, photos, and special details
        </p>

        {/* Book Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {bookStyles.map((book, index) => (
            <div
              key={book.title}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group"
            >
              <div className="bg-[#FFF0F3] rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                {/* Book Image */}
                <div className="mb-4 overflow-hidden rounded-2xl">
                  <Image
                    src={book.image}
                    alt={book.alt}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">{book.description}</p>

                {/* Button */}
                <Link
                  href={book.link}
                  className="block w-full c1 text-white text-sm font-medium py-2.5 rounded-full hover:from-pink-500 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Personalize Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}






 function HeroSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <section className="py-16 bg-white md:py-24 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text + Buttons */}
          <div data-aos="fade-right ">
            <h1 className="text-3xl space-y md:text-6xl lg:text-5xl font-semibold text-gray-900 leading-tight">
              Create a <br />
              <span className="c1_text">Personalised </span> Gift <br />
              Book in Minutes
            </h1>

            <p className="mt-6 text-base md:text-lg text-gray-600 max-w-xl">
              Funny stories, romantic tales, family memories, pet adventures, and kids’ books. 
              Make every gift unique and unforgettable.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/home/authPage"
                className="inline-flex text-sm items-center justify-center gap-2 c1 text-white px-3 py-2 rounded-full font-medium hover:bg-pink-600 transition-all duration-300  transform hover:-translate-y-1"
              >
                <FaShoppingCart />
                Start My Book
              </Link>
              <Link
                href="/home/how-it-works"
                className="inline-flex text-white text-sm items-center justify-center px-3 py-2 rounded-full border-2 border-none  bg-transparent font-medium c1 hover:text-white transition-all duration-300"
              >
                See Examples
              </Link>
            </div>
          </div>

          {/* Right: Image + Badges */}
          <div className="relative" data-aos="fade-left">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden ">
              <Image
                src="/banner img.png"
                alt="Hand holding personalized book"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Top Right Badge: Free UK Delivery */}
            
          </div>
        </div>
      </div>
    </section>
  );
}



 function HowItWorks() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  const steps = [
    {
      number: '1',
      title: 'Choose Your Book',
      description: 'Select from our collection of funny, romantic, family, pet, or kids’ books. Each template is professionally designed.',
    },
    {
      number: '2',
      title: 'Add Personal Details',
      description: 'Enter names, upload photos, and customize the story. Our smart system automatically fits everything perfectly.',
    },
    {
      number: '3',
      title: 'Print & Deliver',
      description: 'We print your book with premium quality materials and deliver it straight to your door in 3-5 working days.',
    },
  ];

  return (
    <section className="py-16 md:py-20 mt-12 bg-[#FFF3F5] from-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          How It Works
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-12">
          Creating your personalized book is as easy as 1-2-3
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="flex flex-col items-center"
            >
              {/* Circle Number */}
              <div className="w-16 h-16 md:w-20 md:h-20 c1 text-black text-2xl md:text-3xl font-bold rounded-full flex items-center justify-center mb-6 shadow-lg">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-black max-w-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}









export  function PricingSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  const plans = [
    {
      name: 'Starter Plan',
      price: '£9.99',
      originalPrice: '£14.99',
      subtitle: 'Personalised Paperback Book',
      features: [
        '120 pages, paperback (£9.99)',
        'Hardcover upgrade: +£2',
        'Up to 10 photos (free)',
        'Print photos in main character',
        'Custom PDF download',
        '1 custom book per month',
        '[PDF download]',
        'Family, funny, journal',
        'Standard support (email only)',
        'Free 1–3 day UK delivery',
        'See Shipping & Delivery policy.',
      ],
      cta: 'Create My Book',
      link: '/create/starter',
    },
    {
      name: 'Pro Plan',
      price: '£23.99',
      originalPrice: '£29.99',
      subtitle: 'Personalised Paperback Book',
      features: [
        '250 pages, paperback (£23.99)',
        'Hardcover upgrade: +£2',
        'Up to 25 photos (free)',
        'Print photos in main character',
        'Custom PDF download',
        '3 custom books per month',
        '[PDF download]',
        'Premium template (romantic, journal, kids, business)',
        '30% discount on extra book',
        'Priority support',
        'Free 1–3 day UK delivery',
        'See Shipping & Delivery policy.',
      ],
      cta: 'Create My Book',
      link: '/create/pro',
      popular: true,
    },
    {
      name: 'Unlimited / Business Plan',
      price: '£39.99',
      originalPrice: '£59.99',
      subtitle: 'Personalised Paperback Book',
      features: [
        'Unlimited pages (£39.99)',
        'Hardcover upgrade: +£2',
        'Unlimited photos',
        'Print photos in main character',
        'Custom PDF download',
        'Unlimited AI book generation',
        '[Digital download]',
        'Premium template (all types)',
        '20% off on print copies (up to 20)',
        'White-label option (for reselling)',
        'Dedicated account manager',
        'Free 1–3 day UK delivery',
        'See Shipping & Delivery policy.',
      ],
      cta: 'Create My Book',
      link: '/create/unlimited',
    },
    {
      name: 'Add-Ons You Could Include',
      price: '',
      originalPrice: '',
      subtitle: '',
      features: [
        'Premium cover finish (laminated/matte): +£5',
        'Upgraded fonts or cover photos of memories included: +£3',
        'Personal illustrated cover: +£10',
        'AI illustrated pages (extra artwork inside): +£1.50',
        'Digital audiobook with AI voice message: +£4.95',
        'Extra print copies of one book: from £5.99',
        'Express print & delivery: +£3.95',
        'Print & deliver in 1–2 working days. Production takes 1–2 working days, then UK delivery is usually 1–3 working days. See Shipping & Delivery policy.',
      ],
      cta: 'Create My Book',
      link: '/addons',
      isAddOn: true,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Choose Your Perfect Book
          </h2>
          <p className="mt-2 text-base md:text-lg text-gray-600">
            Premium quality at affordable prices
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className={`
                relative bg-white rounded-3xl shadow-lg p-6 
                transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
                ring-1 ring-[#F38DA0] ring-offset-2
                ${plan.isAddOn ? 'lg:col-span-1' : ''}
              `}
            >
              {/* PRINTED IN THE UK Badge – on ALL cards */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F38DA0] text-white text-xs font-bold px-4 py-1 rounded-full z-10">
                PRINTED IN THE UK
              </div>

              {/* Plan Header */}
              <div className="text-center mb-6 mt-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                {plan.price && (
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-black">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                )}
                {plan.subtitle && (
                  <p className="mt-1 text-sm text-gray-600">{plan.subtitle}</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-700">
                    <Check className="w-5 h-5 text-[#F38DA0] mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={plan.link}
                className={`
                  block w-full text-center py-3 rounded-full font-semibold 
                  transition-all duration-300 shadow-md hover:shadow-lg
                  ${plan.isAddOn
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-[#F38DA0] text-white hover:from-pink-600 hover:to-pink-700'
                  }
                `}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





export  function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      // Simulate API call
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setAgreed(false);
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#F38DA0' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get 10% Off Your First Order
        </h2>
        <p className="text-white/90 text-base md:text-lg mb-8">
          Join our newsletter for exclusive offers, new book launches, and personalization tips
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full bg-white sm:w-auto flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
          />
          <button
            type="submit"
            disabled={!email || !agreed || submitted}
            className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {submitted ? 'Subscribed!' : 'Get 10% Off'}
          </button>
        </form>

        {/* Checkbox + Privacy */}
        <div className="mt-6 flex items-center justify-center gap-2 text-white/80 text-sm">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-white/50 text-white focus:ring-white/30"
          />
          <label htmlFor="terms" className="cursor-pointer">
            I agree to the{' '}
            <a href="/terms" className="underline hover:text-white">
              terms & conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {/* Footer Text */}
        <p className="mt-4 text-white/70 text-xs">
          No spam, ever. Unsubscribe anytime. By signing up, you agree to our privacy policy.
        </p>
      </div>
    </section>
  );
}