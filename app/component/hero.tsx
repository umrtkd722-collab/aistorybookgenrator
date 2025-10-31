'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  text: string;
  href: string;
  variant: 'primary' | 'outline';
  icon?: IconType;
}

interface HeroBannerProps {
  backgroundImage: string;
  title: string;
  highlightWord?: string; // Word to make pink
  description: string;
  buttons: ButtonProps[];
  bannerText: string;
  className?: string;
}

export  function HeroBanner({
  backgroundImage,
  title,
  highlightWord,
  description,
  buttons,
  bannerText,
  className = '',
}: HeroBannerProps) {
  // Split title into parts to highlight a word
  const renderTitle = () => {
    if (!highlightWord) return <>{title}</>;

    const parts = title.split(new RegExp(`(${highlightWord})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlightWord.toLowerCase() ? (
            <span key={i} className="c1_text">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <section
      className={`relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center ${className}`}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl   sm:px-2 lg:px-4 text-white">
        <div className="flex  items-start justify-between   py-20 sm:py-32">
          {/* Dynamic Title */}
          <div className=' sm:mx-0 px-4 sm:px-0 max-w-2xl lg:px-4 lg:mx-22'>

          <h1 className="text-4xl sm:text-6xl md:text-6xl  font-semibold leading-tight">
            {renderTitle()}
          </h1>
          {/* Dynamic Description */}
          <p className="mt-4 text-lg sm:text-xl text-gray-200 max-w-2xl">{description}</p>

          {/* Dynamic Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {buttons.map((btn, index) => {
              const Icon = btn.icon;
              return (
                <Link
                  key={index}
                  href={btn.href}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    btn.variant === 'primary'
                      ? 'c1 text-white hover:bg-pink-600'
                      : 'border-2 border-none c1 bg-transparent hover:bg-pink-500 hover:text-white'
                  }`}
                >
                  {Icon && <Icon />}
                  {btn.text}
                </Link>
              );
            })}
          </div>
          </div>

        </div>
      </div>

      {/* Dynamic Bottom Banner */}
      <div className="absolute bottom-0 left-0 right-0 c1 text-white py-3 text-center text-sm font-medium">
        <span className="animate-pulse">{bannerText}</span>
      </div>
    </section>
  );
}