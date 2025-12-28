import { BASE_URL } from '../lib/constants'; // Add this import

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/onboarding/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}