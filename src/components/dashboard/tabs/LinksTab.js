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
import { socialIconsMap, socialColorsMap } from '../../../lib/social';

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
      className={`bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded flex-shrink-0"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent 
              className="w-5 h-5" 
              style={{ color: socialColorsMap[link.icon] || socialColorsMap.default }}
            />
          </div>
          
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{link.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[180px] sm:max-w-[200px]">{link.url}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
    <div className="space-y-4 sm:space-y-6 px-3 py-3 sm:px-4 lg:p-8 pt-0">
      {/* Header */}
      <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 sticky top-0 bg-gray-50 z-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My VizitLink</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your social media links and customize your profile
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </Button>
      </div>

      {/* Links List */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Social Links ({data.links.filter(link => link.active).length} active)
        </h3>
        
        {data.links.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Start building your VizitLink by adding your first social media link
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 h-9 px-3 text-sm"
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
