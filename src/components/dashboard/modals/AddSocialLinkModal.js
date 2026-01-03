import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { CheckCircle, AlertCircle, ExternalLink, X } from 'lucide-react';
import { countryCodes, getDefaultCountryFromIP } from '../../../lib/countryCodes';

// Helper function to generate URL from input
const generateUrl = (platformId, input) => {
  const trimmed = input.trim();
  if (!trimmed) return '';
  
  // Remove @ if present
  const cleanInput = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  
  switch (platformId) {
    case 'instagram':
      return `https://instagram.com/${cleanInput}`;
    case 'youtube':
      return `https://youtube.com/@${cleanInput}`;
    case 'twitter':
      return `https://twitter.com/${cleanInput}`;
    case 'facebook':
      return `https://facebook.com/${cleanInput}`;
    case 'linkedin':
      return `https://linkedin.com/in/${cleanInput}`;
    case 'threads':
      return `https://threads.net/@${cleanInput}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanInput}`;
    case 'whatsapp':
      // Remove all non-digits
      const phoneNumber = cleanInput.replace(/\D/g, '');
      return phoneNumber ? `https://wa.me/${phoneNumber}` : '';
    case 'snapchat':
      return `https://snapchat.com/add/${cleanInput}`;
    case 'pinterest':
      return `https://pinterest.com/${cleanInput}`;
    case 'reddit':
      return `https://reddit.com/user/${cleanInput}`;
    case 'github':
      return `https://github.com/${cleanInput}`;
    case 'dribbble':
      return `https://dribbble.com/${cleanInput}`;
    case 'behance':
      return `https://behance.net/${cleanInput}`;
    case 'medium':
      return `https://medium.com/@${cleanInput}`;
    case 'spotify':
      return `https://open.spotify.com/user/${cleanInput}`;
    case 'soundcloud':
      return `https://soundcloud.com/${cleanInput}`;
    case 'twitch':
      return `https://twitch.tv/${cleanInput}`;
    case 'discord':
      return `https://discord.gg/${cleanInput}`;
    case 'telegram':
      return `https://t.me/${cleanInput}`;
    case 'email':
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(trimmed) ? `mailto:${trimmed}` : '';
    case 'onlyfans':
      return `https://onlyfans.com/${cleanInput}`;
    case 'substack':
      return `https://substack.com/@${cleanInput}`;
    case 'buymeacoffee':
      return `https://buymeacoffee.com/${cleanInput}`;
    case 'patreon':
      return `https://patreon.com/${cleanInput}`;
    case 'etsy':
      return `https://etsy.com/shop/${cleanInput}`;
    case 'amazon':
      return `https://amazon.com/author/${cleanInput}`;
    case 'shopify':
      return `https://shopify.com/store/${cleanInput}`;
    case 'gumroad':
      return `https://gumroad.com/${cleanInput}`;
    case 'website':
      // Website accepts full URL
      return trimmed.startsWith('http://') || trimmed.startsWith('https://') 
        ? trimmed 
        : `https://${trimmed}`;
    default:
      return trimmed;
  }
};

