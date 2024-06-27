"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useSession } from "next-auth/react";

const UploadFestivalButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      alert("Please select a file first.");
      return;
    }
  
    const file = fileInputRef.current.files[0];
    setIsLoading(true);
  
    try {
      // Get a pre-signed URL from your server
      const urlResponse = await fetch('/api/get_upload_url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type })
      });
  
      if (!urlResponse.ok) {
        throw new Error('Failed to get upload URL');
      }
  
      const { url, fields } = await urlResponse.json();
  
      // Upload directly to S3 using the signed URL
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);
  
      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }
  
      console.log('File uploaded successfully');
      // Handle successful upload (e.g., show success message, navigate to next page)
  
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">Hi, {session?.user?.name}</h2>
      <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Upload Festival Lineup
      </h3>
      <p className="mb-6 text-center text-gray-600">
        Upload an image of your festival lineup to generate a list of artists!
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mb-4"
      >
        <Upload className="mr-2 h-5 w-5" />
        Select Image
      </button>
      {fileName && <p className="text-center text-gray-600 mb-4">Selected file: {fileName}</p>}
      <button
        onClick={handleUpload}
        disabled={isLoading || !fileName}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Upload className="mr-2 h-5 w-5" />
        {isLoading ? "Uploading..." : "Upload and Process"}
      </button>
    </div>
  );
};

export default UploadFestivalButton;