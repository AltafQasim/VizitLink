"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function PublicProfilePage({ params }) {
    // Unwrap params using React.use() to fix the Next.js warning
    const unwrappedParams = React.use(params);
    const [data, setData] = useState(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("vizitlink_dashboard_data");
            if (raw) setData(JSON.parse(raw));
        } catch (_) { }
    }, []);

    const design = data?.design || {};
    const theme = design.theme || '';
    const wallpaper = design.wallpaper || '';
    const buttonStyle = design.buttonStyle || 'Minimal';
    const fontFamily = design.fontFamily || 'Inter';
    const hideLinktreeFooter = design.hideLinktreeFooter || false;

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

    return (
        <div className="relative min-h-screen" style={{ background: '#21232a url(/profilebg.jpg) repeat 0 0' }}>
            <div className="relative max-w-2xl mx-auto px-4 py-10">
                <div className={`relative rounded-2xl overflow-hidden ${currentBackground}`}>
                    {wallpaper === 'Image' && design.wallpaperImage && (
                        <img src={design.wallpaperImage} alt="Wallpaper" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {wallpaper === 'Video' && design.wallpaperVideo && (
                        <>
                            <video
                                src={design.wallpaperVideo}
                                className="absolute inset-0 w-full h-full object-cover"
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
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                                {data?.profile?.avatar ? (
                                    <img src={data.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-white">
                                        {data?.profile?.displayName?.charAt(0).toUpperCase() || 'A'}
                                    </span>
                                )}
                            </div>
                            <h1 className={`text-2xl font-bold mb-1 ${currentTextColor}`} style={{ fontFamily }}>
                                {data?.profile?.displayName || unwrappedParams?.username}
                            </h1>
                            {data?.profile?.bio && (
                                <p className={`text-sm ${currentTextColor === 'text-white' ? 'text-white/80' : 'text-gray-600'}`} style={{ fontFamily }}>
                                    {data.profile.bio}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            {(data?.links || [])
                                .filter(l => l.active)
                                .sort((a, b) => a.order - b.order)
                                .map(link => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block w-full rounded-lg p-3 flex items-center justify-between transition-colors ${currentButtonStyle}`}
                                        style={{ fontFamily }}
                                    >
                                        <span className="font-medium truncate">{link.title}</span>
                                        <span className="text-xs opacity-70">Visit</span>
                                    </a>
                                ))}
                        </div>

                        {(data?.products || []).filter(p => p.active).length > 0 && (
                            <div className="mt-6">
                                <h3 className={`font-semibold mb-3 ${currentTextColor}`} style={{ fontFamily }}>Shop</h3>
                                <div className="space-y-3">
                                    {(data.products || [])
                                        .filter(p => p.active)
                                        .map((product) => (
                                            <a
                                                key={product.id}
                                                href={product.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`block rounded-lg p-3 hover:opacity-80 transition-colors ${currentTextColor === 'text-white' ? 'bg-white/10' : 'bg-purple-50'}`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden relative">
                                                        {product.image ? (
                                                            <Image src={product.image} alt={product.title || 'Product'} fill className="object-cover" sizes="48px" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-medium text-sm truncate ${currentTextColor}`} style={{ fontFamily }}>{product.title}</p>
                                                        <p className={`text-sm ${currentTextColor === 'text-white' ? 'text-white/70' : 'text-gray-500'}`}>{product.brand || 'Unknown'}</p>
                                                        <p className="text-sm font-semibold text-purple-600">${(Number(product.price) || 0).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


