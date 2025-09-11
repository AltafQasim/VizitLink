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
              {/* Instagram */}
              <div className="rounded-2xl p-6 aspect-square flex items-center justify-center text-white bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515BD4] group">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2">
                    <svg aria-label="Instagram" viewBox="0 0 24 24" className="w-full h-full fill-white transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6">
                      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.6.6.3 1 .7 1.5 1.2.5.5.9.9 1.2 1.5.3.5.5 1.2.6 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.6 2.4-.3.6-.7 1-1.2 1.5-.5.5-.9.9-1.5 1.2-.5.3-1.2.5-2.4.6-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.6-.6-.3-1-.7-1.5-1.2-.5-.5-.9-.9-1.2-1.5-.3-.5-.5-1.2-.6-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.6-2.4.3-.6.7-1 1.2-1.5.5-.5.9-.9 1.5-1.2.5-.3 1.2-.5 2.4-.6C8.4 2.2 8.8 2.2 12 2.2zm0 2.1c-3.1 0-3.5 0-4.7.1-1 .1-1.5.2-1.8.4-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.2.3-.3.8-.4 1.8-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.5.4 1.8.2.5.4.8.8 1.2.4.4.7.6 1.2.8.3.2.8.3 1.8.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.5-.2 1.8-.4.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.3.3-.8.4-1.8.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.5-.4-1.8-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.3-.2-.8-.3-1.8-.4-1.2-.1-1.6-.1-4.7-.1z"/>
                      <path d="M12 6.8a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4zm0 2.1a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2z"/>
                      <circle cx="17.4" cy="6.6" r="1.2"/>
                    </svg>
                  </div>
                  <div className="text-sm font-semibold">@instagram</div>
                </div>
              </div>

              {/* TikTok */}
              <div className="rounded-2xl p-6 aspect-square flex items-center justify-center text-white bg-gradient-to-tr from-black via-[rgba(37,244,238,0.18)] to-[rgba(254,44,85,0.18)] group">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-2 rounded-full p-[2px] bg-gradient-to-tr from-[#25F4EE] to-[#FE2C55]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <svg aria-label="TikTok" viewBox="0 0 24 24" className="w-8 h-8 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1">
                        <path fill="#25F4EE" transform="translate(0.7,0)" d="M12.5 2h3.1c.2 1.4 1 2.8 2.2 3.8 1.1.9 2.5 1.5 3.9 1.6v3.2c-1.6.1-3.1-.3-4.5-1v7.3c0 4.2-3.4 7.6-7.6 7.6S2 21.1 2 16.9s3.4-7.6 7.6-7.6c.6 0 1.1.1 1.6.2v3.2c-.5-.2-1.1-.2-1.6-.2-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4V2z"/>
                        <path fill="#FE2C55" transform="translate(-0.7,0.4)" d="M12.5 2h3.1c.2 1.4 1 2.8 2.2 3.8 1.1.9 2.5 1.5 3.9 1.6v3.2c-1.6.1-3.1-.3-4.5-1v7.3c0 4.2-3.4 7.6-7.6 7.6S2 21.1 2 16.9s3.4-7.6 7.6-7.6c.6 0 1.1.1 1.6.2v3.2c-.5-.2-1.1-.2-1.6-.2-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4V2z"/>
                        <path fill="#FFFFFF" d="M12.5 2h3.1c.2 1.4 1 2.8 2.2 3.8 1.1.9 2.5 1.5 3.9 1.6v3.2c-1.6.1-3.1-.3-4.5-1v7.3c0 4.2-3.4 7.6-7.6 7.6S2 21.1 2 16.9s3.4-7.6 7.6-7.6c.6 0 1.1.1 1.6.2v3.2c-.5-.2-1.1-.2-1.6-.2-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4V2z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">@tiktok</div>
                </div>
              </div>

              {/* X (Twitter) */}
              <div className="rounded-2xl p-6 aspect-square flex items-center justify-center text-white bg-black group">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2">
                    <svg aria-label="X" viewBox="0 0 24 24" className="w-full h-full fill-white transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6">
                      <path d="M18.9 2H22l-7 8 8 12h-6.2l-4.4-6-5 6H2l7.6-8.7L2.5 2h6.3l4 5.7L18.9 2z"/>
                    </svg>
                  </div>
                  <div className="text-sm font-semibold">@x</div>
                </div>
              </div>

              {/* YouTube */}
              <div className="rounded-2xl p-6 aspect-square flex items-center justify-center text-white bg-[#FF0000] group">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2">
                    <svg aria-label="YouTube" viewBox="0 0 24 24" className="w-full h-full fill-white transition-transform duration-300 ease-out group-hover:scale-110">
                      <path d="M23.5 6.2a3.7 3.7 0 0 0-2.6-2.6C19 3 12 3 12 3s-7 0-8.9.6A3.7 3.7 0 0 0 .6 6.2 38 38 0 0 0 0 12a38 38 0 0 0 .6 5.8 3.7 3.7 0 0 0 2.6 2.6C5 21 12 21 12 21s7 0 8.9-.6a3.7 3.7 0 0 0 2.6-2.6c.4-1.9.6-3.9.6-5.8s-.2-3.9-.6-5.8zM9.6 15.5V8.5L15.8 12l-6.2 3.5z"/>
                    </svg>
                  </div>
                  <div className="text-sm font-semibold">/YouTube</div>
                </div>
              </div>
            </div>

            {/* Floating Social Icons */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
              <div className="text-pink-500 font-bold">IG</div>
            </div>

            <div className="absolute top-1/2 -left-4 bg-white rounded-full p-3 shadow-lg">
              <div className="text-black font-bold">X</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSection;
