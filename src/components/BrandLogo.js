import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../lib/utils';

/**
 * BrandLogo Component
 * 
 * A reusable component that displays the VizitLink brand logo and text.
 * Supports multiple size variants and optional linking to homepage.
 * 
 * @param {Object} props
 * @param {string} props.size - Size variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} props.showText - Whether to display "VizitLink" text (default: true)
 * @param {boolean} props.linkToHome - Whether to wrap in Link component (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.textClassName - Additional CSS classes for text
 * @param {string} props.imageClassName - Additional CSS classes for image
 */
export default function BrandLogo({ 
  size = 'md', 
  showText = true, 
  linkToHome = true,
  className = '',
  textClassName = '',
  imageClassName = ''
}) {
  // Size configurations
  const sizeConfig = {
    xs: {
      image: { width: 20, height: 20 },
      text: 'text-sm',
      gap: 'gap-1.5'
    },
    sm: {
      image: { width: 24, height: 24 },
      text: 'text-base',
      gap: 'gap-2'
    },
    md: {
      image: { width: 32, height: 32 },
      text: 'text-xl',
      gap: 'gap-2'
    },
    lg: {
      image: { width: 36, height: 36 },
      text: 'text-2xl',
      gap: 'gap-2'
    },
    xl: {
      image: { width: 48, height: 48 },
      text: 'text-3xl',
      gap: 'gap-3'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div className={cn('flex items-center', config.gap, className)}>
      <Image 
        src="/brandlogo.png" 
        alt="VizitLink Logo" 
        width={config.image.width} 
        height={config.image.height}
        className={cn('object-contain', imageClassName)}
        priority
      />
      {showText && (
        <h1 className={cn('font-bold text-gray-900', config.text, textClassName)}>
          VizitLink
        </h1>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
