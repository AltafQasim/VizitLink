"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { useDashboard } from '../../../context/DashboardContext';
import {
  Plus,
  Edit,
  Trash2,
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
  const { data, updateData, saveChanges, currentProfileId, saveProducts } = useDashboard();
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
      // Save only products slice
      await saveProducts(snapshot.products);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 space-y-4 sm:space-y-6 pt-0 max-w-full">
      {/* Header */}
      <div className="mt-1 px-3 py-3 sm:px-4 lg:px-6 lg:py-4 sm:sticky sm:top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b border-border rounded-lg">
        <div className='flex items-center justify-between gap-2'>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">My Shop</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage your products and track their performance
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base hidden sm:flex"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-auto h-9 px-3 text-sm sm:hidden block rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-background rounded-lg p-3 sm:p-4 lg:p-6 border border-border max-w-full overflow-hidden">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          Products ({data.products.filter(product => product.active).length} active)
        </h3>

        {data.products.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              Start selling by adding your first product to your shop
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="h-9 px-3 text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-w-full">
            <AnimatePresence>
              {data.products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-card border border-border rounded-2xl p-3 sm:p-4 transition-shadow hover:shadow-sm max-w-full min-h-16 ${!product.active ? 'opacity-60' : ''
                    }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4 max-w-full mb-3 sm:mb-2">
                    {/* Product Image - Mobile optimized */}
                    <div className="w-20 h-20 sm:w-20 sm:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details - Mobile optimized */}
                    <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                      <div className="flex items-start justify-between gap-1 mb-2 sm:mb-1.5 max-w-full">
                        <div className="min-w-0 flex-1 max-w-full overflow-hidden">
                          <h3 className="font-medium text-foreground text-base sm:text-base truncate leading-tight">
                            {product.title}
                          </h3>
                          <p className="text-sm sm:text-sm text-muted-foreground truncate m-0 mt-1">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold whitespace-nowrap">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                  </div>
                  {/* Action Controls - Mobile optimized */}
                  <div className="flex items-center justify-between gap-2 flex-shrink-0">
                    {/* Stats - Mobile optimized */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="relative flex items-center justify-center gap-1 rounded-full bg-[#f3f3f1] px-2 py-1 text-xs tracking-tight whitespace-nowrap">
                        {product.clicks} Clicks
                      </span>
                      <span className="relative flex items-center justify-center gap-1 rounded-full bg-[#f3f3f1] px-2 py-1 text-xs tracking-tight whitespace-nowrap">
                        {product.ctr.toFixed(1)}% CTR
                      </span>
                    </div>

                    {/* Action Buttons - Mobile optimized */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="hover:bg-muted p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Switch
                        checked={product.active}
                        onCheckedChange={() => handleToggleActive(product.id)}
                        className="scale-90 sm:scale-100"
                      />
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
