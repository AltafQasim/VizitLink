import { Button } from '@/components/ui/button';

const AnalyticsSection = () => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Left Content - Analytics Cards */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 animate-fade-in order-2 lg:order-1">
          {/* Clickthrough Rate Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-3 md:mb-4">
                <svg width="30" height="22" viewBox="0 0 40 30" fill="none" className="opacity-80 md:w-10 md:h-8">
                  <path d="M2 28L8 22L14 25L22 15L30 18L38 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="22" r="2" fill="currentColor"/>
                  <circle cx="14" cy="25" r="2" fill="currentColor"/>
                  <circle cx="22" cy="15" r="2" fill="currentColor"/>
                  <circle cx="30" cy="18" r="2" fill="currentColor"/>
                  <circle cx="38" cy="8" r="2" fill="currentColor"/>
                </svg>
              </div>
              <div className="text-xl md:text-3xl font-bold mb-1">43,600</div>
              <div className="text-xs md:text-sm opacity-90">Clickthrough rate</div>
            </div>
          </div>

          {/* Track Plays Card */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
            <div className="mb-3 md:mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-80 md:w-8 md:h-8">
                <path d="M9 18V6l12 6-12 6z" fill="currentColor"/>
              </svg>
            </div>
            <div className="text-xl md:text-3xl font-bold mb-1">643</div>
            <div className="text-xs md:text-sm opacity-90">Track Plays</div>
          </div>

          {/* Sales Card */}
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
            <div className="mb-3 md:mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-80 md:w-8 md:h-8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-xl md:text-3xl font-bold mb-1">$2,362</div>
            <div className="text-xs md:text-sm opacity-90">Sales</div>
          </div>

          {/* Visits Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white relative">
            <div className="mb-3 md:mb-4 relative">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-cyan-400 relative">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full absolute top-2 left-2 md:top-4 md:left-4"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full absolute top-4 left-4 md:top-6 md:left-6"></div>
              </div>
            </div>
            <div className="text-xl md:text-3xl font-bold mb-1">960</div>
            <div className="text-xs md:text-sm opacity-90">Visits</div>
            <div className="text-xs opacity-75 mt-1">New York, USA</div>
          </div>
        </div>

        {/* Right Content */}
        <div className="text-center lg:text-left space-y-4 md:space-y-6 animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Analyze your audience and keep your followers engaged
          </h2>
          
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