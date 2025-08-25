"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Upload
} from 'lucide-react';
import AddProductModal from '../modals/AddProductModal';
import EditProductModal from '../modals/EditProductModal';

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
  const { data, updateData } = useDashboard();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize products in localStorage if not exists
  useEffect(() => {
    if (isInitialized) return;
    
    const storedProducts = localStorage.getItem('vizitlink_products');
    if (!storedProducts) {
      localStorage.setItem('vizitlink_products', JSON.stringify(mockProducts));
      updateData({ products: mockProducts });
    } else {
      const products = JSON.parse(storedProducts);
      updateData({ products });
    }
    setIsInitialized(true);
  }, [isInitialized, updateData]);

  const handleToggleActive = (id) => {
    const updatedProducts = data.products.map(product =>
      product.id === id ? { ...product, active: !product.active } : product
    );
    updateData({ products: updatedProducts });
    localStorage.setItem('vizitlink_products', JSON.stringify(updatedProducts));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = data.products.filter(product => product.id !== id);
      updateData({ products: updatedProducts });
      localStorage.setItem('vizitlink_products', JSON.stringify(updatedProducts));
    }
  };

  const handleShare = (product) => {
    // Copy product URL to clipboard
    navigator.clipboard.writeText(product.url);
    // You can add a toast notification here
    alert('Product URL copied to clipboard!');
  };

  const generateId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

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

  const handleAddProduct = (newProductOrArray) => {
    const items = Array.isArray(newProductOrArray) ? newProductOrArray : [newProductOrArray];
    const normalized = items.map(normalizeProduct);
    const updatedProducts = [...data.products, ...normalized];
    updateData({ products: updatedProducts });
    localStorage.setItem('vizitlink_products', JSON.stringify(updatedProducts));
    setShowAddModal(false);
  };

  const handleUpdateProduct = (updatedProduct) => {
    const updatedProducts = data.products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    updateData({ products: updatedProducts });
    localStorage.setItem('vizitlink_products', JSON.stringify(updatedProducts));
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
    <div className="space-y-6 p-4 lg:p-8 pt-0">
      {/* Header */}
      <div className="py-4 flex items-center justify-between sticky top-0 bg-gray-50 z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Shop</h2>
          <p className="text-gray-600 mt-1">
            Manage your products and track their performance
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products List */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Products ({data.products.filter(product => product.active).length} active)
        </h3>
        
        {data.products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">
              Start selling by adding your first product to your shop
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {data.products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={product.image || '/placeholder.svg'}
                          alt={product.title}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          sizes="64px"
                        />
                      </div>
                      <button className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <MoreVertical className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                      </button>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                      <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                      <p className="text-lg font-bold text-gray-900">${product?.price?.toFixed(2)}</p>
                      
                      {/* Performance Metrics */}
                      <div className="flex space-x-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.clicks} Clicks
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product?.ctr?.toFixed(1)}% CTR
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
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
                        onClick={() => handleShare(product)}
                      >
                        <Share2 className="w-4 h-4" />
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
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
          onDelete={handleDelete}
          product={editingProduct}
        />
      )}
    </div>
  );
}
