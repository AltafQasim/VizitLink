import { Button } from './ui/button';
import { Input } from './ui/input';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { SiThreads } from 'react-icons/si';

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
        {/* Logo Section */}
        <div className="max-w-6xl mx-auto mb-8 pb-6 border-b border-gray-200">
          <BrandLogo size="lg" logoVariant="black" colorfulHover />
          <p className="text-sm text-gray-600 mt-2">The only link in bio trusted by 70M+ people</p>
        </div>

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
              {/* <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                // App Store Badge 
                <div className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-xs flex items-center gap-2 min-w-0">
                  <span>📱</span>
                  <div className="min-w-0">
                    <div className="text-xs">Download on the</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </div>

                // Google Play Badge 
                <div className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-xs flex items-center gap-2 min-w-0">
                  <span>▶️</span>
                  <div className="min-w-0">
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </div>
              </div> */}

              {/* Social Icons */}
              <div className="flex gap-3">
                {/* X (Twitter) */}
                <a 
                  href="https://x.com/vizitlink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-gray-800 hover:to-black transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
                  aria-label="Follow us on X"
                >
                  <svg className="w-4 h-4 text-white group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Threads */}
                <a 
                  href="https://threads.net/@vizitlink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-gray-800 hover:to-black transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
                  aria-label="Follow us on Threads"
                >
                  <SiThreads className='w-5 h-5 text-white group-hover:text-purple-400 transition-colors duration-300' />
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com/vizitlink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* VizitLink */}
                <a 
                  href="https://vizitlink.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
                  aria-label="Visit VizitLink"
                >
                  <BrandLogo size="md" showText={false} linkToHome={false} logoVariant='white' colorfulHover={true} />
                  {/* <svg className="w-5 h-5 text-white group-hover:text-lime-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z" />
                  </svg> */}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Acknowledgment */}
      <div className="px-4 md:px-6 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Flags */}
          {/* <div className="flex justify-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-10 h-6 md:w-12 md:h-8 bg-gradient-to-r from-black via-red-600 to-yellow-400 rounded"></div>
            <div className="w-10 h-6 md:w-12 md:h-8 bg-gradient-to-r from-green-600 via-black to-blue-600 rounded"></div>
          </div>

          <p className="text-white text-xs max-w-4xl mx-auto leading-relaxed px-4 mb-3">
            We acknowledge the Traditional Custodians of the land on which our office stands, The Wurundjeri people of the Kulin Nation, and pay our respects to Elders past, present and emerging. VizitLink Pty Ltd (ABN 68 633 489), 1-9 Sackville St, Collingwood VIC 3066
          </p> */}
          
          {/* Copyright */}
          <p className="text-white/70 text-xs">
            © {new Date().getFullYear()} VizitLink. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
