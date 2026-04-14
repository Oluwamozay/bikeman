import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const PushNotificationManager = () => {
  const { user } = useAuth();

  const checkNewListings = useCallback(async () => {
    if (!user || !("Notification" in window) || Notification.permission !== "granted") return;

    const lastCheck = localStorage.getItem("bikeman_last_push_check");
    const now = new Date().toISOString();

    if (lastCheck) {
      // Check for new bikes since last check
      const { data: newBikes } = await supabase
        .from("bikes")
        .select("title, price")
        .gt("created_at", lastCheck)
        .limit(3);

      if (newBikes && newBikes.length > 0) {
        new Notification("🆕 New Listings on Bikeman!", {
          body: `${newBikes.length} new bike${newBikes.length > 1 ? "s" : ""} just listed! Check out ${newBikes[0].title} and more.`,
          icon: "/icon-192.png",
          tag: "new-listings",
        });
      }

      // Check for price drops on favorites
      const favIds: string[] = JSON.parse(localStorage.getItem("bikeman_favorites") || "[]");
      if (favIds.length > 0) {
        const { data: priceChanges } = await supabase
          .from("price_history")
          .select("bike_id, price")
          .in("bike_id", favIds)
          .gt("recorded_at", lastCheck);

        if (priceChanges && priceChanges.length > 0) {
          new Notification("💰 Price Drop Alert!", {
            body: `Prices changed on ${priceChanges.length} of your favorite bike${priceChanges.length > 1 ? "s" : ""}!`,
            icon: "/icon-192.png",
            tag: "price-drop",
          });
        }
      }
    }

    localStorage.setItem("bikeman_last_push_check", now);
  }, [user]);

  useEffect(() => {
    // Check on mount
    checkNewListings();

    // Check every 5 minutes
    const interval = setInterval(checkNewListings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkNewListings]);

  return null;
};

export default PushNotificationManager;
