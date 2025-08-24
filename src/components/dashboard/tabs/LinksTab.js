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
  Eye, 
  EyeOff, 
  GripVertical,
  ExternalLink
} from 'lucide-react';
import AddSocialLinkModal from '../modals/AddSocialLinkModal';
import EditLinkModal from '../modals/EditLinkModal';
import { 
  FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTiktok, FaReddit, FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify, FaSoundcloud, FaTwitch, FaDiscord, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa';
import { SiThreads, SiOnlyfans, SiSubstack, SiBuymeacoffee, SiPatreon, SiEtsy, SiAmazon, SiShopify, SiGumroad, SiLinktree } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

const socialIconsMap = {
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
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-gray-600" />
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900">{link.title}</h3>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">{link.url}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleActive(link.id)}
            className={link.active ? 'text-green-600' : 'text-gray-400'}
          >
            {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(link)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpen(link.url)}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(link.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function LinksTab() {
  const { data, updateData } = useDashboard();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = data.links.findIndex(link => link.id === active.id);
      const newIndex = data.links.findIndex(link => link.id === over.id);
      
      const newLinks = arrayMove(data.links, oldIndex, newIndex);
      updateData({ links: newLinks });
    }
  };

  const handleToggleActive = (id) => {
    const updatedLinks = data.links.map(link =>
      link.id === id ? { ...link, active: !link.active } : link
    );
    updateData({ links: updatedLinks });
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      const updatedLinks = data.links.filter(link => link.id !== id);
      updateData({ links: updatedLinks });
    }
  };

  const handleOpen = (url) => {
    window.open(url, '_blank');
  };

  const handleAddLink = (newLink) => {
    const linkWithId = {
      ...newLink,
      id: Date.now().toString(),
      order: data.links.length + 1,
      createdAt: new Date().toISOString(),
    };
    
    const updatedLinks = [...data.links, linkWithId];
    updateData({ links: updatedLinks });
    setShowAddModal(false);
  };

  const handleUpdateLink = (updatedLink) => {
    const updatedLinks = data.links.map(link =>
      link.id === updatedLink.id ? updatedLink : link
    );
    updateData({ links: updatedLinks });
    setShowEditModal(false);
    setEditingLink(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My VizitLink</h2>
          <p className="text-gray-600 mt-1">
            Manage your social media links and customize your profile
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </Button>
      </div>

      {/* Links List */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Social Links ({data.links.filter(link => link.active).length} active)
        </h3>
        
        {data.links.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-600 mb-4">
              Start building your VizitLink by adding your first social media link
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700"
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
              items={data.links.map(link => link.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                {data.links.map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    onToggleActive={handleToggleActive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onOpen={handleOpen}
                  />
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modals */}
      <AddSocialLinkModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddLink}
      />
      
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
    </div>
  );
}
