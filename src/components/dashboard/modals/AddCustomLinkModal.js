"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader } from '../../ui/dialog';
import { socialIconsMap, socialColorsMap } from '../../../lib/social';
import { Search, ChevronRight, Loader2, Globe, Image as ImageIcon, X } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';

const sidebarItems = [
    { id: 'suggested', label: 'Suggested', icon: '💡' },
    { id: 'commerce', label: 'Commerce', icon: '🛍️' },
    { id: 'social', label: 'Social', icon: '❤️' },
    { id: 'media', label: 'Media', icon: '▶️' },
    { id: 'contact', label: 'Contact', icon: '📇' },
    { id: 'events', label: 'Events', icon: '🗓️' },
    { id: 'viewall', label: 'View all', icon: '⚙️' },
];

const topTiles = [
    { id: 'collection', label: 'Collection', icon: '▦' },
    { id: 'link', label: 'Link', icon: '🔗' },
    { id: 'product', label: 'Product', icon: '🏷️' },
    { id: 'form', label: 'Form', icon: '💬' },
];

const suggestions = [
    { id: 'instagram', name: 'Instagram', desc: 'Display your posts and reels', example: 'https://www.instagram.com/p/...' },
    { id: 'tiktok', name: 'TikTok', desc: 'Share your TikToks on your VizitLink', example: 'https://www.tiktok.com/@user/video/...' },
    { id: 'youtube', name: 'YouTube', desc: 'Share YouTube videos on your VizitLink', example: 'https://youtu.be/...' },
    { id: 'spotify', name: 'Spotify', desc: 'Share music or playlists', example: 'https://open.spotify.com/track/...' },
    { id: 'product', name: 'Digital Products', desc: 'Upload files to sell', example: 'https://sendowl.com/' },
    { id: 'maps', name: 'Maps', desc: 'Share your location with your visitors', example: 'https://maps.google.com/?q=Taj+Mahal' },
    { id: 'bookings', name: 'Bookings', desc: 'Let visitors book and pay for time with you', example: 'https://calendly.com/yourname' },
];

