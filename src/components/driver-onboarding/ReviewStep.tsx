import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Bike,
  Hash,
  Palette,
  Calendar,
  FileText,
  Shield,
  Camera,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ReviewStepProps {
  personalInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  vehicleInfo: {
    vehicleType: string;
    vehicleModel: string;
    vehiclePlate: string;
    vehicleColor: string;
    vehicleYear: string;
  };
  documentsUploaded: number;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const vehicleTypeLabels: Record<string, string> = {
  motorcycle: "🏍️ Motorcycle (Okada)",
  tricycle: "🛺 Tricycle (Keke)",
  car: "🚗 Car",
  bus: "🚐 Mini Bus",
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center gap-3 py-2"
  >
    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium truncate">{value || "—"}</p>
    </div>
  </motion.div>
);

export const ReviewStep = ({
  personalInfo,
  vehicleInfo,
  documentsUploaded,
  onSubmit,
  onBack,
  isSubmitting,
}: ReviewStepProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1">
        {/* Success badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-3"
        >
          <div className="w-16 h-16 rounded-2xl gradient-secondary mx-auto flex items-center justify-center shadow-elevated mb-3">
            <Sparkles className="h-7 w-7 text-secondary-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Everything looks good! Review and submit.</p>
        </motion.div>

        {/* Personal Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/50 bg-card shadow-card p-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Personal Details
          </h3>
          <InfoRow icon={User} label="Full Name" value={personalInfo.fullName} delay={0.15} />
          <InfoRow icon={Phone} label="Phone" value={personalInfo.phone} delay={0.2} />
          {personalInfo.email && (
            <InfoRow icon={Mail} label="Email" value={personalInfo.email} delay={0.25} />
          )}
          {personalInfo.address && (
            <InfoRow icon={MapPin} label="Address" value={personalInfo.address} delay={0.3} />
          )}
        </motion.div>

        {/* Vehicle Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border/50 bg-card shadow-card p-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
            Vehicle Details
          </h3>
          <InfoRow
            icon={Bike}
            label="Type"
            value={vehicleTypeLabels[vehicleInfo.vehicleType] || vehicleInfo.vehicleType}
            delay={0.3}
          />
          <InfoRow icon={Bike} label="Model" value={vehicleInfo.vehicleModel} delay={0.35} />
          <InfoRow icon={Hash} label="Plate" value={vehicleInfo.vehiclePlate} delay={0.4} />
          {vehicleInfo.vehicleColor && (
            <InfoRow icon={Palette} label="Color" value={vehicleInfo.vehicleColor} delay={0.45} />
          )}
          {vehicleInfo.vehicleYear && (
            <InfoRow icon={Calendar} label="Year" value={vehicleInfo.vehicleYear} delay={0.5} />
          )}
        </motion.div>

        {/* Documents Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-border/50 bg-card shadow-card p-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent-foreground mb-2">
            Documents
          </h3>
          <div className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-sm font-medium">{documentsUploaded} documents uploaded</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-6 pb-2 flex gap-3"
      >
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-13 rounded-xl flex-1 border-border/50"
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-13 rounded-xl flex-[2] text-base font-semibold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
          ) : (
            "Submit Application"
          )}
        </Button>
      </motion.div>
    </div>
  );
};
