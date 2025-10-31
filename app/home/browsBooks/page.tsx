
"use client"
import { HeroBanner } from '@/app/component/hero'
import React from 'react'
import { BookStylesSection } from '../page'
import { ShoppingBasketIcon } from 'lucide-react'
import {FaShoppingBasket} from "react-icons/fa";
function Page() {
  return (
    <>
    <HeroBanner
    backgroundImage="/inner-banner.png"
    title="Discover Unique Books for Every Moment"
    highlightWord="Unique Books"
    description="Funny stories, romantic tales, family memories, pet adventures, and kids' books. Make every gift unique and unforgettable."
    buttons={[
      { text: 'Start My Book', href: '/browse-books', variant: 'primary', icon: FaShoppingBasket },
      { text: 'See Examples', href: '/how-it-works', variant: 'outline', icon: undefined },
    ]}
    bannerText="Unlimited Access to Thousands of Books"
  />
  <BookStylesSection/>
    </>
  )
}

export default Page