// Rich category data rendered when a left tab is selected
const categoryData = {
    commerce: [
        {
            header: 'Digital Products',
            items: [
                { id: 'digital-products', name: 'Digital Products', desc: 'Upload files and start earning with digital products', example: 'https://sendowl.com/' },
                { id: 'templates', name: 'Templates', desc: 'Provide customizable templates for your audience', example: 'https://gumroad.com/yourstore' },
                { id: 'ebooks', name: 'eBooks', desc: 'Offer full-length e-books for download', example: 'https://amazon.com/dp/BOOKID' },
                { id: 'guides', name: 'Guides', desc: 'Publish comprehensive guides to help your audience', example: 'https://yourdomain.com/guide' },
                { id: 'documents', name: 'Documents', desc: 'Share downloadable PDFs or Word documents', example: 'https://yourdomain.com/file.pdf' },
                { id: 'course', name: 'Course', desc: 'Monetize your expertise with an online course', example: 'https://kajabi.com' },
                { id: 'sendowl', name: 'SendOwl', desc: 'Sell and deliver digital products with SendOwl', example: 'https://www.sendowl.com' },
                { id: 'mobile-app', name: 'Mobile App', desc: 'Drive app downloads across app stores', example: 'https://apps.apple.com/app/id000000' },
                { id: 'opensea', name: 'OpenSea', desc: 'Showcase an OpenSea NFT collection', example: 'https://opensea.io/collection/your-collection' },
            ],
        },
        {
            header: 'Physical Products',
            items: [
                { id: 'product', name: 'Product', desc: 'Share or promote a product link', example: 'https://amazon.in/dp/PRODUCT' },
                { id: 'shopify', name: 'Shopify', desc: 'Display your Shopify store on your profile', example: 'https://yourstore.myshopify.com' },
                { id: 'amaze', name: 'Amaze', desc: 'Create a store with Amaze and display it', example: 'https://amaze.co/yourstore' },
                { id: 'books', name: 'Books', desc: 'Promote books from Amazon/Apple/B&N', example: 'https://books.apple.com/book/id0000' },
                { id: 'bonfire', name: 'Bonfire', desc: 'Sell merch from your Bonfire store', example: 'https://www.bonfire.com/store/yourstore' },
            ],
        },
    ],
    social: [
        {
            header: 'Social',
            items: [
                { id: 'instagram', name: 'Instagram', desc: 'Preview posts and reels; grow your following', example: 'https://www.instagram.com/p/...' },
                { id: 'tiktok', name: 'TikTok', desc: 'Share TikTok profile or videos', example: 'https://www.tiktok.com/@user/video/...' },
                { id: 'tiktok-profile', name: 'TikTok Profile', desc: 'Share TikTok profiles with your audience', example: 'https://www.tiktok.com/@username' },
                { id: 'twitter', name: 'X', desc: 'Display latest posts from X', example: 'https://x.com/username/status/...' },
                { id: 'threads', name: 'Threads', desc: 'Display latest Threads posts', example: 'https://www.threads.net/@username' },
                { id: 'reviews', name: 'Reviews', desc: 'Showcase Google reviews', example: 'https://g.page/r/your-place' },
                { id: 'facebook', name: 'Facebook', desc: 'Show Facebook videos', example: 'https://www.facebook.com/watch/?v=...' },
                { id: 'snapchat', name: 'Snapchat', desc: 'Drive to your Snapchat Public Profile', example: 'https://www.snapchat.com/add/username' },
                { id: 'pinterest', name: 'Pinterest', desc: 'Share boards and Pins', example: 'https://www.pinterest.com/username/board' },
                { id: 'twitch', name: 'Twitch', desc: 'Show live Twitch stream', example: 'https://www.twitch.tv/username' },
                { id: 'reddit', name: 'Reddit', desc: 'Preview your Reddit profile', example: 'https://www.reddit.com/user/username' },
            ],
        },
        {
            header: 'Communities',
            items: [
                { id: 'discord', name: 'Discord servers', desc: 'Grow your Discord server', example: 'https://discord.gg/invitecode' },
                { id: 'whatsapp', name: 'WhatsApp groups', desc: 'Grow your WhatsApp group', example: 'https://chat.whatsapp.com/INVITE' },
                { id: 'slack', name: 'Slack workspaces', desc: 'Grow your Slack workspace', example: 'https://join.slack.com/t/workspace/signup' },
            ],
        },
    ],
    media: [
        {
            header: 'Video',
            items: [
                { id: 'video', name: 'Video', desc: 'Add videos from Twitch, YouTube, TikTok, Vimeo, Facebook', example: 'https://youtu.be/...' },
                { id: 'youtube', name: 'YouTube', desc: 'Show YouTube video inline', example: 'https://www.youtube.com/watch?v=...' },
                { id: 'tiktok-video', name: 'TikTok Video', desc: 'Highlight one TikTok', example: 'https://www.tiktok.com/@user/video/...' },
                { id: 'vimeo', name: 'Vimeo', desc: 'Share Vimeo videos', example: 'https://vimeo.com/123456' },
            ],
        },
        {
            header: 'Document',
            items: [
                { id: 'pdf', name: 'PDF display', desc: 'Display downloadable PDFs right on your profile', example: 'https://yourdomain.com/file.pdf' },
            ],
        },
        {
            header: 'Audio',
            items: [
                { id: 'music', name: 'Music', desc: 'Let fans listen across services (Spotify, SoundCloud...)', example: 'https://open.spotify.com/track/...' },
                { id: 'podcasts', name: 'Podcasts', desc: 'Show podcast across platforms', example: 'https://podcasts.apple.com/podcast/id0000' },
                { id: 'spotify', name: 'Spotify', desc: 'Embed Spotify content', example: 'https://open.spotify.com/track/...' },
                { id: 'apple-music', name: 'Apple Music', desc: 'Share Apple Music', example: 'https://music.apple.com/album/...' },
                { id: 'soundcloud', name: 'SoundCloud', desc: 'Embed SoundCloud player', example: 'https://soundcloud.com/artist/track' },
                { id: 'presave', name: 'Music Presave', desc: 'Build excitement for upcoming release', example: 'https://presave.io/your' },
                { id: 'audiomack', name: 'Audiomack', desc: 'Share Audiomack tracks/podcasts', example: 'https://audiomack.com/artist/song' },
            ],
        },
    ],
    contact: [
        {
            header: 'Forms',
            items: [
                { id: 'form', name: 'Form', desc: 'Add a contact form for visitors', example: 'https://yourdomain.com/contact' },
                { id: 'contact-form', name: 'Contact form', desc: 'Collect info with a custom form', example: 'https://typeform.com/to/xyz' },
                { id: 'email-signup', name: 'Email sign up', desc: 'Collect emails with a signup form', example: 'https://yourdomain.com/subscribe' },
                { id: 'sms-signup', name: 'SMS sign up', desc: 'Collect phone numbers to connect', example: 'https://yourdomain.com/sms' },
                { id: 'typeform', name: 'Typeform', desc: 'Add Typeform forms, surveys and quizzes', example: 'https://typeform.com/to/xyz' },
                { id: 'laylo', name: 'Laylo', desc: 'Display Laylo profile/drop/tour', example: 'https://laylo.com/your' },
                { id: 'community-sms', name: 'Community SMS', desc: 'Grow SMS subscriber list', example: 'https://community.com/your' },
            ],
        },
        {
            header: 'Details',
            items: [
                { id: 'maps', name: 'Maps', desc: 'Display a map on your profile', example: 'https://maps.google.com/?q=Taj+Mahal' },
                { id: 'contact-details', name: 'Contact Details', desc: 'Add a virtual contact card', example: 'https://yourdomain.com/vcard.vcf' },
                { id: 'faqs', name: 'FAQs', desc: 'Display frequently asked questions', example: 'https://yourdomain.com/faq' },
                { id: 'chatbot', name: 'Chatbot', desc: 'Engage your audience with a chatbot', example: 'https://yourdomain.com/chat' },
                { id: 'email', name: 'Email', desc: 'Send an email to a specific address', example: 'mailto:hello@example.com' },
            ],
        },
        {
            header: 'Scheduling',
            items: [
                { id: 'calendly', name: 'Calendly', desc: 'Visitors can book services or schedule time', example: 'https://calendly.com/yourname' },
            ],
        },
    ],
    events: [
        {
            header: 'Events',
            items: [
                { id: 'tour-events', name: 'Tour and Events', desc: 'Promote upcoming shows/events', example: 'https://yourdomain.com/events' },
                { id: 'seated', name: 'Seated', desc: 'Promote shows via Seated', example: 'https://seated.com/your' },
                { id: 'bandsintown', name: 'Bandsintown', desc: 'Connect fans to your events', example: 'https://bandsintown.com/a/12345' },
            ],
        },
    ],
};

