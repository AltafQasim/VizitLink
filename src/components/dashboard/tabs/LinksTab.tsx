"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { Link } from '@/types/dashboard';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical,
  ExternalLink
} from 'lucide-react';
import AddSocialLinkModal from '@/components/dashboard/modals/AddSocialLinkModal';
import EditLinkModal from '@/components/dashboard/modals/EditLinkModal';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad, SiLinktree } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

const socialIconsMap: { [key: string]: any } = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  twitter: FaTwitter,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  threads: SiThreads,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
  snapchat: FaSnapchatGhost,
  pinterest: FaPinterest,
  reddit: FaReddit,
  github: FaGithub,
  dribbble: FaDribbble,
  behance: FaBehance,
  medium: FaMedium,
  spotify: FaSpotify,
  soundcloud: FaSoundcloud,
  twitch: FaTwitch,
  discord: FaDiscord,
  telegram: FaTelegram,
  email: MdEmail,
  onlyfans: SiOnlyfans,
  substack: SiSubstack,
  buymeacoffee: SiBuymeacoffee,
  patreon: SiPatreon,
  etsy: SiEtsy,
  amazon: SiAmazon,
  shopify: SiShopify,
  gumroad: SiGumroad,
  linktree: SiLinktree,
  website: FaGlobe,
  // Default icon if not found
  default: FaGlobe,
};

// Sortable Link Item Component
function SortableLinkItem({ 
  link, 
  onToggleActive, 
  onEdit, 
  onDelete, 
  onOpen 
}: { 
  link: Link; 
  onToggleActive: (id: string) => void; 
  onEdit: (link: Link) => void; 
  onDelete: (id: string) => void; 
  onOpen: (url: string) => void; 
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 border-b last:border-b-0"
    >
      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        {(() => {
          const IconComponent = socialIconsMap[link.icon] || socialIconsMap.default;
          return IconComponent ? (
            <IconComponent className="w-6 h-6 flex-shrink-0" />
          ) : (
            <span className="text-xl sm:text-2xl flex-shrink-0">{link.icon}</span>
          );
        })()}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-base sm:text-lg">{link.title}</h4>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpen(link.url)}
          className="text-gray-600 hover:text-gray-900"
        >
          <ExternalLink className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleActive(link.id)}
          className="text-gray-600 hover:text-gray-900"
        >
          {link.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(link)}
          className="text-gray-600 hover:text-gray-900"
        >
          <Edit className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(link.id)}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function LinksTab() {
  const { data, updateData } = useDashboard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddLinkClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewLink = (newLinkData: Omit<Link, 'id' | 'createdAt' | 'order'>) => {
    const newLink: Link = {
      id: Date.now().toString(),
      title: newLinkData.title,
      url: newLinkData.url,
      icon: newLinkData.icon,
      order: data.links.length + 1,
      active: true,
      createdAt: new Date().toISOString(),
    };
    updateData({ links: [...data.links, newLink] });
    setIsAddModalOpen(false);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedLink = (updatedLink: Link) => {
    const updatedLinks = data.links.map(link => 
      link.id === updatedLink.id ? updatedLink : link
    );
    updateData({ links: updatedLinks });
    setIsEditModalOpen(false);
    setEditingLink(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = data.links.findIndex(link => link.id === active.id);
      const newIndex = data.links.findIndex(link => link.id === over?.id);

      const reorderedLinks = arrayMove(data.links, oldIndex, newIndex);
      const updatedLinks = reorderedLinks.map((link, index) => ({ ...link, order: index + 1 }));
      updateData({ links: updatedLinks });
    }
  };

  const deleteLink = (id: string) => {
    const updatedLinks = data.links.filter(link => link.id !== id);
    updateData({ links: updatedLinks });
  };

  const toggleLinkActive = (id: string) => {
    const updatedLinks = data.links.map(link => 
      link.id === id ? { ...link, active: !link.active } : link
    );
    updateData({ links: updatedLinks });
  };

  const updateLinkOrder = (id: string, newOrder: number) => {
    const updatedLinks = data.links.map(link => 
      link.id === id ? { ...link, order: newOrder } : link
    ).sort((a, b) => a.order - b.order);
    updateData({ links: updatedLinks });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Links</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage your VizitLink links and social media</p>
        </div>
        <Button onClick={handleAddLinkClick} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>



      {/* Links List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Your Links</h3>
          <p className="text-sm text-gray-500 mt-1">
            {data.links.filter(l => l.active).length} of {data.links.length} links active
          </p>
        </div>
        
        {data.links.length === 0 ? (
          <p className="p-6 text-gray-500">No links added yet. Click "Add Link" to get started!</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.links.sort((a, b) => a.order - b.order).map(link => link.id)}
              strategy={verticalListSortingStrategy}
            >
              {data.links
                .sort((a, b) => a.order - b.order)
                .map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    onToggleActive={toggleLinkActive}
                    onEdit={handleEditLink}
                    onDelete={deleteLink}
                    onOpen={(url) => window.open(url, '_blank')}
                  />
                ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <AddSocialLinkModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewLink}
      />

      <EditLinkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditedLink}
        link={editingLink}
      />
    </div>
  );
}
