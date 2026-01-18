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
import { toast } from 'sonner';
import { supabase } from "../../../lib/supabase";
import { themeStyles, wallpaperStyles, buttonStyles as buttonStylesMap } from "../../../lib/designStyles";

const DesignTab = () => {
    const { data, updateData, updateDesignData, canUndo, canRedo, undo, redo, hasUnsavedChanges, saveDesign } = useDashboard();
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState("Customizable");
    const [activeStyleTab, setActiveStyleTab] = useState("Buttons");
    const [activeFontCategory, setActiveFontCategory] = useState("sans");
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
                await saveDesign(data.design, data.profile);
                toast.success("Design changes saved successfully!");
            } catch (error) {
                toast.error("Failed to save design changes");
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
    }, [canUndo, canRedo, hasUnsavedChanges]);

    // Get current design settings from context
    const selectedTheme = data?.design?.theme || "";
    const selectedWallpaper = data?.design?.wallpaper || "";
    const selectedStyle = data?.design?.buttonStyle || "Minimal";
    const selectedFont = data?.design?.fontFamily || "Inter";
    const hideVizitlinkFooter = data?.design?.hideVizitlinkFooter || false;

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
        updateDesignData({ hideVizitlinkFooter: checked });
    };

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                // Show loading toast
                const loadingToast = toast.loading("Uploading profile picture...");

                // Check if there's an existing avatar to delete
                const currentAvatarUrl = data.profile.avatar;
                let oldFilePath = null;

                // Extract the file path from the URL if it exists and is from Supabase
                if (currentAvatarUrl && currentAvatarUrl.includes('/avatars/')) {
                    // Extract the path after /avatars/ from the URL
                    const urlParts = currentAvatarUrl.split('/avatars/');
                    if (urlParts.length > 1) {
                        oldFilePath = urlParts[1];
                    }
                }

                // Generate a unique file name for the new upload
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${data.profile.id}/${fileName}`;

                // Upload to Supabase avatar bucket
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file);

                if (uploadError) {
                    toast.dismiss(loadingToast);
                    toast.error("Upload error: " + uploadError.message);
                    return;
                }

                // Get the public URL
                const { data: publicUrlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                const avatarUrl = publicUrlData.publicUrl;

                // Update profile with the avatar URL
                updateData({
                    profile: {
                        ...data.profile,
                        avatar: avatarUrl
                    }
                });

                // Delete the old avatar file if it exists
                if (oldFilePath) {
                    const { error: deleteError } = await supabase.storage
                        .from('avatars')
                        .remove([oldFilePath]);

                    if (deleteError) {
                        console.error("Error deleting old avatar:", deleteError);
                    }
                }

                toast.dismiss(loadingToast);
                toast.success("Profile picture uploaded successfully");
            } catch (error) {
                toast.error("Upload error: " + error.message);
                console.error("Profile picture upload error:", error);
            }
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

    // Generate themes from common themeStyles
    const customizableThemeNames = ["Agate", "Blocks", "Air", "Bloom", "Sunset", "Trianglify", "Lake", "Leave", "Mineral", "Ocean", "Groov", "Winter", "Venetian Blinds", "Spring", "Summer", "Autumn"];
    const curatedThemeNames = ["Midnight", "Aurora", "Coral", "Forest", "Lavender", "Sage", "Rose", "Sky", "Amber", "Indigo", "Teal", "Ruby"];

    const themes = customizableThemeNames.map(name => {
        const themeStyle = themeStyles[name];
        if (!themeStyle) return null;
        const isPro = name === "Bloom" || name === "Breeze";
        if (themeStyle.type === 'svg') {
            return { name, svg: themeStyle.svg, textColor: themeStyle.textColor, selected: selectedTheme === name, type: "svg" };
        } else {
            return { name, preview: themeStyle.background, textColor: themeStyle.textColor, selected: selectedTheme === name, isPro, type: themeStyle.background.includes('gradient') ? "gradient" : "solid" };
        }
    }).filter(Boolean);

    const curatedThemes = curatedThemeNames.map(name => {
        const themeStyle = themeStyles[name];
        if (!themeStyle) return null;
        const isPro = name === "Aurora" || name === "Rose" || name === "Ruby";
        return { name, preview: themeStyle.background, textColor: themeStyle.textColor, selected: selectedTheme === name, isPro, type: "gradient" };
    }).filter(Boolean);

    // Generate wallpapers from common wallpaperStyles
    const wallpapers = Object.keys(wallpaperStyles).map(name => {
        const wallpaperStyle = wallpaperStyles[name];
        const isPro = name === "Video";
        const typeMap = {
            'Hero': 'gradient',
            'Fill': 'solid',
            'Gradient': 'gradient',
            'Blur': 'blur',
            'Pattern': 'pattern',
            'Image': 'image',
            'Video': 'video'
        };
        return {
            name,
            preview: name === "Image" && selectedWallpaper === "Image" && data?.design?.wallpaperImage ? "" : wallpaperStyle.background,
            icon: true,
            isPro,
            type: typeMap[name] || 'gradient'
        };
    });

    const colorOptions = [
        "bg-teal-500", "bg-blue-600", "bg-cyan-500", "bg-gray-100", "bg-black"
    ];

    // Generate buttonStyles from common buttonStylesMap
    const buttonStyles = Object.keys(buttonStylesMap).map(name => ({
        name,
        style: buttonStylesMap[name]
    }));

    // Fonts organized by category - using quoted family names for CSS compatibility
    const sansFonts = [
        { name: "Albert Sans", family: '"Albert Sans", sans-serif', weight: "400", selected: selectedFont === "Albert Sans" },
        { name: "Belanosima", family: '"Belanosima", sans-serif', weight: "400", selected: selectedFont === "Belanosima" },
        { name: "Bricolage Grotesque", family: '"Bricolage Grotesque", sans-serif', weight: "400", selected: selectedFont === "Bricolage Grotesque" },
        { name: "DM Sans", family: '"DM Sans", sans-serif', weight: "400", selected: selectedFont === "DM Sans" },
        { name: "Epilogue", family: '"Epilogue", sans-serif', weight: "400", selected: selectedFont === "Epilogue" },
        { name: "IBM Plex Sans", family: '"IBM Plex Sans", sans-serif', weight: "400", selected: selectedFont === "IBM Plex Sans" },
        { name: "Inter", family: '"Inter", sans-serif', weight: "400", selected: selectedFont === "Inter" },
        { name: "Lato", family: '"Lato", sans-serif', weight: "400", selected: selectedFont === "Lato" },
        { name: "Link Sans", family: '"Link Sans", sans-serif', weight: "400", selected: selectedFont === "Link Sans" },
        { name: "M Plus Rounded", family: '"M Plus Rounded", sans-serif', weight: "400", selected: selectedFont === "M Plus Rounded" },
        { name: "Manrope", family: '"Manrope", sans-serif', weight: "400", selected: selectedFont === "Manrope" },
        { name: "Oxanium", family: '"Oxanium", sans-serif', weight: "400", selected: selectedFont === "Oxanium" },
        { name: "Poppins", family: '"Poppins", sans-serif', weight: "500", selected: selectedFont === "Poppins" },
        { name: "Red Hat Display", family: '"Red Hat Display", sans-serif', weight: "400", selected: selectedFont === "Red Hat Display" },
        { name: "Roboto", family: '"Roboto", sans-serif', weight: "400", selected: selectedFont === "Roboto" },
        { name: "Rubik", family: '"Rubik", sans-serif', weight: "400", selected: selectedFont === "Rubik" },
        { name: "Space Grotesk", family: '"Space Grotesk", sans-serif', weight: "400", selected: selectedFont === "Space Grotesk" },
        { name: "Syne", family: '"Syne", sans-serif', weight: "400", selected: selectedFont === "Syne" },
        { name: "Shantell Sans", family: '"Shantell Sans", sans-serif', weight: "400", selected: selectedFont === "Shantell Sans" },
    ];

    const serifFonts = [
        { name: "BioRhyme", family: '"BioRhyme", serif', weight: "400", selected: selectedFont === "BioRhyme" },
        { name: "Bitter", family: '"Bitter", serif', weight: "400", selected: selectedFont === "Bitter" },
        { name: "Caudex", family: '"Caudex", serif', weight: "400", selected: selectedFont === "Caudex" },
        { name: "Corben", family: '"Corben", serif', weight: "400", selected: selectedFont === "Corben" },
        { name: "Domine", family: '"Domine", serif', weight: "400", selected: selectedFont === "Domine" },
        { name: "Hahmlet", family: '"Hahmlet", serif', weight: "400", selected: selectedFont === "Hahmlet" },
        { name: "IBM Plex Serif", family: '"IBM Plex Serif", serif', weight: "400", selected: selectedFont === "IBM Plex Serif" },
        { name: "Lora", family: '"Lora", serif', weight: "400", selected: selectedFont === "Lora" },
        { name: "Merriweather", family: '"Merriweather", serif', weight: "400", selected: selectedFont === "Merriweather" },
        { name: "Noto Serif", family: '"Noto Serif", serif', weight: "400", selected: selectedFont === "Noto Serif" },
        { name: "Old Standard TT", family: '"Old Standard TT", serif', weight: "400", selected: selectedFont === "Old Standard TT" },
        { name: "PT Serif", family: '"PT Serif", serif', weight: "400", selected: selectedFont === "PT Serif" },
        { name: "Playfair Display", family: '"Playfair Display", serif', weight: "400", selected: selectedFont === "Playfair Display" },
        { name: "Roboto Serif", family: '"Roboto Serif", serif', weight: "400", selected: selectedFont === "Roboto Serif" },
        { name: "Roboto Slab", family: '"Roboto Slab", serif', weight: "400", selected: selectedFont === "Roboto Slab" },
        { name: "Source Serif Pro", family: '"Source Serif Pro", serif', weight: "400", selected: selectedFont === "Source Serif Pro" },
    ];

    const monoFonts = [
        { name: "IBM Plex Mono", family: '"IBM Plex Mono", monospace', weight: "400", selected: selectedFont === "IBM Plex Mono" },
        { name: "Space Mono", family: '"Space Mono", monospace', weight: "400", selected: selectedFont === "Space Mono" },
    ];

    const fonts = [...sansFonts, ...serifFonts, ...monoFonts];

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
            "https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/wallpapervideo/default/Glass.mp4",
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
    const defaultWallpaperVideo = 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/wallpapervideo/default/Glass.mp4' || getCoverrSamples()[0];

    // Tint controls
    const [isTintModalOpen, setIsTintModalOpen] = useState(false);
    const [tintValue, setTintValue] = useState(Number(data?.design?.wallpaperTint || 20));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Design Controls Header - Mobile optimized */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm transform-gpu">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                        <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleUndo}
                                    disabled={!canUndo}
                                    className="flex items-center gap-1 sm:gap-2 hover:bg-gray-50 transition-all duration-200 h-10 w-10 sm:h-9 sm:w-auto sm:px-3"
                                >
                                    <Undo2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Undo</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRedo}
                                    disabled={!canRedo}
                                    className="flex items-center gap-1 sm:gap-2 hover:bg-gray-50 transition-all duration-200 h-10 w-10 sm:h-9 sm:w-auto sm:px-3"
                                >
                                    <Redo2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Redo</span>
                                </Button>
                            </div>

                            {/* Status indicator - Mobile optimized */}
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                                <div className={`w-2 h-2 rounded-full ${hasUnsavedChanges ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                                <span className="hidden sm:inline">
                                    {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            {hasUnsavedChanges && (
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md h-10 sm:h-9 px-4 sm:px-3 w-full sm:w-auto"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span className="text-sm sm:text-base">
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 px-3 sm:px-4 py-4 sm:py-6 overflow-visible">

                {/* Profile Section */}
                <section>
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">Profile</h1>
                        <p className="text-gray-600 text-sm sm:text-base">Customize your profile appearance</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="relative">
                                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                                    <AvatarImage src={data?.profile?.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-teal-400 to-blue-600 text-white text-xl sm:text-2xl font-bold">
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
                            {/* Moved from onboarding modal: Display Name and Bio editing */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
                                    <input
                                        type="text"
                                        value={data?.profile?.displayName || ''}
                                        onChange={(e) => updateData({ profile: { ...data.profile, displayName: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={data?.profile?.bio || ''}
                                        onChange={(e) => updateData({ profile: { ...data.profile, bio: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows="3"
                                        placeholder="Add a short bio"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">Hide Vizitlink footer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-gray-400" />
                                    <Switch
                                        checked={hideVizitlinkFooter}
                                        onCheckedChange={handleHideFooterChange}
                                    />
                                </div>
                            </div>

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

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {activeTab === "Customizable" && (
                                <>
                                    {themes.map((theme) => (
                                        <Card
                                            key={theme.name}
                                            className={`relative cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden min-h-[120px] sm:min-h-[140px] ${theme.selected ? "ring-2 ring-purple-500 shadow-lg" : ""
                                                }`}
                                            onClick={() => handleThemeChange(theme.name)}
                                        >
                                            <div className={`aspect-[3/4] relative ${theme.preview || ''} ${theme.textColor}`}>
                                                {/* SVG Background */}
                                                {theme.type === "svg" && theme.svg && (
                                                    <img
                                                        src={theme.svg}
                                                        alt={theme.name}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                )}
                                                {/* Overlay for readability */}
                                                {theme.type === "gradient" && (
                                                    <div className="absolute inset-0 bg-black/10" />
                                                )}
                                                {theme.type === "svg" && (
                                                    <div className="absolute inset-0 bg-black/20" />
                                                )}
                                                <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 flex items-center justify-between">
                                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-black/30 text-white">{theme.name}</span>
                                                </div>
                                            </div>

                                            {/* Pro Badge - Mobile optimized */}
                                            {theme.isPro && (
                                                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                    <Zap className="h-3 w-3" />
                                                    <span className="hidden sm:inline">Pro</span>
                                                </div>
                                            )}

                                            {/* Selected Indicator - Mobile optimized */}
                                            {theme.selected && (
                                                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                            {wallpapers.map((wallpaper) => (
                                <Card
                                    key={wallpaper.name}
                                    className={`relative cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden min-h-[120px] sm:min-h-[140px] ${selectedWallpaper === wallpaper.name ? "ring-2 ring-purple-500 shadow-lg" : ""
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
                                        {/* Bottom labels - Mobile optimized */}
                                        <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 flex items-center justify-between">
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-black/30 text-white">{wallpaper.name}</span>
                                        </div>
                                    </div>

                                    {/* Pro Badge - Mobile optimized */}
                                    {wallpaper.isPro && (
                                        <div className="absolute top-1 right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                                            <span className="hidden sm:inline">Pro</span>
                                        </div>
                                    )}

                                    {/* Selected Indicator - Mobile optimized */}
                                    {selectedWallpaper === wallpaper.name && (
                                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-4 h-4 sm:w-4 sm:h-4 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <DialogTitle>Choose an image</DialogTitle>
                                            <DialogDescription>Select how you want to add your wallpaper image.</DialogDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsWallpaperModalOpen(false)}
                                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </DialogHeader>

                                {wallpaperModalStep === 'menu' && (
                                    <div className="flex flex-col gap-4 mt-4">
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
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    // Show loading toast
                                                    const loadingToast = toast.loading("Uploading wallpaper image...");

                                                    try {
                                                        // Check if there's an existing wallpaper image to delete
                                                        const currentWallpaperUrl = data.design?.wallpaperImage;
                                                        let oldFilePath = null;

                                                        // Extract the file path from the URL if it exists and is from Supabase
                                                        if (currentWallpaperUrl && currentWallpaperUrl.includes('/wallpaperimage/')) {
                                                            // Extract the path after /wallpaperimage/ from the URL
                                                            const urlParts = currentWallpaperUrl.split('/wallpaperimage/');
                                                            if (urlParts.length > 1) {
                                                                oldFilePath = urlParts[1];
                                                            }
                                                        }

                                                        // Generate a unique file name
                                                        const fileExt = file.name.split('.').pop();
                                                        const fileName = `${Date.now()}.${fileExt}`;
                                                        const filePath = `${data.profile.id}/${fileName}`;

                                                        // Upload to Supabase wallpaperimage bucket
                                                        const { data: uploadData, error: uploadError } = await supabase.storage
                                                            .from('wallpaperimage')
                                                            .upload(filePath, file);

                                                        if (uploadError) {
                                                            toast.dismiss(loadingToast);
                                                            toast.error("Upload error: " + uploadError.message);
                                                            return;
                                                        }

                                                        // Get the public URL
                                                        const { data: publicUrlData } = supabase.storage
                                                            .from('wallpaperimage')
                                                            .getPublicUrl(filePath);

                                                        const wallpaperUrl = publicUrlData.publicUrl;

                                                        // Update design with the wallpaper URL
                                                        updateData({
                                                            design: {
                                                                ...data.design,
                                                                wallpaper: 'Image',
                                                                theme: '',
                                                                wallpaperImage: wallpaperUrl,
                                                            }
                                                        });

                                                        // If there was an old file, try to delete it
                                                        if (oldFilePath) {
                                                            const { error: deleteError } = await supabase.storage
                                                                .from('wallpaperimage')
                                                                .remove([oldFilePath]);

                                                            if (deleteError) {
                                                                console.error("Error deleting old wallpaper image:", deleteError);
                                                            }
                                                        }

                                                        toast.dismiss(loadingToast);
                                                        toast.success("Image set as wallpaper");
                                                        setIsWallpaperModalOpen(false);
                                                    } catch (error) {
                                                        toast.dismiss(loadingToast);
                                                        toast.error("Upload error: " + error.message);
                                                        console.error("Wallpaper image upload error:", error);
                                                    }
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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <DialogTitle>Choose a video</DialogTitle>
                                            <DialogDescription>Select how you want to add your wallpaper video.</DialogDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsVideoModalOpen(false)}
                                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </DialogHeader>

                                {videoModalStep === 'menu' && (
                                    <div className="flex flex-col gap-4 mt-4">
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
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    // Show loading toast
                                                    const loadingToast = toast.loading("Uploading wallpaper video...");

                                                    try {
                                                        // Check if there's an existing wallpaper video to delete
                                                        const currentVideoUrl = data.design?.wallpaperVideo;
                                                        let oldFilePath = null;

                                                        // Extract the file path from the URL if it exists and is from Supabase
                                                        if (currentVideoUrl && currentVideoUrl.includes('/wallpapervideo/')) {
                                                            // Extract the path after /wallpapervideo/ from the URL
                                                            const urlParts = currentVideoUrl.split('/wallpapervideo/');
                                                            if (urlParts.length > 1) {
                                                                oldFilePath = urlParts[1];
                                                            }
                                                        }

                                                        // Generate a unique file name
                                                        const fileExt = file.name.split('.').pop();
                                                        const fileName = `${Date.now()}.${fileExt}`;
                                                        const filePath = `${data.profile.id}/${fileName}`;

                                                        // Upload to Supabase wallpapervideo bucket
                                                        const { data: uploadData, error: uploadError } = await supabase.storage
                                                            .from('wallpapervideo')
                                                            .upload(filePath, file);

                                                        if (uploadError) {
                                                            toast.dismiss(loadingToast);
                                                            toast.error("Upload error: " + uploadError.message);
                                                            return;
                                                        }

                                                        // Get the public URL
                                                        const { data: publicUrlData } = supabase.storage
                                                            .from('wallpapervideo')
                                                            .getPublicUrl(filePath);

                                                        const videoUrl = publicUrlData.publicUrl;

                                                        // Update design with the video URL
                                                        updateData({
                                                            design: {
                                                                ...data.design,
                                                                wallpaper: 'Video',
                                                                theme: '',
                                                                wallpaperVideo: videoUrl,
                                                            }
                                                        });

                                                        // If there was an old file, try to delete it
                                                        if (oldFilePath) {
                                                            const { error: deleteError } = await supabase.storage
                                                                .from('wallpapervideo')
                                                                .remove([oldFilePath]);

                                                            if (deleteError) {
                                                                console.error("Error deleting old wallpaper video:", deleteError);
                                                            }
                                                        }

                                                        toast.dismiss(loadingToast);
                                                        toast.success("Video set as wallpaper");
                                                        setIsVideoModalOpen(false);
                                                    } catch (error) {
                                                        toast.dismiss(loadingToast);
                                                        toast.error("Upload error: " + error.message);
                                                        console.error("Wallpaper video upload error:", error);
                                                    }
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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <DialogTitle>Adjust Tint</DialogTitle>
                                            <DialogDescription>Improve readability by adding a subtle tint over your background.</DialogDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsTintModalOpen(false)}
                                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
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
                                    {/* <h3 className="text-lg font-semibold mb-4">Color</h3>
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
                                    <p className="text-sm text-gray-500">Suggested colors are based on your profile image</p> */}
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
                            {["Buttons", "Text",].map((tab) => (
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

                        {activeStyleTab === "Text" && (
                            <div className="space-y-8">
                                {/* Font Selection */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Font Family</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                        {fonts.map((font) => (
                                            <Card
                                                key={font.name}
                                                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg min-h-[120px] sm:min-h-[140px] ${selectedFont === font.name ? "ring-2 ring-purple-500 shadow-lg" : ""
                                                    }`}
                                                onClick={() => handleFontChange(font.name)}
                                            >
                                                <div className="p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3">
                                                    {/* Font Preview - Mobile optimized */}
                                                    <div className="w-full h-12 sm:h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                                                        <span
                                                            className="text-base sm:text-lg font-medium text-gray-800"
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

                                                {/* Selected Indicator - Mobile optimized */}
                                                {selectedFont === font.name && (
                                                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Font Weight Options */}
                                {/* <div>
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
                                </div> */}

                                {/* Font Size Options */}
                                {/* <div>
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
                                </div> */}

                                {/* Live Preview */}
                                {/* <div>
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
                                </div> */}
                            </div>
                        )}

                        {activeStyleTab === "Buttons" && (
                            <div className="space-y-6">
                                {/* Button Style Selection */}
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Button Style</h3>
                                        <p className="text-sm text-gray-500">Choose a style that matches your profile design</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            {
                                                name: 'Solid',
                                                description: 'Solid background with clean look'
                                            },
                                            {
                                                name: 'Glass',
                                                description: 'Glass morphism with blur effect'
                                            },
                                            {
                                                name: 'Outline',
                                                description: 'Transparent with border outline'
                                            }
                                        ].map((style) => {
                                            const isSelected = selectedStyle === style.name;
                                            return (
                                                <Card
                                                    key={style.name}
                                                    className={`cursor-pointer transition-all duration-300 p-6 hover:shadow-xl hover:-translate-y-1 border-2 ${isSelected
                                                            ? 'ring-2 ring-purple-500 ring-offset-2 shadow-lg border-[#7d23cc] bg-purple-50/50'
                                                            : 'border-gray-200 hover:border-purple-300 !bg-gray-100'
                                                        }`}
                                                    onClick={() => handleStyleChange(style.name)}
                                                >
                                                    <div className="flex flex-col items-center gap-4">
                                                        {/* Preview Button */}
                                                        <div className={`w-full h-16 flex items-center justify-center rounded-lg transition-all ${style.name === 'Solid' ? 'bg-[#7d23cc] !text-white border border-gray-200 shadow-sm' :
                                                                style.name === 'Glass' ? 'bg-white/10 !text-[#7d23cc] backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-lg shadow-black/10' :
                                                                    'bg-transparent !text-[#7d23cc] border-2 border-[#7d23cc]'
                                                            } ${isSelected ? 'ring-2 ring-purple-400 ring-offset-1' : ''}`}>
                                                            <span className={`font-medium text-sm`}>
                                                                Button Preview
                                                            </span>
                                                        </div>

                                                        {/* Style Info */}
                                                        <div className="text-center w-full">
                                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                                <p className="font-bold text-gray-900 text-lg">{style.name}</p>
                                                                {isSelected && (
                                                                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 leading-relaxed">{style.description}</p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DesignTab;