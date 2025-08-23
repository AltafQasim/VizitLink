import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad, SiLinktree } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { Link } from '@/types/dashboard';

interface AddSocialLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLink: Omit<Link, 'id' | 'createdAt' | 'order'>) => void;
}

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

export default function AddSocialLinkModal({ isOpen, onClose, onSave }: AddSocialLinkModalProps) {
  const [step, setStep] = useState<'selectIcon' | 'enterUrl'>('selectIcon');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<typeof socialPlatforms[0] | null>(null);
  const [linkUrl, setLinkUrl] = useState('');

  const filteredPlatforms = socialPlatforms.filter(platform =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (platform: typeof socialPlatforms[0]) => {
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
        <AnimatePresence mode="wait">
          {step === 'selectIcon' && (
            <motion.div
              key="selectIcon"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold">Add Social Link</DialogTitle>
                <DialogDescription>Select a social media platform or website.</DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <div className="grid grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
                {filteredPlatforms.map(platform => (
                  <Button
                    key={platform.id}
                    variant="ghost"
                    className="flex flex-col items-center justify-center h-24 w-full p-2 text-center text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleIconSelect(platform)}
                  >
                    <platform.icon className="min-w-10 min-h-10 mb-2" style={{ color: platform.color }} />
                    <span className="text-xs font-medium truncate w-full">{platform.name}</span>
                  </Button>
                ))}
                {filteredPlatforms.length === 0 && (
                  <p className="col-span-3 text-center text-gray-500">No platforms found.</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 'enterUrl' && selectedPlatform && (
            <motion.div
              key="enterUrl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold">Add {selectedPlatform.name} Link</DialogTitle>
                <DialogDescription>Enter the URL for your {selectedPlatform.name} profile.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-3 mb-4">
                <selectedPlatform.icon className="w-8 h-8 flex-shrink-0" style={{ color: selectedPlatform.color }} />
                <Input
                  placeholder={`Enter ${selectedPlatform.name} URL`}
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button 
                  onClick={handleSave} 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!linkUrl.trim()}
                >
                  Save Link
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
