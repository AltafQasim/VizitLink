import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad, SiLinktree } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F', defaultUrl: 'https://instagram.com/' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000', defaultUrl: 'https://youtube.com/' },
  { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: '#1DA1F2', defaultUrl: 'https://twitter.com/' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: '#1877F2', defaultUrl: 'https://facebook.com/' },
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2', defaultUrl: 'https://linkedin.com/in/' },
  { id: 'threads', name: 'Threads', icon: SiThreads, color: '#000000', defaultUrl: 'https://threads.net/@' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000000', defaultUrl: 'https://tiktok.com/@' },
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', defaultUrl: 'https://wa.me/' },
  { id: 'snapchat', name: 'Snapchat', icon: FaSnapchatGhost, color: '#FFFC00', defaultUrl: 'https://snapchat.com/add/' },
  { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: '#E60023', defaultUrl: 'https://pinterest.com/' },
  { id: 'reddit', name: 'Reddit', icon: FaReddit, color: '#FF4500', defaultUrl: 'https://reddit.com/user/' },
  { id: 'github', name: 'GitHub', icon: FaGithub, color: '#181717', defaultUrl: 'https://github.com/' },
  { id: 'dribbble', name: 'Dribbble', icon: FaDribbble, color: '#EA4C89', defaultUrl: 'https://dribbble.com/' },
  { id: 'behance', name: 'Behance', icon: FaBehance, color: '#0057FF', defaultUrl: 'https://behance.net/' },
  { id: 'medium', name: 'Medium', icon: FaMedium, color: '#000000', defaultUrl: 'https://medium.com/@' },
  { id: 'spotify', name: 'Spotify', icon: FaSpotify, color: '#1DB954', defaultUrl: 'https://open.spotify.com/user/' },
  { id: 'soundcloud', name: 'SoundCloud', icon: FaSoundcloud, color: '#FF8800', defaultUrl: 'https://soundcloud.com/' },
  { id: 'twitch', name: 'Twitch', icon: FaTwitch, color: '#9146FF', defaultUrl: 'https://twitch.tv/' },
  { id: 'discord', name: 'Discord', icon: FaDiscord, color: '#5865F2', defaultUrl: 'https://discord.gg/' },
  { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: '#2CA5E0', defaultUrl: 'https://t.me/' },
  { id: 'email', name: 'Email', icon: MdEmail, color: '#EA4335', defaultUrl: 'mailto:' },
  { id: 'onlyfans', name: 'OnlyFans', icon: SiOnlyfans, color: '#00B0FF', defaultUrl: 'https://onlyfans.com/' },
  { id: 'substack', name: 'Substack', icon: SiSubstack, color: '#FF6719', defaultUrl: 'https://substack.com/' },
  { id: 'buymeacoffee', name: 'Buy Me a Coffee', icon: SiBuymeacoffee, color: '#FFDD00', defaultUrl: 'https://buymeacoffee.com/' },
  { id: 'patreon', name: 'Patreon', icon: SiPatreon, color: '#FF424D', defaultUrl: 'https://patreon.com/' },
  { id: 'etsy', name: 'Etsy', icon: SiEtsy, color: '#F16521', defaultUrl: 'https://etsy.com/shop/' },
  { id: 'amazon', name: 'Amazon', icon: SiAmazon, color: '#FF9900', defaultUrl: 'https://amazon.com/' },
  { id: 'shopify', name: 'Shopify', icon: SiShopify, color: '#7AB55C', defaultUrl: 'https://shopify.com/' },
  { id: 'gumroad', name: 'Gumroad', icon: SiGumroad, color: '#FF9000', defaultUrl: 'https://gumroad.com/' },
  { id: 'linktree', name: 'Linktree', icon: SiLinktree, color: '#00DA00', defaultUrl: 'https://linktr.ee/' },
  { id: 'website', name: 'Website', icon: FaGlobe, color: '#4A5568', defaultUrl: 'https://' },
];

export default function AddSocialLinkModal({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState('selectIcon');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');

  const filteredPlatforms = socialPlatforms.filter(platform =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (platform) => {
    setSelectedPlatform(platform);
    setLinkUrl(platform.defaultUrl);
    setStep('enterUrl');
  };

  const handleSave = () => {
    if (selectedPlatform && linkUrl) {
      onSave({
        title: selectedPlatform.name,
        url: linkUrl,
        icon: selectedPlatform.id, // Store the ID to map to icon component later
        active: true,
      });
      resetModal();
    }
  };

  const handleCancel = () => {
    if (step === 'enterUrl') {
      setStep('selectIcon');
      setLinkUrl('');
    } else {
      resetModal();
    }
  };

  const resetModal = () => {
    setStep('selectIcon');
    setSearchTerm('');
    setSelectedPlatform(null);
    setLinkUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel} >
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold">
            {step === 'selectIcon' ? 'Choose Platform' : 'Enter URL'}
          </DialogTitle>
          <DialogDescription>
            {step === 'selectIcon' 
              ? 'Select a social media platform to add to your VizitLink'
              : `Enter the URL for your ${selectedPlatform?.name} profile`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'selectIcon' ? (
              <motion.div
                key="selectIcon"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Search */}
                <div className="relative">
                  <Input
                    placeholder="Search platforms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Platform Grid */}
                <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                  {filteredPlatforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => handleIconSelect(platform)}
                        className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: platform.color + '20' }}
                        >
                          <IconComponent 
                            className="w-6 h-6" 
                            style={{ color: platform.color }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 text-center leading-tight">
                          {platform.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="enterUrl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
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
                    <p className="text-sm text-gray-500">Enter your profile URL</p>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-gray-700">
                    Profile URL
                  </label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!linkUrl.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Add Link
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
