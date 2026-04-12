import { useState } from "react";
import { RotateCcw, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ARBikeViewerProps {
  images: string[];
  name: string;
}

const ARBikeViewer = ({ images, name }: ARBikeViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 30) {
      const step = diff > 0 ? -1 : 1;
      setCurrentIndex((prev) => {
        const next = prev + step;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
      setStartX(e.clientX);
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div className="rounded-xl bg-card/50 border border-border/30 overflow-hidden mb-8">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/20">
        <h3 className="text-xs font-bold flex items-center gap-1.5">
          <RotateCcw className="h-3 w-3 text-primary" />
          360° View
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div
        className="relative h-48 flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <motion.img
          key={currentIndex}
          src={images[currentIndex % images.length]}
          alt={`${name} view ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain"
          style={{ transform: `scale(${zoom})` }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          draggable={false}
        />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-background/80 text-[9px] text-muted-foreground">
          Drag to rotate • {currentIndex + 1}/{images.length}
        </div>
      </div>
    </div>
  );
};

export default ARBikeViewer;
