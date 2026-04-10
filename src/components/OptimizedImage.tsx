import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  onClick,
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden bg-muted/30", className)}
      style={{ width, height }}
      onClick={onClick}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "w-full h-full object-contain transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse rounded-lg" />
      )}
    </div>
  );
};

export default OptimizedImage;
