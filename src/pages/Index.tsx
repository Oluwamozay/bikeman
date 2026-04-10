import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bike, ArrowRight, ShoppingBag, Repeat2, Car, LogIn, LogOut, Users, TrendingUp, Star, Shield, Zap, ChevronLeft, ChevronRight, Quote, Search, MapPin, CheckCircle, RefreshCw, Clock, TrendingDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SocialLinks from "@/components/SocialLinks";
import InstallPrompt from "@/components/InstallPrompt";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { featuredBikes, bikeTags } from "@/data/bikes";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useToast } from "@/hooks/use-toast";

type SortOption = "default" | "price-asc" | "price-desc" | "name";

const stats = [
  { label: "Active Riders", value: "2,400+", icon: Users },
  { label: "Bikes Listed", value: "850+", icon: TrendingUp },
];

const features = [
  { icon: ShoppingBag, label: "Shop", desc: "New bikes from dealers", path: "/shop", color: "from-primary/20 to-primary/5" },
  { icon: Repeat2, label: "Trade", desc: "P2P marketplace", path: "/trade", color: "from-primary/15 to-primary/5" },
  { icon: Car, label: "Ride", desc: "Book a ride now", path: "/ride", color: "from-primary/20 to-primary/5" },
];

const howItWorks = [
  { step: "01", icon: Search, title: "Browse", desc: "Find bikes, riders, or deals on our platform" },
  { step: "02", icon: CheckCircle, title: "Connect", desc: "Verify your identity and match with sellers or drivers" },
  { step: "03", icon: MapPin, title: "Go", desc: "Complete your trade or start your ride instantly" },
];

const testimonials = [
  { name: "Chidi A.", role: "Bike Trader", text: "Ocada Connect made selling my old bike so easy. Got a fair deal within 2 days!", avatar: "C" },
  { name: "Amina K.", role: "Daily Rider", text: "I use the ride feature every day. Fast, reliable, and the drivers are verified.", avatar: "A" },
  { name: "Tunde O.", role: "Bike Dealer", text: "My shop sales doubled since listing on Ocada. The platform is a game-changer!", avatar: "T" },
  { name: "Ngozi E.", role: "Student", text: "Affordable rides to campus. The app is super smooth and easy to use.", avatar: "N" },
];


