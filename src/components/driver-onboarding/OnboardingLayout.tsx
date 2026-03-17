import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  onBack?: () => void;
  showBack?: boolean;
}

const stepLabels = ["Personal", "Vehicle", "Documents", "Review"];

export const OnboardingLayout = ({
  children,
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
  showBack = true,
}: OnboardingLayoutProps) => {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {showBack && step > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-9 w-9 rounded-xl bg-card shadow-card"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                {stepLabels.map((label, i) => (
                  <span
                    key={label}
                    className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${
                      i <= step ? "text-primary" : "text-muted-foreground/50"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <Progress value={progress} className="h-1.5 bg-muted" />
            </div>
          </div>

          <motion.div
            key={title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
