
CREATE TABLE public.listing_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bike_id UUID NOT NULL,
  user_id UUID,
  event_type TEXT NOT NULL DEFAULT 'view',
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_listing_analytics_bike_id ON public.listing_analytics(bike_id);
CREATE INDEX idx_listing_analytics_event_type ON public.listing_analytics(event_type);
CREATE INDEX idx_listing_analytics_created_at ON public.listing_analytics(created_at);

ALTER TABLE public.listing_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can log analytics events
CREATE POLICY "Anyone can create analytics events"
ON public.listing_analytics
FOR INSERT
WITH CHECK (true);

-- Listing owners can view analytics for their bikes
CREATE POLICY "Owners can view their listing analytics"
ON public.listing_analytics
FOR SELECT
USING (
  bike_id IN (
    SELECT id FROM public.bikes WHERE user_id = auth.uid()
  )
);
