import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import SettingsSidebar from "@/components/SettingsSidebar";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem("splash_seen");
    return !seen;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splash_seen", "1");
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SplashScreen show={showSplash} />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            <BottomNav onSettingsOpen={() => setSettingsOpen(true)} />
            <SettingsSidebar open={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
