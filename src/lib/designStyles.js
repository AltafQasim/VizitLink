// Common design styles used across LivePreview, MobilePreview, PublicProfilePage, and DesignTab

// Theme styles mapping
export const themeStyles = {
  'Leave': { svg: '/themes/Leave@1x-10.0s-700px-1400px.svg', textColor: 'text-white', type: 'svg' },
  'Groov': { svg: '/themes/groov.png', textColor: 'text-white', type: 'svg' },
  'Agate': { svg: '/themes/agate.png', textColor: 'text-white', type: 'svg' },
  'Trianglify': { svg: '/themes/Trianglify@1x-10.0s-668px-1025px.svg', textColor: 'text-white', type: 'svg' },
  'Venetian Blinds': { svg: '/themes/Venetian Blinds@1x-1.0s-681px-1088px.svg', textColor: 'text-white', type: 'svg' },
  'Air': { background: 'bg-[rgb(186,197,145)] bg-[image:linear-gradient(rgb(204,215,163)_3px,transparent_3px),linear-gradient(90deg,rgb(204,215,163)_3px,transparent_3px)] bg-[length:40px_40px] bg-center bg-repeat', textColor: 'text-black' },
  'Blocks': { background: 'bg-gradient-to-br from-purple-500 to-pink-500', textColor: 'text-white' },
  'Bloom': { background: 'bg-gradient-to-br from-red-500 to-blue-600', textColor: 'text-white' },
  'Breeze': { background: 'bg-gradient-to-br from-purple-400 to-pink-400', textColor: 'text-white' },
  'Lake': { background: 'bg-slate-800', textColor: 'text-white' },
  'Mineral': { background: 'bg-orange-100', textColor: 'text-black' },
  'Sunset': { background: 'bg-gradient-to-br from-yellow-500 to-red-500', textColor: 'text-white' },
  'Winter': { background: 'bg-gradient-to-br from-blue-200 to-blue-400', textColor: 'text-black' },
  'Spring': { background: 'bg-gradient-to-br from-green-200 to-green-400', textColor: 'text-black' },
  'Summer': { background: 'bg-gradient-to-br from-yellow-200 to-yellow-400', textColor: 'text-black' },
  'Autumn': { background: 'bg-gradient-to-br from-orange-200 to-orange-400', textColor: 'text-black' },
  'Midnight': { background: 'bg-gradient-to-br from-gray-900 to-black', textColor: 'text-white' },
  'Aurora': { background: 'bg-gradient-to-br from-green-400 to-blue-500', textColor: 'text-white' },
  'Coral': { background: 'bg-gradient-to-br from-pink-400 to-orange-400', textColor: 'text-white' },
  'Forest': { background: 'bg-gradient-to-br from-green-600 to-green-800', textColor: 'text-white' },
  'Lavender': { background: 'bg-gradient-to-br from-purple-300 to-pink-300', textColor: 'text-black' },
  'Sage': { background: 'bg-gradient-to-br from-green-200 to-blue-200', textColor: 'text-black' },
  'Rose': { background: 'bg-gradient-to-br from-rose-400 to-pink-500', textColor: 'text-white' },
  'Sky': { background: 'bg-gradient-to-br from-blue-300 to-cyan-400', textColor: 'text-black' },
  'Amber': { background: 'bg-gradient-to-br from-amber-400 to-orange-500', textColor: 'text-white' },
  'Indigo': { background: 'bg-gradient-to-br from-indigo-500 to-purple-600', textColor: 'text-white' },
  'Teal': { background: 'bg-gradient-to-br from-teal-400 to-cyan-500', textColor: 'text-white' },
  'Ruby': { background: 'bg-gradient-to-br from-red-500 to-pink-600', textColor: 'text-white' },
};

// Wallpaper styles mapping
export const wallpaperStyles = {
  'Hero': { background: 'bg-gradient-to-br from-blue-900 to-teal-400', textColor: 'text-white' },
  'Fill': { background: 'bg-gray-100', textColor: 'text-black' },
  'Gradient': { background: 'bg-gradient-to-br from-gray-400 to-gray-600', textColor: 'text-white' },
  'Blur': { background: 'bg-gradient-to-br from-blue-200 to-purple-200', textColor: 'text-black' },
  'Pattern': { background: 'bg-gradient-to-br from-blue-200 to-gray-300', textColor: 'text-black' },
  'Image': { background: 'bg-gradient-to-br from-orange-500 via-red-500 to-black', textColor: 'text-white' },
  'Video': { background: 'bg-gradient-to-br from-gray-600 to-gray-800', textColor: 'text-white' },
};

// Button styles mapping - base styles without border radius
export const buttonStyles = {
  'Solid': {
    base: 'bg-white text-black border border-transparent',
    description: 'Solid background with white color'
  },
  'Glass': {
    base: 'bg-white/10 backdrop-blur-xl backdrop-saturate-150 text-white border border-white/20 shadow-lg shadow-black/10',
    description: 'Glass morphism effect with blur'
  },
  'Outline': {
    base: 'bg-transparent text-black border-2 border-gray-400',
    description: 'Transparent with border outline'
  },
};

/**
 * Get current background, text color, and theme SVG based on wallpaper and theme
 * @param {string} wallpaper - Wallpaper name
 * @param {string} theme - Theme name
 * @param {object} design - Design object containing wallpaperImage, wallpaperVideo, etc.
 * @returns {object} - { currentBackground, currentTextColor, currentThemeSvg }
 */
export function getCurrentStyles(wallpaper, theme, design = {}) {
  let currentBackground = 'bg-gray-100';
  let currentTextColor = 'text-black';
  let currentThemeSvg = null;

  // Wallpaper takes priority over theme
  if (wallpaper === 'Image' && design.wallpaperImage) {
    currentBackground = '';
    currentTextColor = 'text-white';
  } else if (wallpaper === 'Video' && design.wallpaperVideo) {
    currentBackground = '';
    currentTextColor = 'text-white';
  } else if (wallpaper && wallpaperStyles[wallpaper]) {
    currentBackground = wallpaperStyles[wallpaper].background;
    currentTextColor = wallpaperStyles[wallpaper].textColor;
  } else if (theme && themeStyles[theme]) {
    const themeStyle = themeStyles[theme];
    if (themeStyle.type === 'svg' && themeStyle.svg) {
      currentThemeSvg = themeStyle.svg;
      currentBackground = '';
      currentTextColor = themeStyle.textColor;
    } else {
      currentBackground = themeStyle.background;
      currentTextColor = themeStyle.textColor;
    }
  }

  return { currentBackground, currentTextColor, currentThemeSvg };
}

/**
 * Get button style class by name
 * @param {string} buttonStyleName - Button style name
 * @returns {string} - CSS classes for the button style
 */
export function getButtonStyle(buttonStyleName) {
  const style = buttonStyles[buttonStyleName];
  if (!style) {
    // Fallback to Solid if style not found
    return buttonStyles['Solid'].base;
  }
  
  const baseStyle = typeof style === 'string' ? style : style.base;
  return baseStyle;
}

