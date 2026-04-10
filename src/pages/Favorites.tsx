import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { featuredBikes } from "@/data/bikes";

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteBikes = featuredBikes.filter((b) => favorites.includes(b.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold">My Favorites</h1>
            <p className="text-xs text-muted-foreground">{favoriteBikes.length} saved bike{favoriteBikes.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {favoriteBikes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Heart className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold mb-1">No favorites yet</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-[240px]">
              Tap the heart icon on any bike to save it here for quick access.
            </p>
            <Button onClick={() => navigate("/")} className="rounded-xl">
              Browse Bikes
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favoriteBikes.map((bike, i) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-2xl glass border border-border/40 hover:glow-ring transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/bike/${bike.id}`)}
              >
                <img src={bike.img} alt={bike.name} className="w-16 h-16 object-contain rounded-xl bg-muted/30" />
                <div className="flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[9px] font-bold">{bike.tag}</span>
                  <h3 className="text-sm font-bold mt-1 truncate">{bike.name}</h3>
                  <p className="text-sm font-bold text-primary">{bike.price}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(bike.id); }}
                  className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center shrink-0 hover:border-destructive/50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
