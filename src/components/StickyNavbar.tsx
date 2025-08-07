"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const StickyNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if scrolled past threshold
      setIsScrolled(currentScrollY > 10);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 px-6 py-4 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Pill-shaped navbar container */}
        <div className={`
          bg-white rounded-full shadow-lg px-8 py-4 transition-all duration-300
          ${isScrolled ? 'shadow-xl' : 'shadow-lg'}
        `}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="font-bold text-gray-900" style={{ fontSize: '24px' }}>VizitLink</h1>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" style={{ fontSize: '16px' }}>
                Products
              </Link>
              <Link href="/templates" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" style={{ fontSize: '16px' }}>
                Templates
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" style={{ fontSize: '16px' }}>
                Marketplace
              </Link>
              <Link href="/learn" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" style={{ fontSize: '16px' }}>
                Learn
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" style={{ fontSize: '16px' }}>
                Pricing
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100" style={{ fontSize: '16px' }}>
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6" style={{ fontSize: '16px' }}>
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyNavbar;