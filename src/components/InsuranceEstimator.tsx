import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

interface InsuranceEstimatorProps {
  bikePrice: number;
  bikeName: string;
}

const coverageOptions = [
  { key: "third-party", label: "Third Party", rate: 0.03, desc: "Basic legal coverage" },
  { key: "comprehensive", label: "Comprehensive", rate: 0.065, desc: "Full damage & theft" },
  { key: "premium", label: "Premium+", rate: 0.09, desc: "All-risk with extras" },
] as const;

const InsuranceEstimator = ({ bikePrice, bikeName }: InsuranceEstimatorProps) => {
  const [open, setOpen] = useState(false);
  const [coverage, setCoverage] = useState<string>("comprehensive");

  const result = useMemo(() => {
    const opt = coverageOptions.find((c) => c.key === coverage)!;
    const annual = Math.round(bikePrice * opt.rate);
    const monthly = Math.round(annual / 12);
    return { annual, monthly, desc: opt.desc };
  }, [bikePrice, coverage]);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8 rounded-2xl glass border border-border/40 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
            <Shield className="h-4 w-4 text-accent" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold">Insurance Estimate</h3>
            <p className="text-[10px] text-muted-foreground">Protect your ride</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-4 pb-4 space-y-5"
        >
          {/* Coverage Options */}
          <div>
            <span className="text-[11px] font-bold text-muted-foreground mb-2 block">
              Coverage Type
            </span>
            <div className="space-y-2">
              {coverageOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setCoverage(opt.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 ${
                    coverage === opt.key
                      ? "bg-accent/15 border border-accent/30"
                      : "glass border border-border/40"
                  }`}
                >
                  <div>
                    <p className={`text-[12px] font-bold ${coverage === opt.key ? "text-accent" : ""}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground">
                    {(opt.rate * 100).toFixed(1)}%
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl bg-accent/10 border border-accent/20 p-4 space-y-2.5">
            <div className="text-center mb-3">
              <p className="text-[10px] text-muted-foreground font-medium">Estimated Annual Premium</p>
              <p className="text-2xl font-bold text-accent">{fmt(result.annual)}</p>
              <p className="text-[10px] text-muted-foreground">
                ~{fmt(result.monthly)}/month • {result.desc}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-[9px] text-muted-foreground">Bike Value</p>
                <p className="text-[11px] font-bold">{fmt(bikePrice)}</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground">Daily Cost</p>
                <p className="text-[11px] font-bold">{fmt(Math.round(result.annual / 365))}</p>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-muted-foreground text-center">
            *Estimates only. Actual premiums depend on rider profile and provider.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InsuranceEstimator;
