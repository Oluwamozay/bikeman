import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type EventType = "view" | "click" | "inquiry" | "purchase";

export function useListingAnalytics() {
  const trackEvent = useCallback(async (bikeId: string, eventType: EventType, referrer?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("listing_analytics").insert({
        bike_id: bikeId,
        user_id: user?.id || null,
        event_type: eventType,
        referrer: referrer || document.referrer || null,
      });
    } catch (e) {
      // Silently fail — analytics shouldn't break UX
      console.warn("Analytics tracking failed:", e);
    }
  }, []);

  return { trackEvent };
}
