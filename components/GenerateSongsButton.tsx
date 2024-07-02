"use client";

import React, { useState } from "react";
import { ArtistResult, CreatePlaylist } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface GenerateSongsButtonProps {
  artists: ArtistResult[];
}

const buttonVariants = {
  idle: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  loadingHidden: { opacity: 0, scale: 0.8 },
  loading: { opacity: 1, scale: 1 },
  submittedHidden: { opacity: 0, y: 10 },
  submitted: { opacity: 1, y: 0 },
};

const transition = { duration: 0.2 };

const GenerateSongsButton: React.FC<GenerateSongsButtonProps> = ({
  artists,
}) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "submitted"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGeneratePlaylist = async () => {
    setButtonState("loading");
    setError(null);
    try {
      const savedTracks = await CreatePlaylist(artists);
      console.log("Saved tracks:", savedTracks);

      // Store the savedTracks in local storage
      localStorage.setItem("festifaves_playlist", JSON.stringify(savedTracks));

      setButtonState("submitted");

      // Navigate to the playlist page after a short delay
      setTimeout(() => {
        router.push("/playlist");
      }, 1000);
    } catch (error) {
      console.error("Error creating playlist:", error);
      setError("Failed to create playlist. Please try again.");
      setButtonState("idle");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleGeneratePlaylist}
        disabled={buttonState !== "idle"}
        className="w-64 h-12 relative font-medium rounded-md overflow-hidden
                   bg-primary text-primary-foreground
                   hover:bg-primary/90
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                   disabled:pointer-events-none disabled:opacity-50"
      >
        <AnimatePresence mode="wait">
          {buttonState === "idle" && (
            <motion.span
              key="generate"
              variants={buttonVariants}
              initial="idle"
              exit="exit"
              transition={transition}
              className="absolute inset-0 flex items-center justify-center"
            >
              Generate Festival Playlist
            </motion.span>
          )}
          {buttonState === "loading" && (
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
                className="animate-spin h-5 w-5 text-primary-foreground"
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
              Generating...
            </motion.div>
          )}
          {buttonState === "submitted" && (
            <motion.span
              key="submitted"
              variants={buttonVariants}
              initial="submittedHidden"
              animate="submitted"
              transition={transition}
              className="absolute inset-0 flex items-center justify-center"
            >
              Playlist Generated!
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default GenerateSongsButton;
