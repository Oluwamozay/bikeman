import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Gauge, Zap, Fuel, Weight, Droplets, Activity, MessageCircle, GitCompareArrows, Heart, TrendingDown } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useListingAnalytics } from "@/hooks/useListingAnalytics";
import { Button } from "@/components/ui/button";
import { featuredBikes } from "@/data/bikes";
import ImageViewer from "@/components/ImageViewer";
import FinancingCalculator from "@/components/FinancingCalculator";
import InsuranceEstimator from "@/components/InsuranceEstimator";
import OptimizedImage from "@/components/OptimizedImage";
import SEOHead from "@/components/SEOHead";
import ReviewSection from "@/components/ReviewSection";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import BookingForm from "@/components/BookingForm";
import ARBikeViewer from "@/components/ARBikeViewer";

const specIcons: Record<string, React.ElementType> = {
  Engine: Gauge, Power: Zap, Mileage: Fuel, Weight: Weight, Tank: Droplets, "Top Speed": Activity,
};

const BikeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bike = featuredBikes.find((b) => b.id === id);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { trackEvent } = useListingAnalytics();

  useEffect(() => { if (id) trackEvent(id, "view"); }, [id, trackEvent]);

  if (!bike) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SEOHead title="Bike Not Found — Ocada Connect" description="The requested bike listing could not be found." />
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bike not found</p>
          <Button onClick={() => navigate("/")} variant="outline">Go Home</Button>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(`Hi! I'm interested in the ${bike.name} listed at ${bike.price} on Ocada Connect. Is it still available?`);
  const whatsappUrl = `https://wa.me/2348000000000?text=${whatsappMessage}`;
  const openGallery = (index: number) => { setViewerIndex(index); setViewerOpen(true); trackEvent(bike.id, "click"); };
  const handleInquiry = () => { trackEvent(bike.id, "inquiry"); window.open(whatsappUrl, "_blank"); };
  const handleBuy = () => { trackEvent(bike.id, "click"); navigate("/shop"); };

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHead title={`${bike.name} — ${bike.price} | Ocada Connect`} description={bike.description} image={bike.img} url={`https://bikeman.lovable.app/bike/${bike.id}`} type="product" />

      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center hover:glow-ring transition-all">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-sm font-bold truncate">{bike.name}</h1>
        <span className="ml-auto px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-bold">{bike.tag}</span>
        <button onClick={() => toggleFavorite(bike.id)} className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center hover:glow-ring transition-all">
          <Heart className={`h-4 w-4 transition-colors ${isFavorite(bike.id) ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>

      <div className="max-w-md mx-auto px-5">
        {/* Hero Image */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="py-8 flex justify-center">
          <OptimizedImage src={bike.img} alt={bike.name} width={256} height={256} className="w-64 h-64 drop-shadow-2xl cursor-pointer" priority onClick={() => openGallery(0)} />
        </motion.div>

        {/* Price & Name */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
          <h2 className="text-2xl font-bold mb-1">{bike.name}</h2>
          <div className="flex items-center gap-2.5">
            <p className="text-xl font-bold text-primary">{bike.price}</p>
            {bike.originalPriceNum && (
              <>
                <p className="text-sm text-muted-foreground line-through">{bike.originalPrice}</p>
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-[10px] font-bold">
                  <TrendingDown className="h-3 w-3" />
                  {Math.round(((bike.originalPriceNum - bike.priceNum) / bike.originalPriceNum) * 100)}% off
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Price History */}
        <PriceHistoryChart bikeId={bike.id} currentPrice={bike.priceNum} />

        {/* Description */}
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm text-muted-foreground leading-relaxed mb-8">
          {bike.description}
        </motion.p>

        {/* 360° Viewer */}
        <ARBikeViewer images={bike.gallery} name={bike.name} />

        {/* Specs Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
          <h3 className="text-base font-bold mb-4">Specifications</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {bike.specs.map((spec, i) => {
              const Icon = specIcons[spec.label] || Gauge;
              return (
                <motion.div key={spec.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="rounded-xl glass border border-border/40 p-3 flex flex-col items-center gap-1.5 text-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center"><Icon className="h-3.5 w-3.5 text-primary" /></div>
                  <span className="text-xs font-bold">{spec.value}</span>
                  <span className="text-[9px] text-muted-foreground">{spec.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Booking */}
        <BookingForm bikeId={bike.id} bikeName={bike.name} />

        {/* Financing & Insurance */}
        <FinancingCalculator bikePrice={bike.priceNum} bikeName={bike.name} />
        <InsuranceEstimator bikePrice={bike.priceNum} bikeName={bike.name} />

        {/* Gallery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
          <h3 className="text-base font-bold mb-4">Gallery</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {bike.gallery.map((img, i) => (
              <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => openGallery(i)} className="shrink-0 cursor-pointer">
                <OptimizedImage src={img} alt={`${bike.name} view ${i + 1}`} width={112} height={112} className="w-28 h-28 rounded-xl glass border border-border/40 p-2" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reviews */}
        <ReviewSection bikeId={bike.id} />

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-3 mt-8">
          <div className="flex gap-3">
            <Button className="flex-1 h-13 rounded-2xl text-sm font-bold gradient-primary text-primary-foreground shadow-glow" onClick={handleBuy}>
              <ShoppingCart className="h-4 w-4 mr-2" />Buy Now
            </Button>
            <Button variant="outline" className="h-13 rounded-2xl px-5 border-border/50 glass" onClick={handleInquiry}>
              <MessageCircle className="h-4 w-4 mr-1.5 text-green-500" />WhatsApp
            </Button>
          </div>
          <Button variant="outline" className="w-full h-11 rounded-2xl text-xs font-bold border-border/50 glass" onClick={() => navigate("/compare")}>
            <GitCompareArrows className="h-4 w-4 mr-2" />Compare with other bikes
          </Button>
        </motion.div>
      </div>

      {viewerOpen && <ImageViewer images={bike.gallery} initialIndex={viewerIndex} alt={bike.name} onClose={() => setViewerOpen(false)} />}
    </div>
  );
};

export default BikeDetail;