// Helper function to validate input
const validateInput = (platformId, input) => {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, message: 'This field is required' };
  }
  
  const cleanInput = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  
  switch (platformId) {
    case 'instagram':
    case 'twitter':
    case 'facebook':
    case 'snapchat':
    case 'pinterest':
    case 'github':
    case 'dribbble':
    case 'behance':
    case 'soundcloud':
    case 'twitch':
    case 'telegram':
    case 'onlyfans':
    case 'buymeacoffee':
    case 'patreon':
    case 'gumroad':
      // Username validation: alphanumeric, dots, underscores, hyphens
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanInput)) {
        return { isValid: false, message: 'Invalid username format' };
      }
      if (cleanInput.length < 1) {
        return { isValid: false, message: 'Username is too short' };
      }
      return { isValid: true, message: '' };
    
    case 'youtube':
    case 'threads':
    case 'tiktok':
    case 'substack':
      // Channel name validation
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanInput)) {
        return { isValid: false, message: 'Invalid channel name format' };
      }
      if (cleanInput.length < 1) {
        return { isValid: false, message: 'Channel name is too short' };
      }
      return { isValid: true, message: '' };
    
    case 'linkedin':
      // LinkedIn username validation
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanInput)) {
        return { isValid: false, message: 'Invalid LinkedIn username format' };
      }
      return { isValid: true, message: '' };
    
    case 'reddit':
      // Reddit username validation
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanInput)) {
        return { isValid: false, message: 'Invalid Reddit username format' };
      }
      return { isValid: true, message: '' };
    
    case 'medium':
      // Medium username validation
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanInput)) {
        return { isValid: false, message: 'Invalid Medium username format' };
      }
      return { isValid: true, message: '' };
    
    case 'spotify':
      // Spotify username validation
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanInput)) {
        return { isValid: false, message: 'Invalid Spotify username format' };
      }
      return { isValid: true, message: '' };
    
    case 'discord':
      // Discord invite code validation
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanInput)) {
        return { isValid: false, message: 'Invalid Discord invite code format' };
      }
      return { isValid: true, message: '' };
    
    case 'whatsapp':
      // Phone number validation (digits only, 4-15 digits without country code)
      const phoneNumber = trimmed.replace(/\D/g, '');
      if (phoneNumber.length < 4 || phoneNumber.length > 15) {
        return { isValid: false, message: 'Please enter a valid phone number (4-15 digits)' };
      }
      return { isValid: true, message: '' };
    
    case 'email':
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return { isValid: false, message: 'Please enter a valid email address' };
      }
      return { isValid: true, message: '' };
    
    case 'etsy':
    case 'amazon':
    case 'shopify':
      // Shop/store name validation
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanInput)) {
        return { isValid: false, message: 'Invalid shop/store name format' };
      }
      return { isValid: true, message: '' };
    
    case 'website':
      // Website URL validation
      const websiteRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!websiteRegex.test(trimmed)) {
        return { isValid: false, message: 'Please enter a valid website URL' };
      }
      return { isValid: true, message: '' };
    
    default:
      return { isValid: true, message: '' };
  }
};

const socialPlatforms = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: FaInstagram, 
    color: '#E4405F', 
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'channel name',
    examplePlaceholder: '@channelname or channelname',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: '@johndoe or johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: '@johndoe or johndoe',
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
    inputPlaceholder: 'phone number',
    examplePlaceholder: '1234567890',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'invite code',
    examplePlaceholder: 'abc123',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'email address',
    examplePlaceholder: 'your@email.com',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: '@johndoe or johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'shop name',
    examplePlaceholder: 'myshop',
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
    inputPlaceholder: 'author name',
    examplePlaceholder: 'johndoe',
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
    inputPlaceholder: 'store name',
    examplePlaceholder: 'mystore',
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
    inputPlaceholder: 'username',
    examplePlaceholder: 'johndoe',
    placeholder: 'https://gumroad.com/username',
    validation: (url) => {
      const gumroadRegex = /^https?:\/\/(www\.)?gumroad\.com\/[a-zA-Z0-9._-]+\/?$/;
      return gumroadRegex.test(url);
    }
  },
  { 
    id: 'website', 
    name: 'Website', 
    icon: FaGlobe, 
    color: '#4A5568', 
    inputPlaceholder: 'website URL',
    examplePlaceholder: 'yourwebsite.com',
    placeholder: 'https://yourwebsite.com',
    validation: (url) => {
      const websiteRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
      return websiteRegex.test(url);
    }
  },
];

