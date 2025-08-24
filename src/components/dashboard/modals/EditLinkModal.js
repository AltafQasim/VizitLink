"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad, SiLinktree } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const socialPlatforms = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: FaInstagram, 
    color: '#E4405F', 
    placeholder: 'https://instagram.com/username',
    validation: (url) => {
      const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
      return instagramRegex.test(url);
    }
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: FaYoutube, 
    color: '#FF0000', 
    placeholder: 'https://youtube.com/@channelname',
    validation: (url) => {
      const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/(channel\/|c\/|user\/|@[a-zA-Z0-9._-]+)|youtu\.be\/[a-zA-Z0-9._-]+)$/;
      return youtubeRegex.test(url);
    }
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: FaTwitter, 
    color: '#1DA1F2', 
    placeholder: 'https://twitter.com/username',
    validation: (url) => {
      const twitterRegex = /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9._]+\/?$/;
      return twitterRegex.test(url);
    }
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: FaFacebook, 
    color: '#1877F2', 
    placeholder: 'https://facebook.com/username',
    validation: (url) => {
      const facebookRegex = /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._]+\/?$/;
      return facebookRegex.test(url);
    }
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: FaLinkedin, 
    color: '#0A66C2', 
    placeholder: 'https://linkedin.com/in/username',
    validation: (url) => {
      const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9._-]+\/?$/;
      return linkedinRegex.test(url);
    }
  },
  { 
    id: 'threads', 
    name: 'Threads', 
    icon: SiThreads, 
    color: '#000000', 
    placeholder: 'https://threads.net/@username',
    validation: (url) => {
      const threadsRegex = /^https?:\/\/(www\.)?threads\.net\/@[a-zA-Z0-9._]+\/?$/;
      return threadsRegex.test(url);
    }
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: FaTiktok, 
    color: '#000000', 
    placeholder: 'https://tiktok.com/@username',
    validation: (url) => {
      const tiktokRegex = /^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._]+\/?$/;
      return tiktokRegex.test(url);
    }
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    icon: FaWhatsapp, 
    color: '#25D366', 
    placeholder: 'https://wa.me/1234567890',
    validation: (url) => {
      const whatsappRegex = /^https?:\/\/(www\.)?wa\.me\/[0-9]+\/?$/;
      return whatsappRegex.test(url);
    }
  },
  { 
    id: 'snapchat', 
    name: 'Snapchat', 
    icon: FaSnapchatGhost, 
    color: '#FFFC00', 
    placeholder: 'https://snapchat.com/add/username',
    validation: (url) => {
      const snapchatRegex = /^https?:\/\/(www\.)?snapchat\.com\/add\/[a-zA-Z0-9._]+\/?$/;
      return snapchatRegex.test(url);
    }
  },
  { 
    id: 'pinterest', 
    name: 'Pinterest', 
    icon: FaPinterest, 
    color: '#E60023', 
    placeholder: 'https://pinterest.com/username',
    validation: (url) => {
      const pinterestRegex = /^https?:\/\/(www\.)?pinterest\.com\/[a-zA-Z0-9._]+\/?$/;
      return pinterestRegex.test(url);
    }
  },
  { 
    id: 'reddit', 
    name: 'Reddit', 
    icon: FaReddit, 
    color: '#FF4500', 
    placeholder: 'https://reddit.com/user/username',
    validation: (url) => {
      const redditRegex = /^https?:\/\/(www\.)?reddit\.com\/user\/[a-zA-Z0-9._]+\/?$/;
      return redditRegex.test(url);
    }
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    icon: FaGithub, 
    color: '#181717', 
    placeholder: 'https://github.com/username',
    validation: (url) => {
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9._-]+\/?$/;
      return githubRegex.test(url);
    }
  },
  { 
    id: 'dribbble', 
    name: 'Dribbble', 
    icon: FaDribbble, 
    color: '#EA4C89', 
    placeholder: 'https://dribbble.com/username',
    validation: (url) => {
      const dribbbleRegex = /^https?:\/\/(www\.)?dribbble\.com\/[a-zA-Z0-9._-]+\/?$/;
      return dribbbleRegex.test(url);
    }
  },
  { 
    id: 'behance', 
    name: 'Behance', 
    icon: FaBehance, 
    color: '#0057FF', 
    placeholder: 'https://behance.net/username',
    validation: (url) => {
      const behanceRegex = /^https?:\/\/(www\.)?behance\.net\/[a-zA-Z0-9._-]+\/?$/;
      return behanceRegex.test(url);
    }
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    icon: FaMedium, 
    color: '#000000', 
    placeholder: 'https://medium.com/@username',
    validation: (url) => {
      const mediumRegex = /^https?:\/\/(www\.)?medium\.com\/@[a-zA-Z0-9._-]+\/?$/;
      return mediumRegex.test(url);
    }
  },
  { 
    id: 'spotify', 
    name: 'Spotify', 
    icon: FaSpotify, 
    color: '#1DB954', 
    placeholder: 'https://open.spotify.com/user/username',
    validation: (url) => {
      const spotifyRegex = /^https?:\/\/(www\.)?open\.spotify\.com\/user\/[a-zA-Z0-9._-]+\/?$/;
      return spotifyRegex.test(url);
    }
  },
  { 
    id: 'soundcloud', 
    name: 'SoundCloud', 
    icon: FaSoundcloud, 
    color: '#FF8800', 
    placeholder: 'https://soundcloud.com/username',
    validation: (url) => {
      const soundcloudRegex = /^https?:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9._-]+\/?$/;
      return soundcloudRegex.test(url);
    }
  },
  { 
    id: 'twitch', 
    name: 'Twitch', 
    icon: FaTwitch, 
    color: '#9146FF', 
    placeholder: 'https://twitch.tv/username',
    validation: (url) => {
      const twitchRegex = /^https?:\/\/(www\.)?twitch\.tv\/[a-zA-Z0-9._-]+\/?$/;
      return twitchRegex.test(url);
    }
  },
  { 
    id: 'discord', 
    name: 'Discord', 
    icon: FaDiscord, 
    color: '#5865F2', 
    placeholder: 'https://discord.gg/invitecode',
    validation: (url) => {
      const discordRegex = /^https?:\/\/(www\.)?discord\.gg\/[a-zA-Z0-9._-]+\/?$/;
      return discordRegex.test(url);
    }
  },
  { 
    id: 'telegram', 
    name: 'Telegram', 
    icon: FaTelegram, 
    color: '#2CA5E0', 
    placeholder: 'https://t.me/username',
    validation: (url) => {
      const telegramRegex = /^https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9._-]+\/?$/;
      return telegramRegex.test(url);
    }
  },
  { 
    id: 'email', 
    name: 'Email', 
    icon: MdEmail, 
    color: '#EA4335', 
    placeholder: 'mailto:your@email.com',
    validation: (url) => {
      const emailRegex = /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(url);
    }
  },
  { 
    id: 'onlyfans', 
    name: 'OnlyFans', 
    icon: SiOnlyfans, 
    color: '#00B0FF', 
    placeholder: 'https://onlyfans.com/username',
    validation: (url) => {
      const onlyfansRegex = /^https?:\/\/(www\.)?onlyfans\.com\/[a-zA-Z0-9._-]+\/?$/;
      return onlyfansRegex.test(url);
    }
  },
  { 
    id: 'substack', 
    name: 'Substack', 
    icon: SiSubstack, 
    color: '#FF6719', 
    placeholder: 'https://substack.com/@username',
    validation: (url) => {
      const substackRegex = /^https?:\/\/(www\.)?substack\.com\/@[a-zA-Z0-9._-]+\/?$/;
      return substackRegex.test(url);
    }
  },
  { 
    id: 'buymeacoffee', 
    name: 'Buy Me a Coffee', 
    icon: SiBuymeacoffee, 
    color: '#FFDD00', 
    placeholder: 'https://buymeacoffee.com/username',
    validation: (url) => {
      const buymeacoffeeRegex = /^https?:\/\/(www\.)?buymeacoffee\.com\/[a-zA-Z0-9._-]+\/?$/;
      return buymeacoffeeRegex.test(url);
    }
  },
  { 
    id: 'patreon', 
    name: 'Patreon', 
    icon: SiPatreon, 
    color: '#FF424D', 
    placeholder: 'https://patreon.com/username',
    validation: (url) => {
      const patreonRegex = /^https?:\/\/(www\.)?patreon\.com\/[a-zA-Z0-9._-]+\/?$/;
      return patreonRegex.test(url);
    }
  },
  { 
    id: 'etsy', 
    name: 'Etsy', 
    icon: SiEtsy, 
    color: '#F16521', 
    placeholder: 'https://etsy.com/shop/shopname',
    validation: (url) => {
      const etsyRegex = /^https?:\/\/(www\.)?etsy\.com\/shop\/[a-zA-Z0-9._-]+\/?$/;
      return etsyRegex.test(url);
    }
  },
  { 
    id: 'amazon', 
    name: 'Amazon', 
    icon: SiAmazon, 
    color: '#FF9900', 
    placeholder: 'https://amazon.com/author/username',
    validation: (url) => {
      const amazonRegex = /^https?:\/\/(www\.)?amazon\.com\/author\/[a-zA-Z0-9._-]+\/?$/;
      return amazonRegex.test(url);
    }
  },
  { 
    id: 'shopify', 
    name: 'Shopify', 
    icon: SiShopify, 
    color: '#7AB55C', 
    placeholder: 'https://shopify.com/store/storename',
    validation: (url) => {
      const shopifyRegex = /^https?:\/\/(www\.)?shopify\.com\/store\/[a-zA-Z0-9._-]+\/?$/;
      return shopifyRegex.test(url);
    }
  },
  { 
    id: 'gumroad', 
    name: 'Gumroad', 
    icon: SiGumroad, 
    color: '#FF9000', 
    placeholder: 'https://gumroad.com/username',
    validation: (url) => {
      const gumroadRegex = /^https?:\/\/(www\.)?gumroad\.com\/[a-zA-Z0-9._-]+\/?$/;
      return gumroadRegex.test(url);
    }
  },
  { 
    id: 'linktree', 
    name: 'Linktree', 
    icon: SiLinktree, 
    color: '#00DA00', 
    placeholder: 'https://linktr.ee/username',
    validation: (url) => {
      const linktreeRegex = /^https?:\/\/(www\.)?linktr\.ee\/[a-zA-Z0-9._-]+\/?$/;
      return linktreeRegex.test(url);
    }
  },
  { 
    id: 'website', 
    name: 'Website', 
    icon: FaGlobe, 
    color: '#4A5568', 
    placeholder: 'https://yourwebsite.com',
    validation: (url) => {
      const websiteRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
      return websiteRegex.test(url);
    }
  },
];

