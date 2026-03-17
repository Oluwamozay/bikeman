import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, FileText, X, Shield, Camera } from "lucide-react";

interface DocumentFile {
  file: File | null;
  preview: string | null;
  status: "empty" | "uploading" | "uploaded";
}

interface DocumentsData {
  driversLicense: DocumentFile;
  vehicleRegistration: DocumentFile;
  insurance: DocumentFile;
  profilePhoto: DocumentFile;
}

interface DocumentUploadStepProps {
  data: DocumentsData;
  onChange: (data: DocumentsData) => void;
  onNext: () => void;
  onBack: () => void;
}

const documentTypes = [
  {
    key: "driversLicense" as keyof DocumentsData,
    label: "Driver's License",
    desc: "Valid government-issued license",
    icon: FileText,
    required: true,
  },
  {
    key: "vehicleRegistration" as keyof DocumentsData,
    label: "Vehicle Registration",
    desc: "Certificate of registration",
    icon: Shield,
    required: true,
  },
  {
    key: "insurance" as keyof DocumentsData,
    label: "Insurance Certificate",
    desc: "Valid vehicle insurance",
    icon: Shield,
    required: false,
  },
  {
    key: "profilePhoto" as keyof DocumentsData,
    label: "Profile Photo",
    desc: "Clear face photo for verification",
    icon: Camera,
    required: true,
  },
];

const DocumentCard = ({
  doc,
  docData,
  index,
  onUpload,
  onRemove,
}: {
  doc: (typeof documentTypes)[0];
  docData: DocumentFile;
  index: number;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const Icon = doc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.08 }}
      className={`relative rounded-xl border overflow-hidden transition-all ${
        docData.status === "uploaded"
          ? "border-secondary/40 bg-secondary/5"
          : "border-border/50 bg-card shadow-card"
      }`}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />

      {docData.status === "uploaded" && docData.preview ? (
        <div className="relative">
          <div className="h-28 bg-muted overflow-hidden">
            <img
              src={docData.preview}
              alt={doc.label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2 right-2">
            <button
              onClick={onRemove}
              className="w-7 h-7 rounded-lg bg-card/90 backdrop-blur flex items-center justify-center shadow-card"
            >
              <X className="h-3.5 w-3.5 text-destructive" />
            </button>
          </div>
          <div className="px-3 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-secondary" />
            <span className="text-xs font-medium">{doc.label}</span>
            {doc.required && (
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-secondary">
                ✓ Done
              </span>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full p-4 flex items-center gap-3.5 text-left hover:bg-muted/30 transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">{doc.label}</span>
              {doc.required && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                  Required
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{doc.desc}</span>
          </div>
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-glow">
            <Upload className="h-4 w-4 text-primary-foreground" />
          </div>
        </button>
      )}
    </motion.div>
  );
};

export const DocumentUploadStep = ({
  data,
  onChange,
  onNext,
  onBack,
}: DocumentUploadStepProps) => {
  const requiredDocs = documentTypes.filter((d) => d.required);
  const allRequiredUploaded = requiredDocs.every(
    (d) => data[d.key].status === "uploaded"
  );

  const handleUpload = (key: keyof DocumentsData, file: File) => {
    const preview = URL.createObjectURL(file);
    onChange({
      ...data,
      [key]: { file, preview, status: "uploaded" as const },
    });
  };

  const handleRemove = (key: keyof DocumentsData) => {
    if (data[key].preview) URL.revokeObjectURL(data[key].preview!);
    onChange({
      ...data,
      [key]: { file: null, preview: null, status: "empty" as const },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-3 flex-1">
        {/* Upload counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="flex -space-x-1">
            {documentTypes.map((d, i) => (
              <div
                key={d.key}
                className={`w-5 h-5 rounded-full border-2 border-background flex items-center justify-center text-[8px] ${
                  data[d.key].status === "uploaded"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {data[d.key].status === "uploaded" ? "✓" : i + 1}
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {Object.values(data).filter((d) => d.status === "uploaded").length} of{" "}
            {documentTypes.length} uploaded
          </span>
        </motion.div>

        {documentTypes.map((doc, i) => (
          <DocumentCard
            key={doc.key}
            doc={doc}
            docData={data[doc.key]}
            index={i}
            onUpload={(file) => handleUpload(doc.key, file)}
            onRemove={() => handleRemove(doc.key)}
          />
        ))}
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
          className="h-13 rounded-xl flex-1 border-border/50"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!allRequiredUploaded}
          className="h-13 rounded-xl flex-[2] text-base font-semibold gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity disabled:opacity-40 disabled:shadow-none"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};
