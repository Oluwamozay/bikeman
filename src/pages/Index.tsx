import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bike, ArrowRight, ShoppingBag, Repeat2, Car, LogIn, LogOut, Users, TrendingUp, Star, Shield, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SocialLinks from "@/components/SocialLinks";
import InstallPrompt from "@/components/InstallPrompt";

const stats = [
  { label: "Active Riders", value: "2,400+", icon: Users },
  { label: "Bikes Listed", value: "850+", icon: TrendingUp },
];

const features = [
  { icon: ShoppingBag, label: "Shop", desc: "New bikes from dealers", path: "/shop", color: "from-primary/20 to-primary/5" },
  { icon: Repeat2, label: "Trade", desc: "P2P marketplace", path: "/trade", color: "from-primary/15 to-primary/5" },
  { icon: Car, label: "Ride", desc: "Book a ride now", path: "/ride", color: "from-primary/20 to-primary/5" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Auth button */}
      <div className="absolute top-4 right-4 z-20">
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

      <div className="relative z-10 max-w-md mx-auto px-5 py-8 min-h-screen flex flex-col">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col justify-center"
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
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="space-y-3 pb-2">
          <Button
            onClick={() => navigate("/driver-onboarding")}
            className="w-full h-14 rounded-2xl text-base font-bold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-all duration-300"
          >
            Become a Driver
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </motion.div>

        <SocialLinks />
      </div>

      <InstallPrompt />
    </div>
  );
};

export default Index;
