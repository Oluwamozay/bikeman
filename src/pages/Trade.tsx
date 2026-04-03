import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronLeft, Shield, Star, TrendingUp, Plus, ArrowUpDown,
} from "lucide-react";

interface Trader {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  trades: number;
  price: number;
  currency: string;
  paymentMethods: string[];
  type: "buy" | "sell";
  bike: string;
  minAmount: number;
  maxAmount: number;
}

const mockTraders: Trader[] = [
  { id: "1", name: "KingRider_NG", avatar: "👤", rating: 4.9, trades: 312, price: 185000, currency: "NGN", paymentMethods: ["Bank Transfer", "Opay"], type: "buy", bike: "Honda CG 125", minAmount: 100000, maxAmount: 500000 },
  { id: "2", name: "BikeChief", avatar: "🧑‍💼", rating: 4.7, trades: 198, price: 220000, currency: "NGN", paymentMethods: ["Bank Transfer"], type: "buy", bike: "Bajaj Boxer 150", minAmount: 150000, maxAmount: 800000 },
  { id: "3", name: "LagosWheels", avatar: "🏍️", rating: 4.8, trades: 456, price: 450000, currency: "NGN", paymentMethods: ["Palmpay", "Bank Transfer"], type: "sell", bike: "TVS Apache RTR 160", minAmount: 200000, maxAmount: 1000000 },
  { id: "4", name: "SpeedTrader", avatar: "⚡", rating: 4.6, trades: 87, price: 130000, currency: "NGN", paymentMethods: ["Opay", "Kuda"], type: "sell", bike: "Suzuki GN 125", minAmount: 50000, maxAmount: 300000 },
  { id: "5", name: "AbujaMotors", avatar: "🚀", rating: 4.95, trades: 621, price: 750000, currency: "NGN", paymentMethods: ["Bank Transfer", "USSD"], type: "buy", bike: "Yamaha YBR 125G", minAmount: 500000, maxAmount: 2000000 },
];

const Trade = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const filtered = mockTraders.filter((t) => t.type === activeTab);
  const totalVolume = "₦24.5M";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/6 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9 rounded-xl glass shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">P2P Trade</h1>
            <p className="text-xs text-muted-foreground">Buy & sell bikes with escrow protection</p>
          </div>
          <Button onClick={() => !user ? navigate("/auth") : null} size="icon" className="h-9 w-9 rounded-xl gradient-primary text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Volume Stats */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }} className="flex gap-3 mb-5">
          <div className="flex-1 rounded-2xl glass border border-border/30 p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">{totalVolume}</p>
              <p className="text-[10px] text-muted-foreground">24h Volume</p>
            </div>
          </div>
          <div className="flex-1 rounded-2xl glass border border-border/30 p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Escrow</p>
              <p className="text-[10px] text-muted-foreground">Protected</p>
            </div>
          </div>
        </motion.div>

        {/* Buy / Sell Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-5">
          {(["buy", "sell"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                activeTab === tab
                  ? tab === "buy"
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-destructive/20 text-destructive border border-destructive/30"
                  : "glass text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Listings */}
        <div className="space-y-3 flex-1 pb-6">
          {filtered.map((trader, i) => (
            <motion.div
              key={trader.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="rounded-xl border border-border/30 glass p-4 hover:glow-ring transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{trader.avatar}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold">{trader.name}</h3>
                      <Badge className={`text-[8px] font-bold uppercase border-0 px-1.5 ${
                        trader.type === "buy" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                      }`}>
                        {trader.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                        <span className="text-[10px] font-semibold">{trader.rating}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">{trader.trades} trades</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">{trader.bike}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-primary">₦{trader.price.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Limit: ₦{trader.minAmount.toLocaleString()} – ₦{trader.maxAmount.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {trader.paymentMethods.map((pm) => (
                    <span key={pm} className="px-2 py-0.5 rounded-full bg-secondary text-[9px] font-medium text-secondary-foreground">{pm}</span>
                  ))}
                </div>
                <Button size="sm" className={`h-7 rounded-lg text-[11px] font-bold ${
                  activeTab === "buy"
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-destructive/20 text-destructive border border-destructive/30"
                }`}>
                  {activeTab === "buy" ? "Buy" : "Sell"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Post Trade CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button
            onClick={() => !user ? navigate("/auth") : null}
            className="w-full h-14 rounded-2xl text-base font-bold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Post Your Trade
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Trade;
