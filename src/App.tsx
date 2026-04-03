import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DriverOnboarding from "./pages/DriverOnboarding";
import Marketplace from "./pages/Marketplace";
import BikeShop from "./pages/BikeShop";
import Shop from "./pages/Shop";
import Trade from "./pages/Trade";
import Ride from "./pages/Ride";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/driver-onboarding" element={<DriverOnboarding />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/bike-shop" element={<BikeShop />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/ride" element={<Ride />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
