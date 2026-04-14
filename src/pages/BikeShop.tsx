import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Search, ChevronLeft, Star, ShoppingCart, Fuel, Gauge, Store, Sparkles, Loader2,
} from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import SEOHead from "@/components/SEOHead";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LocationSearch from "@/components/LocationSearch";

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  image: string;
  rating: number;
  reviews: number;
  specs: { engine: string; mileage: string };
  isNew: boolean;
  sellerName: string;
}

const mockProducts: Product[] = [
  { id: "1", name: "Honda CB Shine 125 SP", price: 680000, brand: "Honda", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80", rating: 4.8, reviews: 124, specs: { engine: "124cc", mileage: "65 km/l" }, isNew: true, sellerName: "Lagos Motors Hub" },
  { id: "2", name: "Bajaj Pulsar NS200", price: 920000, brand: "Bajaj", image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80", rating: 4.6, reviews: 89, specs: { engine: "199cc", mileage: "40 km/l" }, isNew: true, sellerName: "Abuja Bike World" },
  { id: "3", name: "TVS Raider 125", price: 520000, brand: "TVS", image: "https://images.unsplash.com/photo-1622185135505-2d795003994a?w=400&q=80", rating: 4.5, reviews: 67, specs: { engine: "124.8cc", mileage: "67 km/l" }, isNew: true, sellerName: "PH Ride Center" },
  { id: "4", name: "Yamaha YBR 125G", price: 750000, brand: "Yamaha", image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?w=400&q=80", rating: 4.7, reviews: 156, specs: { engine: "124cc", mileage: "55 km/l" }, isNew: true, sellerName: "Ibadan Wheels" },
  { id: "5", name: "Suzuki Gixxer SF 250", price: 1450000, brand: "Suzuki", image: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=400&q=80", rating: 4.9, reviews: 43, specs: { engine: "249cc", mileage: "35 km/l" }, isNew: true, sellerName: "Premium Bikes NG" },
  { id: "6", name: "Honda CG 125", price: 420000, brand: "Honda", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80", rating: 4.3, reviews: 210, specs: { engine: "124cc", mileage: "70 km/l" }, isNew: false, sellerName: "Kano Bike Mart" },
  { id: "7", name: "Bajaj Boxer 100", price: 350000, brand: "Bajaj", image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80", rating: 4.4, reviews: 189, specs: { engine: "99.3cc", mileage: "80 km/l" }, isNew: false, sellerName: "Kaduna Riders" },
  { id: "8", name: "TVS Star Sport", price: 380000, brand: "TVS", image: "https://images.unsplash.com/photo-1622185135505-2d795003994a?w=400&q=80", rating: 4.2, reviews: 95, specs: { engine: "109.7cc", mileage: "72 km/l" }, isNew: false, sellerName: "Onitsha Auto" },
  { id: "9", name: "Yamaha Fazer FI", price: 880000, brand: "Yamaha", image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?w=400&q=80", rating: 4.6, reviews: 78, specs: { engine: "149cc", mileage: "45 km/l" }, isNew: true, sellerName: "Benin Bike Hub" },
  { id: "10", name: "Suzuki GN 125", price: 520000, brand: "Suzuki", image: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=400&q=80", rating: 4.5, reviews: 112, specs: { engine: "124cc", mileage: "60 km/l" }, isNew: false, sellerName: "Owerri Motors" },
];

const brandFilters = ["All", "Honda", "Bajaj", "TVS", "Yamaha", "Suzuki"];

const BikeShop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeBrand, setActiveBrand] = useState("All");

  const [locationFilter, setLocationFilter] = useState<{ lat: number; lng: number; radius: number } | null>(null);

  const filtered = mockProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = activeBrand === "All" || p.brand === activeBrand;
    return matchesSearch && matchesBrand;
  });

  const { visibleItems, hasMore, sentinelRef, total } = useInfiniteScroll({ items: filtered, pageSize: 4 });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEOHead title="Bike Shop — New Bikes from Verified Sellers | Bikeman" description="Browse new motorcycles from verified sellers across Nigeria. Honda, Bajaj, TVS, Yamaha, Suzuki and more." />

      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-secondary/5 blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl translate-x-1/2" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9 rounded-xl bg-card shadow-card shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight">Bike Shop</h1>
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Brand new bikes from verified sellers</p>
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/50">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Featured Banner */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-2xl gradient-primary p-4 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl translate-x-8 -translate-y-8" />
          <div className="relative z-10">
            <Badge className="bg-white/20 text-primary-foreground border-0 text-[9px] font-bold uppercase tracking-wider mb-2">🔥 Hot Deals</Badge>
            <h2 className="text-lg font-bold text-primary-foreground leading-tight mb-1">New Arrivals This Week</h2>
            <p className="text-xs text-primary-foreground/80">Up to 15% off on select models</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search new bikes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-11 rounded-xl bg-card border-border/50 shadow-card" />
          </div>
        </motion.div>

        {/* Brand filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {brandFilters.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeBrand === brand
                  ? "gradient-secondary text-secondary-foreground shadow-sm"
                  : "bg-card border border-border/50 text-muted-foreground shadow-card"
              }`}
            >
              {brand}
            </button>
          ))}
        </motion.div>

        {/* Location Search */}
        <div className="mb-4">
          <LocationSearch
            onLocationChange={(lat, lng, radius) => setLocationFilter({ lat, lng, radius })}
            onClear={() => setLocationFilter(null)}
          />
        </div>

        {/* Results count */}
        <p className="text-[10px] text-muted-foreground mb-3">
          Showing {visibleItems.length} of {total} bikes{locationFilter ? ` within ${locationFilter.radius}km` : ""}
        </p>

        {/* Products List with infinite scroll */}
        <div className="space-y-3 flex-1 pb-6">
          {visibleItems.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + (i % 4) * 0.07 }}
              className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden group cursor-pointer"
            >
              <div className="flex">
                <div className="w-28 h-28 shrink-0 overflow-hidden relative">
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    width={112}
                    height={112}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-1.5 left-1.5 bg-secondary text-secondary-foreground border-0 text-[8px] font-bold uppercase tracking-wider">New</Badge>
                  )}
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-sm font-semibold leading-tight line-clamp-1 mb-0.5">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-1.5">
                      <Store className="h-2.5 w-2.5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground truncate">{product.sellerName}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-2.5 w-2.5 text-secondary" />
                        <span className="text-[10px] text-muted-foreground">{product.specs.engine}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-2.5 w-2.5 text-secondary" />
                        <span className="text-[10px] text-muted-foreground">{product.specs.mileage}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[10px] text-muted-foreground">₦</span>
                      <span className="text-sm font-bold text-primary">{product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="text-[10px] font-semibold">{product.rating}</span>
                      <span className="text-[9px] text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-1" />

          {hasMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No bikes available</h3>
            <p className="text-xs text-muted-foreground">Try a different brand or search term</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BikeShop;
