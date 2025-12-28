import StickyNavbar from '../../components/StickyNavbar';

export const metadata = {
  title: 'Pricing',
  description: 'Choose the perfect VizitLink plan for your needs. Free, Pro, and Premium plans available.',
  openGraph: {
    title: 'VizitLink Pricing',
    description: 'Choose the perfect VizitLink plan for your needs. Free, Pro, and Premium plans available.',
  },
}

export default function PricingPage() {
  return (
    <div>
      <StickyNavbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-gray-600 text-lg">Choose the perfect plan for your needs!</p>
        </div>
      </div>
    </div>
  );
}
