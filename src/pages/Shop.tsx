import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Search, ChevronLeft, ShoppingCart, Sparkles, Minus, Plus, X, Trash2,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  emoji: string;
  rating: number;
}

const mockProducts: Product[] = [
  { id: "1", name: "Honda CB Shine 125", price: 680000, oldPrice: 780000, category: "Tech", emoji: "🏍️", rating: 4.8 },
  { id: "2", name: "Bajaj Pulsar NS200", price: 920000, category: "Tech", emoji: "🏎️", rating: 4.6 },
  { id: "3", name: "Riding Helmet Pro", price: 25000, oldPrice: 32000, category: "Fashion", emoji: "⛑️", rating: 4.9 },
  { id: "4", name: "LED Headlight Kit", price: 15000, category: "Tech", emoji: "💡", rating: 4.5 },
  { id: "5", name: "Leather Riding Gloves", price: 12000, oldPrice: 15000, category: "Fashion", emoji: "🧤", rating: 4.7 },
  { id: "6", name: "GPS Tracker Device", price: 35000, category: "Tech", emoji: "📡", rating: 4.4 },
  { id: "7", name: "Rider Rain Jacket", price: 18000, category: "Fashion", emoji: "🧥", rating: 4.3 },
  { id: "8", name: "Phone Mount Holder", price: 8000, oldPrice: 11000, category: "Tech", emoji: "📱", rating: 4.6 },
];

const categories = ["All", "Tech", "Fashion"];

interface CartItem extends Product { qty: number; }

const Shop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [flashEnd, setFlashEnd] = useState(Date.now() + 3600000 * 4);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, flashEnd - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [flashEnd]);

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) return prev.map((c) => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter((c) => c.qty > 0));
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9 rounded-xl glass shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight">Shop</h1>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Brand new bikes & gear</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl glass relative">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-glow">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background border-border/50 w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-foreground">Your Cart ({cartCount})</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty</p>}
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl glass">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-primary font-bold">₦{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center">
                        {item.qty === 1 ? <Trash2 className="h-3 w-3 text-destructive" /> : <Minus className="h-3 w-3" />}
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <SheetFooter className="border-t border-border/50 pt-4">
                  <div className="w-full space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-primary">₦{cartTotal.toLocaleString()}</span>
                    </div>
                    <Button className="w-full rounded-xl gradient-primary text-primary-foreground shadow-glow font-bold">
                      Checkout
                    </Button>
                  </div>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </motion.div>

        {/* Flash Sale Banner */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-2xl gradient-primary p-4 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-foreground/5 blur-2xl translate-x-8 -translate-y-8" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-[9px] font-bold uppercase tracking-wider mb-2">
                ⚡ Flash Sale
              </Badge>
              <h2 className="text-lg font-bold text-primary-foreground leading-tight">Up to 20% Off!</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-primary-foreground/70 mb-1">Ends in</p>
              <div className="flex gap-1">
                {timeLeft.split(":").map((t, i) => (
                  <div key={i} className="bg-primary-foreground/20 rounded-lg px-2 py-1">
                    <span className="text-sm font-bold text-primary-foreground font-mono">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-11 rounded-xl glass border-border/30" />
          </div>
        </motion.div>

        {/* Category pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "glass text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 flex-1 pb-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-border/30 glass overflow-hidden group"
            >
              <div className="p-4 flex flex-col items-center">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
                <h3 className="text-xs font-semibold text-center leading-tight line-clamp-2 mb-1">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[10px] text-primary">★ {product.rating}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-sm font-bold text-primary">₦{product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span className="text-[10px] text-muted-foreground line-through">₦{product.oldPrice.toLocaleString()}</span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => addToCart(product)}
                  className="w-full h-8 rounded-lg gradient-primary text-primary-foreground text-[11px] font-bold shadow-glow hover:opacity-90 transition-opacity"
                >
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <span className="text-4xl mb-4">🔍</span>
            <h3 className="text-sm font-semibold mb-1">No products found</h3>
            <p className="text-xs text-muted-foreground">Try a different search or category</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;