export default function AddSocialLinkModal({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState('selectIcon');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [isLoadingCountry, setIsLoadingCountry] = useState(false);

  // Load default country from IP when WhatsApp is selected
  useEffect(() => {
    if (selectedPlatform?.id === 'whatsapp' && !selectedCountryCode) {
      setIsLoadingCountry(true);
      getDefaultCountryFromIP().then(country => {
        setSelectedCountryCode(country);
        setIsLoadingCountry(false);
      });
    }
  }, [selectedPlatform, selectedCountryCode]);

  const filteredPlatforms = socialPlatforms.filter(platform =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (platform) => {
    setSelectedPlatform(platform);
    setInputValue('');
    setIsValid(true);
    setValidationMessage('');
    setSelectedCountryCode(null); // Reset country code
    setStep('enterUrl');
  };

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInputValue(newInput);
    
    // Validate input
    const validation = validateInput(selectedPlatform.id, newInput);
    setIsValid(validation.isValid);
    setValidationMessage(validation.message);
  };

  const handleSave = () => {
    if (selectedPlatform && inputValue.trim() && isValid) {
      // Generate URL from input
      let generatedUrl;
      if (selectedPlatform.id === 'whatsapp' && selectedCountryCode) {
        // For WhatsApp, combine country code with phone number
        const phoneNumber = inputValue.replace(/\D/g, '');
        const fullNumber = selectedCountryCode.dialCode.replace('+', '') + phoneNumber;
        generatedUrl = `https://wa.me/${fullNumber}`;
      } else {
        generatedUrl = generateUrl(selectedPlatform.id, inputValue);
      }
      
      if (generatedUrl && selectedPlatform.validation(generatedUrl)) {
        onSave({
          title: selectedPlatform.name,
          url: generatedUrl,
          icon: selectedPlatform.id,
          active: true,
        });
        resetModal();
      } else {
        setIsValid(false);
        setValidationMessage(`Invalid ${selectedPlatform.name} ${selectedPlatform.inputPlaceholder || 'input'}`);
      }
    }
  };

  const handleCancel = () => {
    if (step === 'enterUrl') {
      setStep('selectIcon');
      setInputValue('');
      setIsValid(true);
      setValidationMessage('');
    } else {
      resetModal();
    }
  };

  const resetModal = () => {
    setStep('selectIcon');
    setSearchTerm('');
    setSelectedPlatform(null);
    setInputValue('');
    setIsValid(true);
    setValidationMessage('');
    setSelectedCountryCode(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel} >
      <DialogContent className="p-0 overflow-hidden sm:max-w-5xl w-[100vw] sm:w-2xl h-[100dvh] sm:h-auto sm:rounded-xl rounded-none">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className='text-left'>
              <DialogTitle className="text-xl font-semibold">
                {step === 'selectIcon' ? 'Choose Platform' : 'Enter URL'}
              </DialogTitle>
              <DialogDescription>
                {step === 'selectIcon' 
                  ? 'Select a social media platform to add to your VizitLink'
                  : `Enter the URL for your ${selectedPlatform?.name} profile`
                }
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetModal}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 max-h-[calc(100dvh-120px)] sm:max-h-none overflow-y-auto">
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

                {/* Input Field with Validation */}
                <div className="space-y-2">
                  <label htmlFor="input" className="text-sm font-medium text-gray-700">
                    {selectedPlatform.inputPlaceholder ? 
                      selectedPlatform.inputPlaceholder.charAt(0).toUpperCase() + selectedPlatform.inputPlaceholder.slice(1) 
                      : 'Enter your information'}
                  </label>
                  {selectedPlatform.id === 'whatsapp' ? (
                    <div className="flex gap-2">
                      <Select
                        value={selectedCountryCode?.code || ''}
                        onValueChange={(value) => {
                          const country = countryCodes.find(c => c.code === value);
                          setSelectedCountryCode(country);
                        }}
                        disabled={isLoadingCountry}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder={isLoadingCountry ? "Loading..." : "Select country"}>
                            {selectedCountryCode && (
                              <span className="flex items-center gap-2">
                                <span>{selectedCountryCode.flag}</span>
                                <span>{selectedCountryCode.dialCode}</span>
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {countryCodes.map((country,index) => (
                            <SelectItem key={index} value={country.code}>
                              <span className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span>{country.name}</span>
                                <span className="text-muted-foreground ml-auto">{country.dialCode}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Input
                          id="input"
                          type="tel"
                          placeholder="Phone number"
                          value={inputValue}
                          onChange={handleInputChange}
                          className={`w-full pr-10 ${
                            inputValue && !isValid 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                              : inputValue && isValid 
                                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                                : ''
                          }`}
                        />
                        {inputValue && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isValid ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        id="input"
                        type={selectedPlatform.id === 'email' ? 'email' : 'text'}
                        placeholder={selectedPlatform.inputPlaceholder || selectedPlatform.examplePlaceholder}
                        value={inputValue}
                        onChange={handleInputChange}
                        className={`w-full pr-10 ${
                          inputValue && !isValid 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                            : inputValue && isValid 
                              ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                              : ''
                        }`}
                      />
                      {inputValue && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isValid ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
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

                  {/* Example */}
                  {selectedPlatform.examplePlaceholder && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <ExternalLink className="w-3 h-3" />
                      <span>Example: {selectedPlatform.examplePlaceholder}</span>
                    </div>
                  )}
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
                    disabled={!inputValue.trim() || !isValid || (selectedPlatform?.id === 'whatsapp' && !selectedCountryCode)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