export default function EditLinkModal({ isOpen, onClose, onSave, link }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  // Initialize form when link changes
  useEffect(() => {
    if (link) {
      setLinkUrl(link.url);
      const platform = socialPlatforms.find(p => p.id === link.icon);
      if (platform) {
        setSelectedPlatform(platform);
        validateUrl(link.url, platform);
      }
    }
  }, [link]);

  const validateUrl = (url, platform) => {
    if (!url.trim()) {
      setIsValid(false);
      setValidationMessage('URL is required');
      return;
    }

    if (!platform.validation(url)) {
      setIsValid(false);
      setValidationMessage(`Please enter a valid ${platform.name} URL`);
      return;
    }

    setIsValid(true);
    setValidationMessage('');
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setLinkUrl(newUrl);
    validateUrl(newUrl, selectedPlatform);
  };

  const handleSave = () => {
    if (selectedPlatform && linkUrl && isValid && link) {
      const updatedLink = {
        ...link,
        url: linkUrl,
      };
      onSave(updatedLink);
      resetModal();
    }
  };

  const resetModal = () => {
    setLinkUrl('');
    setSelectedPlatform(null);
    setIsValid(true);
    setValidationMessage('');
    onClose();
  };

  if (!link || !selectedPlatform) return null;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold">
            Edit Link
          </DialogTitle>
          <DialogDescription>
            Update your {selectedPlatform.name} profile URL
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Selected Platform Display */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: selectedPlatform.color + '20' }}
              >
                <selectedPlatform.icon 
                  className="w-5 h-5" 
                  style={{ color: selectedPlatform.color }}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedPlatform.name}</h3>
                <p className="text-sm text-gray-500">Update your profile URL</p>
              </div>
            </div>

            {/* URL Input with Validation */}
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium text-gray-700">
                Profile URL
              </label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  placeholder={selectedPlatform.placeholder}
                  value={linkUrl}
                  onChange={handleUrlChange}
                  className={`w-full pr-10 ${
                    linkUrl && !isValid 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : linkUrl && isValid 
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : ''
                  }`}
                />
                {linkUrl && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Validation Message */}
              {validationMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center space-x-2 text-sm ${
                    isValid ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isValid ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{validationMessage}</span>
                </motion.div>
              )}

              {/* Example URL */}
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ExternalLink className="w-3 h-3" />
                <span>Example: {selectedPlatform.placeholder}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={resetModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!linkUrl.trim() || !isValid}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Update Link
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
