"use client";

import { motion } from 'framer-motion';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Eye, 
  EyeOff, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad, SiLinktree } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import Link from 'next/link';

const socialIconsMap: { [key: string]: any } = {
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

export default function LivePreview() {
  const { data } = useDashboard();

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex w-96 bg-gray-50 border-l border-gray-200 p-6 flex-col"
    >
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Live Preview</h3>
        <p className="text-sm text-gray-500">See how your VizitLink looks to visitors</p>
      </div>

      {/* Mobile mockup */}
      <div className="flex-1 flex items-center justify-center">
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
                          <IconComponent className="w-5 h-5" />
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
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-lg">🛍️</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">See Full Shop</p>
                      <p className="text-sm text-gray-500">
                        {data.products.filter(p => p.active).length} Product
                        {data.products.filter(p => p.active).length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
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
                    <IconComponent className="w-5 h-5" />
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
