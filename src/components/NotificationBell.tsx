import { useState, useEffect } from "react";
import { Bell, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationBell = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      new Notification("🔔 Ocada Connect", {
        body: "You'll now receive price drop alerts for your favorites!",
        icon: "/icons/icon-192x192.png",
      });
      localStorage.setItem("ocada_push_enabled", "1");
    }
  };

  const isGranted = permission === "granted";

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={requestPermission}
        className={`w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center transition-all duration-300 ${
          isGranted ? "glow-ring" : "hover:glow-ring"
        }`}
        title={isGranted ? "Notifications enabled" : "Enable notifications"}
      >
        {isGranted ? (
          <BellRing className="h-4 w-4 text-primary" />
        ) : (
          <Bell className="h-4 w-4 text-muted-foreground" />
        )}
        {!isGranted && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full right-0 mt-2 w-48 p-2 rounded-lg glass border border-border/40 text-[10px] text-muted-foreground z-50"
          >
            Notifications not supported in this browser
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
