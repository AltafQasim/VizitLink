"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { X, Edit, Share2, Trash2 } from 'lucide-react';

const currencies = [
  { code: 'USD', symbol: '$', name: 'USD ($)' },
  { code: 'EUR', symbol: '€', name: 'EUR (€)' },
  { code: 'GBP', symbol: '£', name: 'GBP (£)' },
  { code: 'CAD', symbol: 'C$', name: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', name: 'AUD (A$)' },
  { code: 'INR', symbol: '₹', name: 'INR (₹)' },
];

export default function EditProductModal({ isOpen, onClose, onSave, product, onDelete }) {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    price: '',
    currency: 'USD',
    showInShop: true,
    showInTest: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        url: product.url || '',
        title: product.title || '',
        price: product.price?.toString() || '',
        currency: product.currency || 'USD',
        showInShop: product.showInShop !== false,
        showInTest: product.showInTest || false,
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (product) {
      const updatedProduct = {
        ...product,
        ...formData,
        price: parseFloat(formData.price) || 0,
      };
      onSave(updatedProduct);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
      onClose();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(product.url);
    alert('Product URL copied to clipboard!');
  };

  const resetModal = () => {
    setFormData({
      url: '',
      title: '',
      price: '',
      currency: 'USD',
      showInShop: true,
      showInTest: false,
    });
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-2xl w-[100vw] sm:w-3xl h-[100dvh] sm:h-auto sm:rounded-xl rounded-none">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Edit product
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 max-h-[calc(100dvh-120px)] sm:max-h-none overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex space-x-6">
              {/* Left Column - Form Fields */}
              <div className="flex-1 space-y-4">
                {/* URL Field */}
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-gray-700">
                    URL
                  </label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    placeholder="https://example.com/product"
                    className="w-full"
                  />
                </div>

                {/* Title Field */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Product title"
                    className="w-full"
                    maxLength={250}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {formData.title.length}/250
                  </div>
                </div>

                {/* Price Field */}
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Price (optional)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>

                {/* Currency Field */}
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Right Column - Product Image */}
              <div className="w-32 flex-shrink-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                  />
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Edit className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Save changes
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
