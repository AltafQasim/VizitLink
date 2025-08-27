"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '../../ui/button';
import { useDashboard } from '../../../context/DashboardContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoreVertical,
  Share2,
  Upload,
  AlertTriangle
} from 'lucide-react';
import AddProductModal from '../modals/AddProductModal';
import EditProductModal from '../modals/EditProductModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';

// Mock products data for now (will be replaced with Supabase later)
const mockProducts = [
  {
    id: '1',
    title: 'Double Hydration Boost Gel',
    brand: 'JTDcosmetics',
    price: 17.40,
    currency: 'USD',
    url: 'https://jtdluxe.com/products/double-hydration-boost-gel',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&crop=center',
    active: true,
    clicks: 0,
    ctr: 0.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Wrinkle Smoother Lift & Firm Serum',
    brand: 'Merle Norman',
    price: 73.00,
    currency: 'USD',
    url: 'https://merlenorman.com/products/wrinkle-smoother-serum',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&h=150&fit=crop&crop=center',
    active: true,
    clicks: 0,
    ctr: 0.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Ancient Multivitamin Women\'s Once Daily',
    brand: 'Ancient Nutrition',
    price: 29.95,
    currency: 'USD',
    url: 'https://ancientnutrition.com/products/multivitamin-womens',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop&crop=center',
    active: false,
    clicks: 0,
    ctr: 0.0,
    createdAt: new Date().toISOString(),
  }
];

export default function ProductsTab() {
  const { data, updateData, saveChanges } = useDashboard();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize products in localStorage if not exists
  useEffect(() => {
    if (isInitialized) return;
    
    // If products are missing in context, seed with defaults once
    if (!data?.products || !Array.isArray(data.products)) {
      updateData({ products: mockProducts });
      // Persist into the main dashboard storage so preview reads the same source
      setTimeout(() => saveChanges(), 0);
    }
    setIsInitialized(true);
  }, [isInitialized, data, updateData, saveChanges]);

  const persist = async (snapshot) => {
    try {
      await saveChanges(snapshot);
      toast.success('Product saved successfully');
    } catch (e) {
      toast.error(e?.message || 'Failed to save product');
    }
  };

  const handleToggleActive = async (id) => {
    const updatedProducts = data.products.map(product =>
      product.id === id ? { ...product, active: !product.active } : product
    );
    const snapshot = { ...data, products: updatedProducts };
    updateData({ products: updatedProducts });
    await persist(snapshot);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    
    const updatedProducts = data.products.filter(product => product.id !== deletingProduct.id);
    const snapshot = { ...data, products: updatedProducts };
    updateData({ products: updatedProducts });
    await persist(snapshot);
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  const handleShare = async (product) => {
    try {
      // Copy product URL to clipboard
      await navigator.clipboard.writeText(product.url);
      toast.success('Product URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL to clipboard');
    }
  };

  const generateId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined);

  const normalizeProduct = (p) => ({
    id: generateId(),
    title: p.title || 'Untitled Product',
    brand: p.brand || 'Unknown',
    price: Number(p.price) || 0,
    currency: p.currency || 'USD',
    url: p.url || '#',
    image: p.image || '/placeholder.svg',
    clicks: 0,
    ctr: 0.0,
    active: true,
    createdAt: new Date().toISOString(),
  });

  const handleAddProduct = async (newProductOrArray) => {
    const items = Array.isArray(newProductOrArray) ? newProductOrArray : [newProductOrArray];
    const normalized = items.map(normalizeProduct);
    const updatedProducts = [...data.products, ...normalized];
    const snapshot = { ...data, products: updatedProducts };
    updateData({ products: updatedProducts });
    await persist(snapshot);
    setShowAddModal(false);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    const updatedProducts = data.products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    const snapshot = { ...data, products: updatedProducts };
    updateData({ products: updatedProducts });
    await persist(snapshot);
    setShowEditModal(false);
    setEditingProduct(null);
  };

  // Don't render until data is loaded
  if (!data || !data.products) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 py-3 sm:px-4 lg:p-8 pt-0">
      {/* Header */}
      <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 sticky top-0 bg-gray-50 z-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Shop</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your products and track their performance
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products List */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Products ({data.products.filter(product => product.active).length} active)
        </h3>
        
        {data.products.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Start selling by adding your first product to your shop
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 h-9 px-3 text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            <AnimatePresence>
              {data.products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-white border border-gray-200 rounded-lg p-3 sm:p-4 ${
                    !product.active ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {product.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {product.brand}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.clicks} clicks • {product.ctr.toFixed(1)}% CTR
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {product.url}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(product.id)}
                          className={product.active ? 'text-green-600' : 'text-gray-400'}
                        >
                          {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(product)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddProduct}
      />
      
      {editingProduct && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          onSave={handleUpdateProduct}
          product={editingProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingProduct?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingProduct(null);
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
