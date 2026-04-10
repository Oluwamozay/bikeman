import { useState, useEffect } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => interactive && onRate?.(s)}
        className={interactive ? "cursor-pointer" : "cursor-default"}
        disabled={!interactive}
      >
        <Star className={`h-4 w-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      </button>
    ))}
  </div>
);

const ReviewSection = ({ bikeId }: { bikeId: string }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles:user_id(full_name, avatar_url)")
      .eq("bike_id", bikeId)
      .order("created_at", { ascending: false });
    setReviews((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [bikeId]);

  const submit = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to leave a review.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      bike_id: bikeId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review submitted!" });
      setComment("");
      setRating(5);
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">Reviews</h3>
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{avg}</span>
          <span className="text-muted-foreground">({reviews.length})</span>
        </div>
      </div>

      {/* Add Review */}
      {user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-secondary/30 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Your rating:</span>
            <StarRating rating={rating} onRate={setRating} interactive />
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="min-h-[60px] text-sm bg-card/50 border-border/30 rounded-xl"
          />
          <Button onClick={submit} disabled={submitting} size="sm" className="gradient-primary text-primary-foreground rounded-xl">
            {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            <span className="ml-1">Submit</span>
          </Button>
        </motion.div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl bg-card/50 border border-border/30 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{(r.profiles as any)?.full_name || "Anonymous"}</span>
                <StarRating rating={r.rating} />
              </div>
              {r.comment && <p className="text-xs text-muted-foreground leading-relaxed">{r.comment}</p>}
              <p className="text-[10px] text-muted-foreground/60">{new Date(r.created_at).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
