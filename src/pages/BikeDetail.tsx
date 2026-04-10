import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, ShoppingCart, Gauge, Zap, Fuel, Weight, Droplets, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredBikes } from "@/data/bikes";

const specIcons: Record<string, React.ElementType> = {
  Engine: Gauge,
  Power: Zap,
  Mileage: Fuel,
  Weight: Weight,
  Tank: Droplets,
  "Top Speed": Activity,
};

const BikeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bike = featuredBikes.find((b) => b.id === id);

  if (!bike) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bike not found</p>
          <Button onClick={() => navigate("/")} variant="outline">Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center hover:glow-ring transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-sm font-bold truncate">{bike.name}</h1>
        <span className="ml-auto px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
          {bike.tag}
        </span>
      </div>

      <div className="max-w-md mx-auto px-5">
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="py-8 flex justify-center"
        >
          <img
            src={bike.img}
            alt={bike.name}
            className="w-64 h-64 object-contain drop-shadow-2xl"
            width={256}
            height={256}
          />
        </motion.div>

        {/* Price & Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-1">{bike.name}</h2>
          <p className="text-xl font-bold text-primary">{bike.price}</p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground leading-relaxed mb-8"
        >
          {bike.description}
        </motion.p>

        {/* Specs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h3 className="text-base font-bold mb-4">Specifications</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {bike.specs.map((spec, i) => {
              const Icon = specIcons[spec.label] || Gauge;
              return (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="rounded-xl glass border border-border/40 p-3 flex flex-col items-center gap-1.5 text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-bold">{spec.value}</span>
                  <span className="text-[9px] text-muted-foreground">{spec.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Gallery */}
        {bike.gallery.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-base font-bold mb-4">Gallery</h3>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {bike.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${bike.name} view ${i + 1}`}
                  className="w-40 h-40 object-contain rounded-xl glass border border-border/40 p-2 shrink-0"
                  loading="lazy"
                  width={160}
                  height={160}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex gap-3"
        >
          <Button
            className="flex-1 h-13 rounded-2xl text-sm font-bold gradient-primary text-primary-foreground shadow-glow"
            onClick={() => navigate("/shop")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
          <Button
            variant="outline"
            className="h-13 rounded-2xl px-5 border-border/50 glass"
            onClick={() => window.open("tel:+2348000000000")}
          >
            <Phone className="h-4 w-4 mr-1.5" />
            Contact
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BikeDetail;
