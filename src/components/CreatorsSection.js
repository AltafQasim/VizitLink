'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { WordRotate } from './magicui/word-rotate';

const CreatorsSection = () => {
  const creators = [
    { 
      name: '@cr7', 
      bg: 'bg-gradient-to-br from-green-600 to-green-700', 
      shape: 'rectangle',
      image: 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/cr7.png'
    },
    { 
      name: '@selenagomez', 
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600', 
      shape: 'rounded-rectangle',
      image: 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/selenagomez.png'
    },
    { 
      name: '@salmankhan', 
      bg: 'bg-gradient-to-br from-purple-400 to-purple-500', 
      shape: 'circle',
      image: 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/salmankhan.png'
    },
    { 
      name: '@viratkohli', 
      bg: 'bg-gradient-to-br from-pink-400 to-pink-500', 
      shape: 'square',
      image: 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/virat%20kohli.png'
    },
    { 
      name: '@arianagrande', 
      bg: 'bg-gradient-to-br from-lime-500 to-lime-600', 
      shape: 'rounded-rectangle',
      image: 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/arianagrade.webp'
    },
    { 
      name: '@ddlovato', 
      bg: 'bg-gradient-to-br from-red-700 to-red-800', 
      shape: 'oval',
      image: 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/ddlovato.png'
    },
    { 
      name: '@dwaynejohnson', 
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600', 
      shape: 'rectangle',
      image: 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/dwaynejohnson.png'
    },
    { 
      name: '@mrbeast', 
      bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', 
      shape: 'circle',
      image: 'https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/mrbeast.png'
    },
  ];

  const passions = [
    "creators",
    "influencers",
    "small businesses",
    "athletes",
    "models",
    "monetizers",
    "health educators",
    "streamers",
    "vloggers",
    "fitness coaches",
    "ecommerce sellers",
    "retailers",
    "products",
    "wellness leaders",
    "musicians",
    "bands",
    "podcasters",
    "fashion designers",
    "culture creators",
    "merch sellers",
    "writers",
    "DJs",
    "creators",
    "influencers",
    "small businesses",
    "athletes",
    "models",
    "monetizers",
    "health educators",
    "streamers",
    "vloggers",
    "fitness coaches",
    "ecommerce sellers",
    "retailers",
    "products",
    "wellness leaders",
    "musicians",
    "bands",
    "podcasters",
    "fashion designers",
    "culture creators",
    "merch sellers",
    "writers",
    "DJs",
    "creators",
    "influencers",
    "small businesses",
    "athletes",
    "models",
    "monetizers",
    "health educators",
    "streamers",
    "vloggers",
    "fitness coaches",
    "ecommerce sellers",
    "retailers",
    "products",
    "wellness leaders",
    "musicians",
    "bands",
    "podcasters",
    "fashion designers",
    "culture creators",
    "merch sellers",
    "writers",
    "DJs"
  ]

  const autoplayPlugin = Autoplay({
    delay: 1500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const getShapeClasses = (shape) => {
    const baseHeight = 'h-64 sm:h-72 md:h-80';
    switch (shape) {
      case 'circle':
        return `${baseHeight} rounded-full w-64 sm:w-72 md:w-80`;
      case 'square':
        return `${baseHeight} rounded-2xl w-64 sm:w-72 md:w-80`;
      case 'oval':
        return `${baseHeight} rounded-full w-80 sm:w-96 md:w-[28rem]`;
      case 'rounded-rectangle':
        return `${baseHeight} rounded-3xl w-72 sm:w-80 md:w-96`;
      default:
        return `${baseHeight} rounded-2xl w-72 sm:w-80 md:w-96`;
    }
  };

  const getProfileShapeClasses = (shape) => {
    const baseSize = 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48';
    switch (shape) {
      case 'circle':
        return `${baseSize} rounded-full`;
      case 'square':
        return `${baseSize} rounded-2xl`;
      case 'oval':
        return `${baseSize} rounded-full aspect-[4/3]`;
      case 'rounded-rectangle':
        return `${baseSize} rounded-3xl`;
      default:
        return `${baseSize} rounded-2xl`;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black py-12 md:py-32 px-4 md:px-6">
      <div className="mx-auto text-center">

        {/* Header */}
        <div className="mb-8 md:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 md:mb-4">
            The only link in bio trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              70M+
            </span>
          </h1>
          <WordRotate
            words={passions}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2665d6] capitalize"
          />
        </div>

        {/* Carousel */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Carousel
            opts={{
              align: "start",
            }}
            plugins={[autoplayPlugin]}
            className="w-full mx-auto overflow-hidden"
          >
            <CarouselContent className="-ml-1 md:-ml-2 lg:-ml-4">
              {[...creators, ...creators, ...creators].map((creator, index) => (
                <CarouselItem key={index} className="pl-1 md:pl-2 lg:pl-4 basis-auto">
                  <div className="group relative">
                    {/* Gradient shadow on hover */}
                    <div className="pointer-events-none absolute inset-0 translate-y-2 scale-105 rounded-3xl opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.35),rgba(168,85,247,0.35)_55%,transparent_70%)]" />
                    <div
                      className={`${creator.bg} ${getShapeClasses(creator.shape)} flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.04] p-3 md:p-4 lg:p-6`}
                    >
                      {/* Background pattern overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

                      {/* Profile Picture */}
                      <div className={`relative z-10 ${getProfileShapeClasses(creator.shape)} overflow-hidden border-4 border-white/30 shadow-2xl transition-all duration-300 group-hover:border-white/50 group-hover:scale-105`}>
                        <Image
                          src={creator.image}
                          alt={creator.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                        />
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>

                      {/* Creator badge */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-6 z-20 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:bg-white">
                        <span className="text-gray-800 font-semibold text-xs md:text-sm">
                          {creator.name}
                        </span>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white/30 rounded-full animate-pulse"></div>
                      <div className="absolute top-8 left-2 md:top-12 md:left-3 lg:top-16 lg:left-4 w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default CreatorsSection;
