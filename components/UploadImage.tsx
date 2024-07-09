"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import UploadButton from "./UploadButton";
import Image from "next/image";

const UploadImage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearLocalStorageExceptImage = () => {
    const imageUrl = localStorage.getItem("festifaves_image_url");
    localStorage.clear();
    if (imageUrl) {
      localStorage.setItem("festifaves_image_url", imageUrl);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      clearLocalStorageExceptImage();
      setFileName(file.name);
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    try {
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
      setImageUrl(s3Url);
      localStorage.setItem("festifaves_image_url", s3Url);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessImage = async () => {
    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    try {
      clearLocalStorageExceptImage();
      const openAiResponse = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      if (!openAiResponse.ok) {
        throw new Error("Failed to process image with OpenAI");
      }

      const openAiData = await openAiResponse.json();
      const parsedOpenAiData = JSON.parse(openAiData.message.content);

      localStorage.setItem(
        "festifaves_artists",
        JSON.stringify(parsedOpenAiData.artists)
      );

      localStorage.setItem(
        "festifaves_festival_name",
        parsedOpenAiData.festival_name &&
          parsedOpenAiData.festival_name !== "Undefined"
          ? parsedOpenAiData.festival_name
          : "Festival"
      );

      router.push("/artists");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (imageUrl) {
      handleProcessImage();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <section className="flex flex-col items-center justify-center p-4">
      <p className="leading-7 my-6 text-center">
        Upload a png or jpeg of your festival lineup to generate a list of
        artists!
      </p>
      {imageUrl && (
        <div className="mb-4 flex justify-center relative w-full max-w-md">
          <Image
            src={imageUrl}
            alt="Uploaded festival lineup"
            width={256}
            height={256}
            objectFit="contain"
          />
        </div>
      )}
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
        isFileSelected={!!imageUrl}
        text={imageUrl ? "Process Image" : "Select Image"}
      />
      {fileName && (
        <p className="text-center text-gray-600 mt-4">
          Selected file: {fileName}
        </p>
      )}
    </section>
  );
};

export default UploadImage;
