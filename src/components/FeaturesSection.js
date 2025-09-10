import Image from "next/image";

const FeaturesSection = () => {
  return (
    <div className="bg-gray-50 py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">

          {/* Left Column - Two Stacked Blocks */}
          <div className="space-y-4 lg:space-y-4 lg:h-full flex flex-col">

            {/* Top Block - Pink/Purple (Content Sharing) */}
            <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl p-4 md:p-6 shadow-lg flex flex-col lg:flex-1">
              <div className="space-y-3 md:space-y-4 lg:flex-1 flex flex-col">
                {/* Visual Elements Row */}
                <div className="relative w-full aspect-[65/30] lg:flex-1">
                  <Image
                    src="/sharecontent.avif"
                    alt="Share content visual"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority={false}
                    className="object-contain"
                  />
                </div>


                {/* Text */}
                <p className="text-gray-900 text-base md:text-lg lg:text-xl font-semibold leading-relaxed">
                  Share your content in limitless ways on your VizitLink.
                </p>
              </div>
            </div>

            {/* Bottom Block - Lime Green (Selling Products) */}
            <div className="bg-gradient-to-br from-lime-300 to-green-400 rounded-2xl p-4 md:p-6 shadow-lg flex flex-col lg:flex-1">
              <div className="space-y-3 md:space-y-4 lg:flex-1 flex flex-col">
                {/* Product Cards */}
                <div className="relative w-full aspect-[65/30] lg:flex-1">
                  <Image
                    src="/sellproduct.avif"
                    alt="Sell products visual"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-contain"
                  />
                </div>


                {/* Text */}
                <p className="text-gray-900 text-base md:text-lg lg:text-xl font-semibold leading-relaxed">
                  Sell products and collect payments. It's monetization made simple.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Large Dark Blue Block */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-2 md:p-4 shadow-lg flex flex-col justify-between h-full lg:min-h-[28rem]">
            <div className="relative w-full aspect-[55/60]">
              <Image
                src="/emailtemp.avif"
                alt="Email template visual"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority={false}
                className="object-contain rounded-lg"
              />
            </div>
            <p className="text-white text-base md:text-lg lg:text-xl font-semibold leading-relaxed mt-2">
              Grow, own and engage your audience by unifying them in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
