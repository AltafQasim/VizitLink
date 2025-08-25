/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'picsum.photos',
      'merlenorman.com',
      'ancientnutrition.com',
      'jtdluxe.com',
      'theordinary.com',
      'cerave.com',
      'neutrogena.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig; 