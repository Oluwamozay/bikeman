import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  alt: string;
  onClose: () => void;
}

const ImageViewer = ({ images, initialIndex = 0, alt, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const go = (dir: number) => {
    setCurrentIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 60) {
      go(info.offset.x > 0 ? -1 : 1);
    }
    if (info.offset.y > 100) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col"
        onClick={onClose}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <span className="text-xs text-muted-foreground font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center hover:glow-ring transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center relative px-4" onClick={(e) => e.stopPropagation()}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${alt} - View ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="max-w-full max-h-[70vh] object-contain cursor-grab active:cursor-grabbing"
            width={512}
            height={512}
          />

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-border/40 flex items-center justify-center hover:glow-ring transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-border/40 flex items-center justify-center hover:glow-ring transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 py-4" onClick={(e) => e.stopPropagation()}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageViewer;
