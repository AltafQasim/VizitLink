/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'hhnlsawagpxafcyplsuj.supabase.co',
      'images.unsplash.com',
      'picsum.photos',
      'merlenorman.com',
      'ancientnutrition.com',
      'jtdluxe.com',
      'theordinary.com',
      'cerave.com',
      'neutrogena.com',
      'supabase.co',
      // Common image hosting domains
      'i.ytimg.com',
      'img.youtube.com',
      'yt3.ggpht.com',
      'ytimg.com',
      // E-commerce domains
      'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'images-eu.ssl-images-amazon.com',
      'flipkart.com',
      'static-assets-web.flixcart.com',
      'rukminim2.flixcart.com',
      // Social media domains
      'scontent.cdninstagram.com',
      'instagram.com',
      'cdninstagram.com',
      'fbcdn.net',
      'scontent.fbcdn.net',
      // Generic domains
      'via.placeholder.com',
      'placehold.co',
      'picsum.photos',
      'loremflickr.com',
      'source.unsplash.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },
};

module.exports = nextConfig; 