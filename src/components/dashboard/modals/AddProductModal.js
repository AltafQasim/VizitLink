"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Search, X, Link, Loader2, ExternalLink } from 'lucide-react';

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
  {
    "id": "1",
    "title": "Daily Moisturizing Lotion",
    "brand": "Aveeno",
    "price": 77.98,
    "currency": "USD",
    "url": "https://aveeno.com/products/daily-moisturizing-lotion",
    "image": "https://picsum.photos/seed/1/150/150"
  },
  {
    "id": "2",
    "title": "Retinol Night Cream",
    "brand": "Neutrogena",
    "price": 73.2,
    "currency": "USD",
    "url": "https://neutrogena.com/products/retinol-night-cream",
    "image": "https://picsum.photos/seed/2/150/150"
  },
  {
    "id": "3",
    "title": "Anthelios Sunscreen SPF 60",
    "brand": "La Roche-Posay",
    "price": 72.66,
    "currency": "USD",
    "url": "https://larocheposay.com/products/anthelios-sunscreen-spf-60",
    "image": "https://picsum.photos/seed/3/150/150"
  },
  {
    "id": "4",
    "title": "Retinol Night Cream",
    "brand": "Neutrogena",
    "price": 62.39,
    "currency": "USD",
    "url": "https://neutrogena.com/products/retinol-night-cream",
    "image": "https://picsum.photos/seed/4/150/150"
  },
  {
    "id": "5",
    "title": "Dramatically Different Moisturizing Lotion",
    "brand": "Clinique",
    "price": 19.86,
    "currency": "USD",
    "url": "https://clinique.com/products/dramatically-different-moisturizing-lotion",
    "image": "https://picsum.photos/seed/5/150/150"
  },
  {
    "id": "6",
    "title": "Revitalift Hyaluronic Acid Serum",
    "brand": "L'Oreal",
    "price": 79.64,
    "currency": "USD",
    "url": "https://loreal.com/products/revitalift-hyaluronic-acid-serum",
    "image": "https://picsum.photos/seed/6/150/150"
  },
  {
    "id": "7",
    "title": "Dramatically Different Moisturizing Lotion",
    "brand": "Clinique",
    "price": 79.02,
    "currency": "USD",
    "url": "https://clinique.com/products/dramatically-different-moisturizing-lotion",
    "image": "https://picsum.photos/seed/7/150/150"
  },
  {
    "id": "8",
    "title": "Advanced Repair Cream",
    "brand": "Eucerin",
    "price": 10.0,
    "currency": "USD",
    "url": "https://eucerin.com/products/advanced-repair-cream",
    "image": "https://picsum.photos/seed/8/150/150"
  },
  {
    "id": "9",
    "title": "Retinol Night Cream",
    "brand": "Neutrogena",
    "price": 70.89,
    "currency": "USD",
    "url": "https://neutrogena.com/products/retinol-night-cream",
    "image": "https://picsum.photos/seed/9/150/150"
  },
  {
    "id": "10",
    "title": "Anthelios Sunscreen SPF 60",
    "brand": "La Roche-Posay",
    "price": 60.48,
    "currency": "USD",
    "url": "https://larocheposay.com/products/anthelios-sunscreen-spf-60",
    "image": "https://picsum.photos/seed/10/150/150"
  },
  {
    "id": "11",
    "title": "Daily Moisturizing Lotion",
    "brand": "Aveeno",
    "price": 63.34,
    "currency": "USD",
    "url": "https://aveeno.com/products/daily-moisturizing-lotion",
    "image": "https://picsum.photos/seed/11/150/150"
  },
  {
    "id": "12",
    "title": "Regenerist Micro-Sculpting Cream",
    "brand": "Olay",
    "price": 53.01,
    "currency": "USD",
    "url": "https://olay.com/products/regenerist-micro-sculpting-cream",
    "image": "https://picsum.photos/seed/12/150/150"
  },
  {
    "id": "13",
    "title": "Regenerist Micro-Sculpting Cream",
    "brand": "Olay",
    "price": 61.45,
    "currency": "USD",
    "url": "https://olay.com/products/regenerist-micro-sculpting-cream",
    "image": "https://picsum.photos/seed/13/150/150"
  },
  {
    "id": "14",
    "title": "Revitalift Hyaluronic Acid Serum",
    "brand": "L'Oreal",
    "price": 15.22,
    "currency": "USD",
    "url": "https://loreal.com/products/revitalift-hyaluronic-acid-serum",
    "image": "https://picsum.photos/seed/14/150/150"
  },
  {
    "id": "15",
    "title": "Anthelios Sunscreen SPF 60",
    "brand": "La Roche-Posay",
    "price": 21.22,
    "currency": "USD",
    "url": "https://larocheposay.com/products/anthelios-sunscreen-spf-60",
    "image": "https://picsum.photos/seed/15/150/150"
  },
  {
    "id": "16",
    "title": "Advanced Repair Cream",
    "brand": "Eucerin",
    "price": 66.04,
    "currency": "USD",
    "url": "https://eucerin.com/products/advanced-repair-cream",
    "image": "https://picsum.photos/seed/16/150/150"
  },
  {
    "id": "17",
    "title": "Retinol Night Cream",
    "brand": "Neutrogena",
    "price": 14.91,
    "currency": "USD",
    "url": "https://neutrogena.com/products/retinol-night-cream",
    "image": "https://picsum.photos/seed/17/150/150"
  },
  {
    "id": "18",
    "title": "Anthelios Sunscreen SPF 60",
    "brand": "La Roche-Posay",
    "price": 16.68,
    "currency": "USD",
    "url": "https://larocheposay.com/products/anthelios-sunscreen-spf-60",
    "image": "https://picsum.photos/seed/18/150/150"
  },
  {
    "id": "19",
    "title": "Niacinamide 10% + Zinc 1%",
    "brand": "The Ordinary",
    "price": 66.16,
    "currency": "USD",
    "url": "https://theordinary.com/products/niacinamide-10%-+-zinc-1%",
    "image": "https://picsum.photos/seed/19/150/150"
  },
  {
    "id": "20",
    "title": "Regenerist Micro-Sculpting Cream",
    "brand": "Olay",
    "price": 45.13,
    "currency": "USD",
    "url": "https://olay.com/products/regenerist-micro-sculpting-cream",
    "image": "https://picsum.photos/seed/20/150/150"
  },
  {
    "id": "21",
    "title": "Dramatically Different Moisturizing Lotion",
    "brand": "Clinique",
    "price": 50.73,
    "currency": "USD",
    "url": "https://clinique.com/products/dramatically-different-moisturizing-lotion",
    "image": "https://picsum.photos/seed/21/150/150"
  },
  {
    "id": "22",
    "title": "Moisturizing Cream",
    "brand": "CeraVe",
    "price": 29.17,
    "currency": "USD",
    "url": "https://cerave.com/products/moisturizing-cream",
    "image": "https://picsum.photos/seed/22/150/150"
  },
  {
    "id": "23",
    "title": "Soft Moisturizing Cream",
    "brand": "Nivea",
    "price": 67.47,
    "currency": "USD",
    "url": "https://nivea.com/products/soft-moisturizing-cream",
    "image": "https://picsum.photos/seed/23/150/150"
  },
  {
    "id": "24",
    "title": "Dramatically Different Moisturizing Lotion",
    "brand": "Clinique",
    "price": 48.37,
    "currency": "USD",
    "url": "https://clinique.com/products/dramatically-different-moisturizing-lotion",
    "image": "https://picsum.photos/seed/24/150/150"
  },
  {
    "id": "25",
    "title": "Moisturizing Cream",
    "brand": "CeraVe",
    "price": 16.17,
    "currency": "USD",
    "url": "https://cerave.com/products/moisturizing-cream",
    "image": "https://picsum.photos/seed/25/150/150"
  },
  {
    "id": "26",
    "title": "Daily Moisturizing Lotion",
    "brand": "Aveeno",
    "price": 59.11,
    "currency": "USD",
    "url": "https://aveeno.com/products/daily-moisturizing-lotion",
    "image": "https://picsum.photos/seed/26/150/150"
  },
  {
    "id": "27",
    "title": "Anthelios Sunscreen SPF 60",
    "brand": "La Roche-Posay",
    "price": 35.09,
    "currency": "USD",
    "url": "https://larocheposay.com/products/anthelios-sunscreen-spf-60",
    "image": "https://picsum.photos/seed/27/150/150"
  },
  {
    "id": "28",
    "title": "Moisturizing Cream",
    "brand": "CeraVe",
    "price": 24.49,
    "currency": "USD",
    "url": "https://cerave.com/products/moisturizing-cream",
    "image": "https://picsum.photos/seed/28/150/150"
  },
  {
    "id": "29",
    "title": "Soft Moisturizing Cream",
    "brand": "Nivea",
    "price": 40.8,
    "currency": "USD",
    "url": "https://nivea.com/products/soft-moisturizing-cream",
    "image": "https://picsum.photos/seed/29/150/150"
  },
  {
    "id": "30",
    "title": "Daily Moisturizing Lotion",
    "brand": "Aveeno",
    "price": 29.96,
    "currency": "USD",
    "url": "https://aveeno.com/products/daily-moisturizing-lotion",
    "image": "https://picsum.photos/seed/30/150/150"
  },
  {
    "id": "31",
    "title": "Niacinamide 10% + Zinc 1%",
    "brand": "The Ordinary",
    "price": 73.22,
    "currency": "USD",
    "url": "https://theordinary.com/products/niacinamide-10%-+-zinc-1%",
    "image": "https://picsum.photos/seed/31/150/150"
  },
  {
    "id": "32",
    "title": "Regenerist Micro-Sculpting Cream",
    "brand": "Olay",
    "price": 10.85,
    "currency": "USD",
    "url": "https://olay.com/products/regenerist-micro-sculpting-cream",
    "image": "https://picsum.photos/seed/32/150/150"
  },
  {
    "id": "33",
    "title": "Soft Moisturizing Cream",
    "brand": "Nivea",
    "price": 79.42,
    "currency": "USD",
    "url": "https://nivea.com/products/soft-moisturizing-cream",
    "image": "https://picsum.photos/seed/33/150/150"
  },
  {
    "id": "34",
    "title": "Advanced Repair Cream",
    "brand": "Eucerin",
    "price": 26.3,
    "currency": "USD",
    "url": "https://eucerin.com/products/advanced-repair-cream",
    "image": "https://picsum.photos/seed/34/150/150"
  },
  {
    "id": "35",
    "title": "Revitalift Hyaluronic Acid Serum",
    "brand": "L'Oreal",
    "price": 23.85,
    "currency": "USD",
    "url": "https://loreal.com/products/revitalift-hyaluronic-acid-serum",
    "image": "https://picsum.photos/seed/35/150/150"
  },
  {
    "id": "36",
    "title": "Regenerist Micro-Sculpting Cream",
    "brand": "Olay",
    "price": 69.6,
    "currency": "USD",
    "url": "https://olay.com/products/regenerist-micro-sculpting-cream",
    "image": "https://picsum.photos/seed/36/150/150"
  },
  {
    "id": "37",
    "title": "Moisturizing Cream",
    "brand": "CeraVe",
    "price": 11.81,
    "currency": "USD",
    "url": "https://cerave.com/products/moisturizing-cream",
    "image": "https://picsum.photos/seed/37/150/150"
  },
  {
    "id": "38",
    "title": "Dramatically Different Moisturizing Lotion",
    "brand": "Clinique",
    "price": 58.4,
    "currency": "USD",
    "url": "https://clinique.com/products/dramatically-different-moisturizing-lotion",
    "image": "https://picsum.photos/seed/38/150/150"
  },
  {
    "id": "39",
    "title": "Anthelios Sunscreen SPF 60",
    "brand": "La Roche-Posay",
    "price": 65.23,
    "currency": "USD",
    "url": "https://larocheposay.com/products/anthelios-sunscreen-spf-60",
    "image": "https://picsum.photos/seed/39/150/150"
  },
  {
    "id": "40",
    "title": "Moisturizing Cream",
    "brand": "CeraVe",
    "price": 71.25,
    "currency": "USD",
    "url": "https://cerave.com/products/moisturizing-cream",
    "image": "https://picsum.photos/seed/40/150/150"
  },
  {
    "id": "41",
    "title": "Niacinamide 10% + Zinc 1%",
    "brand": "The Ordinary",
    "price": 22.6,
    "currency": "USD",
    "url": "https://theordinary.com/products/niacinamide-10%-+-zinc-1%",
    "image": "https://picsum.photos/seed/41/150/150"
  },
  {
    "id": "42",
    "title": "Daily Moisturizing Lotion",
    "brand": "Aveeno",
    "price": 53.36,
    "currency": "USD",
    "url": "https://aveeno.com/products/daily-moisturizing-lotion",
    "image": "https://picsum.photos/seed/42/150/150"
  },
  {
    "id": "43",
    "title": "Retinol Night Cream",
    "brand": "Neutrogena",
    "price": 31.25,
    "currency": "USD",
    "url": "https://neutrogena.com/products/retinol-night-cream",
    "image": "https://picsum.photos/seed/43/150/150"
  },
  {
    "id": "44",
    "title": "Retinol Night Cream",
    "brand": "Neutrogena",
    "price": 22.41,
    "currency": "USD",
    "url": "https://neutrogena.com/products/retinol-night-cream",
    "image": "https://picsum.photos/seed/44/150/150"
  },
  {
    "id": "45",
    "title": "Advanced Repair Cream",
    "brand": "Eucerin",
    "price": 23.69,
    "currency": "USD",
    "url": "https://eucerin.com/products/advanced-repair-cream",
    "image": "https://picsum.photos/seed/45/150/150"
  },
  {
    "id": "46",
    "title": "Revitalift Hyaluronic Acid Serum",
    "brand": "L'Oreal",
    "price": 10.52,
    "currency": "USD",
    "url": "https://loreal.com/products/revitalift-hyaluronic-acid-serum",
    "image": "https://picsum.photos/seed/46/150/150"
  },
  {
    "id": "47",
    "title": "Retinol Night Cream",
    "brand": "Neutrogena",
    "price": 53.32,
    "currency": "USD",
    "url": "https://neutrogena.com/products/retinol-night-cream",
    "image": "https://picsum.photos/seed/47/150/150"
  },
  {
    "id": "48",
    "title": "Niacinamide 10% + Zinc 1%",
    "brand": "The Ordinary",
    "price": 17.55,
    "currency": "USD",
    "url": "https://theordinary.com/products/niacinamide-10%-+-zinc-1%",
    "image": "https://picsum.photos/seed/48/150/150"
  },
  {
    "id": "49",
    "title": "Retinol Night Cream",
    "brand": "Neutrogena",
    "price": 31.43,
    "currency": "USD",
    "url": "https://neutrogena.com/products/retinol-night-cream",
    "image": "https://picsum.photos/seed/49/150/150"
  },
  {
    "id": "50",
    "title": "Daily Moisturizing Lotion",
    "brand": "Aveeno",
    "price": 23.02,
    "currency": "USD",
    "url": "https://aveeno.com/products/daily-moisturizing-lotion",
    "image": "https://picsum.photos/seed/50/150/150"
  },
  {
    id: '51',
    title: 'Wrinkle Smoother Lift & Firm Serum',
    brand: 'Merle Norman',
    price: 73.00,
    currency: 'USD',
    url: 'https://merlenorman.com/products/wrinkle-smoother-serum',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&h=150&fit=crop&crop=center',
  },
  {
    id: '52',
    title: 'Ancient Multivitamin Women\'s Once Daily',
    brand: 'Ancient Nutrition',
    price: 29.95,
    currency: 'USD',
    url: 'https://ancientnutrition.com/products/multivitamin-womens',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop&crop=center',
  },
  {
    id: '53',
    title: 'Double Hydration Boost Gel',
    brand: 'JTDcosmetics',
    price: 17.40,
    currency: 'USD',
    url: 'https://jtdluxe.com/products/double-hydration-boost-gel',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&crop=center',
  },
  {
    id: '54',
    title: 'Vitamin C Brightening Serum',
    brand: 'The Ordinary',
    price: 12.90,
    currency: 'USD',
    url: 'https://theordinary.com/products/vitamin-c-serum',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&crop=center',
  },
  {
    id: '55',
    title: 'Hyaluronic Acid Moisturizer',
    brand: 'CeraVe',
    price: 19.99,
    currency: 'USD',
    url: 'https://cerave.com/products/hyaluronic-acid-moisturizer',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&h=150&fit=crop&crop=center',
  },
  {
    id: '56',
    title: 'Retinol Night Cream',
    brand: 'Neutrogena',
    price: 24.99,
    currency: 'USD',
    url: 'https://neutrogena.com/products/retinol-cream',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop&crop=center',
  }
]


