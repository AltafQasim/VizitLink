"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import {
    Share2,
    Sparkles,
    X,
    Link as LinkIcon,
    Facebook,
    MessageCircle,
    Linkedin,
    ExternalLink,
    Lock
} from 'lucide-react';
import { loadPublicProfileByUsername } from "../../lib/dashboardStorage";
import { socialIconsMap, socialColorsMap } from "../../lib/social";
import BrandLogo from "../../components/BrandLogo";
import { SiFacebook, SiLinkedin, SiMessenger, SiWhatsapp } from "react-icons/si";
import { BASE_URL } from "../../lib/constants";

export default function PublicProfilePage({ params }) {
    // Unwrap params using React.use() to fix the Next.js warning
    const unwrappedParams = React.use(params);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [usernameInput, setUsernameInput] = useState(''); // Add this state for username input

    // Handle copy to clipboard
    const handleCopyLink = () => {
        const profileUrl = `${window.location.origin}/${data?.profile?.username || unwrappedParams?.username}`;
        navigator.clipboard.writeText(profileUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    // Handle social sharing
    const handleSocialShare = (platform) => {
        const profileUrl = `${window.location.origin}/${data?.profile?.username || unwrappedParams?.username}`;
        const text = `Check out ${data?.profile?.displayName || unwrappedParams?.username}'s VizitLink profile!`;

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + profileUrl)}`,
            messenger: `fb-messenger://share/?link=${encodeURIComponent(profileUrl)}`,
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    useEffect(() => {
        const run = async () => {
            const username = unwrappedParams?.username;
            if (!username) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const loaded = await loadPublicProfileByUsername(username);
                if (loaded) {
                    setData(loaded);
                }
            } catch (_) {
                // Error handling
            } finally {
                setIsLoading(false);
            }
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unwrappedParams?.username]);

    const design = data?.design || {};
    const theme = design.theme || '';
    const wallpaper = design.wallpaper || '';
    const buttonStyle = design.buttonStyle || 'Minimal';
    const fontFamily = design.fontFamily || 'Inter';
    const hideVizitlinkFooter = design.hideVizitlinkFooter || false;

    useEffect(() => {
        if (wallpaper === 'Video' && design.wallpaperVideo) setIsVideoLoading(true);
        else setIsVideoLoading(false);
    }, [wallpaper, design.wallpaperVideo]);

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

    const wallpaperStyles = {
        'Hero': { background: 'bg-gradient-to-br from-blue-900 to-teal-400', textColor: 'text-white' },
        'Fill': { background: 'bg-gray-100', textColor: 'text-black' },
        'Gradient': { background: 'bg-gradient-to-br from-gray-400 to-gray-600', textColor: 'text-white' },
        'Blur': { background: 'bg-gradient-to-br from-blue-200 to-purple-200', textColor: 'text-black' },
        'Pattern': { background: 'bg-gradient-to-br from-blue-200 to-gray-300', textColor: 'text-black' },
        'Image': { background: 'bg-gradient-to-br from-orange-500 via-red-500 to-black', textColor: 'text-white' },
        'Video': { background: 'bg-gradient-to-br from-gray-600 to-gray-800', textColor: 'text-white' },
    };

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

    // Show loading skeleton if data is loading
    if (isLoading) {
        return (
            <div className="relative min-h-screen" style={{ background: '#21232a url(/profilebg.jpg) repeat 0 0' }}>
                <div className="relative sm:max-w-2xl mx-auto sm:px-4">
                    <div className="relative sm:rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
                        <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 h-screen">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-white/40 rounded-lg animate-pulse"></div>
                                    <div className="w-10 h-10 bg-white/40 rounded-lg animate-pulse"></div>
                                </div>
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-white/40 rounded-full mx-auto mb-3 animate-pulse"></div>
                                    <div className="h-6 w-48 bg-white/40 rounded mx-auto mb-2 animate-pulse"></div>
                                    <div className="h-4 w-64 bg-white/40 rounded mx-auto animate-pulse"></div>
                                </div>
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-full h-16 bg-white/40 rounded-3xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show not found if no data after loading
    if (!data || !data.profile) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4" style={{ background: '#21232a url(/profilebg.jpg) repeat 0 0' }}>
                <div className="text-center space-y-4 max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-white">Profile Not Found</h1>
                    <p className="text-white/80">
                        This profile doesn't exist or is currently unavailable.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/" className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen" style={{ background: '#21232a url(/profilebg.jpg) repeat 0 0' }}>
            <div className="relative sm:max-w-2xl mx-auto sm:px-4">
                <div className={`relative sm:rounded-2xl overflow-hidden ${currentBackground}`}>
                    {wallpaper === 'Image' && design.wallpaperImage && (
                        <img src={design.wallpaperImage} alt="Wallpaper" className="sm:rounded-3xl sm:px-4 fixed sm:max-w-2xl mx-auto inset-0 w-full h-full object-cover" />
                    )}
                    {wallpaper === 'Video' && design.wallpaperVideo && (
                        <>
                            <video
                                src={design.wallpaperVideo}
                                className="sm:rounded-[30px] sm:px-4 fixed sm:max-w-2xl mx-auto inset-0 w-full h-full object-cover"
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
                        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(Number(design.wallpaperTint || 0)) / 100})` }} />
                    )}

                    <div className="relative z-10 p-6 min-h-[90vh]">
                        {/* Top Icons - Brand and Share */}
                        <div className="flex items-center justify-between mb-4">
                            {/* Brand Mini Icon */}
                            <button
                                onClick={() => setShowBrandModal(true)}
                                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity hover:scale-110 active:scale-95"
                            >
                                <div className="rounded-lg p-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                    <BrandLogo showText={false} linkToHome={false} />
                                </div>
                            </button>

                            {/* Share Icon */}
                            <button
                                onClick={() => setShowShareModal(true)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${currentTextColor === 'text-white'
                                    ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                title="Share profile"
                            >
                                <Share2 className={`w-6 h-6 ${currentTextColor}`} />
                            </button>
                        </div>

                        {/* Profile */}
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                                {data?.profile?.avatar ? (
                                    <img src={data.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-white">
                                        {data?.profile?.displayName?.charAt(0).toUpperCase() || 'A'}
                                    </span>
                                )}
                            </div>
                            <h2 className={`text-lg font-bold mb-1 ${currentTextColor}`} style={{ fontFamily }}>
                                {data?.profile?.displayName || unwrappedParams?.username}
                            </h2>
                            <p className={`text-sm mb-3 ${currentTextColor === 'text-white' ? 'text-white/80' : 'text-gray-600'}`} style={{ fontFamily }}>
                                {data?.profile?.bio}
                            </p>
                        </div>

                        {/* Links */}
                        <div className="space-y-3">
                            {/* Custom Links */}
                            {(data?.customLinks || [])
                                .filter(link => link.active && link.url && link.url.trim() !== '')
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
                                                    <span className="font-medium text-sm" style={{ fontFamily }}>{link.title}</span>
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
                                                className={`group block rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 ${currentTextColor === 'text-white' ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-card shadow-sm border border-border'}`}
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
                                                            {Number(product.price) > 0 && (
                                                                <div className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-primary text-primary-foreground shadow-sm">
                                                                    {`${getCurrencySymbol(product.currency)}${Number(product.price).toFixed(2)}`}
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
                                                    <p className={`text-xs mt-1 truncate ${currentTextColor === 'text-white' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                                        {product.brand || 'Unknown Brand'}
                                                    </p>
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
                            {(data?.links || [])
                                .filter(link => link.active)
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

                    {/* Premium branding footer */}
                    {!hideVizitlinkFooter && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative mt-6 pb-6 z-50"
                        >
                            <div className='flex justify-center items-center'>
                                <div
                                    className="w-auto px-5 py-2.5 cursor-pointer relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black antialiased font-sans [&_span]:!leading-none text-center text-black !ease-in-out !duration-200 hover:!bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.2)] bg-white border border-sand hover:border-chalk hover:bg-chalk active:border-chalk active:bg-chalk flex justify-center items-center h-2xl px-md"
                                    onClick={() => setShowBrandModal(true)}
                                >
                                    <span className="flex items-center justify-center">
                                        <span className="label block font-semibold text-md">Join {data?.profile?.username} on VizitLink</span>
                                    </span>
                                </div>
                            </div>


                            {/* Subtle branding */}
                            <div className="mt-3 flex items-center justify-center gap-1.5">
                                <span className="text-[10px] text-gray-400">Powered by</span>
                                <BrandLogo showText={false} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Brand Modal - Claim your VizitLink */}
            {showBrandModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={() => setShowBrandModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-[#c4f241] rounded-3xl p-6 max-w-md w-full relative overflow-y-auto max-h-[90vh] sm:max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <div className="flex items-center justify-between relative">
                            {/* Brand Icon */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12">
                                <BrandLogo showText={false} linkToHome={false} className="w-10 h-10 sm:w-12 sm:h-12 text-gray-800" />
                            </div>
                            <button
                                onClick={() => setShowBrandModal(false)}
                                className="float-right w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:opacity-70 transition-opacity bg-[#c4f241] rounded-full z-10"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col clear-both">
                            {/* Heading */}
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                                Join the only link in bio trusted by <span className="text-blue-600">70M+</span>
                            </h2>

                            {/* Subheading */}
                            <p className="text-sm sm:text-base text-gray-800 mb-4">
                                One link to share everything you create, curate and sell across IG, TikTok and more.
                            </p>

                            {/* Username Input */}
                            <div className="bg-white rounded-xl px-4 py-3 sm:py-3.5 mb-4 shadow-sm">
                                <div className="flex items-center">
                                    <span className="text-gray-500 text-sm sm:text-base mr-1">{new URL(BASE_URL).hostname}/</span>
                                    <input
                                        type="text"
                                        value={usernameInput}
                                        onChange={(e) => setUsernameInput(e.target.value)}
                                        placeholder="yourname"
                                        className="flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* Claim Button */}
                            <button
                                className="w-full bg-gray-800 hover:bg-gray-900 text-[#c4f241] font-bold py-3 sm:py-3.5 px-6 rounded-full mb-4 sm:mb-5 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base min-h-[48px]"
                                onClick={() => {
                                    // Redirect to signup page with username as query parameter
                                    window.location.href = `/signup${usernameInput ? `?username=${encodeURIComponent(usernameInput)}` : ''}`;
                                }}
                            >
                                Claim your VizitLink
                            </button>

                            {/* Links */}
                            <div className="mb-4">
                                <Link
                                    href="https://instagram.com/vizitlink"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 hover:underline flex items-center text-sm sm:text-base min-h-[44px]"
                                >
                                    Follow on Instagram @vizitlink
                                </Link>
                                <Link
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 hover:underline flex items-center text-sm sm:text-base min-h-[44px]"
                                >
                                    Learn more about VizitLink
                                </Link>
                            </div>

                            {/* Bottom CTA */}
                            <div className="border-t border-gray-800/20 pt-4 sm:pt-5">
                                <h5 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Create your VizitLink</h5>
                                <p className="text-xs sm:text-sm text-gray-700 mb-4">
                                    Get your own free VizitLink. The only link in bio trusted by 70M+ people.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        className="flex-1 text-center bg-gray-800 hover:bg-gray-900 text-[#c4f241] font-semibold py-3 sm:py-3.5 px-6 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base min-h-[48px]"
                                        href="/signup"
                                    >
                                        Sign up free
                                    </Link>
                                    <Link
                                        className="flex-1 text-center border-2 border-gray-800 text-gray-800 font-semibold py-3 sm:py-3.5 px-6 rounded-full hover:bg-gray-800 hover:text-[#c4f241] transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base min-h-[48px]"
                                        href="/"
                                    >
                                        Find out more
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={() => setShowShareModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl p-6 max-w-md w-full relative overflow-y-auto max-h-[90vh] sm:max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <div className="flex items-center justify-between relative mb-3">
                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center clear-both">Share VizitLink</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="float-right w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:opacity-70 transition-opacity rounded-full z-10"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                            </button>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-7 text-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                                {data?.profile?.avatar ? (
                                    <img src={data.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl sm:text-3xl font-bold text-teal-400">
                                        {data?.profile?.displayName?.charAt(0).toUpperCase() || unwrappedParams?.username?.charAt(0).toUpperCase() || 'A'}
                                    </span>
                                )}
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">@{data?.profile?.username || unwrappedParams?.username}</h4>
                            <p className="text-sm sm:text-base text-gray-800 flex items-center justify-center">
                                <BrandLogo showText={false} linkToHome={false} logoVariant="black" className="w-6 h-6" />
                                /{data?.profile?.username || unwrappedParams?.username}
                            </p>
                        </div>

                        {/* Social Share Buttons */}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-7">
                            {/* Copy Link */}
                            <button
                                onClick={handleCopyLink}
                                className="flex flex-col items-center gap-2 group min-h-[72px] sm:min-h-[80px]"
                                aria-label="Copy profile link"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                                    <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight text-center">{copySuccess ? 'Copied!' : 'Copy'}</span>
                            </button>

                            {/* X (Twitter) */}
                            <button
                                onClick={() => handleSocialShare('twitter')}
                                className="flex flex-col items-center gap-2 group min-h-[72px] sm:min-h-[80px]"
                                aria-label="Share on X"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                                    <span className="text-white text-lg sm:text-xl font-bold">𝕏</span>
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">X</span>
                            </button>

                            {/* Facebook */}
                            <button
                                onClick={() => handleSocialShare('facebook')}
                                className="flex flex-col items-center gap-2 group min-h-[72px] sm:min-h-[80px]"
                                aria-label="Share on Facebook"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1877f2] hover:bg-[#0d65d9] rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                                    <SiFacebook className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current" />
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight text-center">Facebook</span>
                            </button>

                            {/* WhatsApp */}
                            <button
                                onClick={() => handleSocialShare('whatsapp')}
                                className="flex flex-col items-center gap-2 group min-h-[72px] sm:min-h-[80px]"
                                aria-label="Share on WhatsApp"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25d366] hover:bg-[#1fb855] rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                                    <SiWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current" />
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight text-center">WhatsApp</span>
                            </button>

                            {/* LinkedIn */}
                            <button
                                onClick={() => handleSocialShare('linkedin')}
                                className="flex flex-col items-center gap-2 group min-h-[72px] sm:min-h-[80px]"
                                aria-label="Share on LinkedIn"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0a66c2] hover:bg-[#004182] rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                                    <SiLinkedin className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current" />
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight text-center">LinkedIn</span>
                            </button>

                            {/* Messenger */}
                            <button
                                onClick={() => handleSocialShare('messenger')}
                                className="flex flex-col items-center gap-2 group min-h-[72px] sm:min-h-[80px]"
                                aria-label="Share on Messenger"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00b2ff] to-[#006aff] hover:opacity-90 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                                    <SiMessenger className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current" />
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight text-center">Messenger</span>
                            </button>
                        </div>

                        {/* Bottom CTA */}
                        <div className="border-t border-gray-200 pt-5 sm:pt-6">
                            <h5 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Join {data?.profile?.username || unwrappedParams?.username} on VizitLink</h5>
                            <p className="text-xs sm:text-sm text-gray-600 mb-4">
                                Get your own free VizitLink. The only link in bio trusted by 70M+ people.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    className="flex-1 text-center text-white bg-gray-800 hover:bg-gray-900 font-semibold py-3 sm:py-3.5 px-6 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base min-h-[48px]"
                                    href="/signup"
                                >
                                    Sign up free
                                </Link>
                                <Link
                                    className="flex-1 text-center border-2 border-gray-800 text-gray-800 font-semibold py-3 sm:py-3.5 px-6 rounded-full hover:bg-gray-800 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base min-h-[48px]"
                                    href="/"
                                >
                                    Find out more
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}


