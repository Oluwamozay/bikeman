import { useState, useEffect } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

interface LocationSearchProps {
  onLocationChange: (lat: number, lng: number, radius: number) => void;
  onClear: () => void;
}

const NIGERIAN_CITIES: Record<string, { lat: number; lng: number }> = {
  Lagos: { lat: 6.5244, lng: 3.3792 },
  Abuja: { lat: 9.0579, lng: 7.4951 },
  "Port Harcourt": { lat: 4.8156, lng: 7.0498 },
  Kano: { lat: 12.0022, lng: 8.592 },
  Ibadan: { lat: 7.3776, lng: 3.947 },
};

const LocationSearch = ({ onLocationChange, onClear }: LocationSearchProps) => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState([25]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState("");

  const detectLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      // Default to Lagos
      const loc = NIGERIAN_CITIES.Lagos;
      setUserLocation(loc);
      setLocationName("Lagos (default)");
      onLocationChange(loc.lat, loc.lng, radius[0]);
      setActive(true);
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationName("Your Location");
        onLocationChange(loc.lat, loc.lng, radius[0]);
        setActive(true);
        setLoading(false);
      },
      () => {
        const loc = NIGERIAN_CITIES.Lagos;
        setUserLocation(loc);
        setLocationName("Lagos (default)");
        onLocationChange(loc.lat, loc.lng, radius[0]);
        setActive(true);
        setLoading(false);
      }
    );
  };

  const selectCity = (name: string) => {
    const loc = NIGERIAN_CITIES[name];
    setUserLocation(loc);
    setLocationName(name);
    onLocationChange(loc.lat, loc.lng, radius[0]);
    setActive(true);
  };

  useEffect(() => {
    if (userLocation) {
      onLocationChange(userLocation.lat, userLocation.lng, radius[0]);
    }
  }, [radius]);

  const handleClear = () => {
    setActive(false);
    setUserLocation(null);
    setLocationName("");
    onClear();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Button
          variant={active ? "default" : "outline"}
          size="sm"
          onClick={active ? handleClear : detectLocation}
          disabled={loading}
          className="rounded-full text-xs shrink-0 h-8"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Navigation className="h-3 w-3 mr-1" />}
          {active ? `📍 ${locationName}` : "Near Me"}
        </Button>
        {!active && Object.keys(NIGERIAN_CITIES).map((city) => (
          <button
            key={city}
            onClick={() => selectCity(city)}
            className="px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            {city}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 px-1">
              <MapPin className="h-3 w-3 text-primary shrink-0" />
              <Slider value={radius} onValueChange={setRadius} min={5} max={100} step={5} className="flex-1" />
              <span className="text-[10px] text-muted-foreground whitespace-nowrap w-12 text-right">{radius[0]} km</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSearch;
