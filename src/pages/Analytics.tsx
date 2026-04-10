import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, BarChart3, Eye, MousePointerClick, MessageCircle, ShoppingCart,
  TrendingUp, Calendar,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import SEOHead from "@/components/SEOHead";

interface AnalyticsSummary {
  bike_id: string;
  bike_title: string;
  views: number;
  clicks: number;
  inquiries: number;
  purchases: number;
}

const COLORS = [
  "hsl(270, 100%, 72%)",
  "hsl(330, 90%, 65%)",
  "hsl(200, 90%, 55%)",
  "hsl(150, 70%, 50%)",
];

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");

  useEffect(() => {
    if (!user) return;
    const fetchAnalytics = async () => {
      setLoading(true);
      
      // Get user's bikes
      const { data: bikes } = await supabase
        .from("bikes")
        .select("id, title")
        .eq("user_id", user.id);
      
      if (!bikes || bikes.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      const bikeIds = bikes.map((b) => b.id);
      
      let query = supabase
        .from("listing_analytics")
        .select("bike_id, event_type")
        .in("bike_id", bikeIds);

      if (period === "7d") {
        query = query.gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
      } else if (period === "30d") {
        query = query.gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString());
      }

      const { data: events } = await query;

      const summaryMap: Record<string, AnalyticsSummary> = {};
      bikes.forEach((b) => {
        summaryMap[b.id] = {
          bike_id: b.id,
          bike_title: b.title,
          views: 0,
          clicks: 0,
          inquiries: 0,
          purchases: 0,
        };
      });

      events?.forEach((e) => {
        const s = summaryMap[e.bike_id];
        if (!s) return;
        if (e.event_type === "view") s.views++;
        else if (e.event_type === "click") s.clicks++;
        else if (e.event_type === "inquiry") s.inquiries++;
        else if (e.event_type === "purchase") s.purchases++;
      });

      setData(Object.values(summaryMap).sort((a, b) => b.views - a.views));
      setLoading(false);
    };

    fetchAnalytics();
  }, [user, period]);

  const totals = data.reduce(
    (acc, d) => ({
      views: acc.views + d.views,
      clicks: acc.clicks + d.clicks,
      inquiries: acc.inquiries + d.inquiries,
      purchases: acc.purchases + d.purchases,
    }),
    { views: 0, clicks: 0, inquiries: 0, purchases: 0 }
  );

  const conversionRate = totals.views > 0 ? ((totals.inquiries + totals.purchases) / totals.views * 100).toFixed(1) : "0";

  const pieData = [
    { name: "Views", value: totals.views },
    { name: "Clicks", value: totals.clicks },
    { name: "Inquiries", value: totals.inquiries },
    { name: "Purchases", value: totals.purchases },
  ].filter((d) => d.value > 0);

  const statCards = [
    { label: "Total Views", value: totals.views, icon: Eye, color: "text-primary" },
    { label: "Clicks", value: totals.clicks, icon: MousePointerClick, color: "text-accent" },
    { label: "Inquiries", value: totals.inquiries, icon: MessageCircle, color: "text-blue-500" },
    { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "text-green-500" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Sign in Required</h2>
          <p className="text-sm text-muted-foreground mb-4">Analytics are available for your listings</p>
          <Button onClick={() => navigate("/auth")} className="gradient-primary text-primary-foreground">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHead title="Listing Analytics — Ocada Connect" description="Track views, clicks, and conversions for your bike listings" />

      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-card shadow-card">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-primary" /> Analytics
          </h1>
          <p className="text-[10px] text-muted-foreground">Track your listing performance</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-5">
        {/* Period selector */}
        <div className="flex gap-2 mb-5">
          {(["7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                period === p
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "glass border border-border/40 text-muted-foreground"
              }`}
            >
              <Calendar className="h-3 w-3" />
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl glass border border-border/40 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                    <span className="text-[10px] text-muted-foreground font-medium">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Bar Chart */}
            {data.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl glass border border-border/40 p-4 mb-6"
              >
                <h3 className="text-sm font-bold mb-4">Views by Listing</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.slice(0, 5)}>
                    <XAxis
                      dataKey="bike_title"
                      tick={{ fontSize: 9 }}
                      tickFormatter={(v) => v.length > 12 ? v.slice(0, 12) + "…" : v}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="clicks" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Pie Chart */}
            {pieData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl glass border border-border/40 p-4 mb-6"
              >
                <h3 className="text-sm font-bold mb-4">Event Breakdown</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] text-muted-foreground">{d.name}: {d.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Per-listing breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold">Per Listing</h3>
              {data.map((d, i) => (
                <motion.div
                  key={d.bike_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className="rounded-xl glass border border-border/40 p-3"
                >
                  <h4 className="text-xs font-bold mb-2 truncate">{d.bike_title}</h4>
                  <div className="flex gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3 w-3" /> {d.views}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MousePointerClick className="h-3 w-3" /> {d.clicks}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MessageCircle className="h-3 w-3" /> {d.inquiries}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <ShoppingCart className="h-3 w-3" /> {d.purchases}
                    </span>
                  </div>
                </motion.div>
              ))}
              {data.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-bold mb-1">No data yet</p>
                  <p className="text-xs text-muted-foreground">Create bike listings to start tracking analytics</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
