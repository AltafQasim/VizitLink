"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Eye,
  EyeOff,
  Lock,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { socialIconsMap, socialColorsMap } from '../../lib/social';

// Format helpers
const getCurrencySymbol = (currency) => {
  const map = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
  };
  return map[currency] || '$';
};

export default function LivePreview() {
  const { data } = useDashboard();
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Get design settings
  const design = data?.design || {};
  const theme = design.theme || '';
  const wallpaper = design.wallpaper || '';
  const buttonStyle = design.buttonStyle || 'Minimal';
  const fontFamily = design.fontFamily || 'Inter';
  const hideVizitlinkFooter = design.hideVizitlinkFooter || false;
  
  useEffect(() => {
    if (wallpaper === 'Video' && design.wallpaperVideo) {
      setIsVideoLoading(true);
    } else {
      setIsVideoLoading(false);
    }
  }, [wallpaper, design.wallpaperVideo]);

  // Theme styles mapping
  const themeStyles = {
    'Air': { background: 'bg-gray-100', textColor: 'text-black' },
    'Blocks': { background: 'bg-gradient-to-br from-purple-500 to-pink-500', textColor: 'text-white' },
    'Bloom': { background: 'bg-gradient-to-br from-red-500 to-blue-600', textColor: 'text-white' },
    'Breeze': { background: 'bg-gradient-to-br from-purple-400 to-pink-400', textColor: 'text-white' },
    'Lake': { background: 'bg-slate-800', textColor: 'text-white' },
    'Mineral': { background: 'bg-orange-100', textColor: 'text-black' },
    'Ocean': { background: 'bg-blue-100', textColor: 'text-black' },
    'Sunset': { background: 'bg-gradient-to-br from-yellow-500 to-red-500', textColor: 'text-white' },
    'Winter': { background: 'bg-gradient-to-br from-blue-200 to-blue-400', textColor: 'text-black' },
    'Spring': { background: 'bg-gradient-to-br from-green-200 to-green-400', textColor: 'text-black' },
    'Summer': { background: 'bg-gradient-to-br from-yellow-200 to-yellow-400', textColor: 'text-black' },
    'Autumn': { background: 'bg-gradient-to-br from-orange-200 to-orange-400', textColor: 'text-black' },
    'Midnight': { background: 'bg-gradient-to-br from-gray-900 to-black', textColor: 'text-white' },
    'Aurora': { background: 'bg-gradient-to-br from-green-400 to-blue-500', textColor: 'text-white' },
    'Coral': { background: 'bg-gradient-to-br from-pink-400 to-orange-400', textColor: 'text-white' },
    'Forest': { background: 'bg-gradient-to-br from-green-600 to-green-800', textColor: 'text-white' },
    'Lavender': { background: 'bg-gradient-to-br from-purple-300 to-pink-300', textColor: 'text-black' },
    'Sage': { background: 'bg-gradient-to-br from-green-200 to-blue-200', textColor: 'text-black' },
    'Rose': { background: 'bg-gradient-to-br from-rose-400 to-pink-500', textColor: 'text-white' },
    'Sky': { background: 'bg-gradient-to-br from-blue-300 to-cyan-400', textColor: 'text-black' },
    'Amber': { background: 'bg-gradient-to-br from-amber-400 to-orange-500', textColor: 'text-white' },
    'Indigo': { background: 'bg-gradient-to-br from-indigo-500 to-purple-600', textColor: 'text-white' },
    'Teal': { background: 'bg-gradient-to-br from-teal-400 to-cyan-500', textColor: 'text-white' },
    'Ruby': { background: 'bg-gradient-to-br from-red-500 to-pink-600', textColor: 'text-white' },
  };

  // Wallpaper styles mapping
  const wallpaperStyles = {
    'Hero': { background: 'bg-gradient-to-br from-blue-900 to-teal-400', textColor: 'text-white' },
    'Fill': { background: 'bg-gray-100', textColor: 'text-black' },
    'Gradient': { background: 'bg-gradient-to-br from-gray-400 to-gray-600', textColor: 'text-white' },
    'Blur': { background: 'bg-gradient-to-br from-blue-200 to-purple-200', textColor: 'text-black' },
    'Pattern': { background: 'bg-gradient-to-br from-blue-200 to-gray-300', textColor: 'text-black' },
    'Image': { background: 'bg-gradient-to-br from-orange-500 via-red-500 to-black', textColor: 'text-white' },
    'Video': { background: 'bg-gradient-to-br from-gray-600 to-gray-800', textColor: 'text-white' },
  };

  // Button styles mapping
  const buttonStyles = {
    'Minimal': 'border border-gray-400 bg-transparent text-black rounded-lg',
    'Classic': 'bg-gray-100 text-black rounded-lg shadow-sm',
    'Unique': 'bg-blue-50 text-gray-700 rounded-lg border border-blue-200',
    'Zen': 'bg-white text-black rounded-full shadow-sm',
    'Simple': 'bg-gray-50 text-black rounded-lg',
    'Precise': 'bg-transparent text-black rounded border border-gray-400',
    'Retro': 'bg-black text-white rounded-full border-2 border-black',
    'Modern': 'bg-gray-100 text-black rounded-lg',
    'Industrial': 'bg-transparent text-black rounded border border-gray-600',
  };

  // Determine which styling to use (wallpaper takes priority over theme)
  let currentBackground, currentTextColor;

  if (wallpaper === 'Image' && design.wallpaperImage) {
    currentBackground = '';
    currentTextColor = 'text-white';
  } else if (wallpaper === 'Video' && design.wallpaperVideo) {
    currentBackground = '';
    currentTextColor = 'text-white';
  } else if (wallpaper && wallpaperStyles[wallpaper]) {
    currentBackground = wallpaperStyles[wallpaper].background;
    currentTextColor = wallpaperStyles[wallpaper].textColor;
  } else if (theme && themeStyles[theme]) {
    // Use theme styling if no wallpaper selected
    currentBackground = themeStyles[theme].background;
    currentTextColor = themeStyles[theme].textColor;
  } else {
    // Default fallback
    currentBackground = 'bg-gray-100';
    currentTextColor = 'text-black';
  }

  const currentButtonStyle = buttonStyles[buttonStyle] || buttonStyles['Minimal'];

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex w-[420px] bg-gray-50 border-l border-gray-200 py-6 px-4 flex-col"
    >
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Live Preview</h3>
        <p className="text-sm text-gray-500">See how your VizitLink looks to visitors</p>
      </div>

      {/* Mobile mockup */}
      <div className="flex items-center justify-center">
        <div className="bg-black rounded-3xl shadow-2xl p-1 w-full h-full max-w-sm">

          {/* Content */}
          <div className={`relative rounded-2xl overflow-hidden ${currentBackground}`}>
            {wallpaper === 'Image' && design.wallpaperImage && (
              <img src={design.wallpaperImage} alt="Wallpaper" className="absolute inset-0 w-full h-full object-cover" />
            )}
            {wallpaper === 'Video' && design.wallpaperVideo && (
              <>
                <video
                  src={design.wallpaperVideo}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => setIsVideoLoading(false)}
                  onCanPlay={() => setIsVideoLoading(false)}
                />
                {isVideoLoading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-full h-full">
                      <div className="h-full rounded-lg bg-white/10 animate-pulse" />
                    </div>
                  </div>
                )}
              </>
            )}
            {(wallpaper === 'Image' || wallpaper === 'Video') && (
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(Number(design.wallpaperTint||0))/100})` }} />
            )}
            <div className="relative z-10 p-6 min-h-[400px] max-h-[550px] overflow-y-auto">
              {/* Profile */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                  {data?.profile?.avatar ? (
                    <img
                      src={data.profile.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {data?.profile?.displayName?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  )}
                </div>
                <h2
                  className={`text-lg font-bold mb-1 ${currentTextColor}`}
                  style={{ fontFamily: fontFamily }}
                >
                  {data?.profile?.displayName}
                </h2>
                <p
                  className={`text-sm mb-3 ${currentTextColor === 'text-white' ? 'text-white/80' : 'text-gray-600'}`}
                  style={{ fontFamily: fontFamily }}
                >
                  {data?.profile?.bio}
                </p>
              </div>

              {/* Links */}
              <div className="space-y-3">
                {data?.links
                  ?.filter(link => link.active)
                  .sort((a, b) => a.order - b.order)
                  .map((link) => {
                    const IconComponent = socialIconsMap[link.icon] || socialIconsMap.default;

                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full rounded-lg p-3 flex items-center justify-between transition-colors ${currentButtonStyle}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          {IconComponent ? (
                            <IconComponent
                              className="w-5 h-5"
                              style={{ color: socialColorsMap[link.icon] || socialColorsMap.default }}
                            />
                          ) : (
                            <span className="text-lg">{link.icon}</span>
                          )}
                          <span className="font-medium" style={{ fontFamily: fontFamily }}>{link.title}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </motion.a>
                    );
                  })}
              </div>

              {/* Shop section with improved design */}
              {(data?.products || []).filter(p => p.active).length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold text-lg ${currentTextColor}`} style={{ fontFamily: fontFamily }}>Shop</h3>
                    <button className={`text-sm px-3 py-1 rounded-full ${currentTextColor === 'text-white' ? 'bg-white/20 text-white/90 hover:bg-white/30' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'} transition-colors`}>View all</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(data.products || [])
                      .filter(p => p.active)
                      .map((product) => (
                        <motion.a
                          key={product.id}
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group block rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${currentTextColor === 'text-white' ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white shadow-sm border border-gray-100'}`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="relative">
                            {product.image ? (
                              <div className="relative w-full h-32 overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.title || 'Product'}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 640px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <ExternalLink className="w-3 h-3 text-gray-700" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-gray-400 text-xs">No Image</div>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className={`font-semibold text-sm truncate ${currentTextColor}`} style={{ fontFamily: fontFamily }}>
                              {product.title}
                            </h4>
                            <p className={`text-xs mt-1 truncate ${currentTextColor === 'text-white' ? 'text-white/70' : 'text-gray-500'}`}>
                              {product.brand || 'Unknown Brand'}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              {Number(product.price) > 0 ? (
                                <span className="text-sm font-bold text-purple-600">
                                  {`${getCurrencySymbol(product.currency)}${Number(product.price).toFixed(2)}`}
                                </span>
                              ) : <span />}
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>
                          </div>
                        </motion.a>
                      ))}
                  </div>
                </div>
              )}

              {/* Social icons */}
              <div className="mt-6 flex justify-center space-x-4">
                {data?.links
                  ?.filter(link => link.active)
                  .slice(0, 5)
                  .map((link) => {
                    const IconComponent = socialIconsMap[link.icon] || socialIconsMap.default;
                    return (
                      <Link
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentTextColor === 'text-white' ? 'bg-white/20' : 'bg-gray-200'}`}
                      >
                        <IconComponent
                          className="w-5 h-5"
                          style={{ color: socialColorsMap[link.icon] || socialColorsMap.default }}
                        />
                      </Link>
                    )
                  })}
              </div>
            </div>

            {/* Hide logo notice */}
            {!hideVizitlinkFooter && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                  <Lock className="w-3 h-3" />
                  <span>Hide VizitLink logo</span>
                  <span className="text-purple-600">🔒</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview controls */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4" />
          <span>Preview mode</span>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium">
          View live
        </button>
      </div>
    </motion.div>
  );
}
