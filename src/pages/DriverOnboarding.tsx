import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/components/driver-onboarding/OnboardingLayout";
import { PersonalInfoStep } from "@/components/driver-onboarding/PersonalInfoStep";
import { VehicleInfoStep } from "@/components/driver-onboarding/VehicleInfoStep";
import { DocumentUploadStep } from "@/components/driver-onboarding/DocumentUploadStep";
import { ReviewStep } from "@/components/driver-onboarding/ReviewStep";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const TOTAL_STEPS = 4;

type DocStatus = "empty" | "uploading" | "uploaded";
interface DocFile {
  file: File | null;
  preview: string | null;
  status: DocStatus;
}
interface DocsState {
  driversLicense: DocFile;
  vehicleRegistration: DocFile;
  insurance: DocFile;
  profilePhoto: DocFile;
}

const emptyDoc: DocFile = { file: null, preview: null, status: "empty" };

const stepTitles = [
  { title: "Tell us about yourself", subtitle: "We need your basic details to get started" },
  { title: "Your vehicle details", subtitle: "What will you be riding with?" },
  { title: "Upload your documents", subtitle: "We need these for verification" },
  { title: "Review & Submit", subtitle: "Make sure everything looks correct" },
];

const DriverOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [vehicleInfo, setVehicleInfo] = useState({
    vehicleType: "",
    vehicleModel: "",
    vehiclePlate: "",
    vehicleColor: "",
    vehicleYear: "",
  });

  const [documents, setDocuments] = useState<DocsState>({
    driversLicense: { ...emptyDoc },
    vehicleRegistration: { ...emptyDoc },
    insurance: { ...emptyDoc },
    profilePhoto: { ...emptyDoc },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please sign in first", variant: "destructive" });
        navigate("/");
        return;
      }

      // Upload documents to storage
      const uploadPromises = Object.entries(documents)
        .filter(([_, doc]) => doc.file)
        .map(async ([key, doc]) => {
          const ext = doc.file!.name.split(".").pop();
          const path = `${user.id}/${key}.${ext}`;
          const { error } = await supabase.storage
            .from("driver-documents")
            .upload(path, doc.file!, { upsert: true });
          if (error) console.error(`Upload error for ${key}:`, error);
          return { key, path };
        });

      await Promise.all(uploadPromises);

      // Register as driver
      const { error } = await supabase.from("drivers").insert({
        user_id: user.id,
        full_name: personalInfo.fullName,
        phone_number: personalInfo.phone,
        vehicle_model: vehicleInfo.vehicleModel,
        vehicle_plate: vehicleInfo.vehiclePlate,
        vehicle_color: vehicleInfo.vehicleColor || null,
      });

      if (error) throw error;

      toast({ title: "🎉 Application submitted!", description: "We'll review your documents shortly." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentsUploaded = Object.values(documents).filter(
    (d) => d.status === "uploaded"
  ).length;

  return (
    <OnboardingLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      title={stepTitles[step].title}
      subtitle={stepTitles[step].subtitle}
      onBack={() => setStep((s) => s - 1)}
      showBack={step > 0}
    >
      {step === 0 && (
        <PersonalInfoStep
          data={personalInfo}
          onChange={setPersonalInfo}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <VehicleInfoStep
          data={vehicleInfo}
          onChange={setVehicleInfo}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <DocumentUploadStep
          data={documents}
          onChange={setDocuments}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ReviewStep
          personalInfo={personalInfo}
          vehicleInfo={vehicleInfo}
          documentsUploaded={documentsUploaded}
          onSubmit={handleSubmit}
          onBack={() => setStep(2)}
          isSubmitting={isSubmitting}
        />
      )}
    </OnboardingLayout>
  );
};

export default DriverOnboarding;
