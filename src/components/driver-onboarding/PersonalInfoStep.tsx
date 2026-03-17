import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin } from "lucide-react";

interface PersonalInfoData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  onNext: () => void;
}

const InputField = ({
  icon: Icon,
  label,
  delay,
  ...props
}: {
  icon: React.ElementType;
  label: string;
  delay: number;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="space-y-2"
  >
    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {label}
    </Label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <Input
        className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-card focus:shadow-glow focus:border-primary/30 transition-all"
        {...props}
      />
    </div>
  </motion.div>
);

export const PersonalInfoStep = ({ data, onChange, onNext }: PersonalInfoStepProps) => {
  const isValid = data.fullName && data.phone;

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1">
        {/* Avatar upload */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-card shadow-card flex items-center justify-center border border-border/50">
              <span className="text-xs">📷</span>
            </div>
          </div>
        </motion.div>

        <InputField
          icon={User}
          label="Full Name"
          placeholder="e.g. Chinedu Okafor"
          delay={0.1}
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
        />

        <InputField
          icon={Phone}
          label="Phone Number"
          placeholder="+234 800 000 0000"
          type="tel"
          delay={0.15}
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
        />

        <InputField
          icon={Mail}
          label="Email Address"
          placeholder="driver@example.com"
          type="email"
          delay={0.2}
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
        />

        <InputField
          icon={MapPin}
          label="Residential Address"
          placeholder="123 Broad St, Lagos"
          delay={0.25}
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-6 pb-2"
      >
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="w-full h-13 rounded-xl text-base font-semibold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity disabled:opacity-40 disabled:shadow-none"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};
