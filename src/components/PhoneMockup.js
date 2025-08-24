const PhoneMockup = () => {
  return (
    <div className="relative animate-float">
      {/* Phone Frame */}
      <div className="relative w-80 h-[600px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden relative">
          
          {/* Profile Section */}
          <div className="bg-gradient-to-br from-blue-200 to-purple-300 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-orange-300 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/api/placeholder/80/80" 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Artist J</h3>
            <p className="text-gray-600 text-sm">Music is our cure</p>
          </div>

          {/* Content Links */}
          <div className="p-4 space-y-3">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 text-white">
              <p className="font-semibold">Latest Single</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl p-4 text-white">
              <p className="font-semibold">Music Video</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl p-4 text-white">
              <p className="font-semibold">Pin on Spotify</p>
            </div>

            {/* Album Art Section */}
            <div className="relative bg-gradient-to-br from-orange-300 to-pink-400 rounded-2xl p-4 h-32">
              <div className="absolute top-2 left-2 text-white">
                <p className="text-lg font-bold italic">Double Return</p>
              </div>
              <div className="absolute bottom-2 left-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-1"></div>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-3 pt-2">
              <div className="w-10 h-10 bg-purple-400 rounded-full"></div>
              <div className="w-10 h-10 bg-pink-400 rounded-full"></div>
              <div className="w-10 h-10 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Vinyl Record */}
        <div className="absolute -right-8 top-16 w-24 h-24 bg-black rounded-full shadow-lg animate-bounce-slow">
          <div className="absolute inset-2 border-2 border-gray-700 rounded-full">
            <div className="absolute inset-4 bg-gray-800 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          <div className="absolute top-1 left-1 text-white text-xs font-bold">999</div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
