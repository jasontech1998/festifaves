import React from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";

interface UploadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  fileName: string | null;
  isFileSelected: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onClick,
  isLoading,
  fileName,
  isFileSelected,
}) => {
  if (isFileSelected) {
    return (
      <Button
        onClick={onClick}
        disabled={isLoading || !fileName}
        className="w-48 mb-4"
      >
        <Upload className="mr-2 h-5 w-5" />
        {isLoading ? "Uploading..." : "Upload and Process"}
      </Button>
    );
  }

  return (
    <Button onClick={onClick} className="w-48 mb-4">
      <Upload className="mr-2 h-5 w-5" />
      Select Image
    </Button>
  );
};

export default UploadButton;