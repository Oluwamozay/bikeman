import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface PriceHistoryChartProps {
  bikeId: string;
  currentPrice: number;
}

const PriceHistoryChart = ({ bikeId, currentPrice }: PriceHistoryChartProps) => {
  const [history, setHistory] = useState<{ date: string; price: number }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("price_history")
        .select("price, recorded_at")
        .eq("bike_id", bikeId)
        .order("recorded_at", { ascending: true });

      if (data && data.length > 0) {
        setHistory(data.map((d) => ({
          date: new Date(d.recorded_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
          price: Number(d.price),
        })));
      } else {
        // Generate mock history for demo
        const now = Date.now();
        const mockData = Array.from({ length: 6 }, (_, i) => ({
          date: new Date(now - (5 - i) * 30 * 86400000).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
          price: Math.round(currentPrice * (0.9 + Math.random() * 0.2)),
        }));
        mockData.push({ date: "Now", price: currentPrice });
        setHistory(mockData);
      }
    };
    fetch();
  }, [bikeId, currentPrice]);

  if (history.length < 2) return null;

  const first = history[0].price;
  const last = history[history.length - 1].price;
  const change = ((last - first) / first) * 100;
  const isUp = change > 0;

  return (
    <div className="rounded-xl bg-card/50 border border-border/30 p-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">Price History</h3>
        <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? "text-red-500" : "text-green-500"}`}>
          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={history}>
          <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis hide domain={["dataMin - 20000", "dataMax + 20000"]} />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
            formatter={(v: number) => [`₦${v.toLocaleString()}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceHistoryChart;
