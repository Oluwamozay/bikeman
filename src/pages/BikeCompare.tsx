import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Check, Gauge, Zap, Fuel, Weight, Droplets, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredBikes, type FeaturedBike } from "@/data/bikes";

const specIcons: Record<string, React.ElementType> = {
  Engine: Gauge,
  Power: Zap,
  Mileage: Fuel,
  Weight: Weight,
  Tank: Droplets,
  "Top Speed": Activity,
};

const BikeCompare = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedBikes = featuredBikes.filter((b) => selected.includes(b.id));
  const showComparison = selectedBikes.length >= 2;

  const allSpecLabels = ["Engine", "Power", "Mileage", "Weight", "Tank", "Top Speed"];

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
        <h1 className="text-sm font-bold">Compare Bikes</h1>
        <span className="ml-auto text-[10px] text-muted-foreground font-medium">
          {selected.length}/3 selected
        </span>
      </div>

      <div className="max-w-md mx-auto px-5 py-5">
        {/* Selection */}
        {!showComparison && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs text-muted-foreground mb-5">Select 2-3 bikes to compare side by side</p>
            <div className="space-y-3">
              {featuredBikes.map((bike) => {
                const isSelected = selected.includes(bike.id);
                return (
                  <motion.button
                    key={bike.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggle(bike.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "border-primary/50 bg-primary/5 glow-ring"
                        : "border-border/40 glass hover:glow-ring"
                    }`}
                  >
                    <img src={bike.img} alt={bike.name} className="w-14 h-14 object-contain" width={56} height={56} />
                    <div className="flex-1 text-left">
                      <h3 className="text-xs font-bold">{bike.name}</h3>
                      <p className="text-xs text-primary font-bold">{bike.price}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? "gradient-primary" : "border border-border/60"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {selected.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5"
              >
                <Button
                  className="w-full h-12 rounded-2xl font-bold gradient-primary text-primary-foreground shadow-glow"
                  onClick={() => {}}
                >
                  Compare {selected.length} Bikes
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Comparison Table */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Reset */}
              <div className="flex justify-between items-center mb-5">
                <p className="text-xs text-muted-foreground">Comparing {selectedBikes.length} bikes</p>
                <button
                  onClick={() => setSelected([])}
                  className="flex items-center gap-1 text-xs text-primary font-bold"
                >
                  <X className="h-3 w-3" /> Reset
                </button>
              </div>

              {/* Bike headers */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {selectedBikes.map((bike) => (
                  <motion.div
                    key={bike.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 min-w-[100px] rounded-2xl glass border border-border/40 p-3 flex flex-col items-center gap-2"
                  >
                    <img src={bike.img} alt={bike.name} className="w-16 h-16 object-contain" width={64} height={64} />
                    <h3 className="text-[10px] font-bold text-center leading-tight">{bike.name}</h3>
                    <p className="text-xs font-bold text-primary">{bike.price}</p>
                  </motion.div>
                ))}
              </div>

              {/* Spec rows */}
              <div className="space-y-2">
                {allSpecLabels.map((label, i) => {
                  const Icon = specIcons[label] || Gauge;
                  const values = selectedBikes.map(
                    (b) => b.specs.find((s) => s.label === label)?.value || "—"
                  );
                  // Determine best value (simple heuristic)
                  const nums = values.map((v) => parseFloat(v.replace(/[^0-9.]/g, "")));
                  const bestIdx = label === "Weight"
                    ? nums.indexOf(Math.min(...nums.filter((n) => !isNaN(n))))
                    : nums.indexOf(Math.max(...nums.filter((n) => !isNaN(n))));

                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl glass border border-border/40 p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
                      </div>
                      <div className="flex gap-2">
                        {values.map((val, vi) => (
                          <div
                            key={vi}
                            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold ${
                              vi === bestIdx
                                ? "bg-primary/15 text-primary"
                                : "text-foreground"
                            }`}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Price comparison */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 rounded-xl glass border border-border/40 p-3"
              >
                <span className="text-[10px] font-bold text-muted-foreground mb-2 block">Price Difference</span>
                <div className="flex gap-2">
                  {selectedBikes.map((bike) => {
                    const cheapest = Math.min(...selectedBikes.map((b) => b.priceNum));
                    const diff = bike.priceNum - cheapest;
                    return (
                      <div key={bike.id} className="flex-1 text-center">
                        <p className="text-xs font-bold text-primary">{bike.price}</p>
                        {diff > 0 && (
                          <p className="text-[9px] text-muted-foreground">+₦{diff.toLocaleString()}</p>
                        )}
                        {diff === 0 && (
                          <p className="text-[9px] text-primary font-bold">Best Price</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BikeCompare;
