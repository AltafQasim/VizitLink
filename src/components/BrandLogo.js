import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../lib/utils';

/**
 * BrandLogo Component
 * 
 * A reusable component that displays the VizitLink brand logo and text.
 * Supports multiple size variants and optional linking to homepage.
 * Automatically switches between logo variants based on background color.
 * 
 * @param {Object} props
 * @param {string} props.size - Size variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} props.showText - Whether to display "VizitLink" text (default: true)
 * @param {boolean} props.linkToHome - Whether to wrap in Link component (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.textClassName - Additional CSS classes for text
 * @param {string} props.imageClassName - Additional CSS classes for image
 * @param {'auto' | 'white' | 'black'} props.logoVariant - Logo variant to use (default: 'auto')
 * @param {boolean} props.colorfulHover - Enable colorful hover effect (default: false)
 */
export default function BrandLogo({ 
  size = 'md', 
  showText = true, 
  linkToHome = true,
  className = '',
  textClassName = '',
  imageClassName = '',
  logoVariant = 'auto',
  colorfulHover = false
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

  // Determine which logo variant to use
  const getLogoSrc = () => {
    if (logoVariant === 'white') return '/brandlogowhite.svg';
    if (logoVariant === 'black') return '/brandlogoblack.svg';
    
    // Auto mode - default to original logo
    return '/brandlogo.svg';
  };

  const logoSrc = getLogoSrc();

  const content = (
    <div className={cn('flex items-center', config.gap, className)}>
      <Image 
        src={logoSrc} 
        alt="VizitLink Logo" 
        width={config.image.width} 
        height={config.image.height}
        className={cn('object-contain', colorfulHover ? 'group-hover:drop-shadow-[0_0_8px_rgba(127,34,254,0.8)] transition-all duration-300' : '', imageClassName)}
        priority
      />
      {showText && (
        <h1 className={cn('font-bold text-gray-900', config.text, textClassName, colorfulHover ? 'group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300' : '')}>
          VizitLink
        </h1>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className={cn('inline-flex', colorfulHover ? 'group' : '')}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cn(colorfulHover ? 'group' : '')}>
      {content}
    </div>
  );
}
