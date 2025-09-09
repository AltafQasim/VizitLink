import { Button } from './ui/button';
import PhoneMockup from './PhoneMockup';

const CustomizeSection = () => {
  return (
    <div className="bg-gradient-to-br from-purple-200 to-pink-200 py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Left Content - Phone Mockup */}
        <div className="flex justify-center lg:justify-start animate-fade-in order-2 lg:order-1">
          <div className="scale-75 sm:scale-90 md:scale-100">
            <PhoneMockup />
          </div>
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
