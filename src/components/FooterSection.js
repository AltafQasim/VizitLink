import { Button } from './ui/button';
import { Input } from './ui/input';
import Link from 'next/link';

const FooterSection = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-12 md:py-20 px-4 md:px-6">
        {/* Person Silhouette */}
        <div className="absolute left-0 bottom-0 w-32 h-48 md:w-48 md:h-72 lg:w-64 lg:h-96 opacity-80">
          <svg viewBox="0 0 200 300" className="w-full h-full fill-cyan-400">
            <path d="M100 50C120 50 135 65 135 85C135 105 120 120 100 120C80 120 65 105 65 85C65 65 80 50 100 50ZM70 140C70 135 75 130 80 130H120C125 130 130 135 130 140V180C130 185 135 190 140 190H160C165 190 170 195 170 200V290C170 295 165 300 160 300H40C35 300 30 295 30 290V200C30 195 35 190 40 190H60C65 190 70 185 70 180V140Z" />
          </svg>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto flex flex-col gap-4 md:gap-6 justify-center items-center text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight px-4">
            jumpstart your corner of the internet today
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row animate-slide-up max-w-lg" style={{ animationDelay: '0.4s' }}>
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
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 md:px-8 py-6 font-semibold text-base md:text-lg w-auto"
              >
                Claim your VizitLink
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Plant */}
        <div className="absolute right-4 md:right-8 bottom-0 w-16 h-24 md:w-24 md:h-36 lg:w-32 lg:h-48 opacity-60">
          <svg viewBox="0 0 100 150" className="w-full h-full fill-purple-300">
            <path d="M50 150V100C50 90 55 85 60 80C70 70 80 65 85 55C90 45 85 35 75 30C65 25 55 30 50 40C45 30 35 25 25 30C15 35 10 45 15 55C20 65 30 70 40 80C45 85 50 90 50 100V150Z" />
          </svg>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-white mx-4 md:mx-6 mb-12 md:mb-20 rounded-2xl md:rounded-3xl p-6 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Company */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Company</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
              <li><Link href="/blog" className="hover:text-purple-600 transition-colors">The VizitLink Blog</Link></li>
              <li><Link href="/engineering-blog" className="hover:text-purple-600 transition-colors">Engineering Blog</Link></li>
              <li><Link href="/marketplace" className="hover:text-purple-600 transition-colors">Marketplace</Link></li>
              <li><Link href="/whats-new" className="hover:text-purple-600 transition-colors">What's New</Link></li>
              <li><Link href="/about" className="hover:text-purple-600 transition-colors">About</Link></li>
              <li><Link href="/press" className="hover:text-purple-600 transition-colors">Press</Link></li>
              <li><Link href="/careers" className="hover:text-purple-600 transition-colors">Careers</Link></li>
              <li><Link href="/link-in-bio" className="hover:text-purple-600 transition-colors">Link in Bio</Link></li>
              <li><Link href="/social-good" className="hover:text-purple-600 transition-colors">Social Good</Link></li>
              <li><Link href="/contact" className="hover:text-purple-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Community</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
              <li><Link href="/enterprise" className="hover:text-purple-600 transition-colors">VizitLink for Enterprise</Link></li>
              <li><Link href="/creator-report-2023" className="hover:text-purple-600 transition-colors">2023 Creator Report</Link></li>
              <li><Link href="/creator-report-2022" className="hover:text-purple-600 transition-colors">2022 Creator Report</Link></li>
              <li><Link href="/trending" className="hover:text-purple-600 transition-colors">What's Trending</Link></li>
              <li><Link href="/creator-directory" className="hover:text-purple-600 transition-colors">Creator Profile Directory</Link></li>
              <li><Link href="/templates" className="hover:text-purple-600 transition-colors">Explore Templates</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Support</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
              <li><Link href="/help" className="hover:text-purple-600 transition-colors">Help Topics</Link></li>
              <li><Link href="/getting-started" className="hover:text-purple-600 transition-colors">Getting Started</Link></li>
              <li><Link href="/pro" className="hover:text-purple-600 transition-colors">VizitLink Pro</Link></li>
              <li><Link href="/features" className="hover:text-purple-600 transition-colors">Features & How-Tos</Link></li>
              <li><Link href="/faq" className="hover:text-purple-600 transition-colors">FAQs</Link></li>
              <li><Link href="/report-violation" className="hover:text-purple-600 transition-colors">Report a Violation</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Trust & Legal</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
              <li><Link href="/terms" className="hover:text-purple-600 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy Notice</Link></li>
              <li><Link href="/cookies" className="hover:text-purple-600 transition-colors">Cookie Notice</Link></li>
              <li><Link href="/trust-center" className="hover:text-purple-600 transition-colors">Trust Center</Link></li>
              <li><Link href="/transparency" className="hover:text-purple-600 transition-colors">Transparency Report</Link></li>
              <li><Link href="/law-enforcement" className="hover:text-purple-600 transition-colors">Law Enforcement Access Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-6 md:mt-8 pt-6 md:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6">
            {/* Login and Get Started */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full lg:w-auto">
              <Link href="/login">
                <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50 w-full sm:w-auto">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-lime-400 hover:bg-lime-500 text-black font-bold w-full sm:w-auto">
                  Get started for free
                </Button>
              </Link>
            </div>

            {/* App Store Badges and Social Icons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                {/* App Store Badge */}
                <div className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-xs flex items-center gap-2 min-w-0">
                  <span>📱</span>
                  <div className="min-w-0">
                    <div className="text-xs">Download on the</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </div>

                {/* Google Play Badge */}
                <div className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-xs flex items-center gap-2 min-w-0">
                  <span>▶️</span>
                  <div className="min-w-0">
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                  <span className="text-white text-xs">𝕏</span>
                </div>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                  <span className="text-white text-xs">🔗</span>
                </div>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                  <span className="text-white text-xs">📱</span>
                </div>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                  <span className="text-white text-xs">📺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Acknowledgment */}
      <div className="px-4 md:px-6 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Flags */}
          <div className="flex justify-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-10 h-6 md:w-12 md:h-8 bg-gradient-to-r from-black via-red-600 to-yellow-400 rounded"></div>
            <div className="w-10 h-6 md:w-12 md:h-8 bg-gradient-to-r from-green-600 via-black to-blue-600 rounded"></div>
          </div>

          <p className="text-white text-xs max-w-4xl mx-auto leading-relaxed px-4">
            We acknowledge the Traditional Custodians of the land on which our office stands, The Wurundjeri people of the Kulin Nation, and pay our respects to Elders past, present and emerging. VizitLink Pty Ltd (ABN 68 633 489), 1-9 Sackville St, Collingwood VIC 3066
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
