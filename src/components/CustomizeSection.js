import { Button } from './ui/button';
import PhoneMockup from './PhoneMockup';

const CustomizeSection = () => {
  return (
    <div className="bg-gradient-to-br from-purple-200 to-pink-200 py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Left Content - Phone Mockup */}
        <div className="flex justify-center lg:justify-start animate-fade-in order-2 lg:order-1">
          <div className="scale-75 sm:scale-90 md:scale-100">
            <PhoneMockup />
          </div>
        </div>

        {/* Right Content */}
        <div className="text-center lg:text-left space-y-4 md:space-y-6 animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Create and customize your VizitLink in minutes
          </h2>
          
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
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