const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([300000, 900000]);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { recentIds, addViewed } = useRecentlyViewed();
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const { toast } = useToast();

  // Price drop alerts for favorited bikes
  useEffect(() => {
    const alertKey = "ocada_price_drop_alerted";
    const alerted: string[] = JSON.parse(localStorage.getItem(alertKey) || "[]");
    const droppedFavs = featuredBikes.filter(
      (b) => favorites.includes(b.id) && b.originalPriceNum && !alerted.includes(b.id)
    );
    if (droppedFavs.length > 0) {
      const newAlerted = [...alerted, ...droppedFavs.map((b) => b.id)];
      localStorage.setItem(alertKey, JSON.stringify(newAlerted));
      setTimeout(() => {
        droppedFavs.forEach((bike) => {
          const pct = Math.round(((bike.originalPriceNum! - bike.priceNum) / bike.originalPriceNum!) * 100);
          toast({
            title: `🔥 Price Drop on ${bike.name}!`,
            description: `Now ${bike.price} (${pct}% off from ${bike.originalPrice})`,
          });
        });
      }, 1500);
    }
  }, [favorites, toast]);

  const filteredBikes = useMemo(() => {
    let bikes = activeTag === "All" ? featuredBikes : featuredBikes.filter((b) => b.tag === activeTag);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      bikes = bikes.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.price.toLowerCase().includes(q) ||
        b.specs.some((s) => s.value.toLowerCase().includes(q))
      );
    }
    bikes = bikes.filter((b) => b.priceNum >= priceRange[0] && b.priceNum <= priceRange[1]);
    if (sortBy === "price-asc") bikes = [...bikes].sort((a, b) => a.priceNum - b.priceNum);
    else if (sortBy === "price-desc") bikes = [...bikes].sort((a, b) => b.priceNum - a.priceNum);
    else if (sortBy === "name") bikes = [...bikes].sort((a, b) => a.name.localeCompare(b.name));
    return bikes;
  }, [activeTag, searchQuery, priceRange, sortBy]);

  const recentBikes = useMemo(() => {
    return recentIds.map((id) => featuredBikes.find((b) => b.id === id)).filter(Boolean);
  }, [recentIds]);

  const scrollCarousel = (dir: number) => {
    const next = Math.max(0, Math.min(carouselIndex + dir, filteredBikes.length - 1));
    setCarouselIndex(next);
    carouselRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    const scrollTop = containerRef.current?.scrollTop ?? window.scrollY;
    if (scrollTop > 5) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.4, 100));
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      setPullDistance(0);
      setTimeout(() => setIsRefreshing(false), 1500);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={isRefreshing || pullDistance > 20 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <RefreshCw className={`h-5 w-5 text-primary ${isRefreshing ? "animate-spin" : ""}`} style={{ transform: !isRefreshing ? `rotate(${pullDistance * 3}deg)` : undefined }} />
        <span className="text-xs text-muted-foreground font-medium">
          {isRefreshing ? "Refreshing..." : pullDistance > 60 ? "Release to refresh" : "Pull to refresh"}
        </span>
      </motion.div>
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Auth button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
            <button onClick={signOut} className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:glow-ring transition-all duration-300">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/auth")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass hover:glow-ring transition-all duration-300"
          >
            <LogIn className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Sign In</span>
          </motion.button>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-md mx-auto px-5 py-8 pb-24"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined, transition: pullDistance === 0 ? 'transform 0.3s ease' : 'none' }}
      >
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-8 relative"
          >
            <Bike className="h-10 w-10 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-glow">
              <Star className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-4xl font-bold tracking-tight leading-[1.1] mb-3"
          >
            Ocada
            <span className="text-gradient"> Connect</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-muted-foreground text-base leading-relaxed mb-7 max-w-[300px]"
          >
            Nigeria's smartest ride platform. Shop, trade & ride — all in one.
          </motion.p>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-3 mb-7">
            {stats.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                className="flex-1 rounded-2xl border border-border/50 glass p-3.5 flex items-center gap-3 hover:glow-ring transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">{value}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { icon: Zap, label: "Fast Rides" },
              { icon: Shield, label: "Verified Drivers" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full glass hover:glow-ring transition-all duration-300"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 3 Feature Cards */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-3 gap-3 mb-5">
          {features.map((f, i) => (
            <motion.button
              key={f.label}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(f.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.08 }}
              className="rounded-2xl border border-border/50 glass p-4 flex flex-col items-center gap-2 hover:glow-ring transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-bold">{f.label}</span>
              <span className="text-[9px] text-muted-foreground leading-tight text-center">{f.desc}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="space-y-3 mb-12">
          <Button
            onClick={() => navigate("/driver-onboarding")}
            className="w-full h-14 rounded-2xl text-base font-bold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-all duration-300"
          >
            Become a Driver
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </motion.div>

        {/* ── How It Works ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-xl font-bold mb-1">How It Works</h2>
          <p className="text-xs text-muted-foreground mb-6">Get started in 3 simple steps</p>
          <div className="space-y-4">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl glass border border-border/40 hover:glow-ring transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                    <h3 className="text-sm font-bold">{item.title}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Featured Bikes Carousel ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, price, engine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-11 rounded-xl glass border-border/40 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Price Range Slider */}
          <div className="mb-4 p-3 rounded-xl glass border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-muted-foreground">Budget Range</span>
              <span className="text-[11px] font-bold text-primary">
                ₦{(priceRange[0] / 1000).toFixed(0)}k – ₦{(priceRange[1] / 1000).toFixed(0)}k
              </span>
            </div>
            <Slider
              min={300000}
              max={900000}
              step={10000}
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              className="w-full"
            />
          </div>

          {/* Sort Options */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1" style={{ scrollbarWidth: "none" }}>
            {([
              { key: "default", label: "Default" },
              { key: "price-asc", label: "Price ↑" },
              { key: "price-desc", label: "Price ↓" },
              { key: "name", label: "A–Z" },
            ] as { key: SortOption; label: string }[]).map((s) => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all duration-200 ${
                  sortBy === s.key
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "glass border border-border/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold">Featured Bikes</h2>
              <p className="text-xs text-muted-foreground">Tap a bike for full details</p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={() => navigate("/favorites")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass border border-border/40 text-[10px] font-bold hover:glow-ring transition-all mr-2"
              >
                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                {favorites.length}
              </button>
            )}
            <div className="flex gap-1.5">
              <button onClick={() => scrollCarousel(-1)} className="w-8 h-8 rounded-lg glass border border-border/40 flex items-center justify-center hover:glow-ring transition-all">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => scrollCarousel(1)} className="w-8 h-8 rounded-lg glass border border-border/40 flex items-center justify-center hover:glow-ring transition-all">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {bikeTags.map((tag) => (
              <button
                key={tag}
                onClick={() => { setActiveTag(tag); setCarouselIndex(0); }}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTag === tag
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "glass border border-border/40 text-muted-foreground hover:text-foreground hover:glow-ring"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredBikes.map((bike, i) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { addViewed(bike.id); navigate(`/bike/${bike.id}`); }}
                className="relative min-w-[160px] snap-center rounded-2xl glass border border-border/40 p-4 flex flex-col items-center gap-2 cursor-pointer hover:glow-ring transition-all duration-300"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(bike.id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full glass border border-border/40 flex items-center justify-center z-10"
                >
                  <Heart className={`h-3.5 w-3.5 transition-colors ${isFavorite(bike.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </button>
                <img src={bike.img} alt={bike.name} className="w-24 h-24 object-contain mb-1" loading="lazy" width={96} height={96} />
                {bike.originalPriceNum && (
                  <span className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-[8px] font-bold z-10">
                    <TrendingDown className="h-2.5 w-2.5" />
                    {Math.round(((bike.originalPriceNum - bike.priceNum) / bike.originalPriceNum) * 100)}%
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[9px] font-bold">{bike.tag}</span>
                <h3 className="text-xs font-bold text-center leading-tight">{bike.name}</h3>
                <div className="text-center">
                  <p className="text-sm font-bold text-primary">{bike.price}</p>
                  {bike.originalPrice && (
                    <p className="text-[9px] text-muted-foreground line-through">{bike.originalPrice}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Recently Viewed ── */}
        {recentBikes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="text-xl font-bold">Recently Viewed</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
              {recentBikes.map((bike) => (
                <motion.div
                  key={bike!.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/bike/${bike!.id}`)}
                  className="min-w-[130px] snap-center rounded-2xl glass border border-border/40 p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:glow-ring transition-all duration-300"
                >
                  <img src={bike!.img} alt={bike!.name} className="w-16 h-16 object-contain" loading="lazy" />
                  <h3 className="text-[11px] font-bold text-center leading-tight">{bike!.name}</h3>
                  <p className="text-xs font-bold text-primary">{bike!.price}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Testimonials ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-xl font-bold mb-1">What Riders Say</h2>
          <p className="text-xs text-muted-foreground mb-6">Real stories from our community</p>
          <div className="space-y-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl glass border border-border/40 p-4 hover:glow-ring transition-all duration-300"
              >
                <Quote className="h-4 w-4 text-primary/40 mb-2" />
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{t.name}</p>
                    <p className="text-[9px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Download / Final CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="rounded-2xl gradient-primary p-6 text-center">
            <Bike className="h-8 w-8 text-primary-foreground mx-auto mb-3" />
            <h2 className="text-lg font-bold text-primary-foreground mb-1">Ready to Ride?</h2>
            <p className="text-xs text-primary-foreground/80 mb-4">Join thousands of riders across Nigeria</p>
            <Button
              onClick={() => navigate(user ? "/ride" : "/auth")}
              variant="secondary"
              className="rounded-xl font-bold h-11 px-8"
            >
              {user ? "Book a Ride" : "Get Started"}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </motion.section>

        <SocialLinks />
      </div>

      <InstallPrompt />
    </div>
  );
};

export default Index;
