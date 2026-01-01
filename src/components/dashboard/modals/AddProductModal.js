"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Search, X, Link, Loader2, ExternalLink, Edit } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useDashboard } from '../../../context/DashboardContext';
import { toast } from 'sonner';

// Image component with fallback handling
const ImageWithFallback = ({ src, alt, fill, className, sizes, priority = false }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleImageError = () => {
    if (!hasError) {
      setImgSrc('/placeholder.svg');
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill={'fill'}
        className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 w-full h-full object-cover`}
        sizes={sizes}
        priority={priority}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Format price with currency symbol
const formatPrice = (price, currency) => {
  if (!price || price <= 0) return 'Price not available';

  const symbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥'
  };

  const symbol = symbols[currency] || '$';
  return `${symbol}${price.toFixed(2)}`;
};

// Mock suggested products (will be replaced with Supabase search later)
const mockProducts = [
  // Perfumes - Amazon
  {
    "id": "p1",
    "title": "Vera Wang Eau de Parfum for Women",
    "brand": "Vera Wang",
    "price": 69.99,
    "currency": "USD",
    "url": "https://www.amazon.com/Vera-Wang-Parfum-Women-Floral/dp/B07Z4Z6Z6Z",
    "image": "https://m.media-amazon.com/images/I/61X8G0dZh5L._AC_SL1500_.jpg"
  },
  {
    "id": "p2",
    "title": "Dolce & Gabbana Light Blue Eau Intense",
    "brand": "Dolce & Gabbana",
    "price": 89.50,
    "currency": "USD",
    "url": "https://www.amazon.com/Dolce-Gabbana-Light-Blue-Intense/dp/B07X5Z6Z6Z",
    "image": "https://m.media-amazon.com/images/I/71hNlrAHWBL._AC_SL1500_.jpg"
  },
  {
    "id": "p3",
    "title": "Versace Eros Eau de Parfum",
    "brand": "Versace",
    "price": 72.95,
    "currency": "USD",
    "url": "https://www.amazon.com/Versace-Eros-Parfum-Men-Ounce/dp/B07X5Z6Z6Z",
    "image": "https://m.media-amazon.com/images/I/61t07i32GCL._AC_SL1500_.jpg"
  },
  {
    "id": "p4",
    "title": "Yves Saint Laurent Black Opium",
    "brand": "Yves Saint Laurent",
    "price": 98.00,
    "currency": "USD",
    "url": "https://www.amazon.com/Yves-Saint-Laurent-Black-Opium/dp/B07X5Z6Z6Z",
    "image": "https://m.media-amazon.com/images/I/61Aapx9WXGL._AC_SL1500_.jpg"
  },
  {
    "id": "p5",
    "title": "Tom Ford Oud Wood Eau de Parfum",
    "brand": "Tom Ford",
    "price": 145.00,
    "currency": "USD",
    "url": "https://www.amazon.com/Tom-Ford-Oud-Wood-Parfum/dp/B07X5Z6Z6Z",
    "image": "https://m.media-amazon.com/images/I/61i5bJr8BmL._AC_SL1500_.jpg"
  },

  // Mobile Phones - Flipkart
  {
    "id": "m1",
    "title": "Apple iPhone 15 Pro Max",
    "brand": "Apple",
    "price": 1199.00,
    "currency": "USD",
    "url": "https://www.flipkart.com/apple-iphone-15-pro-max/p/itm123456789",
    "image": "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/c/4/d/-original-imagtc5fz9sprrnk.jpeg"
  },
  {
    "id": "m2",
    "title": "Samsung Galaxy S24 Ultra 5G",
    "brand": "Samsung",
    "price": 1299.99,
    "currency": "USD",
    "url": "https://www.flipkart.com/samsung-galaxy-s24-ultra-5g/p/itm123456789",
    "image": "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/n/9/e/-original-imagtc2fvydzh6gh.jpeg"
  },
  {
    "id": "m3",
    "title": "Google Pixel 8 Pro",
    "brand": "Google",
    "price": 899.00,
    "currency": "USD",
    "url": "https://www.flipkart.com/google-pixel-8-pro/p/itm123456789",
    "image": "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/d/z/t/-original-imagkc5hf2bg4gzh.jpeg"
  },
  {
    "id": "m4",
    "title": "OnePlus 12 5G",
    "brand": "OnePlus",
    "price": 749.00,
    "currency": "USD",
    "url": "https://www.flipkart.com/oneplus-12-5g/p/itm123456789",
    "image": "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/f/6/9/-original-imagkc5hf2bg4gzh.jpeg"
  },
  {
    "id": "m5",
    "title": "Xiaomi 14 Pro 5G",
    "brand": "Xiaomi",
    "price": 699.99,
    "currency": "USD",
    "url": "https://www.flipkart.com/xiaomi-14-pro-5g/p/itm123456789",
    "image": "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/n/9/e/-original-imagtc2fvydzh6gh.jpeg"
  },

  // Mobile Accessories - Amazon
  {
    "id": "a1",
    "title": "Apple AirPods Pro (2nd Generation)",
    "brand": "Apple",
    "price": 249.00,
    "currency": "USD",
    "url": "https://www.amazon.com/Apple-AirPods-Pro-2nd-Generation/dp/B09JQWJN5Z",
    "image": "https://m.media-amazon.com/images/I/71bhWgQK-cL._AC_SL1500_.jpg"
  },
  {
    "id": "a2",
    "title": "Anker PowerCore 10000 PD Redux",
    "brand": "Anker",
    "price": 29.99,
    "currency": "USD",
    "url": "https://www.amazon.com/Anker-PowerCore-10000-Redux-Portable/dp/B09VCS6N5Q",
    "image": "https://m.media-amazon.com/images/I/713X9-5WhSL._AC_SL1500_.jpg"
  },
  {
    "id": "a3",
    "title": "Belkin BoostCharge Pro MagSafe",
    "brand": "Belkin",
    "price": 39.99,
    "currency": "USD",
    "url": "https://www.amazon.com/Belkin-BoostCharge-Wireless-Charger-MagSafe/dp/B09VCS6N5Q",
    "image": "https://m.media-amazon.com/images/I/71J2dZOWkIL._AC_SL1500_.jpg"
  },
  {
    "id": "a4",
    "title": "Samsung Galaxy Buds2 Pro",
    "brand": "Samsung",
    "price": 199.99,
    "currency": "USD",
    "url": "https://www.amazon.com/Samsung-Galaxy-Buds2-Pro-SM-R510NZKAXAR/dp/B09VCS6N5Q",
    "image": "https://m.media-amazon.com/images/I/61L5qiJ34YL._AC_SL1500_.jpg"
  },
  {
    "id": "a5",
    "title": "OtterBox Defender Series Pro Case",
    "brand": "OtterBox",
    "price": 49.99,
    "currency": "USD",
    "url": "https://www.amazon.com/OtterBox-Defender-Pro-iPhone-Cases/dp/B09VCS6N5Q",
    "image": "https://m.media-amazon.com/images/I/81BmjcZQ-QL._AC_SL1500_.jpg"
  },

  // Fashion Items - Meesho
  {
    "id": "f1",
    "title": "Men's Casual T-Shirt",
    "brand": "Roadster",
    "price": 19.99,
    "currency": "USD",
    "url": "https://www.meesho.com/mens-casual-t-shirt/p/123456789",
    "image": "https://images.meesho.com/images/products/146741161/fgxih_512.webp"
  },
  {
    "id": "f2",
    "title": "Aviator Sunglasses for Men",
    "brand": "John Jacobs",
    "price": 29.99,
    "currency": "USD",
    "url": "https://www.meesho.com/aviator-sunglasses-men/p/123456789",
    "image": "https://images.meesho.com/images/products/21786582/62db0_512.webp"
  },
  {
    "id": "f3",
    "title": "Analog Watch for Men",
    "brand": "Fastrack",
    "price": 39.99,
    "currency": "USD",
    "url": "https://www.meesho.com/analog-watch-men/p/123456789",
    "image": "https://images.meesho.com/images/products/3498005/15031190_512.webp"
  },
  {
    "id": "f4",
    "title": "Men's Sports Shoes",
    "brand": "Campus",
    "price": 49.99,
    "currency": "USD",
    "url": "https://www.meesho.com/mens-sports-shoes/p/123456789",
    "image": "https://images.meesho.com/images/products/101684867/khali_512.webp"
  },
  {
    "id": "f5",
    "title": "Women's Handbag",
    "brand": "Lavie",
    "price": 34.99,
    "currency": "USD",
    "url": "https://www.meesho.com/womens-handbag/p/123456789",
    "image": "https://images.meesho.com/images/products/90685102/vw2up_512.webp"
  },

  // Other Relevant Categories - Mix of platforms
  {
    "id": "o1",
    "title": "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    "brand": "Instant Pot",
    "price": 89.99,
    "currency": "USD",
    "url": "https://www.amazon.com/Instant-Pot-Duo-Electric-Pressure/dp/B09VCS6N5Q",
    "image": "https://m.media-amazon.com/images/I/71W5fXJzJ5L._AC_SL1500_.jpg"
  },
  {
    "id": "o2",
    "title": "Kindle Paperwhite (8 GB) – Black",
    "brand": "Amazon",
    "price": 109.99,
    "currency": "USD",
    "url": "https://www.amazon.com/Kindle-Paperwhite-8-GB-Black/dp/B09VCS6N5Q",
    "image": "https://m.media-amazon.com/images/I/61K454miqwL._AC_SL1500_.jpg"
  },
  {
    "id": "o3",
    "title": "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    "brand": "Sony",
    "price": 349.99,
    "currency": "USD",
    "url": "https://www.amazon.com/Sony-WH-1000XM5-Wireless-Canceling-Headphones/dp/B09VCS6N5Q",
    "image": "https://m.media-amazon.com/images/I/61JL30HHBBL._AC_SL1500_.jpg"
  },
  {
    "id": "o4",
    "title": "Nike Air Force 1 '07 Sneakers",
    "brand": "Nike",
    "price": 99.99,
    "currency": "USD",
    "url": "https://www.flipkart.com/nike-air-force-1-07-sneakers/p/itm123456789",
    "image": "https://rukminim2.flixcart.com/image/416/416/xif0q/shoe/n/i/k/123456789_400.jpg"
  },
  {
    "id": "o5",
    "title": "Women's Ethnic Kurti Set",
    "brand": "Libas",
    "price": 29.99,
    "currency": "USD",
    "url": "https://www.meesho.com/womens-ethnic-kurti-set/p/123456789",
    "image": "https://images.meesho.com/images/products/124805107/pu7pz_512.webp"
  }
];


export default function AddProductModal({ isOpen, onClose, onSave }) {
  const { data } = useDashboard();
  const [activeTab, setActiveTab] = useState('custom'); // 'browse' or 'custom'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [extractedProduct, setExtractedProduct] = useState(null);
  const [linkError, setLinkError] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Custom product form state
  const [customProduct, setCustomProduct] = useState({
    title: '',
    brand: '',
    price: '',
    currency: 'USD',
    redirectUrl: '',
    showPrice: true,
    image: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const filteredProducts = mockProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term is a URL
  const isUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Extract product data from URL
  const extractProductFromUrl = async (url) => {
    setIsLoadingLink(true);
    setLinkError('');
    setExtractedProduct(null);

    try {
      const response = await fetch('/api/extract-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const productData = {
          id: `extracted-${Date.now()}`,
          title: result.data.title || 'Untitled Product',
          brand: result.data.brand || result.data.domain || '',
          price: result.data.price || 0,
          currency: result.data.currency || 'USD',
          url: result.data.url,
          image: result.data.image || '/placeholder.svg',
          description: result.data.description || '',
          isExtracted: true
        };
        setExtractedProduct(productData);
      } else {
        throw new Error('No product data found');
      }
    } catch (error) {
      console.error('Error extracting product:', error);

      // Provide user-friendly error messages
      let errorMessage = 'Sorry, we had trouble finding this. Please try a new URL.';

      if (error.message.includes('Network error')) {
        errorMessage = 'Network error: Please check your internet connection and try again.';
      } else if (error.message.includes('Failed to fetch URL')) {
        errorMessage = 'Unable to access this URL. The website might be blocking our request.';
      } else if (error.message.includes('Invalid URL')) {
        errorMessage = 'Please enter a valid URL (e.g., https://example.com)';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again with a different URL.';
      }

      setLinkError(errorMessage);
    } finally {
      setIsLoadingLink(false);
    }
  };

  // Handle search term change with debouncing
  useEffect(() => {
    if (searchTerm && isUrl(searchTerm)) {
      // Debounce the API call to avoid too many requests
      const timeoutId = setTimeout(() => {
        extractProductFromUrl(searchTerm);
      }, 1000); // 1 second delay

      return () => clearTimeout(timeoutId);
    } else {
      setExtractedProduct(null);
      setLinkError('');
    }
  }, [searchTerm]);

  const handleProductSelect = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleAddExtractedProduct = async () => {
    if (extractedProduct) {
      setIsAddingProduct(true);
      const payload = [{
        title: extractedProduct.title,
        brand: extractedProduct.brand,
        price: extractedProduct.price,
        currency: extractedProduct.currency,
        url: extractedProduct.url,
        image: extractedProduct.image,
      }];
      onSave(payload);
      // Show success message briefly before closing
      setTimeout(() => {
        resetModal();
      }, 1000);
    }
  };

  const handleAddSelected = () => {
    const payload = selectedProducts.map((product) => ({
      title: product.title,
      brand: product.brand,
      price: product.price,
      currency: product.currency,
      url: product.url,
      image: product.image,
    }));
    onSave(payload);
    resetModal();
  };

  const resetModal = () => {
    setActiveTab('custom');
    setSearchTerm('');
    setSelectedProducts([]);
    setExtractedProduct(null);
    setLinkError('');
    setIsLoadingLink(false);
    setIsAddingProduct(false);
    setCustomProduct({
      title: '',
      brand: '',
      price: '',
      currency: 'USD',
      redirectUrl: '',
      showPrice: true,
      image: ''
    });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setPendingFile(null);
    onClose();
  };

  // Handle custom product form changes
  const handleCustomProductChange = (field, value) => {
    setCustomProduct(prev => ({ ...prev, [field]: value }));
  };

  // Handle single image upload
  const handleImageButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle custom product save
  const handleSaveCustomProduct = async () => {
    if (!customProduct.title.trim()) {
      toast.error('Please enter a product title');
      return;
    }

    if (!customProduct.price || parseFloat(customProduct.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!pendingFile && !customProduct.image) {
      toast.error('Please upload a product image');
      return;
    }

    setIsAddingProduct(true);
    const loadingToast = toast.loading('Adding product...');

    try {
      let finalImage = customProduct.image;

      if (pendingFile) {
        // Upload new image
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
      }

      const payload = [{
        title: customProduct.title,
        brand: customProduct.brand || '',
        price: parseFloat(customProduct.price),
        currency: customProduct.currency,
        url: customProduct.redirectUrl || '#',
        image: finalImage,
        showPrice: customProduct.showPrice,
      }];

      onSave(payload);
      toast.dismiss(loadingToast);
      toast.success('Product added successfully');

      // Clear temp states
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      setPendingFile(null);

      setTimeout(() => {
        resetModal();
      }, 1000);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to add product: ' + error.message);
    } finally {
      setIsAddingProduct(false);
    }
  };

  // Clear extracted product when user starts typing new search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear extracted product if user is typing (not a complete URL)
    if (extractedProduct && !isUrl(value)) {
      setExtractedProduct(null);
      setLinkError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-5xl w-[100vw] sm:w-full h-[100dvh] sm:h-[85vh] sm:rounded-xl rounded-none flex flex-col">
        <DialogHeader className="px-8 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[20px] font-semibold tracking-tight">
              Add to your shop
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

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'custom'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Add Your Own
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'browse'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Browse Products
            </button>
          </div>
        </DialogHeader>

        <div className="px-4 pt-4 sm:px-8 overflow-y-auto flex-1 scroll-elegant scrollbar-accent" aria-describedby="add-products-desc">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {activeTab === 'browse' ? (
              <>
                {/* Main Title */}
                <div className="text-left">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-1">Add products</h2>
                  <p id="add-products-desc" className="text-gray-600">Add product links from anywhere</p>
                </div>

                {/* Search Input */}
                <div className="sticky top-0 z-10">
                  <div className="w-full bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black antialiased font-sans [&_span]:!leading-none text-center text-black !ease-in-out !duration-200 hover:!bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.2)] border border-sand hover:border-chalk hover:bg-chalk active:border-chalk active:bg-chalk rounded-full px-5 py-4 flex items-center">
                    {isUrl(searchTerm) ? (
                      <Link className="w-5 h-5 text-purple-500 mr-3" />
                    ) : (
                      <Search className="w-5 h-5 text-gray-500 mr-3" />
                    )}
                    <input
                      type="text"
                      placeholder="Search products or paste a link (e.g., https://amazon.com/dp/...)"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-gray-500"
                    />
                  </div>

                  {/* Link Error */}
                  {linkError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">
                        Sorry, we had trouble finding this. Please try a new URL.
                      </p>
                    </div>
                  )}
                </div>

                {/* Loading State */}
                {isLoadingLink && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Loader2 className="w-5 h-5 text-purple-500 mr-2 animate-spin" />
                      Extracting Product Data...
                    </h3>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      {/* Loading Image Placeholder */}
                      <div className="w-20 h-24 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                      </div>

                      {/* Loading Content */}
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      </div>

                      {/* Loading Button */}
                      <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* Extracted Product */}
                {extractedProduct && !isLoadingLink && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Link className="w-5 h-5 text-purple-500 mr-2" />
                      Product from Link
                    </h3>
                    <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                      {/* Product Image */}
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-50 relative flex-shrink-0">
                        <ImageWithFallback
                          src={extractedProduct.image || '/placeholder.svg'}
                          alt={extractedProduct.title}
                          className="object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {(extractedProduct.brand || extractedProduct.domain) && (
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-gray-600 font-medium truncate">{extractedProduct.brand || extractedProduct.domain}</p>
                            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                          {extractedProduct.title}
                        </h3>
                        {extractedProduct.description && (
                          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                            {extractedProduct.description}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice(extractedProduct.price, extractedProduct.currency)}
                        </p>
                      </div>

                      {/* Add Button */}
                      <Button
                        onClick={handleAddExtractedProduct}
                        disabled={isAddingProduct}
                        className={`w-20 h-10 text-sm font-medium transition-all duration-200 ${isAddingProduct
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                          } text-white`}
                      >
                        {isAddingProduct ? (
                          <div className="flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            Adding...
                          </div>
                        ) : (
                          'Add'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Products Grid - Only show when not extracting from URL */}
                {!isUrl(searchTerm) && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-1">
                    {filteredProducts.map((product) => {
                      const isSelected = selectedProducts.find(p => p.id === product.id);
                      return (
                        <motion.div
                          key={product.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative cursor-pointer rounded-2xl transition-all duration-200 shadow-sm ${isSelected
                            ? 'ring-2 ring-purple-500 bg-purple-50 border border-purple-200'
                            : 'border border-gray-200 hover:shadow-md bg-white'
                            }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          {/* Product Image */}
                          <div className="aspect-[14/12] rounded-t-2xl overflow-hidden bg-gray-50 relative">
                            <ImageWithFallback
                              src={product.image || '/placeholder.svg'}
                              alt={product.title}
                              className="object-cover rounded-t-2xl"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="p-3">
                            {product.brand && (
                              <p className="text-sm text-gray-600 font-medium mb-1">{product.brand}</p>
                            )}
                            <h3 className="font-semibold text-gray-900 text-[14px] leading-snug mb-1.5 line-clamp-2">
                              {product.title}
                            </h3>
                            <p className="text-[14px] font-semibold text-gray-900">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center shadow">
                              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Custom Product Form - Same layout as EditProductModal */
              <div className="grid sm:grid-cols-2 gap-6">

                {/* Product Image */}
                <div className="w-full sm:w-auto flex justify-center !m-0">
                  <div className="relative">
                    <img
                      src={previewUrl || customProduct.image || '/placeholder.svg'}
                      alt={customProduct.title || 'Product'}
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
                      disabled={uploadingImage}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${uploadingImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'}`}
                      title="Change image"
                    >
                      {uploadingImage ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Edit className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                </div>


                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <Input
                      id="title"
                      type="text"
                      value={customProduct.title}
                      onChange={(e) => handleCustomProductChange('title', e.target.value)}
                      placeholder="Product title"
                      className="w-full"
                      maxLength={250}
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {customProduct.title.length}/250
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
                      value={customProduct.brand}
                      onChange={(e) => handleCustomProductChange('brand', e.target.value)}
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
                        value={customProduct.price}
                        onChange={(e) => handleCustomProductChange('price', e.target.value)}
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
                        value={customProduct.currency}
                        onChange={(e) => handleCustomProductChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                        <option value="INR">INR (₹)</option>
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
                      value={customProduct.redirectUrl}
                      onChange={(e) => handleCustomProductChange('redirectUrl', e.target.value)}
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
                      checked={customProduct.showPrice}
                      onCheckedChange={(checked) => handleCustomProductChange('showPrice', checked)}
                    />
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </div>
        {/* Action Buttons */}
        {activeTab === 'browse' && !isLoadingLink && !isUrl(searchTerm) && !extractedProduct && (
          <div className="flex justify-between items-center border-t border-gray-200 sticky bottom-0 bg-white p-4 sm:px-8">
            <div className="text-sm text-gray-600">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={resetModal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSelected}
                disabled={selectedProducts.length === 0}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}
        {activeTab === 'custom' && (
          <div className="flex justify-end items-center border-t border-gray-200 sticky bottom-0 bg-white p-4 sm:px-8">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={resetModal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCustomProduct}
                disabled={isAddingProduct || !customProduct.title.trim() || (!pendingFile && !customProduct.image)}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isAddingProduct ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Product'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}