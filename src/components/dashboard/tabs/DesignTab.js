"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Edit, Share, Star, Home, Palette, Image, Wand2, ChevronRight, Zap, Upload, X, Undo2, Redo2, Save, ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Card } from "../../ui/card";
import { useDashboard } from "../../../context/DashboardContext";
import toast, { Toaster } from 'react-hot-toast';

const DesignTab = () => {
    const { data, updateData, updateDesignData, canUndo, canRedo, undo, redo, hasUnsavedChanges, saveChanges } = useDashboard();
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState("Customizable");
    const [activeStyleTab, setActiveStyleTab] = useState("Presets");
    const [isSaving, setIsSaving] = useState(false);

    // Wallpaper Image modal state
    const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
    const [wallpaperModalStep, setWallpaperModalStep] = useState("menu"); // menu | upload | gallery
    const [galleryQuery, setGalleryQuery] = useState("");
    const [isWallpaperVideoLoading, setIsWallpaperVideoLoading] = useState(false);

    // Wallpaper Video modal state
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoModalStep, setVideoModalStep] = useState("menu"); // menu | upload | gallery
    const [videoGalleryQuery, setVideoGalleryQuery] = useState("");
    const [videoThumbLoading, setVideoThumbLoading] = useState({});

    useEffect(() => {
        if (data?.design?.wallpaper === 'Video' && data?.design?.wallpaperVideo) {
            setIsWallpaperVideoLoading(true);
        } else {
            setIsWallpaperVideoLoading(false);
        }
    }, [data?.design?.wallpaper, data?.design?.wallpaperVideo]);



    // Enhanced action handlers with toast feedback
    const handleUndo = () => {
        if (canUndo) {
            undo();
            toast.success("Undone last action");
            // Prevent focus issues
            document.activeElement?.blur();
        }
    };

    const handleRedo = () => {
        if (canRedo) {
            redo();
            toast.success("Redone last action");
            // Prevent focus issues
            document.activeElement?.blur();
        }
    };

    const handleSave = async () => {
        if (hasUnsavedChanges) {
            setIsSaving(true);
            try {
                await saveChanges();
                toast.success("Changes saved successfully!");
            } catch (error) {
                toast.error("Failed to save changes");
            } finally {
                setIsSaving(false);
            }
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if user is typing in an input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            // Undo: Ctrl+Z or Cmd+Z
            if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                handleUndo();
            }

            // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z
            if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
                event.preventDefault();
                handleRedo();
            }

            // Save: Ctrl+S or Cmd+S
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                handleSave();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, hasUnsavedChanges, undo, redo, saveChanges]);

    // Get current design settings from context
    const selectedTheme = data?.design?.theme || "";
    const selectedWallpaper = data?.design?.wallpaper || "";
    const selectedStyle = data?.design?.buttonStyle || "Minimal";
    const selectedFont = data?.design?.fontFamily || "Inter";
    const hideLinktreeFooter = data?.design?.hideLinktreeFooter || false;

    // Enhanced design change handlers with visual feedback
    const handleThemeChange = (themeName) => {
        // When theme is selected, remove wallpaper selection
        updateData({
            design: {
                ...data.design,
                theme: themeName,
                wallpaper: "" // Clear wallpaper selection
            }
        });
        toast.success(`Theme changed to ${themeName}`);
    };

    const handleWallpaperChange = (wallpaperName) => {
        if (wallpaperName === "Image") {
            setIsWallpaperModalOpen(true);
            setWallpaperModalStep("menu");
            return;
        }
        if (wallpaperName === "Video") {
            setIsVideoModalOpen(true);
            setVideoModalStep("menu");
            return;
        }
        // When wallpaper is selected, remove theme selection
        updateData({
            design: {
                ...data.design,
                wallpaper: wallpaperName,
                theme: "" // Clear theme selection
            }
        });
        toast.success(`Wallpaper changed to ${wallpaperName}`);
    };

    const handleStyleChange = (styleName) => {
        updateDesignData({ buttonStyle: styleName });
        toast.success(`Button style changed to ${styleName}`);
    };

    const handleFontChange = (fontName) => {
        updateDesignData({ fontFamily: fontName });
        toast.success(`Font changed to ${fontName}`);
    };

    const handleHideFooterChange = (checked) => {
        updateDesignData({ hideLinktreeFooter: checked });
    };

    const handleProfilePictureUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                updateData({
                    profile: {
                        ...data.profile,
                        avatar: imageData
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfilePicture = () => {
        updateData({
            profile: {
                ...data.profile,
                avatar: ""
            }
        });
    };

    const themes = [
        { name: "Air", preview: "bg-gray-100", textColor: "text-black", selected: selectedTheme === "Air", type: "gradient" },
        { name: "Blocks", preview: "bg-gradient-to-br from-purple-500 to-pink-500", textColor: "text-white", selected: selectedTheme === "Blocks", type: "gradient" },
        { name: "Bloom", preview: "bg-gradient-to-br from-red-500 to-blue-600", textColor: "text-white", selected: selectedTheme === "Bloom", isPro: true, type: "gradient" },
        { name: "Breeze", preview: "bg-gradient-to-br from-purple-400 to-pink-400", textColor: "text-white", selected: selectedTheme === "Breeze", isPro: true, type: "gradient" },
        { name: "Lake", preview: "bg-slate-800", textColor: "text-white", selected: selectedTheme === "Lake", type: "solid" },
        { name: "Mineral", preview: "bg-orange-100", textColor: "text-black", selected: selectedTheme === "Mineral", type: "solid" },
        { name: "Ocean", preview: "bg-blue-100", textColor: "text-black", selected: selectedTheme === "Ocean", type: "solid" },
        { name: "Sunset", preview: "bg-gradient-to-br from-yellow-500 to-red-500", textColor: "text-white", selected: selectedTheme === "Sunset", type: "gradient" },
        { name: "Winter", preview: "bg-gradient-to-br from-blue-200 to-blue-400", textColor: "text-black", selected: selectedTheme === "Winter", type: "gradient" },
        { name: "Spring", preview: "bg-gradient-to-br from-green-200 to-green-400", textColor: "text-black", selected: selectedTheme === "Spring", type: "gradient" },
        { name: "Summer", preview: "bg-gradient-to-br from-yellow-200 to-yellow-400", textColor: "text-black", selected: selectedTheme === "Summer", type: "gradient" },
        { name: "Autumn", preview: "bg-gradient-to-br from-orange-200 to-orange-400", textColor: "text-black", selected: selectedTheme === "Autumn", type: "gradient" },
    ];

    const curatedThemes = [
        { name: "Midnight", preview: "bg-gradient-to-br from-gray-900 to-black", textColor: "text-white", selected: selectedTheme === "Midnight", type: "gradient" },
        { name: "Aurora", preview: "bg-gradient-to-br from-green-400 to-blue-500", textColor: "text-white", selected: selectedTheme === "Aurora", isPro: true, type: "gradient" },
        { name: "Coral", preview: "bg-gradient-to-br from-pink-400 to-orange-400", textColor: "text-white", selected: selectedTheme === "Coral", type: "gradient" },
        { name: "Forest", preview: "bg-gradient-to-br from-green-600 to-green-800", textColor: "text-white", selected: selectedTheme === "Forest", type: "gradient" },
        { name: "Lavender", preview: "bg-gradient-to-br from-purple-300 to-pink-300", textColor: "text-black", selected: selectedTheme === "Lavender", type: "gradient" },
        { name: "Sage", preview: "bg-gradient-to-br from-green-200 to-blue-200", textColor: "text-black", selected: selectedTheme === "Sage", type: "gradient" },
        { name: "Rose", preview: "bg-gradient-to-br from-rose-400 to-pink-500", textColor: "text-white", selected: selectedTheme === "Rose", isPro: true, type: "gradient" },
        { name: "Sky", preview: "bg-gradient-to-br from-blue-300 to-cyan-400", textColor: "text-black", selected: selectedTheme === "Sky", type: "gradient" },
        { name: "Amber", preview: "bg-gradient-to-br from-amber-400 to-orange-500", textColor: "text-white", selected: selectedTheme === "Amber", type: "gradient" },
        { name: "Indigo", preview: "bg-gradient-to-br from-indigo-500 to-purple-600", textColor: "text-white", selected: selectedTheme === "Indigo", type: "gradient" },
        { name: "Teal", preview: "bg-gradient-to-br from-teal-400 to-cyan-500", textColor: "text-white", selected: selectedTheme === "Teal", type: "gradient" },
        { name: "Ruby", preview: "bg-gradient-to-br from-red-500 to-pink-600", textColor: "text-white", selected: selectedTheme === "Ruby", isPro: true, type: "gradient" },
    ];

    const wallpapers = [
        { name: "Hero", preview: "bg-gradient-to-br from-blue-900 to-teal-400", icon: true, type: "gradient" },
        { name: "Fill", preview: "bg-gray-100", icon: true, type: "solid" },
        { name: "Gradient", preview: "bg-gradient-to-br from-gray-400 to-gray-600", icon: true, type: "gradient" },
        { name: "Blur", preview: "bg-gradient-to-br from-blue-200 to-purple-200", icon: true, type: "blur" },
        { name: "Pattern", preview: "bg-gradient-to-br from-blue-200 to-gray-300", icon: true, type: "pattern" },
        { name: "Image", preview: selectedWallpaper === "Image" && data?.design?.wallpaperImage ? "" : "bg-gradient-to-br from-orange-500 via-red-500 to-black", icon: true, type: "image" },
        { name: "Video", preview: "bg-gradient-to-br from-gray-600 to-gray-800", icon: true, isPro: true, type: "video" },
    ];

    const colorOptions = [
        "bg-teal-500", "bg-blue-600", "bg-cyan-500", "bg-gray-100", "bg-black"
    ];

    const buttonStyles = [
        { name: "Minimal", style: "border border-gray-400 bg-transparent text-black rounded-lg" },
        { name: "Classic", style: "bg-gray-100 text-black rounded-lg shadow-sm" },
        { name: "Unique", style: "bg-blue-50 text-gray-700 rounded-lg border border-blue-200" },
        { name: "Zen", style: "bg-white text-black rounded-full shadow-sm" },
        { name: "Simple", style: "bg-gray-50 text-black rounded-lg" },
        { name: "Precise", style: "bg-transparent text-black rounded border border-gray-400" },
        { name: "Retro", style: "bg-black text-white rounded-full border-2 border-black" },
        { name: "Modern", style: "bg-gray-100 text-black rounded-lg" },
        { name: "Industrial", style: "bg-transparent text-black rounded border border-gray-600" },
    ];

    const fonts = [
        { name: "Inter", family: "Inter", weight: "400", selected: selectedFont === "Inter" },
        { name: "Roboto", family: "Roboto", weight: "400", selected: selectedFont === "Roboto" },
        { name: "Open Sans", family: "Open Sans", weight: "400", selected: selectedFont === "Open Sans" },
        { name: "Lato", family: "Lato", weight: "400", selected: selectedFont === "Lato" },
        { name: "Poppins", family: "Poppins", weight: "500", selected: selectedFont === "Poppins" },
        { name: "Montserrat", family: "Montserrat", weight: "500", selected: selectedFont === "Montserrat" },
        { name: "Raleway", family: "Raleway", weight: "400", selected: selectedFont === "Raleway" },
        { name: "Nunito", family: "Nunito", weight: "400", selected: selectedFont === "Nunito" },
        { name: "Ubuntu", family: "Ubuntu", weight: "400", selected: selectedFont === "Ubuntu" },
        { name: "Playfair Display", family: "Playfair Display", weight: "400", selected: selectedFont === "Playfair Display" },
        { name: "Merriweather", family: "Merriweather", weight: "400", selected: selectedFont === "Merriweather" },
        { name: "Source Sans Pro", family: "Source Sans Pro", weight: "400", selected: selectedFont === "Source Sans Pro" },
    ];

    // Simple Unsplash placeholders (50 images). In future, can be replaced by API.
    const getUnsplashPlaceholders = (q = "") => {
        const topics = [
            "nature", "city", "tech", "abstract", "ocean", "forest", "mountain", "desert", "sunset", "night",
            "neon", "pastel", "pattern", "gradient", "texture", "sky", "clouds", "space", "water", "fire",
            "flowers", "leaves", "rocks", "metal", "wood", "glass", "bokeh", "minimal", "architecture", "street",
            "snow", "rain", "autumn", "spring", "summer", "winter", "beach", "lake", "river", "valley",
            "studio", "portrait", "aesthetic", "background", "landscape", "macro", "vintage", "modern", "dark", "light"
        ];
        const base = `https://images.unsplash.com/photo-`;
        const ids = [
            "1500530855697-b586d89ba3ee", "1501785888041-af3ef285b470", "1500534314209-a25ddb2bd429", "1501594907352-04cda38ebc29",
            "1500534314209-a25ddb2bd429", "1517812983140-6f53a42c9c56", "1496307042754-b4aa456c4a2d", "1493247035880-8f8b81a407f6",
            "1500534314209-a25ddb2bd429", "1500534314209-a25ddb2bd429", "1520975916090-3105956dac38", "1520974735194-54a56612ee37",
            "1520975916090-3105956dac38", "1519681393784-d120267933ba", "1482192596544-9eb780fc7f66", "1472214103451-9374bd1c798e",
            "1469474968028-56623f02e42e", "1469474968028-56623f02e42e", "1449157291145-7efd050a4d0e", "1491972690050-ba117db4dc09",
            "1470770903676-69b98201ea1c", "1469474968028-56623f02e42e", "1520974735194-54a56612ee37", "1519681393784-d120267933ba",
            "1469474968028-56623f02e42e", "1500534314209-a25ddb2bd429", "1520975916090-3105956dac38", "1500534314209-a25ddb2bd429",
            "1496307042754-b4aa456c4a2d", "1493247035880-8f8b81a407f6", "1501785888041-af3ef285b470", "1501594907352-04cda38ebc29",
            "1500530855697-b586d89ba3ee", "1517812983140-6f53a42c9c56", "1491972690050-ba117db4dc09", "1482192596544-9eb780fc7f66",
            "1472214103451-9374bd1c798e", "1520974735194-54a56612ee37", "1520975916090-3105956dac38", "1519681393784-d120267933ba",
            "1469474968028-56623f02e42e", "1500534314209-a25ddb2bd429", "1493247035880-8f8b81a407f6", "1496307042754-b4aa456c4a2d",
            "1501594907352-04cda38ebc29", "1501785888041-af3ef285b470", "1500530855697-b586d89ba3ee", "1491972690050-ba117db4dc09",
            "1517812983140-6f53a42c9c56", "1482192596544-9eb780fc7f66"
        ];
        const filtered = topics.filter(t => t.includes(q.toLowerCase())).slice(0, 10);
        const urls = ids.slice(0, 50).map((id, i) => {
            const fit = "&fit=crop&w=600&q=80";
            return `${base}${id}?auto=format${fit}`;
        });
        // For now ignore query for images, keep it simple; query can be used later with API
        return urls;
    };

    // Sample royalty-free videos from robust public sources (no API key required)
    const getCoverrSamples = (q = "") => {
        const urls = [
            // W3Schools Big Buck Bunny (short)
            "https://www.w3schools.com/html/mov_bbb.mp4",
            // Sample-Videos
            "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
            "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4",
            // Filesamples
            "https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4",
            "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
            // Test-videos.co.uk
            "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
            "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
            // Akamai (Sintel)
            "https://media.w3.org/2010/05/sintel/trailer.mp4",
            // More samples
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        ];
        return urls;
    };

    // Defaults for Image/Video wallpaper cards
    const defaultWallpaperImage = getUnsplashPlaceholders()[0];
    const defaultWallpaperVideo = getCoverrSamples()[0];

    // Tint controls
    const [isTintModalOpen, setIsTintModalOpen] = useState(false);
    const [tintValue, setTintValue] = useState(Number(data?.design?.wallpaperTint || 20));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Container */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            {/* Sticky Design Controls Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transform-gpu">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleUndo}
                                    disabled={!canUndo}
                                    className="flex items-center gap-2 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <Undo2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Undo</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRedo}
                                    disabled={!canRedo}
                                    className="flex items-center gap-2 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <Redo2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Redo</span>
                                </Button>
                            </div>

                            {/* Status indicator */}
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <div className={`w-2 h-2 rounded-full ${hasUnsavedChanges ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                                <span className="hidden sm:inline">
                                    {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {hasUnsavedChanges && (
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span className="hidden sm:inline">
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </span>
                                </Button>
                            )}


                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 px-4 py-6 overflow-visible">

                {/* Profile Section */}
                <section>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Profile</h1>
                        <p className="text-gray-600">Customize your profile appearance</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={data?.profile?.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-teal-400 to-blue-600 text-white text-2xl font-bold">
                                        {data?.profile?.displayName?.charAt(0).toUpperCase() || 'A'}
                                    </AvatarFallback>
                                </Avatar>
                                {data?.profile?.avatar && (
                                    <button
                                        onClick={removeProfilePicture}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4" />
                                    {data?.profile?.avatar ? 'Change Photo' : 'Add Photo'}
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">Hide Linktree footer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-gray-400" />
                                    <Switch
                                        checked={hideLinktreeFooter}
                                        onCheckedChange={handleHideFooterChange}
                                    />
                                </div>
                            </div>

                            <button className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                    <Share className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">Sharing preview</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Theme Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Theme</h2>
                        <p className="text-gray-600">Choose your theme and color scheme</p>

                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex gap-4 border-b border-gray-200 mb-6">
                            {["Customizable", "Curated"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === tab
                                        ? "text-gray-900 border-b-2 border-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {activeTab === "Customizable" && (
                                <>
                                    {themes.map((theme) => (
                                        <Card
                                            key={theme.name}
                                            className={`relative cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden ${theme.selected ? "ring-2 ring-purple-500 shadow-lg" : ""
                                                }`}
                                            onClick={() => handleThemeChange(theme.name)}
                                        >
                                            <div className={`aspect-[3/4] relative ${theme.preview} ${theme.textColor}`}>
                                                {/* Overlay for readability */}
                                                {theme.type === "gradient" && (
                                                    <div className="absolute inset-0 bg-black/10" />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                                    {theme.name === "Air" && <span>💨</span>}
                                                    {theme.name === "Blocks" && <span>🧱</span>}
                                                    {theme.name === "Bloom" && <span>🌸</span>}
                                                    {theme.name === "Breeze" && <span>🌬️</span>}
                                                    {theme.name === "Lake" && <span>🏞️</span>}
                                                    {theme.name === "Mineral" && <span>💎</span>}
                                                    {theme.name === "Ocean" && <span>🌊</span>}
                                                    {theme.name === "Sunset" && <span>🌅</span>}
                                                    {theme.name === "Winter" && <span>❄️</span>}
                                                    {theme.name === "Spring" && <span>🌱</span>}
                                                    {theme.name === "Summer" && <span>☀️</span>}
                                                    {theme.name === "Autumn" && <span>🍂</span>}
                                                </div>
                                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-black/30 text-white">{theme.name}</span>
                                                </div>
                                            </div>

                                            {/* Pro Badge */}
                                            {theme.isPro && (
                                                <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                    <Zap className="h-3 w-3" />
                                                    Pro
                                                </div>
                                            )}

                                            {/* Selected Indicator */}
                                            {theme.selected && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </>
                            )}
                            {activeTab === "Curated" && (
                                <>
                                    {curatedThemes.map((theme) => (
                                        <Card
                                            key={theme.name}
                                            className={`relative cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden ${theme.selected ? "ring-2 ring-purple-500 shadow-lg" : ""
                                                }`}
                                            onClick={() => handleThemeChange(theme.name)}
                                        >
                                            <div className={`aspect-[3/4] relative ${theme.preview} ${theme.textColor}`}>
                                                {theme.type === "gradient" && (
                                                    <div className="absolute inset-0 bg-black/10" />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                                    {theme.name === "Midnight" && <span>🌙</span>}
                                                    {theme.name === "Aurora" && <span>🌌</span>}
                                                    {theme.name === "Coral" && <span>🐟</span>}
                                                    {theme.name === "Forest" && <span>🌲</span>}
                                                    {theme.name === "Lavender" && <span>💐</span>}
                                                    {theme.name === "Sage" && <span>🌿</span>}
                                                    {theme.name === "Rose" && <span>🌹</span>}
                                                    {theme.name === "Sky" && <span>🌤️</span>}
                                                    {theme.name === "Amber" && <span>🔆</span>}
                                                    {theme.name === "Indigo" && <span>💙</span>}
                                                    {theme.name === "Teal" && <span>💧</span>}
                                                    {theme.name === "Ruby" && <span>💎</span>}
                                                </div>
                                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-black/30 text-white">{theme.name}</span>
                                                </div>
                                            </div>

                                            {/* Pro Badge */}
                                            {theme.isPro && (
                                                <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                    <Zap className="h-3 w-3" />
                                                    Pro
                                                </div>
                                            )}

                                            {/* Selected Indicator */}
                                            {theme.selected && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Wallpaper Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Wallpaper</h2>
                        <p className="text-gray-600">Set your background and colors</p>

                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                            {wallpapers.map((wallpaper) => (
                                <Card
                                    key={wallpaper.name}
                                    className={`relative cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden ${selectedWallpaper === wallpaper.name ? "ring-2 ring-purple-500 shadow-lg" : ""
                                        }`}
                                    onClick={() => handleWallpaperChange(wallpaper.name)}
                                >
                                    <div className={`aspect-[3/4] relative ${wallpaper.type !== 'image' && !wallpaper.style ? wallpaper.preview : ''}`} style={wallpaper.style || undefined}>
                                        {wallpaper.type === 'image' && (
                                            <img src={(selectedWallpaper === 'Image' && data?.design?.wallpaperImage) ? data.design.wallpaperImage : defaultWallpaperImage} alt="Selected wallpaper" className="absolute inset-0 w-full h-full object-cover" />
                                        )}
                                        {wallpaper.type === 'video' && (
                                            <>
                                                {selectedWallpaper === 'Video' && isWallpaperVideoLoading && (
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                        <div className="w-full h-full">
                                                            <div className="h-full rounded-lg bg-white/10 animate-pulse" />
                                                        </div>
                                                    </div>
                                                )}
                                                <video
                                                    src={data?.design?.wallpaperVideo || defaultWallpaperVideo}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    muted
                                                    playsInline
                                                    autoPlay
                                                    loop
                                                    onLoadedData={() => setIsWallpaperVideoLoading(false)}
                                                    onCanPlay={() => setIsWallpaperVideoLoading(false)}
                                                />
                                            </>
                                        )}
                                        {/* Overlays */}
                                        {wallpaper.type === "gradient" && (
                                            <div className="absolute inset-0 bg-black/10" />
                                        )}
                                        {wallpaper.type === "blur" && (
                                            <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
                                        )}
                                        {wallpaper.type === "pattern" && (
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
                                        )}

                                        {(wallpaper.type === 'image' || wallpaper.type === 'video') && (
                                            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(Number(data?.design?.wallpaperTint || 0)) / 100})` }} />
                                        )}
                                        {/* Bottom labels */}
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-black/30 text-white">{wallpaper.name}</span>
                                        </div>
                                    </div>

                                    {/* Pro Badge */}
                                    {wallpaper.isPro && (
                                        <div className="absolute top-1 right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                                            Pro
                                        </div>
                                    )}



                                    {/* Selected Indicator */}
                                    {selectedWallpaper === wallpaper.name && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>

                        {/* Wallpaper Image Modal */}
                        <Dialog open={isWallpaperModalOpen} onOpenChange={setIsWallpaperModalOpen}>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Choose an image</DialogTitle>
                                    <DialogDescription>Select how you want to add your wallpaper image.</DialogDescription>
                                </DialogHeader>

                                {wallpaperModalStep === 'menu' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <Card onClick={() => setWallpaperModalStep('upload')} className="p-4 cursor-pointer hover:shadow-md transition">
                                            <div className="flex items-center gap-3">
                                                <Upload className="w-5 h-5" />
                                                <div>
                                                    <p className="font-medium">Upload your own</p>
                                                    <p className="text-xs text-gray-500">Use an image from your device</p>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card onClick={() => setWallpaperModalStep('gallery')} className="p-4 cursor-pointer hover:shadow-md transition">
                                            <div className="flex items-center gap-3">
                                                <Image className="w-5 h-5" />
                                                <div>
                                                    <p className="font-medium">Select royalty-free image</p>
                                                    <p className="text-xs text-gray-500">Browse curated Unsplash images</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {wallpaperModalStep === 'upload' && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">Upload Image</p>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <p className="text-sm text-gray-700">Select file to upload,</p>
                                            <p className="text-sm text-gray-500">or drag-and-drop file</p>
                                            <p className="text-xs text-gray-400 mt-2">Allowed file types: JPEG, PNG, WebP, GIF, AVIF, BMP, HEIC, HEIF</p>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,image/heic,image/heif"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        const imageData = ev.target?.result;
                                                        if (!imageData) return;
                                                        updateData({
                                                            design: {
                                                                ...data.design,
                                                                wallpaper: 'Image',
                                                                theme: '',
                                                                wallpaperImage: imageData,
                                                            }
                                                        });
                                                        toast.success('Image set as wallpaper');
                                                        setIsWallpaperModalOpen(false);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                                className="mt-4"
                                            />
                                        </div>
                                    </div>
                                )}

                                {wallpaperModalStep === 'gallery' && (
                                    <div className="mt-4">
                                        <Input
                                            placeholder="Search images (e.g., nature, city, abstract)"
                                            value={galleryQuery}
                                            onChange={(e) => setGalleryQuery(e.target.value)}
                                            className="mb-3"
                                        />
                                        <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
                                            {getUnsplashPlaceholders(galleryQuery).map((src, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className="relative group rounded overflow-hidden"
                                                    onClick={() => {
                                                        updateData({
                                                            design: {
                                                                ...data.design,
                                                                wallpaper: 'Image',
                                                                theme: '',
                                                                wallpaperImage: src,
                                                            }
                                                        });
                                                        toast.success('Image set as wallpaper');
                                                        setIsWallpaperModalOpen(false);
                                                    }}
                                                >
                                                    <img src={src} alt="Unsplash" className="w-full h-24 object-cover" />
                                                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </DialogContent>
                        </Dialog>

                        {/* Wallpaper Video Modal */}
                        <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Choose a video</DialogTitle>
                                    <DialogDescription>Select how you want to add your wallpaper video.</DialogDescription>
                                </DialogHeader>

                                {videoModalStep === 'menu' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <Card onClick={() => setVideoModalStep('upload')} className="p-4 cursor-pointer hover:shadow-md transition">
                                            <div className="flex items-center gap-3">
                                                <Upload className="w-5 h-5" />
                                                <div>
                                                    <p className="font-medium">Upload your own</p>
                                                    <p className="text-xs text-gray-500">Use a video from your device</p>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card onClick={() => setVideoModalStep('gallery')} className="p-4 cursor-pointer hover:shadow-md transition">
                                            <div className="flex items-center gap-3">
                                                <Image className="w-5 h-5" />
                                                <div>
                                                    <p className="font-medium">Select royalty-free video</p>
                                                    <p className="text-xs text-gray-500">Browse curated Coverr videos</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {videoModalStep === 'upload' && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">Upload Video</p>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <p className="text-sm text-gray-700">Select file to upload,</p>
                                            <p className="text-sm text-gray-500">or drag-and-drop file</p>
                                            <p className="text-xs text-gray-400 mt-2">Allowed file types: MP4, WebM, Ogg</p>
                                            <input
                                                type="file"
                                                accept="video/mp4,video/webm,video/ogg"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        const videoData = ev.target?.result;
                                                        if (!videoData) return;
                                                        updateData({
                                                            design: {
                                                                ...data.design,
                                                                wallpaper: 'Video',
                                                                theme: '',
                                                                wallpaperVideo: videoData,
                                                            }
                                                        });
                                                        toast.success('Video set as wallpaper');
                                                        setIsVideoModalOpen(false);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                                className="mt-4"
                                            />
                                        </div>
                                    </div>
                                )}

                                {videoModalStep === 'gallery' && (
                                    <div className="mt-4">
                                        <Input
                                            placeholder="Search videos (e.g., nature, city, abstract)"
                                            value={videoGalleryQuery}
                                            onChange={(e) => setVideoGalleryQuery(e.target.value)}
                                            className="mb-3"
                                        />
                                        <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                                            {getCoverrSamples(videoGalleryQuery).map((src, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className="relative group rounded overflow-hidden"
                                                    onClick={() => {
                                                        updateData({
                                                            design: {
                                                                ...data.design,
                                                                wallpaper: 'Video',
                                                                theme: '',
                                                                wallpaperVideo: src,
                                                            }
                                                        });
                                                        toast.success('Video set as wallpaper');
                                                        setIsVideoModalOpen(false);
                                                    }}
                                                >
                                                    <video src={src} className="w-full h-28 object-cover" muted playsInline />
                                                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </DialogContent>
                        </Dialog>

                        {/* Tint Modal */}
                        <Dialog open={isTintModalOpen} onOpenChange={setIsTintModalOpen}>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Adjust Tint</DialogTitle>
                                    <DialogDescription>Improve readability by adding a subtle tint over your background.</DialogDescription>
                                </DialogHeader>

                                <div className="mt-4">
                                    <div className="aspect-[3/2] relative rounded-lg overflow-hidden bg-gray-100">
                                        {(selectedWallpaper === 'Image') && (
                                            <img src={data?.design?.wallpaperImage || defaultWallpaperImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        )}
                                        {(selectedWallpaper === 'Video') && (
                                            <video src={data?.design?.wallpaperVideo || defaultWallpaperVideo} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
                                        )}
                                        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(tintValue || 0) / 100})` }} />
                                    </div>
                                    <p className={`mt-2 text-sm ${tintValue < 20 ? 'text-red-600' : 'text-gray-600'}`}>
                                        {tintValue < 20
                                            ? "This amount of tint may make your content hard to read and less accessible."
                                            : "This amount of tint improves text visibility and helps make your content more accessible."}
                                    </p>

                                    <div className="my-6">
                                        <input
                                            type="range"
                                            min={-20}
                                            max={80}
                                            value={tintValue}
                                            onChange={(e) => setTintValue(Number(e.target.value))}
                                            className="w-full h-1 mb-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                        />
                                        <div className="flex items-center justify-between w-full mt-2">
                                            <Sun className="w-5 h-5" />
                                            <Moon className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsTintModalOpen(false)}>Cancel</Button>
                                        <Button onClick={() => {
                                            updateData({
                                                design: {
                                                    ...data.design,
                                                    wallpaperTint: tintValue,
                                                }
                                            });
                                            toast.success('Tint applied');
                                            setIsTintModalOpen(false);
                                        }}>Apply</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div>
                            {(selectedWallpaper === 'Image' || selectedWallpaper === 'Video') ? (
                                <Button size="sm" variant="outline" onClick={() => setIsTintModalOpen(true)} className="flex items-center justify-between w-full rounded-full border border-blue-200 p-5 my-4">
                                    <h3 className="text-lg font-semibold">Tint</h3>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <>
                                    <h3 className="text-lg font-semibold mb-4">Color</h3>
                                    <div className="flex gap-3 mb-4">
                                        <div className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer">
                                            <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded"></div>
                                        </div>
                                        {colorOptions.map((color, index) => (
                                            <div
                                                key={index}
                                                className={`w-10 h-10 ${color} rounded-lg cursor-pointer border border-gray-200`}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500">Suggested colors are based on your profile image</p>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Style Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Style</h2>
                        <p className="text-gray-600">Customize buttons and typography</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex gap-6 border-b border-gray-200 mb-6">
                            {["Presets", "Text", "Buttons"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveStyleTab(tab)}
                                    className={`pb-3 px-1 font-medium transition-colors relative ${activeStyleTab === tab
                                        ? "text-gray-900 border-b-2 border-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeStyleTab === "Presets" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Button and font</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {buttonStyles.map((style) => (
                                        <Card
                                            key={style.name}
                                            className={`cursor-pointer transition-all hover:scale-105 ${selectedStyle === style.name ? "ring-2 ring-purple-500" : ""
                                                }`}
                                            onClick={() => handleStyleChange(style.name)}
                                        >
                                            <div className="p-4 flex flex-col items-center gap-3">
                                                <div className={`px-4 py-2 text-sm ${style.style}`}>
                                                    Button
                                                </div>
                                                <p className="text-sm font-medium text-center">{style.name}</p>
                                            </div>
                                            {/* {(style.name === "Retro" || style.name === "Modern") && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">?</span>
                                                </div>
                                            )} */}
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeStyleTab === "Text" && (
                            <div className="space-y-8">
                                {/* Font Selection */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Font Family</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {fonts.map((font) => (
                                            <Card
                                                key={font.name}
                                                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${selectedFont === font.name ? "ring-2 ring-purple-500 shadow-lg" : ""
                                                    }`}
                                                onClick={() => handleFontChange(font.name)}
                                            >
                                                <div className="p-4 flex flex-col items-center gap-3">
                                                    {/* Font Preview */}
                                                    <div className="w-full h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                                                        <span
                                                            className="text-lg font-medium text-gray-800"
                                                            style={{
                                                                fontFamily: font.family,
                                                                fontWeight: font.weight
                                                            }}
                                                        >
                                                            Aa
                                                        </span>
                                                    </div>

                                                    {/* Font Name */}
                                                    <p className="text-sm font-medium text-center text-gray-800">{font.name}</p>

                                                    {/* Font Weight */}
                                                    <span className="text-xs text-gray-500">{font.weight}</span>
                                                </div>

                                                {/* Selected Indicator */}
                                                {selectedFont === font.name && (
                                                    <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Font Weight Options */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Font Weight</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { weight: "300", name: "Light" },
                                            { weight: "400", name: "Regular" },
                                            { weight: "500", name: "Medium" },
                                            { weight: "600", name: "Semi Bold" },
                                            { weight: "700", name: "Bold" },
                                            { weight: "800", name: "Extra Bold" },
                                        ].map((weight) => (
                                            <Card
                                                key={weight.weight}
                                                className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                                            >
                                                <div className="p-3 flex flex-col items-center gap-2">
                                                    <span
                                                        className="text-lg text-gray-800"
                                                        style={{
                                                            fontFamily: selectedFont,
                                                            fontWeight: weight.weight
                                                        }}
                                                    >
                                                        Aa
                                                    </span>
                                                    <p className="text-xs font-medium text-gray-600">{weight.name}</p>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Font Size Options */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Font Size</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { size: "12px", name: "Small" },
                                            { size: "14px", name: "Regular" },
                                            { size: "16px", name: "Medium" },
                                            { size: "18px", name: "Large" },
                                            { size: "20px", name: "XL" },
                                            { size: "24px", name: "XXL" },
                                        ].map((size) => (
                                            <Card
                                                key={size.size}
                                                className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                                            >
                                                <div className="p-3 flex flex-col items-center gap-2">
                                                    <span
                                                        className="text-gray-800"
                                                        style={{
                                                            fontFamily: selectedFont,
                                                            fontSize: size.size
                                                        }}
                                                    >
                                                        Aa
                                                    </span>
                                                    <p className="text-xs font-medium text-gray-600">{size.name}</p>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Preview */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Preview</h3>
                                    <Card className="p-6 bg-gray-50">
                                        <div className="space-y-4">
                                            <h2
                                                className="text-2xl font-bold text-gray-900"
                                                style={{ fontFamily: selectedFont }}
                                            >
                                                Your Profile Title
                                            </h2>
                                            <p
                                                className="text-gray-600"
                                                style={{ fontFamily: selectedFont }}
                                            >
                                                This is how your profile text will look with the selected font. You can see the difference in typography and readability.
                                            </p>
                                            <div className="flex gap-2">
                                                <span
                                                    className="text-sm text-gray-500"
                                                    style={{ fontFamily: selectedFont }}
                                                >
                                                    Bio text example
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeStyleTab === "Buttons" && (
                            <div>
                                <p className="text-gray-500">Button customization options coming soon...</p>
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DesignTab;