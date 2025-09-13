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
