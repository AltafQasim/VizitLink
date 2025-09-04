"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Lock,
  Smartphone,
  X,
  ExternalLink
} from 'lucide-react';
import { socialIconsMap, socialColorsMap } from '../../lib/social';

export default function MobilePreview() {
  const { data } = useDashboard();
  const [showPreview, setShowPreview] = useState(false);

  // Derive design like LivePreview
  const design = data?.design || {};
  const theme = design.theme || '';
  const wallpaper = design.wallpaper || '';
  const buttonStyle = design.buttonStyle || 'Minimal';
  const fontFamily = design.fontFamily || 'Inter';
  const hideVizitlinkFooter = design.hideVizitlinkFooter || false;

  const themeStyles = useMemo(() => ({
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
  }), []);

  const wallpaperStyles = useMemo(() => ({
    'Hero': { background: 'bg-gradient-to-br from-blue-900 to-teal-400', textColor: 'text-white' },
    'Fill': { background: 'bg-gray-100', textColor: 'text-black' },
    'Gradient': { background: 'bg-gradient-to-br from-gray-400 to-gray-600', textColor: 'text-white' },
    'Blur': { background: 'bg-gradient-to-br from-blue-200 to-purple-200', textColor: 'text-black' },
    'Pattern': { background: 'bg-gradient-to-br from-blue-200 to-gray-300', textColor: 'text-black' },
    'Image': { background: 'bg-gradient-to-br from-orange-500 via-red-500 to-black', textColor: 'text-white' },
    'Video': { background: 'bg-gradient-to-br from-gray-600 to-gray-800', textColor: 'text-white' },
  }), []);

  const buttonStyles = useMemo(() => ({
    'Minimal': 'border border-gray-400 bg-transparent text-black rounded-lg',
    'Classic': 'bg-gray-100 text-black rounded-lg shadow-sm',
    'Unique': 'bg-blue-50 text-gray-700 rounded-lg border border-blue-200',
    'Zen': 'bg-white text-black rounded-full shadow-sm',
    'Simple': 'bg-gray-50 text-black rounded-lg',
    'Precise': 'bg-transparent text-black rounded border border-gray-400',
    'Retro': 'bg-black text-white rounded-full border-2 border-black',
    'Modern': 'bg-gray-100 text-black rounded-lg',
    'Industrial': 'bg-transparent text-black rounded border border-gray-600',
  }), []);

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
    currentBackground = themeStyles[theme].background;
    currentTextColor = themeStyles[theme].textColor;
  } else {
    currentBackground = 'bg-gray-100';
    currentTextColor = 'text-black';
  }
  const currentButtonStyle = buttonStyles[buttonStyle] || buttonStyles['Minimal'];

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
              {/* Status bar */}
              <div className="bg-black text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
                <span>9:41</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>

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
                    />
                  )}
                  {(wallpaper === 'Image' || wallpaper === 'Video') && (
                    <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(Number(design.wallpaperTint||0))/100})` }} />
                  )}

                  <div className="relative z-10 p-4 sm:p-6 h-full overflow-y-auto">
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
                              className={`block w-full rounded-lg p-3 flex items-center justify-between transition-colors ${currentButtonStyle}`}
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
                                <span className="font-medium" style={{ fontFamily }}>{link.title}</span>
                              </div>
                              <ExternalLink className="w-4 h-4 opacity-70" />
                            </motion.a>
                          );
                        })}
                    </div>

                    {/* Shop section */}
                    {(data?.products || []).filter(p => p.active).length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className={`font-semibold ${currentTextColor}`} style={{ fontFamily }}>Shop</h3>
                          <button className={`text-sm ${currentTextColor === 'text-white' ? 'text-white/80' : 'text-purple-600'}`}>View all</button>
                        </div>
                        <div className="space-y-3">
                          {(data.products || [])
                            .filter(p => p.active)
                            .slice(0, 3)
                            .map((product) => (
                              <motion.a
                                key={product.id}
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block rounded-lg p-3 hover:opacity-80 transition-colors ${currentTextColor === 'text-white' ? 'bg-white/10' : 'bg-purple-50'}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-white rounded-lg overflow-hidden relative">
                                    {product.image ? (
                                      <img src={product.image} alt={product.title || 'Product'} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-gray-100" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm truncate ${currentTextColor}`} style={{ fontFamily }}>{product.title}</p>
                                    <p className={`text-xs ${currentTextColor === 'text-white' ? 'text-white/70' : 'text-gray-500'}`}>{product.brand || 'Unknown'}</p>
                                    <p className="text-xs font-semibold text-purple-600">${(Number(product.price) || 0).toFixed(2)}</p>
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

                    {/* Hide logo notice */}
                    {!hideVizitlinkFooter && (
                      <div className="mt-4 text-center">
                        <div className="flex items-center justify-center space-x-1 text-xs opacity-70">
                          <Lock className="w-3 h-3" />
                          <span>Hide VizitLink logo</span>
                          <span className="text-purple-200">🔒</span>
                        </div>
                      </div>
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
