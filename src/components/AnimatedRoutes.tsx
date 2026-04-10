import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import DriverOnboarding from "@/pages/DriverOnboarding";
import Marketplace from "@/pages/Marketplace";
import BikeShop from "@/pages/BikeShop";
import BikeDetail from "@/pages/BikeDetail";
import BikeCompare from "@/pages/BikeCompare";
import Shop from "@/pages/Shop";
import Trade from "@/pages/Trade";
import Ride from "@/pages/Ride";
import NotFound from "@/pages/NotFound";

const pages = [
  { path: "/", element: <Index /> },
  { path: "/auth", element: <Auth /> },
  { path: "/driver-onboarding", element: <DriverOnboarding /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/bike-shop", element: <BikeShop /> },
  { path: "/bike/:id", element: <BikeDetail /> },
  { path: "/compare", element: <BikeCompare /> },
  { path: "/shop", element: <Shop /> },
  { path: "/trade", element: <Trade /> },
  { path: "/ride", element: <Ride /> },
  { path: "*", element: <NotFound /> },
];

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {pages.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PageTransition>{element}</PageTransition>}
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
