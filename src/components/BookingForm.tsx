import { useState } from "react";
import { Calendar, Clock, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface BookingFormProps {
  bikeId: string;
  bikeName: string;
}

const BookingForm = ({ bikeId, bikeName }: BookingFormProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"test_ride" | "reservation">("test_ride");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!user) {
      toast({ title: "Sign in required", variant: "destructive" });
      return;
    }
    if (!date) {
      toast({ title: "Please select a date", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("bookings").insert({
      bike_id: bikeId,
      user_id: user.id,
      booking_type: type,
      scheduled_date: new Date(date).toISOString(),
      notes: notes.trim() || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
      toast({ title: type === "test_ride" ? "Test ride scheduled!" : "Bike reserved!" });
      setTimeout(() => { setSuccess(false); setOpen(false); setDate(""); setNotes(""); }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full h-11 rounded-2xl text-xs font-bold border-border/50 glass"
      >
        <Calendar className="h-4 w-4 mr-2 text-primary" />
        Book Test Ride / Reserve
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl bg-card/50 border border-border/30 space-y-3">
              {success ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center py-4 gap-2">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                  <p className="text-sm font-semibold">Booking confirmed!</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex gap-2">
                    {(["test_ride", "reservation"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                          type === t ? "gradient-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground"
                        }`}
                      >
                        {t === "test_ride" ? "🏍️ Test Ride" : "🔒 Reserve"}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-9 h-10 rounded-xl bg-card/50 border-border/30 text-sm"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests..."
                    className="min-h-[50px] text-xs bg-card/50 border-border/30 rounded-xl"
                  />
                  <Button onClick={submit} disabled={loading} className="w-full h-10 rounded-xl gradient-primary text-primary-foreground text-xs font-bold">
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm Booking"}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingForm;
