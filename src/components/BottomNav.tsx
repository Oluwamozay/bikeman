import { useLocation, useNavigate } from "react-router-dom";
import { Home, ShoppingBag, MessageCircle, Car, Settings } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ShoppingBag, label: "Shop", path: "/shop" },
  { icon: MessageCircle, label: "Chat", path: "/messages" },
  { icon: Car, label: "Ride", path: "/ride" },
  { icon: Settings, label: "Settings", path: "__settings__" },
];

interface BottomNavProps {
  onSettingsOpen?: () => void;
}

const BottomNav = ({ onSettingsOpen }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hidden = ["/auth", "/driver-onboarding"].includes(location.pathname);
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-border/30 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map(({ icon: Icon, label, path }) => {
          const isSettings = path === "__settings__";
          const active = !isSettings && location.pathname === path;
          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (isSettings) {
                  onSettingsOpen?.();
                } else {
                  navigate(path);
                }
              }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
