import StickyNavbar from '../../components/StickyNavbar';

export const metadata = {
  title: 'Blog',
  description: 'Latest updates, insights, and tips from the VizitLink team. Learn how to grow your presence online.',
  openGraph: {
    title: 'VizitLink Blog',
    description: 'Latest updates, insights, and tips from the VizitLink team.',
  },
}

export default function BlogPage() {
  return (
    <div>
      <StickyNavbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">The VizitLink Blog</h1>
          <p className="text-gray-600 text-lg">Latest updates and insights from our team!</p>
        </div>
      </div>
    </div>
  );
}
