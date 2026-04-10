import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Check, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (!user) return;
    const channel = supabase
      .channel("user-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    setNotifications((p) => p.map((n) => ({ ...n, is_read: true })));
  };

  const remove = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((p) => p.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="text-center space-y-3">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Sign in to view notifications</p>
          <Button onClick={() => navigate("/auth")} className="gradient-primary text-primary-foreground rounded-xl">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Notifications</h1>
            {unreadCount > 0 && <p className="text-xs text-muted-foreground">{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs text-primary">
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  if (!n.is_read) markRead(n.id);
                  if (n.link) navigate(n.link);
                }}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  n.is_read ? "bg-card/30 border-border/20" : "bg-card border-primary/20 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.is_read ? "bg-muted" : "bg-primary"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{n.title}</p>
                    {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                    className="text-muted-foreground/40 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