export default function AddProductModal({ isOpen, onClose, onSave }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [extractedProduct, setExtractedProduct] = useState(null);
  const [linkError, setLinkError] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

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
          brand: result.data.brand || result.data.domain || 'Unknown',
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
    setSearchTerm('');
    setSelectedProducts([]);
    setExtractedProduct(null);
    setLinkError('');
    setIsLoadingLink(false);
    setIsAddingProduct(false);
    onClose();
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
        </DialogHeader>

        <div className="px-4 pt-4 sm:px-8 sm:pt-8 overflow-y-auto flex-1 scroll-elegant scrollbar-accent" aria-describedby="add-products-desc">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Main Title */}
            <div className="text-left">
              <h2 className="text-[22px] font-bold text-gray-900 mb-1">Add products</h2>
              <p id="add-products-desc" className="text-gray-600">Add product links from anywhere</p>
            </div>

            {/* Search Input */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 py-2 border-b border-gray-100">
              <div className="w-full bg-gray-100 rounded-full px-5 py-4 flex items-center">
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
                    <img
                      src={extractedProduct.image || '/placeholder.svg'}
                      alt={extractedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-600 font-medium truncate">{extractedProduct.brand}</p>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
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
                    className={`w-20 h-10 text-sm font-medium transition-all duration-200 ${
                      isAddingProduct 
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
                    className={`relative cursor-pointer rounded-2xl transition-all duration-200 shadow-sm ${
                      isSelected 
                        ? 'ring-2 ring-purple-500 bg-purple-50 border border-purple-200' 
                        : 'border border-gray-200 hover:shadow-md bg-white'
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    {/* Product Image */}
                    <div className="aspect-[4/5] rounded-t-2xl overflow-hidden bg-gray-50 relative">
                      <Image
                        src={product.image || '/placeholder.svg'}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={false}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-3">
                      <p className="text-sm text-gray-600 font-medium mb-1">{product.brand}</p>
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

            {/* Action Buttons - Hide when loading link or when URL is being processed */}
            {!isLoadingLink && !isUrl(searchTerm) && !extractedProduct && (
            <div className="flex justify-between items-center pt-5 border-t border-gray-200 sticky bottom-0 bg-white py-4">
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
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
