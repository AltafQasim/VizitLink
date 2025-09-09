import { Headphones, IndianRupee } from 'lucide-react';
import { Button } from './ui/button';
import { Globe } from './magicui/globe';

const AnalyticsSection = () => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center justify-center">

        {/* Left Content - Analytics Cards */}
        <div className="grid grid-cols-11 gap-3 md:gap-4 animate-fade-in order-2 lg:order-1">
          {/* Clickthrough Rate Card */}
          <div className="bg-gradient-to-br flex items-center justify-center col-span-7 from-green-600 to-green-700 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-evenly gap-2">
              <div className="mb-3 md:mb-4">
                <svg width="30" height="22" viewBox="0 0 40 30" fill="none" className="opacity-80 h-16 w-16 md:w-32 md:h-20">
                  <path d="M2 28L8 22L14 25L22 15L30 18L38 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8" cy="22" r="2" fill="currentColor" />
                  <circle cx="14" cy="25" r="2" fill="currentColor" />
                  <circle cx="22" cy="15" r="2" fill="currentColor" />
                  <circle cx="30" cy="18" r="2" fill="currentColor" />
                  <circle cx="38" cy="8" r="2" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold mb-1">43,600</div>
                <div className="text-xs md:text-sm opacity-90">Clickthrough rate</div>
              </div>
            </div>
          </div>

          {/* Track Plays Card */}
          <div className="bg-gradient-to-br text-center col-span-4 from-purple-400 to-purple-500 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
            <div className='flex justify-center'>
              <div className="mb-3 border rounded-full p-1">
                <Headphones className='w-12 h-12' />
              </div>
            </div>
            <div className="text-xl md:text-3xl font-bold mb-1">643</div>
            <div className="text-xs md:text-sm opacity-90">Track Plays</div>
          </div>

          {/* Sales Card */}
          <div className="bg-gradient-to-br text-center col-span-4 from-pink-500 to-pink-600 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
            <div className='flex justify-center'>
              <div className="mb-3 border rounded-full p-1">
                <IndianRupee className='w-12 h-12' />
              </div>
            </div>
            <div className="text-xl md:text-3xl font-bold mb-1">₹2B+</div>
            <div className="text-xs md:text-sm opacity-90">Sales</div>
          </div>

          {/* Visits Card */}
          <div className="bg-gradient-to-br col-span-7 flex items-center justify-evenly from-blue-600 to-blue-700 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white relative">
            <div className="relative">
              <Globe className="w-16 top-0 static h-16 md:w-32 md:h-32" />
            </div>
            <div>
              <div className="text-xl md:text-3xl font-bold mb-1">960</div>
              <div className="text-xs md:text-sm opacity-90">Visits</div>
              <div className="text-xs opacity-75 mt-1">Mumbai, India</div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="text-left space-y-4 md:space-y-6 animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
          <h1 className="hero-title text-lime-green leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-[#2665d6] to-purple-500 bg-clip-text text-transparent">
            Analyze your audience and keep your followers engaged
          </h1>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
            Track your engagement over time, monitor revenue and learn what's
            converting your audience. Make informed updates on the fly to keep them
            coming back.
          </p>

          <div className="pt-2">
            <Button
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 md:px-8 py-3 md:py-4 font-semibold text-base md:text-lg w-full sm:w-auto"
            >
              Get started for free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
