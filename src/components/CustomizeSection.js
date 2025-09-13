"use client";
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import PhoneMockup from './PhoneMockup';

const CustomizeSection = () => {
  return (
    <div className="bg-gradient-to-br from-purple-200 to-pink-200 py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Left Content - Phone Mockup with looping creation ticker */}
        <div className="flex justify-center lg:justify-start animate-fade-in order-2 lg:order-1">
          <CreationTickerWrapper />
        </div>

        {/* Right Content */}
        <div className="text-left space-y-4 md:space-y-6 animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
          <h1 className="hero-title text-lime-green leading-tight animate-slide-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-[#502274] to-purple-500 bg-clip-text text-transparent">
            Create and customize your VizitLink in minutes
          </h1>
          
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-lg">
            Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, 
            events and more. It all comes together in a link in bio landing page designed 
            to convert.
          </p>

          <div className="pt-2">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 md:px-8 py-3 md:py-4 font-semibold text-base md:text-lg w-full sm:w-auto"
            >
              Get started for free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeSection;

// Ticker Component: animates through steps on a loop
function CreationTickerWrapper() {
  const [step, setStep] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const steps = [
    {
      key: 'link',
      title: 'Adding link…',
      progress: 70,
      tintClass: 'bg-blue-500/15',
      barClass: 'bg-blue-500',
      icon: (
        <svg viewBox="0 0 24 24" className="relative w-full h-full text-blue-600">
          <path fill="currentColor" d="M3.9 12a4.1 4.1 0 0 1 1.2-2.9l2.9-2.9a4.1 4.1 0 0 1 5.8 0 1 1 0 1 1-1.4 1.4 2.1 2.1 0 0 0-3 0L8 9.2a2.1 2.1 0 0 0 0 3l.2.2a1 1 0 1 1-1.4 1.4l-.2-.2A4.1 4.1 0 0 1 3.9 12Zm16.2 0a4.1 4.1 0 0 1-1.2 2.9l-2.9 2.9a4.1 4.1 0 0 1-5.8 0 1 1 0 0 1 1.4-1.4 2.1 2.1 0 0 0 3 0l2.4-2.4a2.1 2.1 0 0 0 0-3l-.2-.2a1 1 0 0 1 1.4-1.4l.2.2c.8.7 1.2 1.8 1.2 2.9Z"/>
          <path fill="currentColor" d="M8.8 12a3.2 3.2 0 0 1 3.2-3.2h0a1 1 0 1 1 0 2h0a1.2 1.2 0 0 0 0 2h0a1 1 0 1 1 0 2h0A3.2 3.2 0 0 1 8.8 12Z"/>
        </svg>
      ),
    },
    {
      key: 'product',
      title: 'Adding product…',
      progress: 45,
      tintClass: 'bg-emerald-500/15',
      barClass: 'bg-emerald-500',
      icon: (
        <svg viewBox="0 0 24 24" className="relative w-full h-full text-emerald-600">
          <path fill="currentColor" d="M3 7a2 2 0 0 1 2-2h3l1-2h6l1 2h3a2 2 0 0 1 2 2v1H3V7Zm0 3h18l-1 9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2l-1-9Zm6 2a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"/>
        </svg>
      ),
    },
    {
      key: 'design',
      title: 'Changing design…',
      progress: 30,
      tintClass: 'bg-fuchsia-500/15',
      barClass: 'bg-fuchsia-500',
      icon: (
        <svg viewBox="0 0 24 24" className="relative w-full h-full text-fuchsia-600">
          <path fill="currentColor" d="M7 3h10v2H7V3Zm11.7 3.3 1.4 1.4-2.8 2.8-1.4-1.4 2.8-2.8ZM3 7h2v10H3V7Zm8 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 11 16Z"/>
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // Animate progress from 0 -> target on each step change
  useEffect(() => {
    setProgressWidth(0);
    const t = setTimeout(() => {
      setProgressWidth(steps[step].progress);
    }, 60);
    return () => clearTimeout(t);
  }, [step]);

  const active = steps[step];

  return (
    <div className="relative scale-75 sm:scale-90 md:scale-100">
      <PhoneMockup step={active.key} />

      {/* Looping ticker */}
      <div className="absolute -right-4 sm:-right-6 md:-right-8 top-4 md:top-6 w-[220px] sm:w-[240px] md:w-[260px]">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-white/60 p-3 md:p-4 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7">
              <span className={`absolute inset-0 rounded-md ${active.tintClass}`} />
              {active.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xs md:text-sm font-semibold text-gray-900 truncate">{active.title}</div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  key={active.key + step}
                  className={`h-full rounded-full ${active.barClass} transition-all duration-[1800ms] ease-out`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] md:text-xs text-gray-500">
            <span className="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Auto-setup running</span>
          </div>
        </div>
      </div>
    </div>
  );
}
