import { useState, useEffect, useCallback } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  fallbackLabel?: string;
  fallbackClassName?: string;
  style?: React.CSSProperties;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Image component with preloading, crossfade, and branded fallback.
 * Reserves space via parent aspect ratio; shows branded placeholder on error.
 */
export default function SmartImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onLoad,
  fallbackLabel = 'AERO ONE',
  fallbackClassName = '',
  style,
  fetchPriority,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ ...style, opacity: loaded && !error ? (style?.opacity ?? 1) : 0 }}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        {...(fetchPriority ? { fetchPriority } : {})}
      />
      {!loaded && !error && (
        <div className={`absolute inset-0 flex items-center justify-center ${fallbackClassName}`}>
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#C6A879] rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${fallbackClassName}`}>
          <div className="font-display text-sm tracking-[0.3em] text-current opacity-40 uppercase">{fallbackLabel}</div>
          <div className="font-body text-xs text-current opacity-25">Image unavailable</div>
        </div>
      )}
    </>
  );
}
