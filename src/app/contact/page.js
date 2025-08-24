import StickyNavbar from '../../components/StickyNavbar';

export default function ContactPage() {
  return (
    <div>
      <StickyNavbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">Get in touch with our team!</p>
        </div>
      </div>
    </div>
  );
}
