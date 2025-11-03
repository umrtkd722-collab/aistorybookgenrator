
"use client"
import { HeroBanner } from '@/app/component/hero'
import React from 'react'
import { FaEye, FaShoppingCart } from 'react-icons/fa'
import { PricingSection } from '../page'

function page() {
  return (
    <div>

     <HeroBanner
        bannerText="Limited Time: Buy 2 Books and Get 15% Off! Use code GIFT15"
      backgroundImage="/inner-banner.png"
      title="Select Your Book, Personalize It Your Way"
      highlightWord="Personalize"
      description="Funny stories, romantic tales, family memories, pet adventures, and kids' books. Make every gift unique and unforgettable."
      buttons={[
        {
          text: 'Start My Book',
          href: '/home/authPage',
          variant: 'primary',
          icon: FaShoppingCart,
        },
        {
          text: 'See Examples',
          href: '/home/how-it-works',
          variant: 'outline',
          icon: FaEye,
        },
    ]}/>
    <PricingSection/>
    </div>
  )
}

export default page