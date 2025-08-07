"use client";

import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    quote: "VizitLink simplifies the process for creators to share multiple parts of themselves in one inclusive link.",
    author: "Riley Lemon",
    title: "Youtuber, Content Creator",
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    quote: "The best tool I've found for managing all my social media links in one place. Game changer!",
    author: "Sarah Johnson",
    title: "Digital Creator, Influencer",
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    quote: "VizitLink has transformed how I connect with my audience. It's simple, effective, and beautiful.",
    author: "Mike Chen",
    title: "Podcaster, Entrepreneur",
    image: "/api/placeholder/300/200"
  }
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

  return (
    <div className="bg-white py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Testimonial Image */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-64 h-48 md:w-80 md:h-60 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-green-600 relative">
              {/* Placeholder for testimonial image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="mb-6">
          <blockquote className="text-gray-800 text-2xl md:text-3xl font-bold leading-relaxed max-w-3xl mx-auto">
            "{currentTestimonial.quote}"
          </blockquote>
        </div>

        {/* Author Information */}
        <div className="mb-8">
          <p className="text-gray-600 text-lg">
            {currentTestimonial.author}, {currentTestimonial.title}
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={prevTestimonial}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={nextTestimonial}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection; 