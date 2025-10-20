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
  AlertTriangle,
  Search,
  Filter,
  Grid3x3,
  List,
  TrendingUp,
  DollarSign,
  Eye,
  Package
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter and search products
  const filteredProducts = data?.products?.filter(product => {
    // Filter by active status
    if (filterActive === 'active' && !product.active) return false;
    if (filterActive === 'inactive' && product.active) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.price.toString().includes(query)
      );
    }
    return true;
  }) || [];

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
    <div className="p-1 space-y-4 sm:space-y-6 pt-0 max-w-full max-h-full h-full">
      {/* Enhanced Header with Statistics */}
      <div className="mt-1 px-3 py-3 sm:px-4 lg:px-6 lg:py-4 sm:sticky sm:top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b border-border rounded-lg">
        <div className='flex flex-col gap-4'>
          {/* Title and Add Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Package className="w-6 h-6" />
                My Shop
              </h2>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Manage your products and track their performance
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base hidden sm:flex gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="sm:hidden flex items-center justify-center min-w-[44px] min-h-[44px] h-11 w-11 p-0 rounded-full shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Statistics Cards - Mobile Optimized */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">Total Products</p>
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">{data.products.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 rounded-xl p-3 sm:p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">Active</p>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100">
                {data.products.filter(p => p.active).length}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">Total Clicks</p>
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100">
                {data.products.reduce((acc, p) => acc + (p.clicks || 0), 0)}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 rounded-xl p-3 sm:p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-medium">Avg. Price</p>
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-100">
                ${data.products.length > 0 
                  ? (data.products.reduce((acc, p) => acc + p.price, 0) / data.products.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div> */}

          {/* Search and Filter Controls - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
            {/* Search Bar - Mobile Optimized */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-2 rounded-lg border border-border bg-background text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] sm:min-h-0"
              />
            </div>

            {/* Filter Buttons - Mobile Optimized (44px touch targets) */}
            <div className="flex items-center gap-2">
              <div className="flex flex-1 sm:flex-none rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setFilterActive('all')}
                  className={`flex-1 sm:flex-none px-4 sm:px-4 py-3 sm:py-2 text-sm sm:text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
                    filterActive === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterActive('active')}
                  className={`flex-1 sm:flex-none px-4 sm:px-4 py-3 sm:py-2 text-sm sm:text-sm font-medium transition-colors border-l border-border min-h-[44px] sm:min-h-0 ${
                    filterActive === 'active'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterActive('inactive')}
                  className={`flex-1 sm:flex-none px-4 sm:px-4 py-3 sm:py-2 text-sm sm:text-sm font-medium transition-colors border-l border-border min-h-[44px] sm:min-h-0 ${
                    filterActive === 'inactive'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  Inactive
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors border-l border-border ${
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-background rounded-lg p-3 sm:p-4 lg:p-6 border border-border max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            {filteredProducts.length === data.products.length
              ? `Products (${data.products.filter(product => product.active).length} active)`
              : `Showing ${filteredProducts.length} of ${data.products.length} products`
            }
          </h3>
          {filteredProducts.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {viewMode === 'grid' ? 'Grid' : 'List'} View
            </p>
          )}
        </div>

        {data.products.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Package className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base max-w-md mx-auto">
              Start selling by adding your first product to your shop. Showcase your products beautifully.
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="min-h-[44px] h-11 sm:h-9 px-5 sm:px-4 text-base sm:text-sm gap-2"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              Add Your First Product
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Search className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setFilterActive('all');
              }}
              className="min-h-[44px] h-11 sm:h-9 px-5 sm:px-4 text-base sm:text-sm"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4" 
            : "space-y-3 sm:space-y-4"
          }>
            <AnimatePresence>
              {filteredProducts.map((product) => (
                viewMode === 'grid' ? (
                  /* Grid View Card - Mobile Optimized */
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`group bg-card border border-border rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 ${
                      !product.active ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {!product.active && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-semibold">Inactive</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-1">
                        <div className="bg-background/80 backdrop-blur-sm rounded-full p-1">
                          <Switch
                            checked={product.active}
                            onCheckedChange={() => handleToggleActive(product.id)}
                            className="scale-90"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Details - Mobile Optimized */}
                    <div className="p-4 sm:p-4">
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1.5 truncate">
                        {product.brand}
                      </p>
                      <h3 className="font-semibold text-foreground text-base sm:text-base mb-3 line-clamp-2 min-h-[3rem] leading-snug">
                        {product.title}
                      </h3>
                      
                      {/* Price and Stats - Mobile Optimized */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-base sm:text-sm font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1.5 text-sm sm:text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4 sm:w-3 sm:h-3" />
                            {product.clicks}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons - Mobile Optimized (44px touch targets) */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="flex-1 min-h-[44px] h-11 sm:h-9 text-sm sm:text-xs font-medium"
                        >
                          <Edit className="w-4 h-4 sm:w-3 sm:h-3 mr-1.5 sm:mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="flex-1 min-h-[44px] h-11 sm:h-9 text-sm sm:text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                        >
                          <Trash2 className="w-4 h-4 sm:w-3 sm:h-3 mr-1.5 sm:mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* List View Card - Mobile Optimized */
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-card border border-border rounded-2xl p-4 sm:p-4 transition-all hover:shadow-md hover:border-primary/50 ${
                      !product.active ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-4">
                      {/* Product Image - Mobile Optimized */}
                      <div className="relative w-24 h-24 sm:w-24 sm:h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        {!product.active && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white/90 px-2 py-1 rounded text-[10px] font-semibold">Inactive</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details - Mobile Optimized */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">
                              {product.brand}
                            </p>
                            <h3 className="font-semibold text-foreground text-base sm:text-base line-clamp-2 leading-snug">
                              {product.title}
                            </h3>
                          </div>
                          <div className="bg-background/80 backdrop-blur-sm rounded-full p-0.5">
                            <Switch
                              checked={product.active}
                              onCheckedChange={() => handleToggleActive(product.id)}
                              className="scale-100 sm:scale-100"
                            />
                          </div>
                        </div>

                        {/* Stats and Actions - Mobile Optimized */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-base sm:text-sm font-bold">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm sm:text-xs bg-muted px-3 py-1.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-1.5 sm:gap-1">
                              <Eye className="w-4 h-4 sm:w-3 sm:h-3" />
                              {product.clicks} Clicks
                            </span>
                            <span className="text-sm sm:text-xs bg-muted px-3 py-1.5 sm:px-2 sm:py-1 rounded-full">
                              {product.ctr.toFixed(1)}% CTR
                            </span>
                          </div>

                          {/* Action Buttons - Mobile Optimized (44px touch targets) */}
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="flex-1 sm:flex-none min-h-[44px] h-11 sm:h-9 px-4 sm:px-3 text-sm sm:text-xs"
                            >
                              <Edit className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5 sm:mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="flex-1 sm:flex-none min-h-[44px] h-11 sm:h-9 px-4 sm:px-3 text-sm sm:text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5 sm:mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
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
