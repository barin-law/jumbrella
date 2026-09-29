import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

// Official JuriMbrella Vector Branding Assets
import logoNavySvg from '../../assets/branding/jurimbrella-logo.svg';
import logoWhiteSvg from '../../assets/branding/jurimbrella-logo-white.svg';
import emblemNavySvg from '../../assets/branding/jurimbrella-emblem.svg';
import emblemWhiteSvg from '../../assets/branding/jurimbrella-emblem-white.svg';
import horizNavySvg from '../../assets/branding/jurimbrella-horizontal.svg';
import horizWhiteSvg from '../../assets/branding/jurimbrella-horizontal-white.svg';

export type BrandLogoVariant = 'full' | 'compact' | 'horizontal' | 'emblem' | 'wordmark';
export type BrandLogoTheme = 'light' | 'dark' | 'auto';

export interface BrandLogoProps {
  /**
   * 'full': Complete official logo (Emblem on top, Wordmark + Tagline below, zero overlap)
   * 'compact' / 'horizontal': Horizontal lockup for navbars and headers (Emblem on left, Wordmark on right)
   * 'emblem': Icon-only circular emblem (Umbrella + Pen Nib + Leaves + Anchor)
   * 'wordmark': Typography only
   */
  variant?: BrandLogoVariant;
  /**
   * 'light': Deep Blue & Emerald (for light backgrounds)
   * 'dark': White & Vibrant Green (for dark backgrounds #002D5B)
   * 'auto': Uses active application theme
   */
  themeMode?: BrandLogoTheme;
  alt?: string;
  decorative?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
  size?: number | string;
  priority?: boolean;
  id?: string;
  onClick?: () => void;
}

/**
 * Helper hook to safely detect if dark mode is active
 */
function useSafeIsDark(themeMode?: BrandLogoTheme | string): boolean {
  let isSystemDark = false;
  try {
    const themeContext = useTheme();
    isSystemDark = themeContext.isDark;
  } catch {
    if (typeof document !== 'undefined') {
      isSystemDark = document.documentElement.classList.contains('dark');
    }
  }

  if (themeMode === 'dark') return true;
  if (themeMode === 'light') return false;
  return isSystemDark;
}

/**
 * BrandMark / BrandIcon Component
 * Circular emblem with sunburst umbrella, golden burst, pen nib, leaves, and anchor.
 * Guaranteed to render a SINGLE image with NO overlapping.
 */
export const BrandMark: React.FC<{
  themeMode?: BrandLogoTheme;
  className?: string;
  size?: number | string;
  alt?: string;
  decorative?: boolean;
  onClick?: () => void;
}> = ({
  themeMode = 'auto',
  className = '',
  size = 40,
  alt = 'JuriMbrella — Protection over every signature',
  decorative = false,
  onClick,
}) => {
  const [loadError, setLoadError] = useState(false);
  const isDark = useSafeIsDark(themeMode);
  const resolvedAlt = decorative ? '' : alt;
  const asset = isDark ? emblemWhiteSvg : emblemNavySvg;

  if (loadError) {
    return (
      <span
        className={`inline-flex items-center justify-center font-bold text-[#002D5B] dark:text-[#A8E063] rounded-full border border-[#2EAF4A]/40 bg-[#FFFFFF] ${className}`}
        style={{ width: size, height: size }}
        onClick={onClick}
      >
        J
      </span>
    );
  }

  return (
    <img
      src={asset}
      alt={resolvedAlt}
      width={size}
      height={size}
      onError={() => setLoadError(true)}
      className={`inline-block aspect-square object-contain select-none shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    />
  );
};

export const BrandIcon = BrandMark;

/**
 * BrandWordmark Component
 * Official typography "JuriMbrella" with subtitle/tagline option.
 */
export const BrandWordmark: React.FC<{
  themeMode?: BrandLogoTheme;
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}> = ({
  themeMode = 'auto',
  className = '',
  showTagline = true,
  size = 'md',
  onClick,
}) => {
  const isDark = useSafeIsDark(themeMode);

  const sizeClasses = {
    sm: { title: 'text-base font-bold', sub: 'text-[9px] tracking-wide' },
    md: { title: 'text-xl font-extrabold', sub: 'text-[11px] tracking-wide' },
    lg: { title: 'text-2xl font-extrabold', sub: 'text-xs tracking-wider' },
    xl: { title: 'text-3xl font-extrabold', sub: 'text-sm tracking-wider' },
  }[size];

  const juriColor = isDark ? 'text-white' : 'text-[#002D5B]';
  const mbrellaColor = isDark ? 'text-[#A8E063]' : 'text-[#2EAF4A]';
  const taglineColor = isDark ? 'text-slate-300' : 'text-[#17212B]';

  return (
    <div
      className={`inline-flex flex-col select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`font-sans tracking-tight leading-none ${sizeClasses.title}`}>
        <span className={juriColor}>Juri</span>
        <span className={mbrellaColor}>Mbrella</span>
      </div>
      {showTagline && (
        <div className={`flex items-center gap-1.5 mt-1 font-medium ${sizeClasses.sub} ${taglineColor}`}>
          <span className="h-[1.5px] w-2.5 bg-[#2EAF4A] rounded-full inline-block" />
          <span>Protection over every signature</span>
          <span className="h-[1.5px] w-2.5 bg-[#2EAF4A] rounded-full inline-block" />
        </div>
      )}
    </div>
  );
};

