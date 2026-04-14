import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Share2, Users, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ReferralSystem = () => {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      // Get or create referral code
      const { data: existing } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id);

      if (existing && existing.length > 0) {
        setCode(existing[0].code);
        setReferrals(existing);
      } else {
        // Generate a unique code
        const newCode = `BIKE${user.id.slice(0, 6).toUpperCase()}`;
        const { error } = await supabase.from("referrals").insert({
          referrer_id: user.id,
          code: newCode,
        });
        if (!error) setCode(newCode);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareCode = async () => {
    const shareData = {
      title: "Join Bikeman!",
      text: `Use my referral code ${code} to join Bikeman — Nigeria's smartest ride platform! 🏍️`,
      url: `https://bikeman.lovable.app?ref=${code}`,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      copyCode();
    }
  };

  const completedReferrals = referrals.filter(r => r.status === "completed").length;
  const pendingReferrals = referrals.filter(r => r.status === "pending").length;

  if (!user) {
    return (
      <div className="p-6 rounded-2xl glass border border-border/40 text-center">
        <Gift className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Sign in to get your referral code</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Referral Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl gradient-primary relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <Gift className="h-6 w-6 text-primary-foreground mb-3" />
        <h3 className="text-lg font-bold text-primary-foreground mb-1">Invite Friends</h3>
        <p className="text-xs text-primary-foreground/70 mb-4">
          Share your code and earn badges when friends join Bikeman!
        </p>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={code}
              readOnly
              className="bg-white/10 border-white/20 text-primary-foreground font-mono font-bold text-center tracking-widest h-11 rounded-xl"
            />
          </div>
          <Button
            onClick={copyCode}
            variant="secondary"
            className="h-11 px-4 rounded-xl"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            onClick={shareCode}
            variant="secondary"
            className="h-11 px-4 rounded-xl"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl glass border border-border/40 text-center"
        >
          <Users className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{completedReferrals}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Successful</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl glass border border-border/40 text-center"
        >
          <Gift className="h-5 w-5 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold">{pendingReferrals}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Pending</p>
        </motion.div>
      </div>

      {/* Rewards Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl glass border border-border/40"
      >
        <h4 className="text-sm font-bold mb-3">🏆 Referral Rewards</h4>
        <div className="space-y-2.5">
          {[
            { count: 1, badge: "First Referral 🤝", desc: "Invite your first friend" },
            { count: 5, badge: "Team Builder 👥", desc: "Get 5 friends to join" },
            { count: 10, badge: "Ambassador 🌟", desc: "Refer 10 users" },
            { count: 25, badge: "Legend 🔥", desc: "25+ successful referrals" },
          ].map((tier) => (
            <div
              key={tier.count}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                completedReferrals >= tier.count
                  ? "bg-primary/10 border border-primary/20"
                  : "opacity-50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                completedReferrals >= tier.count
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {completedReferrals >= tier.count ? "✓" : tier.count}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold">{tier.badge}</p>
                <p className="text-[10px] text-muted-foreground">{tier.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralSystem;
