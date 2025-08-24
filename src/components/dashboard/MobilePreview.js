"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Eye, 
  Lock,
  Smartphone,
  X,
  ExternalLink
} from 'lucide-react';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad, SiLinktree } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

const socialIconsMap = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  twitter: FaTwitter,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  threads: SiThreads,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
  snapchat: FaSnapchatGhost,
  pinterest: FaPinterest,
  reddit: FaReddit,
  github: FaGithub,
  dribbble: FaDribbble,
  behance: FaBehance,
  medium: FaMedium,
  spotify: FaSpotify,
  soundcloud: FaSoundcloud,
  twitch: FaTwitch,
  discord: FaDiscord,
  telegram: FaTelegram,
  email: MdEmail,
  onlyfans: SiOnlyfans,
  substack: SiSubstack,
  buymeacoffee: SiBuymeacoffee,
  patreon: SiPatreon,
  etsy: SiEtsy,
  amazon: SiAmazon,
  shopify: SiShopify,
  gumroad: SiGumroad,
  linktree: SiLinktree,
  website: FaGlobe,
  default: FaGlobe,
};

const socialColorsMap = {
  instagram: '#E4405F',
  youtube: '#FF0000',
  twitter: '#1DA1F2',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  threads: '#000000',
  tiktok: '#000000',
  whatsapp: '#25D366',
  snapchat: '#FFFC00',
  pinterest: '#E60023',
  reddit: '#FF4500',
  github: '#181717',
  dribbble: '#EA4C89',
  behance: '#0057FF',
  medium: '#000000',
  spotify: '#1DB954',
  soundcloud: '#FF8800',
  twitch: '#9146FF',
  discord: '#5865F2',
  telegram: '#2CA5E0',
  email: '#EA4335',
  onlyfans: '#00B0FF',
  substack: '#FF6719',
  buymeacoffee: '#FFDD00',
  patreon: '#FF424D',
  etsy: '#F16521',
  amazon: '#FF9900',
  shopify: '#7AB55C',
  gumroad: '#FF9000',
  linktree: '#00DA00',
  website: '#4A5568',
  default: '#4A5568',
};

export default function MobilePreview() {
  const { data } = useDashboard();
  const [showPreview, setShowPreview] = useState(false);

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
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm h-[600px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Status bar */}
              <div className="bg-black text-white px-4 py-2 flex justify-between items-center text-xs">
                <span>9:41</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white p-4 h-full overflow-y-auto">
                {/* Profile */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {data.profile.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {data.profile.displayName}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {data.profile.bio}
                  </p>
                </div>

                {/* Links */}
                <div className="space-y-3">
                  {data.links
                    .filter(link => link.active)
                    .sort((a, b) => a.order - b.order)
                    .map((link) => {
                      const IconComponent = socialIconsMap[link.icon] || socialIconsMap.default;
                      
                      return (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-3 flex items-center justify-between transition-colors"
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
                            <span className="font-medium text-gray-900">{link.title}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </motion.a>
                      );
                    })}
                </div>

                {/* Shop section */}
                {data.products.filter(p => p.active).length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Shop</h3>
                      <button className="text-sm text-purple-600">View all</button>
                    </div>
                    <div className="space-y-3">
                      {data.products
                        .filter(p => p.active)
                        .slice(0, 2)
                        .map((product) => (
                          <motion.a
                            key={product.id}
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-purple-50 rounded-lg p-3 hover:bg-purple-100 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-xs truncate">{product.title}</p>
                                <p className="text-xs text-gray-500">{product.brand}</p>
                                <p className="text-xs font-semibold text-purple-600">
                                  ${product.price?.toFixed(2) || '0.00'}
                                </p>
                              </div>
                            </div>
                          </motion.a>
                        ))}
                    </div>
                  </div>
                )}

                {/* Social icons */}
                <div className="mt-6 flex justify-center space-x-4">
                  {data.links
                    .filter(link => link.active)
                    .slice(0, 5)
                    .map((link) => {
                      const IconComponent = socialIconsMap[link.icon] || socialIconsMap.default;
                      return (
                        <div
                          key={link.id}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
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
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                    <Lock className="w-3 h-3" />
                    <span>Hide VizitLink logo</span>
                    <span className="text-purple-600">🔒</span>
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