/**
 * Centralized BrandLogo Component
 * Supports:
 * - full: Circular full logo (Emblem on top, Wordmark + Tagline cleanly below it)
 * - compact / horizontal: Horizontal lockup with emblem + wordmark + tagline
 * - emblem: Icon-only presentation
 * - wordmark: Text only
 * Guaranteed to render a SINGLE image with NO overlapping!
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'compact',
  themeMode = 'auto',
  alt = 'JuriMbrella — Protection over every signature',
  decorative = false,
  className = '',
  width,
  height,
  size,
  priority = false,
  id,
  onClick,
}) => {
  const [loadError, setLoadError] = useState(false);
  const isDark = useSafeIsDark(themeMode);
  const resolvedAlt = decorative ? '' : alt;

  // Handle emblem-only presentation
  if (variant === 'emblem') {
    const emblemSize = size || height || width || 44;
    return (
      <BrandMark
        themeMode={themeMode}
        className={className}
        size={emblemSize}
        alt={resolvedAlt}
        decorative={decorative}
        onClick={onClick}
      />
    );
  }

  // Handle wordmark-only presentation
  if (variant === 'wordmark') {
    return (
      <BrandWordmark
        themeMode={themeMode}
        className={className}
        onClick={onClick}
      />
    );
  }

  // Fallback if asset fails to load
  if (loadError) {
    return (
      <div
        id={id}
        className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002D5B] text-white font-bold text-base shadow-xs">
          J
        </span>
        <BrandWordmark themeMode={themeMode} showTagline={variant === 'full'} />
      </div>
    );
  }

  // Determine which asset to load based on variant and theme
  const isHorizontal = variant === 'compact' || variant === 'horizontal';
  const lightAsset = isHorizontal ? horizNavySvg : logoNavySvg;
  const darkAsset = isHorizontal ? horizWhiteSvg : logoWhiteSvg;
  const selectedAsset = isDark ? darkAsset : lightAsset;

  // Determine heights and aspect ratio based on variant
  const defaultHeight = variant === 'full' ? 90 : 42;
  const resolvedHeight = height || size || defaultHeight;
  const aspectClass = isHorizontal ? 'aspect-[440/100]' : 'aspect-[512/540]';

  return (
    <img
      id={id}
      src={selectedAsset}
      alt={resolvedAlt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setLoadError(true)}
      className={`inline-block ${aspectClass} object-contain select-none shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        height: typeof resolvedHeight === 'number' ? `${resolvedHeight}px` : resolvedHeight,
        width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
        maxHeight: typeof resolvedHeight === 'number' ? `${resolvedHeight}px` : resolvedHeight,
      }}
      onClick={onClick}
    />
  );
};

// Aliases for unified brand system
export const Logo = BrandLogo;
export default BrandLogo;
