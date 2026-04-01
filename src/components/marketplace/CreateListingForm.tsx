import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { X, ImagePlus, Loader2, Camera } from "lucide-react";

interface CreateListingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateListingForm = ({ onClose, onSuccess }: CreateListingFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "used",
    brand: "",
    year: new Date().getFullYear().toString(),
    location: "",
    engine_capacity: "",
    mileage: "",
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of imageFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error } = await supabase.storage.from("bike-images").upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("bike-images").getPublicUrl(fileName);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to create a listing");
      return;
    }
    if (!form.title || !form.price || !form.brand || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages();
      }

      const { error } = await supabase.from("bike_listings").insert({
        user_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        condition: form.condition,
        brand: form.brand.trim(),
        year: form.year ? parseInt(form.year) : null,
        location: form.location.trim(),
        engine_capacity: form.engine_capacity.trim() || null,
        mileage: form.mileage.trim() || null,
        images: imageUrls,
      });

      if (error) throw error;
      toast.success("Listing created successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-2xl shadow-elevated max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card z-10 px-5 pt-5 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Post a Bike</h2>
              <p className="text-xs text-muted-foreground">List your bike on the marketplace</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Image Upload */}
          <div>
            <Label className="text-xs font-semibold mb-2 block">Photos (up to 5)</Label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border/50">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imageFiles.length < 5 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors shrink-0">
                  <Camera className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-[9px] text-muted-foreground">Add</span>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" multiple />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-xs font-semibold">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Honda CG 125 — Clean Title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 h-11 rounded-xl bg-background border-border/50"
              maxLength={100}
            />
          </div>

          {/* Price & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price" className="text-xs font-semibold">Price (₦) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="185,000"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="mt-1 h-11 rounded-xl bg-background border-border/50"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Condition *</Label>
              <Select value={form.condition} onValueChange={(v) => updateField("condition", v)}>
                <SelectTrigger className="mt-1 h-11 rounded-xl bg-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Brand & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="brand" className="text-xs font-semibold">Brand *</Label>
              <Input
                id="brand"
                placeholder="Honda"
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                className="mt-1 h-11 rounded-xl bg-background border-border/50"
                maxLength={50}
              />
            </div>
            <div>
              <Label htmlFor="year" className="text-xs font-semibold">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2023"
                value={form.year}
                onChange={(e) => updateField("year", e.target.value)}
                className="mt-1 h-11 rounded-xl bg-background border-border/50"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-xs font-semibold">Location *</Label>
            <Input
              id="location"
              placeholder="Lagos, Ikeja"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="mt-1 h-11 rounded-xl bg-background border-border/50"
              maxLength={100}
            />
          </div>

          {/* Engine & Mileage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="engine" className="text-xs font-semibold">Engine (cc)</Label>
              <Input
                id="engine"
                placeholder="125cc"
                value={form.engine_capacity}
                onChange={(e) => updateField("engine_capacity", e.target.value)}
                className="mt-1 h-11 rounded-xl bg-background border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="mileage" className="text-xs font-semibold">Mileage</Label>
              <Input
                id="mileage"
                placeholder="15,000 km"
                value={form.mileage}
                onChange={(e) => updateField("mileage", e.target.value)}
                className="mt-1 h-11 rounded-xl bg-background border-border/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="desc" className="text-xs font-semibold">Description</Label>
            <Textarea
              id="desc"
              placeholder="Tell buyers about your bike's condition, history, and features..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1 rounded-xl bg-background border-border/50 min-h-[80px]"
              maxLength={500}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Listing"
            )}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateListingForm;
