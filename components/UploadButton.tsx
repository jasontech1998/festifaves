import React from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface UploadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  fileName: string | null;
  isFileSelected: boolean;
  text: string;
}

const buttonVariants = {
  idle: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  loadingHidden: { opacity: 0, scale: 0.8 },
  loading: { opacity: 1, scale: 1 },
};

const transition = { duration: 0.2 };

const UploadButton: React.FC<UploadButtonProps> = ({
  onClick,
  isLoading,
  fileName,
  isFileSelected,
  text,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-64 h-12 relative font-medium rounded-md overflow-hidden
                 bg-primary text-primary-foreground
                 hover:bg-primary/90
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                 disabled:pointer-events-none disabled:opacity-50"
    >
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.span
            key="idle"
            variants={buttonVariants}
            initial="idle"
            exit="exit"
            transition={transition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Upload className="mr-2 h-5 w-5" />
            {isFileSelected ? text : "Select Image"}
          </motion.span>
        )}
        {isLoading && (
          <motion.div
            key="loading"
            variants={buttonVariants}
            initial="loadingHidden"
            animate="loading"
            exit="loadingHidden"
            transition={transition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className="animate-spin h-5 w-5 text-primary-foreground mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default UploadButton;