"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../../ui/button';
import { useDashboard } from '../../../context/DashboardContext';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  ExternalLink,
  AlertTriangle,
  Image as ImageIcon,
  Layout,
  BarChart2,
  Check,
  ToggleLeft,
  ToggleRight,
  MoreHorizontal
} from 'lucide-react';
import AddSocialLinkModal from '../modals/AddSocialLinkModal';
import AddCustomLinkModal from '../modals/AddCustomLinkModal';
import EditLinkModal from '../modals/EditLinkModal';
import { socialIconsMap, socialColorsMap } from '../../../lib/social';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Switch } from '../../ui/switch';
import { supabase } from '../../../lib/supabase';

const generateId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch { }
  return `link_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

// Layout Frame Component
function LayoutFrame({ layoutLink, onUpdate, onCancel, onSave }) {
  const [layoutTool, setLayoutTool] = useState(!layoutLink.title && !layoutLink.url ? 'layout' : null);
  const [isEditingDraft, setIsEditingDraft] = useState(true);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [metadataError, setMetadataError] = useState(null);
  const fetchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const lastFetchedUrlRef = useRef(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // URL validation function with enhanced checks
  const isValidUrl = (string) => {
    if (!string || typeof string !== 'string') return false;
    
    // Trim whitespace
    const trimmed = string.trim();
    if (!trimmed) return false;
    
    try {
      const url = new URL(trimmed);
      // Only allow http and https protocols
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
      // Ensure hostname exists
      if (!url.hostname || url.hostname.length === 0) return false;
      return true;
    } catch (_) {
      return false;
    }
  };

  // Enhanced metadata fetch with abort controller and error handling
  const fetchMetadata = async (url) => {
    // Validation checks
    if (!url || !url.trim()) return;
    
    const trimmedUrl = url.trim();
    
    // Skip if already fetching or if URL is the same as last fetch
    if (isFetchingMeta || trimmedUrl === lastFetchedUrlRef.current) return;
    
    // Validate URL format
    if (!isValidUrl(trimmedUrl)) {
      setMetadataError('Invalid URL format');
      return;
    }

    // Cancel any previous fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this fetch
    abortControllerRef.current = new AbortController();
    
    setIsFetchingMeta(true);
    setMetadataError(null);
    lastFetchedUrlRef.current = trimmedUrl;
    
    const loadingToast = toast.loading('Fetching link metadata...');
    
    try {
      const response = await fetch('/api/extract-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
        signal: abortControllerRef.current.signal,
      });
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
      
      const data = await response.json();

      if (data.success && data.data) {
        // Extract and validate metadata
        const metadata = {
          title: data.data.title?.trim() || '',
          thumbnail: data.data.image || data.data.og_image || '',
          description: data.data.description?.trim() || '',
          domain: data.data.domain || new URL(trimmedUrl).hostname,
          favicon: data.data.favicon || data.data.icon || '',
        };
        
        // Update with fetched data - preserve existing title if present
        const updatedLink = {
          ...layoutLink,
          url: trimmedUrl,
          title: layoutLink?.title?.trim() ? layoutLink.title : metadata.title,
          thumbnail: metadata.thumbnail || layoutLink?.thumbnail,
          description: metadata.description || layoutLink?.description,
          domain: metadata.domain || layoutLink?.domain,
          favicon: metadata.favicon || layoutLink?.favicon,
          active: true, // Auto-activate when metadata is successfully fetched
        };

        await onUpdate(updatedLink);

        toast.dismiss(loadingToast);
        // Auto-save after successful metadata fetch
        setTimeout(() => {
          onSave(updatedLink);
          setIsEditingDraft(false);
          toast.success('Link metadata fetched successfully');
        }, 500);
      } else {
        // Handle unsuccessful metadata extraction
        toast.dismiss(loadingToast);
        setMetadataError(data.error || 'Could not extract metadata from URL');
        toast.warning('Limited metadata available for this URL');
        
        // Still update with URL and basic info
        const basicUpdate = {
          ...layoutLink,
          url: trimmedUrl,
          domain: new URL(trimmedUrl).hostname,
          active: false,
        };
        await onUpdate(basicUpdate);
      }
    } catch (error) {
      // Handle abort separately from other errors
      if (error.name === 'AbortError') {
        toast.dismiss(loadingToast);
        return;
      }
      
      toast.dismiss(loadingToast);
      console.error('Error fetching metadata:', error);
      setMetadataError(error.message || 'Failed to fetch metadata');
      toast.error('Failed to fetch link metadata');
      
      // Update with URL even if metadata fetch failed
      const fallbackUpdate = {
        ...layoutLink,
        url: trimmedUrl,
        domain: new URL(trimmedUrl).hostname,
        active: false,
      };
      await onUpdate(fallbackUpdate);
    } finally {
      setIsFetchingMeta(false);
      abortControllerRef.current = null;
    }
  };

  // Debounced URL change handler with improved validation
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;

    // Clear any error state
    setMetadataError(null);
    
    // Update URL immediately for responsive typing
    if (layoutLink.url !== newUrl) {
      onUpdate({ url: newUrl });

      // Clear previous timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      // Only trigger metadata fetch if URL is valid
      const trimmedUrl = newUrl?.trim();
      if (trimmedUrl && isValidUrl(trimmedUrl)) {
        // Debounce with longer delay for better UX
        fetchTimeoutRef.current = setTimeout(() => {
          fetchMetadata(trimmedUrl);
        }, 1200);
      } else if (trimmedUrl && trimmedUrl.length > 10) {
        // Show validation error for invalid URLs after some typing
        fetchTimeoutRef.current = setTimeout(() => {
          setMetadataError('Please enter a valid URL (http:// or https://)');
        }, 800);
      }
    }
  };

  // Enhanced paste handler with immediate fetch
  const handleUrlPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text')?.trim();
    
    if (!pastedText) return;
    
    // Clear error state
    setMetadataError(null);
    
    // Validate pasted URL
    if (!isValidUrl(pastedText)) {
      setMetadataError('Pasted URL is not valid');
      onUpdate({ url: pastedText });
      return;
    }

    // Clear previous timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Update URL
    if (layoutLink.url !== pastedText) {
      onUpdate({ url: pastedText });
      
      // Fetch metadata immediately on paste (shorter delay)
      fetchTimeoutRef.current = setTimeout(() => {
        fetchMetadata(pastedText);
      }, 300);
    }
  };

  const handleThumbnailUpload = async (event) => {
    // const f = e.target.files?.[0]; 
    // if (!f) return; 
    // const r = new FileReader(); 
    // r.onload = () => onUpdate({ thumbnail: r.result }); 
    // r.readAsDataURL(f);

    const file = event.target.files[0];
    if (file) {
      try {
        // Show loading toast
        const loadingToast = toast.loading("Uploading thumbnail...");

        // Check if there's an existing thumbnail to delete
        const currentThumbnailUrl = layoutLink.thumbnail;
        let oldFilePath = null;

        // Extract the file path from the URL if it exists and is from Supabase
        if (currentThumbnailUrl && currentThumbnailUrl.includes('/link_thumbnail/')) {
          // Extract the path after /link_thumbnail/ from the URL
          const urlParts = currentThumbnailUrl.split('/link_thumbnail/');
          if (urlParts.length > 1) {
            oldFilePath = urlParts[1];
          }
        }

        // Generate a unique file name for the new upload
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${layoutLink.profile_id}/${fileName}`;

        // Upload to Supabase thumbnail bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('link_thumbnail')
          .upload(filePath, file);

        if (uploadError) {
          toast.dismiss(loadingToast);
          toast.error("Upload error: " + uploadError.message);
          return;
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('link_thumbnail')
          .getPublicUrl(filePath);

        const thumbnailUrl = publicUrlData.publicUrl;

        // Update profile with the thumbnail URL
        onUpdate({ thumbnail: thumbnailUrl })

        // Delete the old thumbnail file if it exists
        if (oldFilePath) {
          const { error: deleteError } = await supabase.storage
            .from('link_thumbnail')
            .remove([oldFilePath]);

          if (deleteError) {
            console.error("Error deleting old thumbnail:", deleteError);
          }
        }

        toast.dismiss(loadingToast);
        toast.success("Thumbnail uploaded successfully");
      } catch (error) {
        toast.error("Upload error: " + error.message);
        console.error("Thumbnail upload error:", error);
      }
    }
  };

  return (
    <div className="mb-5 rounded-2xl border border-gray-200 bg-white">
      {/* Top row: Title/URL with actions - Mobile optimized */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            value={layoutLink.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter title"
            disabled={!isEditingDraft}
            className={`flex-1 bg-transparent outline-none px-3 py-2 rounded-md text-sm sm:text-base min-h-[44px] ${isEditingDraft ? 'border border-gray-300' : 'border border-transparent'}`}
          />
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (isEditingDraft) {
                  onSave(layoutLink);
                }
                setIsEditingDraft(v => !v);
              }}
              className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-1.5 sm:p-2"
            >
              {isEditingDraft ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-1.5 sm:p-2" 
              onClick={onCancel}
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Switch 
              checked={layoutLink.active} 
              onCheckedChange={(checked) => onUpdate({ active: checked })} 
              className="scale-90 sm:scale-100"
              disabled={layoutLink?.url?.trim() === ''}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            value={layoutLink.url || ''}
            onChange={handleUrlChange}
            onPaste={handleUrlPaste}
            placeholder="Enter URL to fetch data"
            disabled={!isEditingDraft}
            className={`flex-1 bg-transparent outline-none px-3 py-2 rounded-md text-sm sm:text-base min-h-[44px] ${
              isEditingDraft ? 'border border-gray-300' : 'border border-transparent'
            } ${metadataError ? 'border-red-300' : ''}`}
          />
          {isFetchingMeta && (
            <div className="w-5 h-5 sm:w-4 sm:h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin flex-shrink-0" title="Fetching metadata..."></div>
          )}
        </div>
        {/* Error message display */}
        {metadataError && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-red-700">{metadataError}</span>
          </div>
        )}
      </div>
      {/* Icon toolbar (bottom of header) - Mobile optimized */}
      <div className="px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-4 text-gray-600 border-b border-gray-200 overflow-x-auto">
        <button 
          onClick={() => setLayoutTool(layoutTool === 'layout' ? null : 'layout')} 
          className={`flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${layoutTool === 'layout' ? 'text-black bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          <Layout className="w-4 h-4 sm:w-5 sm:h-5" /> 
          <span className="hidden xs:inline">Layout</span>
        </button>
        <button 
          onClick={() => setLayoutTool(layoutTool === 'redirect' ? null : 'redirect')} 
          className={`flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${layoutTool === 'redirect' ? 'text-black bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" /> 
          <span className="hidden xs:inline">Redirect</span>
        </button>
        <button 
          onClick={() => setLayoutTool(layoutTool === 'thumbnail' ? null : 'thumbnail')} 
          className={`flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${layoutTool === 'thumbnail' ? 'text-black bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" /> 
          <span className="hidden xs:inline">Thumbnail</span>
        </button>
        <button 
          onClick={() => setLayoutTool(layoutTool === 'clicks' ? null : 'clicks')} 
          className={`flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${layoutTool === 'clicks' ? 'text-black bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" /> 
          <span className="hidden xs:inline">Clicks</span>
        </button>
      </div>
      {/* Cards area - only show if a tool is selected */}
      <AnimatePresence mode="wait">
        {layoutTool && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {layoutTool === 'layout' && (
                <>
                  {/* Classic card */}
                  <label className={`block rounded-2xl border ${layoutLink.layout === 'classic' ? 'border-black' : 'border-gray-200'} p-4 cursor-pointer`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <input type="radio" name={`layout_radio_${layoutLink.id}`} checked={layoutLink.layout === 'classic'} onChange={() => onUpdate({ layout: 'classic' })} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">Classic</div>
                        <div className="text-sm text-gray-600">Efficient, direct and compact.</div>
                      </div>
                      {/* small preview pill */}
                      <div className="hidden sm:flex items-center justify-between gap-2 bg-teal-800 text-white px-3 py-2 rounded-full w-40">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-orange-200" />
                        {/* <div className="w-6 h-6 rounded-full overflow-hidden bg-orange-200" /> */}
                        <MoreHorizontal className="w-4 h-4" />
                      </div>
                    </div>
                  </label>

                  {/* Featured card */}
                  <label className={`block rounded-2xl border ${layoutLink.layout === 'featured' ? 'border-black' : 'border-gray-200'} p-4 cursor-pointer`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <input type="radio" name={`layout_radio_${layoutLink.id}`} checked={layoutLink.layout === 'featured'} onChange={() => onUpdate({ layout: 'featured' })} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">Featured</div>
                        <div className="text-sm text-gray-600">Make your link stand out with a larger, more attractive display.</div>
                        <div className="mt-3">
                          <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                            <span className="px-3 py-2 rounded-lg border flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Add thumbnail</span>
                          </label>
                        </div>
                      </div>
                      <div className="w-40 h-24 rounded-xl overflow-hidden bg-gray-200">
                        {layoutLink?.thumbnail ? (
                          <img src={layoutLink.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                    </div>
                  </label>
                </>
              )}

              {layoutTool === 'thumbnail' && (
                <div className="rounded-2xl border border-gray-200 p-4">
                  <div className="font-semibold mb-2">Thumbnail</div>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                    <span className="px-3 py-2 rounded-lg border flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Upload thumbnail</span>
                  </label>
                  {layoutLink?.thumbnail && (<img src={layoutLink.thumbnail} alt="thumb" className="mt-3 h-28 w-48 object-cover rounded-lg border" />)}
                </div>
              )}

              {layoutTool === 'redirect' && (
                <div className="rounded-2xl border border-gray-200 p-4 text-sm text-gray-700">
                  <div className="font-semibold mb-2">Redirect</div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Optionally send users to a different URL than the main link. Clicks will still be tracked.</p>
                    <input
                      value={layoutLink.redirect_url || ''}
                      onChange={(e) => onUpdate({ redirect_url: e.target.value })}
                      placeholder="Enter redirect URL (optional)"
                      className="w-full bg-transparent outline-none px-3 py-2 rounded-md border border-gray-300 text-sm"
                    />
                    <p className="text-xs text-gray-500">Leave empty to use the main URL.</p>
                  </div>
                </div>
              )}

              {layoutTool === 'clicks' && (
                <div className="rounded-2xl border border-gray-200 p-4 text-sm text-gray-700">
                  <div className="font-semibold mb-2">Clicks</div>
                  <p className="text-gray-600">Total clicks: <span className="font-semibold">{layoutLink.clicks_count ?? 0}</span></p>
                  <p className="text-xs text-gray-500 mt-1">This updates after users visit your link via the redirect endpoint.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sortable Link Item Component
function SortableLinkItem({
  link,
  onToggleActive,
  onEdit,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = socialIconsMap[link.icon] || socialIconsMap.default;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`bg-card border border-border rounded-2xl p-3 sm:p-4 mb-3 cursor-move transition-all duration-200 min-h-16 ${
        isDragging ? 'opacity-50 shadow-2xl scale-105 z-50' : 'hover:shadow-md'
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      layout
      transition={{
        layout: { duration: 0.3, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
        y: { duration: 0.3 }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded flex-shrink-0 transition-colors"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground transition-transform hover:scale-110" />
          </div>

          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent
              className="w-5 h-5"
              style={{ color: socialColorsMap[link.icon] || socialColorsMap.default }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground text-sm sm:text-base truncate">{link.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{link.url}</p>
          </div>
        </div>

        {/* Action Controls - Right Side - Mobile optimized */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(link)}
              className="hover:bg-muted p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
            >
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(link)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Switch
              checked={link.active}
              onCheckedChange={() => onToggleActive(link.id)}
              className="scale-90 sm:scale-100"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LinksTab() {
  const { data, updateData, saveLinks, customLinks, socialLinks, upsertCustomLink, upsertSocialLink, deleteCustomLink, deleteSocialLink, reorderSocialLinks } = useDashboard();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingLink, setDeletingLink] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeSection, setActiveSection] = useState('social'); // 'social' or 'links'
  const [layoutLinks, setLayoutLinks] = useState([]); // array of inline layout frame drafts
  // Saved custom links are provided from context (Supabase)
  const [layoutTool, setLayoutTool] = useState('layout'); // 'layout' | 'redirect' | 'thumbnail' | 'clicks'
  const [isEditingDraft, setIsEditingDraft] = useState(true);
  // Optimistic local edits for saved custom links and debounced API calls
  const [savedEdits, setSavedEdits] = useState({}); // id -> partial updates
  const savedDebounceTimersRef = useRef({}); // id -> timeout id
  const savedEditsRef = useRef(savedEdits);
  const customLinksRef = useRef(customLinks);

  useEffect(() => { savedEditsRef.current = savedEdits; }, [savedEdits]);
  useEffect(() => { customLinksRef.current = customLinks; }, [customLinks]);

  // Removed localStorage syncing; handled by Supabase via context

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const persist = async (snapshot) => {
    try {
      await saveLinks(snapshot.links);
      toast.success('Link saved successfully');
    } catch (e) {
      toast.error(e?.message || 'Failed to save link');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      if (activeSection === 'social') {
        // For social links: reorder in social_links table
        const oldIndex = socialLinks.findIndex(link => link.id === active.id);
        const newIndex = socialLinks.findIndex(link => link.id === over.id);
        const newLinks = arrayMove(socialLinks, oldIndex, newIndex).map((l, idx) => ({ ...l, order: idx + 1 }));

        try {
          // Update order in database
          const orderedIds = newLinks.map(link => link.id);
          await reorderSocialLinks(orderedIds);
          toast.success('Link order updated', {
            icon: '✨',
            duration: 2000,
          });
        } catch (error) {
          console.error('Failed to reorder links:', error);
          toast.error('Failed to update link order');
        }
      } else {
        // For custom links: reorder in data.links (legacy)
        const oldIndex = data.links.findIndex(link => link.id === active.id);
        const newIndex = data.links.findIndex(link => link.id === over.id);
        const newLinks = arrayMove(data.links, oldIndex, newIndex).map((l, idx) => ({ ...l, order: idx + 1 }));
        const snapshot = { ...data, links: newLinks };
        updateData({ links: newLinks });
        await persist(snapshot);
      }
    }
  };

  const handleToggleActive = async (id) => {
    if (activeSection === 'social') {
      const link = socialLinks.find(l => l.id === id);
      if (!link) return;
      const updatedLink = { ...link, active: !link.active };
      try {
        await upsertSocialLink(updatedLink);
        toast.success(updatedLink.active ? 'Link activated' : 'Link deactivated');
      } catch (error) {
        console.error('Failed to toggle link:', error);
        toast.error('Failed to update link');
      }
    } else {
      const updatedLinks = data.links.map(link =>
        link.id === id ? { ...link, active: !link.active } : link
      );
      const snapshot = { ...data, links: updatedLinks };
      updateData({ links: updatedLinks });
      await persist(snapshot);
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowEditModal(true);
  };

  const handleDelete = (link) => {
    setDeletingLink(link);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingLink) return;

    const loadingToast = toast.loading('Deleting link...');

    try {
      if (activeSection === 'social') {
        await deleteSocialLink(deletingLink.id);
      } else {
        const updatedLinks = data.links.filter(link => link.id !== deletingLink.id);
        const snapshot = { ...data, links: updatedLinks };
        updateData({ links: updatedLinks });
        await persist(snapshot);
      }
      toast.dismiss(loadingToast);
      toast.success('Link deleted successfully');
      setShowDeleteModal(false);
      setDeletingLink(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Failed to delete link:', error);
      toast.error('Failed to delete link');
    }
  };


  const handleAddLink = async (newLink) => {
    if (activeSection === 'social') {
      // For social links: save directly to social_links table
      try {
        const newId = generateId();
        const socialLink = {
          ...newLink,
          id: newId,
          order: (socialLinks?.length || 0) + 1,
          createdAt: new Date().toISOString(),
          active: true,
        };
        await upsertSocialLink(socialLink);
        toast.success('Social link added');
        setShowAddModal(false);
      } catch (error) {
        console.error('Failed to add social link:', error);
        toast.error('Failed to add social link');
      }
    } else {
      // For custom links: open inline layout frame instead of persisting immediately
      const newId = generateId();
      const draft = {
        ...newLink,
        ...(newId ? { id: newId } : {}),
        order: (customLinks?.length || 0) + 1,
        createdAt: new Date().toISOString(),
        layout: 'classic',
        title: '', // Start with blank title
        url: '', // Start with blank URL
        active: false, // Default switch off
      };

      // Check if this link already exists in layoutLinks to prevent duplicates
      const existingLink = layoutLinks.find(link => link.icon === newLink.icon);
      if (!existingLink) {
        setLayoutLinks(prev => [...prev, draft]);
      }
      setShowAddModal(false);
      // Do not persist until user saves in layout frame
    }
  };

  // Optionally preload frames from saved links (skipped to avoid duplicates)

  const cancelLayoutDraft = (linkId) => {
    setLayoutLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const saveLayoutDraft = async (payloadOrId) => {
    if (!payloadOrId) return;

    const linkToSave = typeof payloadOrId === 'string'
      ? layoutLinks.find(l => l.id === payloadOrId)
      : payloadOrId;
    if (!linkToSave) return;

    const loadingToast = toast.loading('Saving custom link...');
    try {
      await upsertCustomLink(linkToSave);
      toast.dismiss(loadingToast);
      toast.success('Custom link saved');
      // Remove draft frame after saving (only if it exists as draft)
      setLayoutLinks(prev => prev.filter(link => link.id !== linkToSave.id));
    } catch (e) {
      toast.dismiss(loadingToast);
      console.error('Failed to save custom link:', e);
      toast.error(e?.message || 'Failed to save custom link');
    }
  };

  const updateLayoutDraft = (linkId, updates) => {
    setLayoutLinks(prev => prev.map(link =>
      link.id === linkId ? { ...link, ...updates } : link
    ));
  };

  const updateSavedCustomLink = async (linkId, updates) => {
    const existing = customLinks.find(l => l.id === linkId);
    if (!existing) return;

    // Optimistically update UI immediately
    setSavedEdits(prev => ({
      ...prev,
      [linkId]: { ...(prev[linkId] || {}), ...updates },
    }));

    // Debounce actual API call per link id
    const timers = savedDebounceTimersRef.current;
    if (timers[linkId]) {
      clearTimeout(timers[linkId]);
    }
    
    // Track loading state per link
    let loadingToast = null;
    timers[linkId] = setTimeout(async () => {
      loadingToast = toast.loading('Updating link...');
      try {
        const latestExisting = customLinksRef.current.find(l => l.id === linkId) || existing;
        const latestLocal = savedEditsRef.current[linkId] || {};
        const payload = { ...latestExisting, ...latestLocal };
        const saved = await upsertCustomLink(payload);
        toast.dismiss(loadingToast);
        // Clear local edits for this id after successful save
        setSavedEdits(prev => {
          const { [linkId]: _omit, ...rest } = prev;
          return rest;
        });
        // Optionally, ensure local reflects any server-generated fields
        setSavedEdits(prev => prev); // no-op to trigger re-render if needed
      } catch (e) {
        toast.dismiss(loadingToast);
        console.error('Failed to update custom link:', e);
        toast.error(e?.message || 'Failed to update');
      }
    }, 600);
  };

  const deleteSavedCustom = async (linkId) => {
    const loadingToast = toast.loading('Deleting link...');
    try {
      await deleteCustomLink(linkId);
      toast.dismiss(loadingToast);
      toast.success('Link deleted successfully');
      // Clear any pending debounce and local edits
      const timers = savedDebounceTimersRef.current;
      if (timers[linkId]) {
        clearTimeout(timers[linkId]);
        delete timers[linkId];
      }
      setSavedEdits(prev => {
        const { [linkId]: _omit, ...rest } = prev;
        return rest;
      });
    } catch (e) {
      toast.dismiss(loadingToast);
      console.error('Failed to delete custom link:', e);
      toast.error(e?.message || 'Failed to delete');
    }
  };

  const handleUpdateLink = async (updatedLink) => {
    if (activeSection === 'social') {
      // For social links: update in social_links table
      try {
        await upsertSocialLink(updatedLink);
        toast.success('Social link updated');
        setShowEditModal(false);
        setEditingLink(null);
      } catch (error) {
        console.error('Failed to update social link:', error);
        toast.error('Failed to update social link');
      }
    } else {
      // For custom links: update in data.links (legacy)
      const updatedLinks = data.links.map(link =>
        link.id === updatedLink.id ? updatedLink : link
      );
      const snapshot = { ...data, links: updatedLinks };
      updateData({ links: updatedLinks });
      await persist(snapshot);
      setShowEditModal(false);
      setEditingLink(null);
    }
  };

  return (
    <div className="p-1 space-y-4 sm:space-y-6  pt-0 max-w-full">
      {/* Header */}
      <div className="mt-1 px-3 py-3 sm:px-4 lg:px-6 lg:py-4 sm:sticky sm:top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b border-border rounded-lg">
        <div className='flex items-center justify-between gap-2'>
          <div className="mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">My VizitLink</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage your social media icons and custom links
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base hidden sm:flex"
          >
            <Plus className="w-4 h-4" />
            Add {activeSection === 'social' ? 'Social Icon' : 'Link'}
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-auto h-9 px-3 text-sm sm:hidden block rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Section Tabs - Mobile optimized */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveSection('social')}
            className={`flex-1 px-3 sm:px-4 py-3 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-colors min-h-[44px] sm:min-h-auto ${activeSection === 'social'
              ? 'bg-background text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <span className="block sm:inline">Social Icons</span>
          </button>
          <button
            onClick={() => setActiveSection('links')}
            className={`flex-1 px-3 sm:px-4 py-3 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-colors min-h-[44px] sm:min-h-auto ${activeSection === 'links'
              ? 'bg-background text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <span className="block sm:inline">Custom Links</span>
          </button>
        </div>


      </div>

      {/* Content based on active section */}
      {activeSection === 'social' ? (
        /* Social Icons Section */
        <div className="bg-background rounded-lg p-3 sm:p-4 lg:p-6 border border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Social Icons ({socialLinks.filter(link => link.active).length} active)
          </h3>

          {socialLinks.length === 0 ? (
            <div className="text-center py-10 sm:py-12">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No links yet</h3>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Start building your VizitLink by adding your first social media link
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="h-9 px-3 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Your First Link
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={socialLinks.map(link => link.id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  {socialLinks.map((link) => (
                    <SortableLinkItem
                      key={link.id}
                      link={link}
                      onToggleActive={handleToggleActive}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </SortableContext>
            </DndContext>
          )}
        </div>
      ) : (
        /* Custom Links Section */
        <div className="bg-background rounded-lg p-3 sm:p-4 lg:p-6 border border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Custom Links
          </h3>
          {/* Render all layout draft frames */}
          {layoutLinks.map((layoutLink) => (
            <LayoutFrame
              key={layoutLink.id}
              layoutLink={layoutLink}
              onUpdate={(updates) => updateLayoutDraft(layoutLink.id, updates)}
              onCancel={() => cancelLayoutDraft(layoutLink.id)}
              onSave={(payloadOrId) => saveLayoutDraft(payloadOrId)}
            />
          ))}

          {/* Render saved custom links as editable frames */}
          {customLinks.map((savedLink) => {
            const merged = { ...savedLink, ...(savedEdits[savedLink.id] || {}) };
            return (
              <LayoutFrame
                key={savedLink.id}
                layoutLink={merged}
                onUpdate={(updates) => updateSavedCustomLink(savedLink.id, updates)}
                onCancel={() => deleteSavedCustom(savedLink.id)}
                onSave={(payload) => updateSavedCustomLink(savedLink.id, payload || merged)}
              />
            );
          })}


          {/* Show empty state only if no drafts and no saved links */}
          {layoutLinks.length === 0 && customLinks.length === 0 && (
            <div className="text-center py-10 sm:py-12">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <ExternalLink className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Custom Links Yet</h4>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Add websites, articles, products, and other custom links to your profile
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add Your First Link
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {activeSection === 'social' ? (
        <AddSocialLinkModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddLink}
        />
      ) : (
        <AddCustomLinkModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddLink}
        />
      )}

      {editingLink && (
        <EditLinkModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingLink(null);
          }}
          onSave={handleUpdateLink}
          link={editingLink}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete Link
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingLink?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingLink(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
