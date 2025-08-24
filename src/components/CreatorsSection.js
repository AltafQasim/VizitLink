'use client'
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const CreatorsSection = () => {
  const creators = [
    { name: '@kanyewest', bg: 'bg-gradient-to-br from-green-600 to-green-700', shape: 'rectangle' },
    { name: '@selenagomez', bg: 'bg-gradient-to-br from-orange-500 to-orange-600', shape: 'rounded-rectangle' },
    { name: '@justinbieber', bg: 'bg-gradient-to-br from-purple-400 to-purple-500', shape: 'circle' },
    { name: '@taylorswift', bg: 'bg-gradient-to-br from-pink-400 to-pink-500', shape: 'square' },
    { name: '@arianagrande', bg: 'bg-gradient-to-br from-lime-500 to-lime-600', shape: 'rounded-rectangle' },
    { name: '@ddlovato', bg: 'bg-gradient-to-br from-red-700 to-red-800', shape: 'oval' },
    { name: '@nickiminaj', bg: 'bg-gradient-to-br from-blue-500 to-blue-600', shape: 'rectangle' },
    { name: '@justintimberlake', bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', shape: 'circle' },
  ];

  const autoplayPlugin = Autoplay({
    delay: 1500,
    stopOnInteraction: false,
    stopOnMouseEnter: false,
  });

  const getShapeClasses = (shape) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80';
      case 'square':
        return 'rounded-2xl w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72';
      case 'oval':
        return 'rounded-full w-56 h-40 sm:w-72 sm:h-52 md:w-96 md:h-72';
      case 'rounded-rectangle':
        return 'rounded-3xl w-44 h-60 sm:w-56 sm:h-76 md:w-72 md:h-96';
      default:
        return 'rounded-2xl w-44 h-60 sm:w-56 sm:h-76 md:w-72 md:h-96';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Header */}
        <div className="mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 md:mb-4">
            The only link in bio trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              70M+
            </span>
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            creators
          </h3>
        </div>

        {/* Carousel */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Carousel
            opts={{
              align: "start",
            }}
            plugins={[autoplayPlugin]}
            className="w-full max-w-6xl mx-auto overflow-hidden"
          >
            <CarouselContent className="-ml-1 md:-ml-2 lg:-ml-4">
              {[...creators, ...creators, ...creators].map((creator, index) => (
                <CarouselItem key={index} className="pl-1 md:pl-2 lg:pl-4 basis-auto">
                  <div className="hover-scale">
                    <div 
                      className={`${creator.bg} ${getShapeClasses(creator.shape)} flex items-end relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 p-3 md:p-4 lg:p-6`}
                    >
                      {/* Background pattern */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Creator badge */}
                      <div className="relative z-10 bg-white rounded-full px-2 py-1 md:px-3 md:py-1 shadow-lg">
                        <span className="text-gray-800 font-medium text-xs">
                          {creator.name}
                        </span>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full animate-pulse"></div>
                      <div className="absolute top-8 left-2 md:top-12 md:left-3 lg:top-16 lg:left-4 w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 bg-white/10 rounded-full"></div>
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
