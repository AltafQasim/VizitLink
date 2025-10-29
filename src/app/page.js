import TopBanner from '../components/TopBanner';
import StickyNavbar from '../components/StickyNavbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialSection from '../components/TestimonialSection';
import CustomizeSection from '../components/CustomizeSection';
import AnalyticsSection from '../components/AnalyticsSection';
import CreatorsSection from '../components/CreatorsSection';
import FooterSection from '../components/FooterSection';
import ShareSection from '../components/ShareSection';
import { BASE_URL } from '../lib/constants'; // Add this import

// Server Component - Static Page
export default function Home() {
  return (
    <div className="min-h-screen">
      <TopBanner />
      <StickyNavbar />
      <HeroSection />
      <CustomizeSection />
      <ShareSection />
      <AnalyticsSection />
      <CreatorsSection />
      <FeaturesSection />
      <TestimonialSection />
      <FooterSection />
    </div>
  );
}

// Enable static page generation
export const dynamic = 'force-static';

// You can also add generateMetadata for even better SEO
export const metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'VizitLink',
  },
}