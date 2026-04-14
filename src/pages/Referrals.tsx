import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReferralSystem from "@/components/ReferralSystem";

const Referrals = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-5 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold">Referrals</h1>
        </div>
        <ReferralSystem />
      </div>
    </div>
  );
};

export default Referrals;
