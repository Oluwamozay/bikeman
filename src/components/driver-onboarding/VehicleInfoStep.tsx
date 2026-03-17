import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Bike, Palette, Hash, Calendar } from "lucide-react";

interface VehicleInfoData {
  vehicleType: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  vehicleYear: string;
}

interface VehicleInfoStepProps {
  data: VehicleInfoData;
  onChange: (data: VehicleInfoData) => void;
  onNext: () => void;
  onBack: () => void;
}

const vehicleTypes = [
  { value: "motorcycle", label: "🏍️ Motorcycle (Okada)", desc: "Two-wheeler" },
  { value: "tricycle", label: "🛺 Tricycle (Keke)", desc: "Three-wheeler" },
  { value: "car", label: "🚗 Car", desc: "Sedan / SUV" },
  { value: "bus", label: "🚐 Mini Bus", desc: "Commercial bus" },
];

export const VehicleInfoStep = ({ data, onChange, onNext, onBack }: VehicleInfoStepProps) => {
  const isValid = data.vehicleType && data.vehicleModel && data.vehiclePlate;

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1">
        {/* Vehicle type selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-2"
        >
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Vehicle Type
          </Label>
          <div className="grid grid-cols-2 gap-2.5">
            {vehicleTypes.map((type, i) => (
              <motion.button
                key={type.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => onChange({ ...data, vehicleType: type.value })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  data.vehicleType === type.value
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border/50 bg-card shadow-card hover:border-primary/30"
                }`}
              >
                <span className="text-lg block mb-1">{type.label.split(" ")[0]}</span>
                <span className="text-xs font-semibold block">{type.label.split(" ").slice(1).join(" ")}</span>
                <span className="text-[10px] text-muted-foreground">{type.desc}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Vehicle Model
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
              <Bike className="h-4 w-4" />
            </div>
            <Input
              className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-card focus:shadow-glow focus:border-primary/30"
              placeholder="e.g. TVS Apache, Toyota Corolla"
              value={data.vehicleModel}
              onChange={(e) => onChange({ ...data, vehicleModel: e.target.value })}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Plate Number
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                <Hash className="h-4 w-4" />
              </div>
              <Input
                className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-card focus:shadow-glow focus:border-primary/30 uppercase"
                placeholder="ABC 123 XY"
                value={data.vehiclePlate}
                onChange={(e) => onChange({ ...data, vehiclePlate: e.target.value.toUpperCase() })}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Color
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                <Palette className="h-4 w-4" />
              </div>
              <Input
                className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-card focus:shadow-glow focus:border-primary/30"
                placeholder="Black"
                value={data.vehicleColor}
                onChange={(e) => onChange({ ...data, vehicleColor: e.target.value })}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-2"
        >
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Year of Manufacture
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
              <Calendar className="h-4 w-4" />
            </div>
            <Input
              className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-card focus:shadow-glow focus:border-primary/30"
              placeholder="2022"
              type="number"
              value={data.vehicleYear}
              onChange={(e) => onChange({ ...data, vehicleYear: e.target.value })}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-6 pb-2 flex gap-3"
      >
        <Button
          variant="outline"
          onClick={onBack}
          className="h-13 rounded-xl flex-1 border-border/50"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="h-13 rounded-xl flex-[2] text-base font-semibold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity disabled:opacity-40 disabled:shadow-none"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};
