/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    domains: [
      'localhost',
      'hhnlsawagpxafcyplsuj.supabase.co',
      'images.unsplash.com',
      'images.meesho.com',
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
      // E-commerce domains - Amazon
      'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'images-eu.ssl-images-amazon.com',
      'amazon.com',
      // E-commerce domains - Flipkart
      'flipkart.com',
      'static-assets-web.flixcart.com',
      'rukminim1.flixcart.com',
      'rukminim2.flixcart.com',
      // E-commerce domains - Meesho
      'meesho.com',
      // Other e-commerce platforms
      'assets.myntassets.com',
      'static.myntassets.com',
      'ii1.pepperfry.com',
      'cdn.shopify.com',
      'cdn.shopclues.com',
      'www.myntra.com',
      'myntassets.com',
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
    formats: ['image/avif', 'image/webp', 'video/mp4'],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false, // Enable optimization for production
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },

  // SEO & Security headers (also handled in middleware)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Output configuration
  output: 'standalone', // For better deployment optimization

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return module.size() > 160000;
            },
            name(module) {
              const hash = require('crypto').createHash('sha1');
              module.updateHash(hash);
              return hash.digest('hex').substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name(module, chunks) {
              return (chunks[0]?.name || '') + '-shared';
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;