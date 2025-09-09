import { Button } from './ui/button';

const ShareSection = () => {
  return (
    <div className="bg-gradient-to-br from-red-800 to-red-900 py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">

        {/* Left Content */}
        <div className="text-left space-y-4 md:space-y-6 animate-fade-in">
          <h1 className="hero-title text-lime-green leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-[#e9c0e9] to-[#e9c0e9] bg-clip-text text-transparent">
            Share your VizitLink from your Instagram, TikTok, Twitter and other bios
          </h1>

          <p className="text-white text-base md:text-lg mb-6 md:mb-8 max-w-2xl">
            Add your unique VizitLink URL to all the platforms and places you find your
            audience. Then use your QR code to drive your offline traffic online.
          </p>

          <Button
            size="lg"
            className="bg-white text-red-800 hover:bg-gray-100 rounded-full px-6 md:px-8 py-3 md:py-4 font-semibold text-base md:text-lg"
          >
            Get started for free
          </Button>
        </div>

        {/* Right Content - Social Media Mockups */}
        <div className="flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-full max-w-lg">
            {/* Social Media Post Mockups */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-400 rounded-2xl p-6 aspect-square flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm font-semibold">@username</div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-2xl p-6 aspect-square flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm font-semibold">@profile</div>
                </div>
              </div>

              <div className="bg-pink-500 rounded-2xl p-6 aspect-square flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm font-semibold">@creator</div>
                </div>
              </div>

              <div className="bg-yellow-600 rounded-2xl p-6 aspect-square flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm font-semibold">@artist</div>
                </div>
              </div>
            </div>

            {/* Floating Social Icons */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
              <div className="text-pink-500 font-bold">IG</div>
            </div>

            <div className="absolute top-1/2 -left-4 bg-white rounded-full p-3 shadow-lg">
              <div className="text-black font-bold">TT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSection;