function detectType(urlString) {
    try {
        const u = new URL(urlString);
        const host = u.hostname.toLowerCase();
        if (host.includes('instagram.com')) return 'instagram';
        if (host.includes('tiktok.com')) return 'tiktok';
        if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
        if (host.includes('open.spotify.com')) return 'spotify';
        return 'website';
    } catch {
        return 'website';
    }
}

export default function AddCustomLinkModal({ isOpen, onClose, onSave }) {
    const [query, setQuery] = useState('');
    const [activeLeft, setActiveLeft] = useState('suggested');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [meta, setMeta] = useState(null);
    const type = detectType(query);
    const debounceRef = useRef(null);
    const abortRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setActiveLeft('suggested');
            setLoading(false);
            setError('');
            setMeta(null);
        }
    }, [isOpen]);

    const faviconUrl = useMemo(() => {
        if (!meta?.domain) return null;
        return `https://www.google.com/s2/favicons?domain=${meta.domain}&sz=64`;
    }, [meta]);

    const isLikelyUrl = (value) => {
        try {
            const u = new URL(value);
            return u.protocol === 'http:' || u.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const fetchMeta = async () => {
        if (!query || !isLikelyUrl(query)) return;
        setLoading(true);
        setError('');
        setMeta(null);
        try {
            // cancel previous in-flight
            if (abortRef.current) {
                abortRef.current.abort();
            }
            abortRef.current = new AbortController();
            const r = await fetch('/api/extract-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: query }),
                signal: abortRef.current.signal,
            });
            const j = await r.json();
            if (!r.ok || !j?.success) throw new Error(j?.error || 'Failed to fetch metadata');
            setMeta(j.data);
        } catch (e) {
            let errorMessage = 'Sorry, we had trouble finding this. Please try a new URL.';
            const msg = (e?.message || '').toLowerCase();
            if (msg.includes('network')) {
                errorMessage = 'Network error: Please check your internet connection and try again.';
            } else if (msg.includes('failed to fetch url') || msg.includes('403') || msg.includes('blocked')) {
                errorMessage = 'Unable to access this URL. The website might be blocking our request.';
            } else if (msg.includes('invalid url')) {
                errorMessage = 'Please enter a valid URL (e.g., https://example.com)';
            } else if (msg.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again with a different URL.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchMeta();
        }
    };

    const onChangeUrl = (e) => {
        const val = e.target.value;
        setQuery(val);
        // debounce auto-fetch if value looks like URL
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (isLikelyUrl(val)) {
                fetchMeta();
            } else {
                setMeta(null);
                setError('');
            }
        }, 1000);
    };

    const onPasteUrl = (e) => {
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        // small delay to allow state update, then auto fetch
        setTimeout(() => {
            if (isLikelyUrl(pasted)) fetchMeta();
        }, 150);
    };

    const confirm = () => {
        const payload = {
            title: meta?.title || query,
            url: query,
            icon: type,
            active: true,
            type: 'custom',
            metadata: meta || undefined,
            thumbnail: meta?.image || undefined,
            description: meta?.description || undefined,
            domain: meta?.domain || undefined,
            favicon: faviconUrl || undefined,
        };
        onSave(payload);
    };

    const TypeIcon = socialIconsMap[type] || Globe;
    const color = socialColorsMap[type] || socialColorsMap.default;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 overflow-hidden sm:max-w-5xl w-[100vw] sm:w-2xl h-[100dvh] sm:h-[80vh] sm:rounded-xl rounded-none">
                <div className="h-full flex flex-col">
                    <DialogHeader className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-white shrink-0">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-semibold mb-3">
                                add custom link
                            </DialogTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="relative rounded-2xl border border-gray-300 bg-white">
                            <Input
                                placeholder="Paste or search a link"
                                value={query}
                                onChange={onChangeUrl}
                                onPaste={onPasteUrl}
                                onKeyDown={onEnter}
                                className="border-0 h-12 pl-12 pr-28"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                        </div>
                    </DialogHeader>

                    {/* Body layout */}
                    {!loading && !meta && (<div className="px-4 sm:px-6 pb-4 grid gap-4 flex-1 max-h-[80dvh] sm:max-h-[calc(100vh-270px)] min-h-0 grid-cols-1 lg:grid-cols-[220px_1fr] overflow-hidden">
                        {/* Left sidebar - desktop */}
                        <div className="hidden lg:block border-r border-gray-200 pr-3 pt-4 overflow-y-auto">
                            {sidebarItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveLeft(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left mb-1 ${activeLeft === item.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                    aria-pressed={activeLeft === item.id}
                                >
                                    <span className="w-5 text-center">{item.icon}</span>
                                    <span className="text-sm text-gray-800">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Mobile category pills */}
                        <div className="block lg:hidden py-2 overflow-x-auto no-scrollbar">
                            <div className="flex gap-2 pb-1 min-w-max">
                                {sidebarItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveLeft(item.id)}
                                        className={`px-3 py-2 rounded-full border text-sm ${activeLeft === item.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200'}`}
                                        aria-pressed={activeLeft === item.id}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right content */}
                        <div className="flex min-h-0 pt-4 flex-col flex-1 scrollbar-hide">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="text-1xl font-bold text-gray-700 capitalize">{activeLeft}</div>
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                                {activeLeft === 'suggested' ? (
                                    <>
                                        <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
                                            {suggestions.map(s => {
                                                const SIcon = socialIconsMap[s.id] || Globe;
                                                const sColor = socialColorsMap[s.id] || socialColorsMap.default;
                                                return (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => {
                                                            if (s.example) setQuery(s.example);
                                                            // Immediately persist lightweight link and open layout modal in dashboard via callback, if provided
                                                            if (onSave) {
                                                                const temp = {
                                                                    title: s.name,
                                                                    url: s.example || '',
                                                                    icon: s.id,
                                                                    active: true,
                                                                    type: 'custom'
                                                                };
                                                                onSave(temp);
                                                            }
                                                            onClose && onClose();
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 rounded-lg transition"
                                                    >
                                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: sColor + '20' }}>
                                                            <SIcon className="w-5 h-5" style={{ color: sColor }} />
                                                        </div>
                                                        <div className="flex-1 min-w-0 text-left">
                                                            <div className="text-sm font-medium text-gray-900 truncate">{s.name}</div>
                                                            <div className="text-xs text-gray-500 truncate">{s.desc}</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {(activeLeft === 'viewall' ? Object.values(categoryData).flat() : (categoryData[activeLeft] || [])).map(section => (
                                            <div key={section.header} className="mb-5">
                                                <div className="text-sm font-medium text-gray-700 mb-2">{section.header}</div>
                                                <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
                                                    {section.items.map(s => {
                                                        const SIcon = socialIconsMap[s.id] || Globe;
                                                        const sColor = socialColorsMap[s.id] || socialColorsMap.default;
                                                        return (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => s.example && setQuery(s.example)}
                                                                className="w-full flex items-center gap-3 px-3 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 rounded-lg transition"
                                                            >
                                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: sColor + '20' }}>
                                                                    <SIcon className="w-5 h-5" style={{ color: sColor }} />
                                                                </div>
                                                                <div className="flex-1 min-w-0 text-left">
                                                                    <div className="text-sm font-medium text-gray-900 truncate">{s.name}</div>
                                                                    <div className="text-xs text-gray-500 truncate">{s.desc}</div>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                        {((activeLeft !== 'suggested') && !categoryData[activeLeft] && activeLeft !== 'viewall') && (
                                            <div className="text-center py-10">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                                                    <span className="text-lg">✨</span>
                                                </div>
                                                <div className="font-medium text-gray-900 mb-1">No items yet</div>
                                                <div className="text-sm text-gray-600">This category will be available soon.</div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>


                        </div>
                    </div>)}
                    {/* Error */}
                    {error && (
                        <div className="mt-3 text-sm text-red-600">{error}</div>
                    )}

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                            <div className="p-3 flex gap-3 animate-pulse">
                                <div className="w-16 h-16 bg-gray-200 rounded-md" />
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-24" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {meta && !loading && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                            <div className="p-3 flex gap-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                                    {meta.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={meta.image} alt={meta.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {meta.domain && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={`https://www.google.com/s2/favicons?domain=${meta.domain}&sz=64`} alt="fav" className="w-4 h-4" />
                                        )}
                                        <span className="text-xs text-gray-500 truncate">{meta.domain}</span>
                                    </div>
                                    <div className="font-medium text-gray-900 truncate">{meta.title}</div>
                                    <div className="text-sm text-gray-600 line-clamp-2">{meta.description}</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}


