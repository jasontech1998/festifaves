"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UploadButton from "./UploadButton";

const UploadImage: React.FC = () => {
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
      const urlResponse = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: file.name, contentType: file.type }),
        }
      );

      if (!urlResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { url, fields, s3Url } = await urlResponse.json();

      // Upload directly to S3 using the signed URL
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      console.log("File uploaded successfully");

      // Handle successful upload
      console.log("image url:", s3Url);
      // use that to call openai POST and insert as image_url

      const openAiResponse = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: s3Url }),
      });

      if (!openAiResponse.ok) {
        throw new Error("Failed to process image with OpenAI");
      }

      const openAiData = await openAiResponse.json();

      const parsedOpenAiData = JSON.parse(openAiData.message.content);
      console.log("OpenAI response:", parsedOpenAiData);

      // Store the artists data in localStorage
      localStorage.setItem(
        "festifaves_artists",
        JSON.stringify(parsedOpenAiData.artists)
      );

      // Navigate to the artists page
      router.push("/artists");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (fileName) {
      handleUpload();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <section>
      <p className="leading-7 my-6">
        Upload a png or jpeg of your festival lineup to generate a list of
        artists!
      </p>
      <div className="flex flex-col justify-center items-center p-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg"
          className="hidden"
        />
        <UploadButton
          onClick={handleButtonClick}
          isLoading={isLoading}
          fileName={fileName}
          isFileSelected={!!fileName}
        />
        {fileName && (
          <p className="text-center text-gray-600 mb-4">
            Selected file: {fileName}
          </p>
        )}
      </div>
    </section>
  );
};

export default UploadImage;