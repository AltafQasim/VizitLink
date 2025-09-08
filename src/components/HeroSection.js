import { Button } from './ui/button';
import { Input } from './ui/input';
import PhoneMockup from './PhoneMockup';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="bg-hero-bg min-h-screen flex items-center justify-center p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Left Content */}
        <div className="text-left space-y-6 md:space-y-8">
          <h1 className="hero-title text-lime-green leading-tight animate-slide-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Everything you are. In one, simple link in bio.
          </h1>
          
          <p className="text-white/90 leading-relaxed max-w-lg mx-0 animate-slide-up font-normal text-base md:text-lg lg:text-xl" 
             style={{ 
               lineHeight: '1.6',
               animationDelay: '0.2s' 
             }}>
            Join 70M+ people using VizitLink for their link in bio. One link to help you share 
            everything you create, curate and sell from your Instagram, TikTok, Twitter, 
            YouTube and other social media profiles.
          </p>

          {/* Input Section */}
          <div className="flex flex-col gap-2 sm:flex-row animate-slide-up max-w-md" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center bg-white rounded-full px-4 md:px-5 py-1 flex-1">
              <span className="text-gray-500 mr-2 text-sm md:text-base">{process.env.SITE_URL}/</span>
              <Input 
                placeholder="" 
                className="w-auto border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 text-sm md:text-base"
              />
            </div>
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 md:px-8 py-6 font-semibold text-base md:text-lg w-auto"
              >
                Claim your VizitLink
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Content - Phone Mockup */}
        <div className="flex justify-center  animate-slide-in-left order-1 lg:order-2" style={{ animationDelay: '0.6s' }}>
          <div className="scale-75 sm:scale-90 md:scale-100">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
