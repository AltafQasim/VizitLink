const FeaturesSection = () => {
  return (
    <div className="bg-gray-50 py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Two Stacked Blocks */}
          <div className="space-y-8">
            
            {/* Top Block - Pink/Purple (Content Sharing) */}
            <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                {/* Visual Elements Row */}
                <div className="flex gap-4">
                  {/* Bubble Gum Video */}
                  <div className="bg-white rounded-lg p-3 flex-1">
                    <div className="relative">
                      <div className="w-full h-20 bg-pink-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 bg-pink-300 rounded-full mx-auto mb-1"></div>
                          <span className="text-xs text-pink-600 font-medium">Bubble Gum</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-pink-500 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Music Player */}
                  <div className="bg-gray-800 rounded-lg p-3 flex-1">
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-600 rounded"></div>
                      <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Person with Lights */}
                  <div className="bg-white rounded-lg p-3 flex-1">
                    <div className="relative">
                      <div className="w-full h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Text */}
                <p className="text-gray-800 text-lg font-medium leading-relaxed">
                  Share your content in limitless ways on your VizitLink.
                </p>
              </div>
            </div>
            
            {/* Bottom Block - Lime Green (Selling Products) */}
            <div className="bg-gradient-to-br from-lime-300 to-green-400 rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                {/* Product Cards */}
                <div className="flex gap-3">
                  {/* Lipstick */}
                  <div className="bg-white rounded-lg p-3 transform rotate-2 shadow-md">
                    <div className="w-16 h-16 bg-red-400 rounded-lg mb-2"></div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Lipstick</p>
                      <p className="text-sm font-bold text-gray-800">$10</p>
                    </div>
                  </div>
                  
                  {/* Beanie */}
                  <div className="bg-white rounded-lg p-3 transform -rotate-1 shadow-md">
                    <div className="w-16 h-16 bg-yellow-300 rounded-lg mb-2"></div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Beanie</p>
                      <p className="text-sm font-bold text-gray-800">$20</p>
                    </div>
                  </div>
                  
                  {/* Dress */}
                  <div className="bg-white rounded-lg p-3 transform rotate-1 shadow-md">
                    <div className="w-16 h-16 bg-pink-300 rounded-lg mb-2"></div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Dress</p>
                      <p className="text-sm font-bold text-gray-800">$40</p>
                    </div>
                  </div>
                  
                  {/* Record */}
                  <div className="bg-white rounded-lg p-3 transform -rotate-2 shadow-md sm:block hidden">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg mb-2"></div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Record</p>
                      <p className="text-sm font-bold text-gray-800">$30</p>
                    </div>
                  </div>
                </div>
                
                {/* Text */}
                <p className="text-gray-800 text-lg font-medium leading-relaxed">
                  Sell products and collect payments. It's monetization made simple.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Large Dark Blue Block */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-8 shadow-lg">
            <div className="space-y-8">
              {/* Email Subscribers */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-2xl font-bold">6,412</p>
                  <p className="text-blue-200 text-sm">Email subscribers</p>
                </div>
              </div>
              
              {/* Mobile Screens */}
              <div className="flex gap-4">
                {/* Profile Screen */}
                <div className="bg-white rounded-lg p-3 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
                      <div className="text-xs text-gray-600">Profile</div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
                
                {/* Email Form Screen */}
                <div className="bg-white rounded-lg p-3 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-800">Get email updates</div>
                      <div className="h-6 bg-gray-100 rounded border"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-gray-300 rounded"></div>
                        <span className="text-xs text-gray-600">Agree to terms</span>
                      </div>
                      <div className="h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                        Subscribe
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Currency Icon */}
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-yellow-800 font-bold text-lg">€</span>
                </div>
              </div>
              
              {/* Text */}
              <p className="text-white text-lg font-medium leading-relaxed">
                Grow, own and engage your audience by unifying them in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
