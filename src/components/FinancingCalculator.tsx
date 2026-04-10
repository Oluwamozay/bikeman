import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface FinancingCalculatorProps {
  bikePrice: number;
  bikeName: string;
}

const tenureOptions = [6, 12, 18, 24, 36];
const INTEREST_RATE = 18; // annual %

const FinancingCalculator = ({ bikePrice, bikeName }: FinancingCalculatorProps) => {
  const [open, setOpen] = useState(false);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [tenure, setTenure] = useState(12);

  const result = useMemo(() => {
    const downPayment = (bikePrice * downPaymentPct) / 100;
    const loanAmount = bikePrice - downPayment;
    const monthlyRate = INTEREST_RATE / 100 / 12;
    const monthly =
      monthlyRate > 0
        ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure))
        : loanAmount / tenure;
    const totalPaid = monthly * tenure + downPayment;
    const totalInterest = totalPaid - bikePrice;
    return {
      downPayment,
      loanAmount,
      monthly: Math.round(monthly),
      totalPaid: Math.round(totalPaid),
      totalInterest: Math.round(totalInterest),
    };
  }, [bikePrice, downPaymentPct, tenure]);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mb-8 rounded-2xl glass border border-border/40 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Calculator className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold">Financing Calculator</h3>
            <p className="text-[10px] text-muted-foreground">Estimate your monthly payments</p>
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
          {/* Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-muted-foreground">Down Payment</span>
              <span className="text-[11px] font-bold text-primary">
                {downPaymentPct}% — {fmt(result.downPayment)}
              </span>
            </div>
            <Slider
              min={0}
              max={80}
              step={5}
              value={[downPaymentPct]}
              onValueChange={(v) => setDownPaymentPct(v[0])}
            />
          </div>

          {/* Tenure */}
          <div>
            <span className="text-[11px] font-bold text-muted-foreground mb-2 block">
              Loan Tenure (months)
            </span>
            <div className="flex gap-2">
              {tenureOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTenure(t)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 ${
                    tenure === t
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "glass border border-border/40 text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 space-y-2.5">
            <div className="text-center mb-3">
              <p className="text-[10px] text-muted-foreground font-medium">Monthly Payment</p>
              <p className="text-2xl font-bold text-primary">{fmt(result.monthly)}</p>
              <p className="text-[10px] text-muted-foreground">per month for {tenure} months</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[9px] text-muted-foreground">Loan Amount</p>
                <p className="text-[11px] font-bold">{fmt(result.loanAmount)}</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground">Total Interest</p>
                <p className="text-[11px] font-bold">{fmt(result.totalInterest)}</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground">Total Paid</p>
                <p className="text-[11px] font-bold">{fmt(result.totalPaid)}</p>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-muted-foreground text-center">
            *Estimates based on {INTEREST_RATE}% annual interest rate. Actual terms may vary.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FinancingCalculator;
