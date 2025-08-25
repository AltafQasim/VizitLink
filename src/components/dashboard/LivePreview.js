"use client";

import { motion } from 'framer-motion';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Eye, 
  EyeOff, 
  Lock,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad, SiLinktree } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import Link from 'next/link';

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

export default function LivePreview() {
  const { data } = useDashboard();

  console.log({data})

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex w-[420px] bg-gray-50 border-l border-gray-200 p-6 flex-col"
    >
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Live Preview</h3>
        <p className="text-sm text-gray-500">See how your VizitLink looks to visitors</p>
      </div>

      {/* Mobile mockup */}
      <div className="flex items-center justify-center">
        <div className="bg-black rounded-3xl shadow-2xl p-4 w-full max-w-xs">
          {/* Status bar */}
          <div className="flex justify-between items-center mb-4 text-white text-xs">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
            {/* Profile */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
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
            {(data.products || []).filter(p => p.active).length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Shop</h3>
                  <button className="text-sm text-purple-600">View all</button>
                </div>
                <div className="space-y-3">
                  {(data.products || [])
                    .filter(p => p.active)
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
                          <div className="w-12 h-12 bg-white rounded-lg overflow-hidden relative">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.title || 'Product'}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{product.title}</p>
                            <p className="text-sm text-gray-500">{product.brand || 'Unknown'}</p>
                            <p className="text-sm font-semibold text-purple-600">${(Number(product.price) || 0).toFixed(2)}</p>
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
                  return(
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ color: socialColorsMap[link.icon] || socialColorsMap.default }}
                    />
                  </Link>
                )})}
            </div>
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
