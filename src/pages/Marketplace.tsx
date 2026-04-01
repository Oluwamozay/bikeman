import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CreateListingForm from "@/components/marketplace/CreateListingForm";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronLeft,
  Plus,
  Heart,
  Bike,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: number;
  condition: string;
  location: string;
  image: string;
  brand: string;
  year: number;
  isFavorite: boolean;
}

const mockListings: Listing[] = [
  {
    id: "1",
    title: "Honda CG 125 — Clean Title",
    price: 185000,
    condition: "used",
    location: "Lagos, Ikeja",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80",
    brand: "Honda",
    year: 2021,
    isFavorite: false,
  },
  {
    id: "2",
    title: "Bajaj Boxer 150 — Low Mileage",
    price: 220000,
    condition: "used",
    location: "Abuja, Wuse",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80",
    brand: "Bajaj",
    year: 2022,
    isFavorite: true,
  },
  {
    id: "3",
    title: "TVS Apache RTR 160 — Like New",
    price: 450000,
    condition: "refurbished",
    location: "Port Harcourt",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&q=80",
    brand: "TVS",
    year: 2023,
    isFavorite: false,
  },
  {
    id: "4",
    title: "Suzuki GN 125 — Daily Runner",
    price: 130000,
    condition: "used",
    location: "Ibadan, Ring Road",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400&q=80",
    brand: "Suzuki",
    year: 2020,
    isFavorite: false,
  },
];

const conditionColors: Record<string, string> = {
  new: "bg-secondary text-secondary-foreground",
  used: "bg-muted text-muted-foreground",
  refurbished: "bg-accent text-accent-foreground",
};

const filterTabs = ["All", "Used", "New", "Refurbished"];

const Marketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [listings, setListings] = useState(mockListings);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filtered = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.brand.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      l.condition.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const toggleFavorite = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isFavorite: !l.isFavorite } : l))
    );
  };

  const handleCreateClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShowCreateForm(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-40 left-0 w-80 h-80 rounded-full bg-secondary/5 blur-3xl -translate-x-1/2" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-5"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-9 w-9 rounded-xl bg-card shadow-card shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">P2P Marketplace</h1>
            <p className="text-xs text-muted-foreground">Buy & sell bikes directly</p>
          </div>
          <Button
            onClick={handleCreateClick}
            size="icon"
            className="h-9 w-9 rounded-xl gradient-primary text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-4 rounded-2xl gradient-primary p-4 text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-3">
            <Sparkles className="h-6 w-6 shrink-0" />
            <div>
              <p className="text-sm font-bold">Sell your bike in minutes</p>
              <p className="text-[11px] opacity-90">Free listing • Verified buyers • Secure deals</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bikes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-xl bg-card border-border/50 shadow-card"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl border-border/50"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-card border border-border/50 text-muted-foreground shadow-card"
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-card border border-border/50 text-muted-foreground shadow-card flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" />
            Price
          </button>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground font-medium">
            {filtered.length} bikes found
          </span>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-2 gap-3 flex-1 pb-6">
          {filtered.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-28 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(listing.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-card/80 backdrop-blur flex items-center justify-center"
                >
                  <Heart
                    className={`h-3.5 w-3.5 transition-colors ${
                      listing.isFavorite
                        ? "fill-destructive text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
                <Badge
                  className={`absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider border-0 ${
                    conditionColors[listing.condition]
                  }`}
                >
                  {listing.condition}
                </Badge>
              </div>

              {/* Info */}
              <div className="p-2.5">
                <h3 className="text-xs font-semibold leading-tight line-clamp-2 mb-1.5">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground truncate">
                    {listing.location}
                  </span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[10px] text-muted-foreground">₦</span>
                  <span className="text-sm font-bold text-primary">
                    {listing.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Bike className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No bikes found</h3>
            <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Create Listing Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <CreateListingForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => setShowCreateForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
