"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { X, Edit, Share2, Trash2, Loader2 } from 'lucide-react';
import { Switch } from '../../ui/switch';
import { supabase } from '../../../lib/supabase';
import { useDashboard } from '../../../context/DashboardContext';

const currencies = [
  { code: 'USD', symbol: '$', name: 'USD ($)' },
  { code: 'EUR', symbol: '€', name: 'EUR (€)' },
  { code: 'GBP', symbol: '£', name: 'GBP (£)' },
  { code: 'CAD', symbol: 'C$', name: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', name: 'AUD (A$)' },
  { code: 'INR', symbol: '₹', name: 'INR (₹)' },
];

export default function EditProductModal({ isOpen, onClose, onSave, product, onDelete }) {
  const { data } = useDashboard();
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    brand: '',
    price: '',
    currency: 'USD',
    showInShop: true,
    showInTest: false,
    showPrice: true,
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        url: product.url || '',
        title: product.title || '',
        brand: product.brand || '',
        price: product.price?.toString() || '',
        currency: product.currency || 'USD',
        showInShop: product.showInShop !== false,
        showInTest: product.showInTest || false,
        showPrice: (product.showPrice !== undefined ? product.showPrice !== false : (product.show_price !== undefined ? product.show_price !== false : true)),
        image: product.image || ''
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!product) return;
    setIsUploading(true);
    try {
      let finalImage = product.image;

      if (pendingFile) {
        // Prepare old path deletion if image belongs to our bucket
        const currentImageUrl = product.image;
        let oldFilePath = null;
        if (currentImageUrl && currentImageUrl.includes('/productimage/')) {
          const parts = currentImageUrl.split('/productimage/');
          if (parts.length > 1) oldFilePath = parts[1];
        }

        // Upload new image (mirrors wallpaper upload)
        const ext = pendingFile.name.split('.').pop();
        const fileName = `${Date.now()}.${ext}`;
        const userId = data?.profile?.id || 'anonymous';
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('productimage')
          .upload(filePath, pendingFile);
        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('productimage')
          .getPublicUrl(filePath);
        finalImage = publicUrlData.publicUrl;

        if (oldFilePath) {
          await supabase.storage.from('productimage').remove([oldFilePath]);
        }
      }

      const updatedProduct = {
        ...product,
        ...formData,
        image: finalImage,
        price: parseFloat(formData.price) || 0,
      };
      onSave(updatedProduct);
      // Clear temp states after successful save
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      setPendingFile(null);
    } catch (err) {
      alert('Save failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  // Mirror wallpaper image upload flow, but into 'productimage' bucket
  const handleImageButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      brand: '',
      price: '',
      currency: 'USD',
      showInShop: true,
      showInTest: false,
      showPrice: true,
    });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setPendingFile(null);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-5xl w-[100vw] sm:w-full h-[100dvh] sm:h-[85vh] sm:rounded-xl rounded-none">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Edit product
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetModal}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 max-h-[calc(100dvh-120px)] sm:max-h-none overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Right Column - Product Image (same behavior as wallpaper image upload) */}
              <div className="w-full flex justify-center !m-0">
                <div className="relative">
                  <img
                    src={previewUrl || product.image}
                    alt={product.title}
                    className="sm:w-full sm:h-full w-44 h-44 rounded-lg object-cover border border-gray-200"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,image/heic,image/heif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={handleImageButtonClick}
                    disabled={isUploading}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'}`}
                    title="Change image"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Edit className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>


              {/* Left Column - Form Fields */}
              <div className="flex-1 space-y-4">
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

                {/* Brand Field */}
                <div className="space-y-2">
                  <label htmlFor="brand" className="text-sm font-medium text-gray-700">
                    Brand (optional)
                  </label>
                  <Input
                    id="brand"
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Brand name"
                    className="w-full"
                  />
                </div>

                <div className="flex space-x-3 w-full">

                  {/* Price Field */}
                  <div className="space-y-2 w-full">
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
                  <div className="space-y-2 w-full">
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

                {/* URL Field */}
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-gray-700">
                    Redirect URL
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

                {/* Show/Hide Price Switch */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Price</label>
                    <p className="text-xs text-gray-500">Display price on product card</p>
                  </div>
                  <Switch
                    checked={formData.showPrice}
                    onCheckedChange={(checked) => handleInputChange('showPrice', checked)}
                  />
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

              {/* <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </Button> */}
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
