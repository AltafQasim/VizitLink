"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    quote: "Connecting with millions of fans globally through one unified link has transformed my digital presence.",
    author: "Virat Kohli",
    title: "International Cricketer, Brand Ambassador",
    description: "Cricket icon and one of the greatest batsmen of all time",
    image: "https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/virat%20kohli.png",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    quote: "As an artist, having all my creative work in one place helps my fans discover everything I do.",
    author: "Priyanka Chopra Jonas",
    title: "Global Icon, Actor, Producer",
    description: "Bollywood star turned Hollywood actress and UNICEF Goodwill Ambassador",
    image: "https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/priyankachopra.png",
    gradient: "from-pink-500 to-rose-600"
  },
  {
    id: 7,
    quote: "Connecting with my global family of fans means everything to me. One platform, millions of hearts united.",
    author: "Cristiano Ronaldo",
    title: "Football Legend, Global Icon",
    description: "Portuguese footballer widely regarded as one of the greatest players of all time",
    image: "https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/cr7.png",
    gradient: "from-red-600 to-orange-600"
  },
  {
    id: 3,
    quote: "Sharing my journey from the field to social causes has never been easier. One link, endless possibilities.",
    author: "MS Dhoni",
    title: "Former Indian Cricket Captain, Icon",
    description: "World Cup winning captain and one of India's most successful cricket leaders",
    image: "https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/msdhoni.png",
    gradient: "from-yellow-500 to-orange-600"
  },
  {
    id: 4,
    quote: "Music transcends boundaries, and so should the way we connect with our audience worldwide.",
    author: "AR Rahman",
    title: "Music Maestro, Oscar Winner",
    description: "Legendary composer and the pride of Indian music on the global stage",
    image: "https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/arrahman.png",
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    id: 5,
    quote: "From wrestling to acting, my fans follow me everywhere. This makes it simple for them to stay connected.",
    author: "Dwayne Johnson",
    title: "Actor, Former WWE Champion",
    description: "Global superstar with Indian fan following in millions",
    image: "https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/dwaynejohnson.png",
    gradient: "from-green-500 to-teal-600"
  },
  {
    id: 6,
    quote: "Badminton taught me discipline, and technology helps me stay close to my supporters across India.",
    author: "PV Sindhu",
    title: "Olympic Medalist, Badminton Champion",
    description: "India's badminton pride and two-time Olympic medalist",
    image: "https://hhnlsawagpxafcyplsuj.supabase.co/storage/v1/object/public/testimonials/pvsindhu.png",
    gradient: "from-red-500 to-pink-600"
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Icons Worldwide
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See how global personalities connect with their audiences
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          {/* Profile Picture */}
          <div className="mb-8 md:mb-10 flex justify-center">
            <div className="relative group">
              {/* Gradient ring */}
              <div className={`absolute -inset-2 bg-gradient-to-r ${currentTestimonial.gradient} rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse`}></div>

              {/* Profile image container */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.author}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                  priority
                />
              </div>

              {/* Verified badge */}
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-blue-500 rounded-full p-1.5 md:p-2 shadow-lg">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {currentTestimonial.author}
            </h3>
            <p className={`text-base md:text-lg font-semibold bg-gradient-to-r ${currentTestimonial.gradient} bg-clip-text text-transparent mb-2`}>
              {currentTestimonial.title}
            </p>
            <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
              {currentTestimonial.description}
            </p>
          </div>

          {/* Testimonial Quote */}
          <div className="mb-8 md:mb-10 relative">
            <div className="absolute -top-4 left-4 md:left-8 text-6xl md:text-7xl text-gray-200 font-serif">"</div>
            <blockquote className="text-gray-700 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-center max-w-3xl mx-auto px-4 md:px-8 relative z-10">
              {currentTestimonial.quote}
            </blockquote>
            <div className="absolute -bottom-4 right-4 md:right-8 text-6xl md:text-7xl text-gray-200 font-serif">"</div>
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center items-center gap-6 md:gap-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-gray-300 shadow-lg"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2 md:gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${index === currentIndex
                      ? 'w-8 md:w-10 h-3 md:h-3.5 bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'w-3 md:w-3.5 h-3 md:h-3.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-gray-300 shadow-lg"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
