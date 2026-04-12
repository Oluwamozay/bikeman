import { useState, useEffect } from "react";
import { Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
}

const GamificationBadges = () => {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: badges } = await supabase.from("badges").select("*");
      setAllBadges((badges as Badge[]) || []);

      if (user) {
        const { data: earned } = await supabase
          .from("user_badges")
          .select("badge_id")
          .eq("user_id", user.id);
        setEarnedIds(new Set((earned || []).map((e: any) => e.badge_id)));
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">Achievements</h3>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {earnedIds.size}/{allBadges.length}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {allBadges.map((badge, i) => {
          const earned = earnedIds.has(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                earned
                  ? "bg-primary/10 border-primary/30 shadow-sm"
                  : "bg-card/30 border-border/20 opacity-40 grayscale"
              }`}
            >
              <span className="text-xl mb-0.5">{badge.icon}</span>
              <span className="text-[8px] font-semibold leading-tight">{badge.name}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GamificationBadges;
