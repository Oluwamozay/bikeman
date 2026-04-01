import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bike, ArrowRight, Shield, Zap, ShoppingBag, Repeat2, LogIn, LogOut, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SocialLinks from "@/components/SocialLinks";
import InstallPrompt from "@/components/InstallPrompt";

const stats = [
  { label: "Active Riders", value: "2,400+", icon: Users },
  { label: "Bikes Listed", value: "850+", icon: TrendingUp },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-secondary/8 blur-3xl" />

      {/* Auth button - top right */}
      <div className="absolute top-4 right-4 z-20">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center shadow-card hover:bg-muted transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/50 shadow-card hover:bg-muted transition-colors"
          >
            <LogIn className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Sign In</span>
          </button>
        )}
      </div>

      <div className="relative z-10 max-w-md mx-auto px-5 py-8 min-h-screen flex flex-col">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-8"
          >
            <Bike className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight leading-tight mb-3">
            Ocada
            <span className="gradient-primary bg-clip-text text-transparent"> Connect</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Nigeria's smartest ride platform. Connect with riders, earn more, ride safer.
          </p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex gap-3 mb-8"
          >
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex-1 bg-card rounded-xl border border-border/50 shadow-card p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">{value}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              </div>
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
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/50 shadow-card"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 pb-2"
        >
          <Button
            onClick={() => navigate("/driver-onboarding")}
            className="w-full h-14 rounded-xl text-base font-semibold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
          >
            Become a Driver
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 rounded-xl text-base font-medium border-border/50"
          >
            Book a Ride
          </Button>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              variant="outline"
              onClick={() => navigate("/marketplace")}
              className="h-12 rounded-xl border-border/50 flex items-center gap-2"
            >
              <Repeat2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">P2P Trade</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/bike-shop")}
              className="h-12 rounded-xl border-border/50 flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Bike Shop</span>
            </Button>
          </div>
        </motion.div>

        {/* Social Links */}
        <SocialLinks />
      </div>

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default Index;
