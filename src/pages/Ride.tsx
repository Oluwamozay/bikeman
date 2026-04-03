import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, MapPin, Navigation, Clock, DollarSign, Loader2, Car, Bike, Crown, Zap,
} from "lucide-react";

const rideTiers = [
  { id: "standard", name: "Standard", icon: Car, fare: 800, eta: "5 min", desc: "Affordable & reliable" },
  { id: "xl", name: "XL", icon: Car, fare: 1200, eta: "7 min", desc: "Extra comfort" },
  { id: "luxury", name: "Luxury", icon: Crown, fare: 2500, eta: "10 min", desc: "Premium ride" },
  { id: "moto", name: "Moto", icon: Bike, fare: 400, eta: "3 min", desc: "Quick bike ride" },
];

const Ride = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedTier, setSelectedTier] = useState("standard");
  const [isBooking, setIsBooking] = useState(false);
  const [dotPos, setDotPos] = useState(0);

  // Animate the GPS dot along the route
  useEffect(() => {
    const id = setInterval(() => setDotPos((p) => (p >= 100 ? 0 : p + 0.5)), 50);
    return () => clearInterval(id);
  }, []);

  const selectedRide = rideTiers.find((r) => r.id === selectedTier)!;

  const handleBook = () => {
    setIsBooking(true);
    setTimeout(() => setIsBooking(false), 3000);
  };

  // SVG route path
  const routePath = "M 40 180 Q 80 120 140 100 Q 200 80 260 120 Q 280 140 260 160";

  // Get point along the path
  const getPointOnPath = (pct: number) => {
    const t = pct / 100;
    const x = 40 + t * 220;
    const y = 180 - Math.sin(t * Math.PI) * 80 + t * -20;
    return { x: Math.min(280, Math.max(40, x)), y: Math.min(180, Math.max(80, y)) };
  };

  const dot = getPointOnPath(dotPos);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9 rounded-xl glass shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">Book a Ride</h1>
            <p className="text-xs text-muted-foreground">Fast, safe & reliable</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-semibold text-primary">Live</span>
          </div>
        </motion.div>

        {/* Map Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/30 glass mb-5 overflow-hidden relative"
          style={{ height: 220 }}
        >
          {/* GPS Grid */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 220" preserveAspectRatio="none">
            {/* Grid lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 28} y1="0" x2={i * 28} y2="220" stroke="hsl(142 70% 55% / 0.06)" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 28} x2="300" y2={i * 28} stroke="hsl(142 70% 55% / 0.06)" strokeWidth="0.5" />
            ))}

            {/* Route line */}
            <path d={routePath} fill="none" stroke="hsl(142 70% 55% / 0.4)" strokeWidth="2.5" strokeDasharray="6 4" />
            <path d={routePath} fill="none" stroke="hsl(142 70% 55% / 0.15)" strokeWidth="8" />

            {/* Start marker */}
            <circle cx="40" cy="180" r="6" fill="hsl(142 70% 55%)" opacity="0.9" />
            <circle cx="40" cy="180" r="10" fill="none" stroke="hsl(142 70% 55% / 0.3)" strokeWidth="2" />

            {/* End marker */}
            <circle cx="260" cy="160" r="6" fill="hsl(0 84% 60%)" opacity="0.9" />
            <circle cx="260" cy="160" r="10" fill="none" stroke="hsl(0 84% 60% / 0.3)" strokeWidth="2" />

            {/* Moving dot */}
            <circle cx={dot.x} cy={dot.y} r="4" fill="hsl(142 70% 55%)" />
            <circle cx={dot.x} cy={dot.y} r="8" fill="hsl(142 70% 55% / 0.2)" />
            <circle cx={dot.x} cy={dot.y} r="14" fill="hsl(142 70% 55% / 0.08)" />
          </svg>

          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Navigation className="h-3 w-3 text-primary" />
              <span>Live tracking active</span>
            </div>
          </div>
        </motion.div>

        {/* Pickup / Dropoff */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2.5 mb-5">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-glow" />
            <Input placeholder="Pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} className="pl-9 h-12 rounded-xl glass border-border/30 text-sm" />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-destructive" />
            <Input placeholder="Drop-off location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="pl-9 h-12 rounded-xl glass border-border/30 text-sm" />
          </div>
        </motion.div>

        {/* Ride Tiers */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-2 mb-5">
          <p className="text-xs text-muted-foreground font-medium mb-2">Choose your ride</p>
          {rideTiers.map((tier, i) => (
            <motion.button
              key={tier.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              onClick={() => setSelectedTier(tier.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 ${
                selectedTier === tier.id
                  ? "glass glow-ring"
                  : "glass border border-transparent hover:border-border/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedTier === tier.id ? "bg-primary/20" : "bg-secondary"
              }`}>
                <tier.icon className={`h-5 w-5 ${selectedTier === tier.id ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-bold">{tier.name}</h3>
                <p className="text-[10px] text-muted-foreground">{tier.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">₦{tier.fare.toLocaleString()}</p>
                <div className="flex items-center gap-0.5 justify-end">
                  <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{tier.eta}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Fare Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="rounded-xl glass border border-border/30 p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Base fare</span>
            <span className="text-xs font-semibold">₦200</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Distance (est.)</span>
            <span className="text-xs font-semibold">₦{(selectedRide.fare - 200).toLocaleString()}</span>
          </div>
          <div className="border-t border-border/30 pt-2 mt-2 flex items-center justify-between">
            <span className="text-sm font-bold">Total</span>
            <span className="text-lg font-bold text-primary">₦{selectedRide.fare.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Book Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Button
            onClick={handleBook}
            disabled={isBooking}
            className="w-full h-14 rounded-2xl text-base font-bold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-all duration-300 disabled:opacity-70"
          >
            {isBooking ? (
              <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Finding your rider...</span>
              </motion.div>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-1.5" />
                Book {selectedRide.name} — ₦{selectedRide.fare.toLocaleString()}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Ride;
