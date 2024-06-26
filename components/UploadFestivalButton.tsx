import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";

const UploadFestivalButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGeneratePlaylist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ask_ai", { method: "POST" });
      const data = await res.json();
      const parsedData = JSON.parse(data.message.content);

      localStorage.setItem(
        "festifaves_artists",
        JSON.stringify(parsedData.artists)
      );

      router.push("/artists");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h3 className="text-3xl font-semibold mb-4 text-center text-gray-800">
        Generate Artists
      </h3>
      <p className="mb-6 text-center text-gray-600">
        Click the button below to get all the artists in the festival lineup!
      </p>
      <button
        onClick={handleGeneratePlaylist}
        disabled={isLoading}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
      >
        <Music className="mr-2 h-5 w-5" />
        {isLoading ? "Generating..." : "Generate Artists"}
      </button>
    </div>
  );
};

export default UploadFestivalButton;
