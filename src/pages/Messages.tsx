import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  bike_id: string | null;
}

interface Conversation {
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePartner, setActivePartner] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();

    const channel = supabase
      .channel("user-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          if (activePartner && (msg.sender_id === activePartner || msg.receiver_id === activePartner)) {
            setMessages((p) => [...p, msg]);
          }
          loadConversations();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activePartner]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!data) { setLoading(false); return; }

    const map = new Map<string, { msgs: Message[] }>();
    data.forEach((m: Message) => {
      const partner = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!map.has(partner)) map.set(partner, { msgs: [] });
      map.get(partner)!.msgs.push(m);
    });

    const convs: Conversation[] = [];
    for (const [partnerId, { msgs }] of map) {
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", partnerId).single();
      convs.push({
        partnerId,
        partnerName: profile?.full_name || "User",
        lastMessage: msgs[0].content,
        lastTime: msgs[0].created_at,
        unread: msgs.filter((m) => m.receiver_id === user.id && !m.is_read).length,
      });
    }
    setConversations(convs);
    setLoading(false);
  };

  const openChat = async (partnerId: string) => {
    if (!user) return;
    setActivePartner(partnerId);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    setMessages(data || []);

    // mark as read
    await supabase.from("messages").update({ is_read: true }).eq("sender_id", partnerId).eq("receiver_id", user.id);
  };

  const sendMessage = async () => {
    if (!input.trim() || !user || !activePartner) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: activePartner,
      content: input.trim(),
    });
    setInput("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="text-center space-y-3">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Sign in to view your messages</p>
          <Button onClick={() => navigate("/auth")} className="gradient-primary text-primary-foreground rounded-xl">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <button
            onClick={() => activePartner ? setActivePartner(null) : navigate(-1)}
            className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold">{activePartner ? conversations.find((c) => c.partnerId === activePartner)?.partnerName : "Messages"}</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : activePartner ? (
          /* Chat View */
          <div className="flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
            <ScrollArea className="flex-1 p-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex mb-3 ${m.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    m.sender_id === user.id
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary/60 rounded-bl-md"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </ScrollArea>
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="p-3 border-t border-border/30 flex gap-2"
            >
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 h-10 rounded-xl bg-secondary/50 border-border/30" />
              <Button type="submit" size="icon" disabled={!input.trim()} className="h-10 w-10 rounded-xl gradient-primary">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        ) : (
          /* Conversation List */
          <div className="p-4 space-y-2">
            {conversations.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-sm">No messages yet</p>
            ) : conversations.map((c) => (
              <motion.button
                key={c.partnerId}
                whileTap={{ scale: 0.98 }}
                onClick={() => openChat(c.partnerId)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30 hover:bg-card transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
                  {c.partnerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">{c.partnerName}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(c.lastTime).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full gradient-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                    {c.unread}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
