"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../../context/DashboardContext';
import {
  Lock,
  Smartphone,
  X,
  ExternalLink,
  Sparkles,
  ShareIcon,
  Share2
} from 'lucide-react';
import { socialIconsMap, socialColorsMap } from '../../lib/social';
import BrandLogo from '../BrandLogo';
import { getCurrentStyles, getButtonStyle } from '../../lib/designStyles';

export default function MobilePreview() {
  const { data, customLinks } = useDashboard();
  const [showPreview, setShowPreview] = useState(false);

  // Derive design like LivePreview
  const design = data?.design || {};
  const theme = design.theme || '';
  const wallpaper = design.wallpaper || '';
  const buttonStyle = design.buttonStyle || 'Minimal';
  // Get font family with fallback - handle font names with spaces
  const getFontFamily = (fontName) => {
    if (!fontName) return '"Inter", sans-serif';
    // If font name has spaces, wrap in quotes
    if (fontName.includes(' ')) {
      return `"${fontName}", sans-serif`;
    }
    return `"${fontName}", sans-serif`;
  };
  const fontFamily = getFontFamily(design.fontFamily || 'Inter');
  const hideVizitlinkFooter = design.hideVizitlinkFooter || false;

  // Get current styles using common helper function
  const { currentBackground, currentTextColor, currentThemeSvg } = getCurrentStyles(wallpaper, theme, design);
  const currentButtonStyle = getButtonStyle(buttonStyle);

  return (
    <div className="lg:hidden">
      {/* Preview Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
        >
          {showPreview ? <X className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Preview Overlay */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-3"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-[92%] max-w-sm h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Content (mirrors LivePreview) */}
              <div className="flex-1 bg-black/5 p-3 overflow-hidden">
                <div className={`relative rounded-2xl overflow-hidden ${currentBackground} h-full`}>
                  {wallpaper === 'Image' && design.wallpaperImage && (
                    <img src={design.wallpaperImage} alt="Wallpaper" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {wallpaper === 'Video' && design.wallpaperVideo && (
                    <video
                      src={design.wallpaperVideo}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      disablePictureInPicture
                      disableRemotePlayback
                      onError={(e) => {
                        console.error('Video loading error:', e);
                      }}
                    />
                  )}
                  {currentThemeSvg && (
                    <img
                      src={currentThemeSvg}
                      alt="Theme"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {(wallpaper === 'Image' || wallpaper === 'Video') && (
                    <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(Number(design.wallpaperTint || 0)) / 100})` }} />
                  )}
                  {currentThemeSvg && (
                    <div className="absolute inset-0 bg-black/20" />
                  )}
                  <div className="relative z-10 p-4 sm:p-6 h-full overflow-y-auto">
                    {/* Top Icons - Brand and Share */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Brand Mini Icon */}
                      <button
                        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity hover:scale-110 active:scale-95"
                      >
                        <div className="rounded-lg p-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-sm">
                          <BrandLogo showText={false} linkToHome={false} />
                        </div>
                      </button>

                      {/* Share Icon */}
                      <button
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${currentTextColor === 'text-white'
                          ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                          : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        title="Share profile"
                      >
                        <Share2 className={`w-4 h-4 ${currentTextColor}`} />
                      </button>
                    </div>

                    {/* Profile */}
                    <div className="text-center mb-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                        {data?.profile?.avatar ? (
                          <img src={data.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {data?.profile?.displayName?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        )}
                      </div>
                      <h2 className={`text-lg font-bold mb-1 ${currentTextColor}`} style={{ fontFamily }}>
                        {data?.profile?.displayName}
                      </h2>
                      {data?.profile?.bio && (
                        <p className={`text-sm ${currentTextColor === 'text-white' ? 'text-white/80' : 'text-gray-600'}`} style={{ fontFamily }}>
                          {data.profile.bio}
                        </p>
                      )}
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
                      {/* Custom Links */}
                      {customLinks
                        ?.filter(link => link.active && link.url && link.url.trim() !== '')
                        .map((link) => {
                          const IconComponent = socialIconsMap[link.icon] || socialIconsMap.default;

                          if (link.layout === 'featured') {
                            return (
                              <motion.a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full h-40 p-3 relative flex items-center justify-center transition-colors ${currentButtonStyle} !rounded-3xl`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {link?.thumbnail ?
                                  <img src={link?.thumbnail} alt='thumbnail' className='absolute top-0 left-0 w-full h-full object-cover rounded-3xl' /> :
                                  IconComponent ? (
                                    <IconComponent
                                      className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl"
                                      style={{ color: socialColorsMap[link.icon] || socialColorsMap.default }}
                                    />
                                  ) : (
                                    <span className="text-lg">{link.icon}</span>
                                  )}
                                <div className="absolute inset-0 rounded-3xl" style={{ backgroundColor: `rgba(0,0,0,${(Number(design.wallpaperTint || 0)) / 100})` }} />
                                <div className="flex items-center h-16 space-x-3 z-10 text-white" >
                                  <span className="font-medium text-sm">{link.title}</span>
                                </div>
                              </motion.a>
                            );
                          } else {
                            return (
                              <motion.a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full p-3 flex items-center justify-between transition-colors ${currentButtonStyle} !rounded-3xl`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center space-x-3">
                                  {link?.thumbnail ?
                                    <img src={link.thumbnail} className='w-10 h-10 rounded-full object-cover' alt={link.title} /> :
                                    IconComponent ? (
                                      <IconComponent
                                        className="w-5 h-5"
                                        style={{ color: socialColorsMap[link.icon] || socialColorsMap.default }}
                                      />
                                    ) : (
                                      <span className="text-lg">{link.icon}</span>
                                    )}
                                  <span className="font-medium text-sm">{link.title}</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </motion.a>
                            );
                          }
                        })}
                    </div>

                    {/* Shop section with improved design */}
                    {(data?.products || []).filter(p => p.active).length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`font-semibold text-lg ${currentTextColor}`} style={{ fontFamily }}>Shop</h3>
                          {/* <button className={`text-sm px-3 py-1 rounded-full transition-colors ${currentTextColor === 'text-white' ? 'bg-white/20 text-white/90 hover:bg-white/30' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>View all</button> */}
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
                                className={`group block rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 ${currentButtonStyle}`}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="relative">
                                  {product.image ? (
                                    <div className="relative w-full h-32 overflow-hidden">
                                      <img
                                        src={product.image}
                                        alt={product.title || 'Product'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      {Number(product.price) > 0 && product.showPrice !== false && (
                                        <div className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-primary text-primary-foreground shadow-sm">
                                          ${(Number(product.price) || 0).toFixed(2)}
                                        </div>
                                      )}
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
                                  <h4 className={`font-semibold text-sm truncate ${currentTextColor}`} style={{ fontFamily }}>
                                    {product.title}
                                  </h4>
                                  {product.brand && (
                                    <p className={`text-xs mt-1 truncate ${currentTextColor === 'text-white' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                      {product.brand}
                                    </p>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <span />
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
                            <div
                              key={link.id}
                              className={`${currentTextColor === 'text-white' ? 'bg-white/20' : 'bg-gray-200'} w-8 h-8 rounded-full flex items-center justify-center`}
                            >
                              <IconComponent
                                className="w-5 h-5"
                                style={{ color: socialColorsMap[link.icon] || socialColorsMap.default }}
                              />
                            </div>
                          );
                        })}
                    </div>

                    {!hideVizitlinkFooter && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative mt-6 pb-6 z-50"
                      >
                        <div className='flex justify-center items-center'>
                          <div className="w-auto px-5 py-2.5 relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black antialiased font-sans [&_span]:!leading-none text-center text-black !ease-in-out !duration-200 hover:!bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.2)] bg-white border border-sand hover:border-chalk hover:bg-chalk active:border-chalk active:bg-chalk flex justify-center items-center h-2xl px-md">
                            <span className="flex items-center justify-center">
                              <span className="label block font-semibold text-md">Join {data?.profile?.username} on VizitLink</span>
                            </span>
                          </div>
                        </div>


                        {/* Subtle branding */}
                        <div className="mt-3 flex items-center justify-center gap-1.5">
                          <span className="text-[10px] text-gray-400">Powered by</span>
                          <BrandLogo showText={false} linkToHome={false} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
