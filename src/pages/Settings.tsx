import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  User, Bell, Shield, Palette, Globe, HelpCircle, LogOut,
  ChevronRight, Moon, Sun, Smartphone, Lock, Eye, EyeOff,
  Volume2, VolumeX, MapPin, CreditCard, FileText, Info,
  ArrowLeft, Settings2, Mail, Phone, Camera, Trash2, Download, Loader2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

type SettingsSection = "main" | "profile" | "notifications" | "privacy" | "appearance" | "language" | "help" | "account";

const sectionDelay = (i: number) => ({ delay: 0.08 + i * 0.04 });

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [section, setSection] = useState<SettingsSection>("main");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Notification toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [rideAlerts, setRideAlerts] = useState(true);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Privacy
  const [profileVisible, setProfileVisible] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Appearance
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("theme") !== "light";
  });
  const [fontSize, setFontSize] = useState("medium");

  // Language
  const [language, setLanguage] = useState("en");

  // Dialogs
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);

  // Load profile and settings from DB
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      try {
        const [profileRes, settingsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
          supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
        ]);

        if (profileRes.data) {
          const p = profileRes.data as any;
          setDisplayName(p.display_name || "");
          setPhone(p.phone || "");
          setBio(p.bio || "");
          setAvatarUrl(p.avatar_url || "");
        }

        if (settingsRes.data) {
          const s = settingsRes.data as any;
          setPushEnabled(s.push_enabled ?? true);
          setEmailNotifs(s.email_notifs ?? true);
          setSmsNotifs(s.sms_notifs ?? false);
          setRideAlerts(s.ride_alerts ?? true);
          setTradeAlerts(s.trade_alerts ?? true);
          setPromoAlerts(s.promo_alerts ?? false);
          setSoundEnabled(s.sound_enabled ?? true);
          setProfileVisible(s.profile_visible ?? true);
          setLocationSharing(s.location_sharing ?? true);
          setShowOnlineStatus(s.show_online_status ?? true);
          setTwoFactor(s.two_factor ?? false);
          setDarkMode(s.dark_mode ?? true);
          setFontSize(s.font_size || "medium");
          setLanguage(s.language || "en");
        }
      } catch {
        // Tables may not exist yet
      }
      setLoading(false);
    };
    load();
  }, [user]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Save settings helper
  const saveSettings = async (partial: Record<string, any>) => {
    if (!user) return;
    try {
      const { data } = await supabase.from("user_settings").select("id").eq("user_id", user.id).maybeSingle();
      if (data) {
        await supabase.from("user_settings").update({ ...partial, updated_at: new Date().toISOString() } as any).eq("user_id", user.id);
      } else {
        await supabase.from("user_settings").insert({ user_id: user.id, ...partial } as any);
      }
    } catch { /* tables may not exist */ }
  };

  // Auto-save toggles
  const toggle = (setter: (v: boolean) => void, key: string) => (val: boolean) => {
    setter(val);
    saveSettings({ [key]: val });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const newUrl = urlData.publicUrl + "?t=" + Date.now();
    setAvatarUrl(newUrl);

    await supabase.from("profiles").update({ avatar_url: newUrl, updated_at: new Date().toISOString() } as any).eq("user_id", user.id);
    setUploading(false);
    toast.success("Profile photo updated!");
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
      const payload = { display_name: displayName, phone, bio, updated_at: new Date().toISOString() };
      if (data) {
        await supabase.from("profiles").update(payload as any).eq("user_id", user.id);
      } else {
        await supabase.from("profiles").insert({ user_id: user.id, ...payload } as any);
      }
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
    setSaving(false);
  };

  const handleDeleteAccount = () => {
    setDeleteDialog(false);
    toast.error("Account deletion requested. You'll receive an email confirmation.");
  };

  const handleLogout = async () => {
    setLogoutDialog(false);
    await signOut();
    navigate("/auth");
  };

  const handleExportData = () => {
    toast.success("Your data export has been started. You'll receive an email when it's ready.");
  };

  const menuItems = [
    { key: "profile" as const, icon: User, label: "Profile", desc: "Name, photo, contact info" },
    { key: "notifications" as const, icon: Bell, label: "Notifications", desc: "Push, email, SMS alerts" },
    { key: "privacy" as const, icon: Shield, label: "Privacy & Security", desc: "Visibility, 2FA, data" },
    { key: "appearance" as const, icon: Palette, label: "Appearance", desc: "Theme, font size" },
    { key: "language" as const, icon: Globe, label: "Language", desc: "App language preference" },
    { key: "account" as const, icon: Settings2, label: "Account", desc: "Export data, delete account" },
    { key: "help" as const, icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact, about" },
  ];

  const SectionHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="flex items-center gap-3 mb-6">
      <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
        <ArrowLeft className="h-4 w-4" />
      </motion.button>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );

  const ToggleRow = ({ icon: Icon, label, desc, checked, onCheckedChange }: {
    icon: any; label: string; desc: string; checked: boolean; onCheckedChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-[11px] text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const renderSection = () => {
    switch (section) {
      case "profile":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionHeader title="Profile" onBack={() => setSection("main")} />

            {/* Avatar with upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-primary/30" />
                ) : (
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-glow disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 text-primary-foreground animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5 text-primary-foreground" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{user?.email || "Not signed in"}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-xs font-semibold">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="glass border-border/50 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
                <Input id="email" value={user?.email || ""} disabled className="glass border-border/50 rounded-xl opacity-60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" className="glass border-border/50 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-semibold">Bio</Label>
                <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio about yourself" className="glass border-border/50 rounded-xl" />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving} className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-bold shadow-glow">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Profile
              </Button>
            </div>
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionHeader title="Notifications" onBack={() => setSection("main")} />
            <div className="space-y-1">
              <ToggleRow icon={Smartphone} label="Push Notifications" desc="Get notified on your device" checked={pushEnabled} onCheckedChange={toggle(setPushEnabled, "push_enabled")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={Mail} label="Email Notifications" desc="Receive updates via email" checked={emailNotifs} onCheckedChange={toggle(setEmailNotifs, "email_notifs")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={Phone} label="SMS Notifications" desc="Get text message alerts" checked={smsNotifs} onCheckedChange={toggle(setSmsNotifs, "sms_notifs")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={MapPin} label="Ride Alerts" desc="Notifications for ride updates" checked={rideAlerts} onCheckedChange={toggle(setRideAlerts, "ride_alerts")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={CreditCard} label="Trade Alerts" desc="P2P trade notifications" checked={tradeAlerts} onCheckedChange={toggle(setTradeAlerts, "trade_alerts")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={Bell} label="Promotional" desc="Deals and offers" checked={promoAlerts} onCheckedChange={toggle(setPromoAlerts, "promo_alerts")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={soundEnabled ? Volume2 : VolumeX} label="Sound" desc="Play notification sounds" checked={soundEnabled} onCheckedChange={toggle(setSoundEnabled, "sound_enabled")} />
            </div>
          </motion.div>
        );

      case "privacy":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionHeader title="Privacy & Security" onBack={() => setSection("main")} />
            <div className="space-y-1">
              <ToggleRow icon={Eye} label="Profile Visibility" desc="Let others see your profile" checked={profileVisible} onCheckedChange={toggle(setProfileVisible, "profile_visible")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={MapPin} label="Location Sharing" desc="Share location during rides" checked={locationSharing} onCheckedChange={toggle(setLocationSharing, "location_sharing")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={showOnlineStatus ? Eye : EyeOff} label="Online Status" desc="Show when you're active" checked={showOnlineStatus} onCheckedChange={toggle(setShowOnlineStatus, "show_online_status")} />
              <Separator className="bg-border/30" />
              <ToggleRow icon={Lock} label="Two-Factor Auth" desc="Extra login security" checked={twoFactor} onCheckedChange={toggle(setTwoFactor, "two_factor")} />
            </div>

            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full h-11 rounded-xl glass border-border/50 text-sm font-semibold">
                <Lock className="h-4 w-4 mr-2" /> Change Password
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-xl glass border-border/50 text-sm font-semibold">
                <FileText className="h-4 w-4 mr-2" /> Privacy Policy
              </Button>
            </div>
          </motion.div>
        );

      case "appearance":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionHeader title="Appearance" onBack={() => setSection("main")} />

            <div className="space-y-5">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    {darkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Dark Mode</p>
                    <p className="text-[11px] text-muted-foreground">Use dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={(v) => { setDarkMode(v); saveSettings({ dark_mode: v }); }} />
              </div>
              <Separator className="bg-border/30" />

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Font Size</Label>
                <Select value={fontSize} onValueChange={(v) => { setFontSize(v); saveSettings({ font_size: v }); }}>
                  <SelectTrigger className="glass border-border/50 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-2xl glass border border-border/50 p-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Preview</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary" />
                  <div className="w-8 h-8 rounded-lg bg-secondary" />
                  <div className="w-8 h-8 rounded-lg bg-accent" />
                  <div className="w-8 h-8 rounded-lg bg-muted" />
                  <div className="w-8 h-8 rounded-lg bg-background border border-border" />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "language":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionHeader title="Language" onBack={() => setSection("main")} />
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Select Language</Label>
              <Select value={language} onValueChange={(v) => { setLanguage(v); saveSettings({ language: v }); toast.success("Language updated"); }}>
                <SelectTrigger className="glass border-border/50 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  <SelectItem value="yo">🇳🇬 Yorùbá</SelectItem>
                  <SelectItem value="ig">🇳🇬 Igbo</SelectItem>
                  <SelectItem value="ha">🇳🇬 Hausa</SelectItem>
                  <SelectItem value="pcm">🇳🇬 Pidgin</SelectItem>
                  <SelectItem value="fr">🇫🇷 French</SelectItem>
                  <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      case "account":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionHeader title="Account" onBack={() => setSection("main")} />
            <div className="space-y-3">
              <Button variant="outline" onClick={handleExportData} className="w-full h-12 rounded-xl glass border-border/50 text-sm font-semibold justify-start">
                <Download className="h-4 w-4 mr-3 text-primary" /> Export My Data
              </Button>
              <Button variant="outline" onClick={() => setLogoutDialog(true)} className="w-full h-12 rounded-xl glass border-border/50 text-sm font-semibold justify-start">
                <LogOut className="h-4 w-4 mr-3 text-primary" /> Sign Out
              </Button>
              <Button variant="outline" onClick={() => setDeleteDialog(true)} className="w-full h-12 rounded-xl glass border-destructive/30 text-destructive text-sm font-semibold justify-start hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 mr-3" /> Delete Account
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[11px] text-muted-foreground">App Version 1.0.0</p>
              <p className="text-[10px] text-muted-foreground mt-1">© 2026 Ocada Connect</p>
            </div>
          </motion.div>
        );

      case "help":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionHeader title="Help & Support" onBack={() => setSection("main")} />
            <div className="space-y-3">
              {[
                { icon: HelpCircle, label: "FAQ", desc: "Frequently asked questions" },
                { icon: Mail, label: "Contact Support", desc: "Email our support team" },
                { icon: FileText, label: "Terms of Service", desc: "Read our terms" },
                { icon: Shield, label: "Privacy Policy", desc: "Data protection info" },
                { icon: Info, label: "About Ocada", desc: "Learn more about us" },
              ].map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={sectionDelay(i)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl glass border border-border/30 hover:glow-ring transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-6">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
                <ArrowLeft className="h-4 w-4" />
              </motion.button>
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl glass border border-border/50 p-4 flex items-center gap-3 mb-6">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-primary/30" />
              ) : (
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{displayName || user?.email || "Guest"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email || "Not signed in"}</p>
              </div>
              <button onClick={() => setSection("profile")} className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ChevronRight className="h-4 w-4 text-primary" />
              </button>
            </motion.div>

            <div className="space-y-2">
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={sectionDelay(i)}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSection(item.key)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl glass border border-border/30 hover:glow-ring transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6">
              <Button variant="outline" onClick={() => setLogoutDialog(true)} className="w-full h-12 rounded-xl glass border-border/50 text-sm font-semibold">
                <LogOut className="h-4 w-4 mr-2 text-primary" /> Sign Out
              </Button>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-6 pb-24 min-h-screen">
        {renderSection()}
      </div>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="glass border-border/50 rounded-2xl max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>This action is permanent. All your data will be erased and cannot be recovered.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog(false)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} className="rounded-xl">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutDialog} onOpenChange={setLogoutDialog}>
        <DialogContent className="glass border-border/50 rounded-2xl max-w-[340px]">
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>Are you sure you want to sign out of your account?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLogoutDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleLogout} className="rounded-xl gradient-primary text-primary-foreground">Sign Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
