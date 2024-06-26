"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArtistResult, GetArtists } from "@/lib/actions";
import Image from "next/image";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchArtists = useCallback(async () => {
    if (hasFetched) return; // Prevent multiple fetches

    const storedArtists = localStorage.getItem("festifaves_artists");

    if (storedArtists) {
      setIsLoading(true);
      try {
        const parsedArtists = JSON.parse(storedArtists) as string[];
        console.log("Parsed Artists: ", parsedArtists);

        if (parsedArtists.length > 0) {
          const allArtists = await GetArtists(parsedArtists);
          console.log("All Artists: ", allArtists);
          setArtists(allArtists);
          setHasFetched(true);
        } else {
          setError("No artists found in storage");
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
        setError("Failed to fetch artists. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasFetched]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const handleCreatePlaylist = () => {
    console.log(artists);
    // Implement playlist creation logic here
    console.log("Creating playlist...");
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 lg:p-8 gap-8">
      <div className="w-full order-2 lg:order-1 lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4 lg:mb-6">Artists Found</h2>
        <p className="text-lg lg:text-xl mb-6 lg:mb-12">
          Here are the artists we found in your festival lineup:
        </p>

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {artists.map((artist, index) => (
              <a
                key={artist.id + index}
                href={artist.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-100 hover:text-gray-600 transition duration-300 ease-in-out"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 relative mb-2">
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                    className="rounded-full"
                  />
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-center truncate w-full">
                  {artist.name}
                </h2>
                <p className="text-xs text-gray-600 text-center truncate w-full">
                  {artist.genres && artist.genres.length > 0
                    ? artist.genres[0]
                    : "No genre"}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="w-full order-1 lg:order-2 lg:w-1/3">
        <div className="bg-white p-6 rounded-lg shadow-md text-black">
          <h2 className="text-2xl font-bold mb-4">Generate Playlist</h2>
          <p className="mb-6">
            Click the button below to create a playlist with your liked songs from these artists!
          </p>
          <button
            onClick={handleCreatePlaylist}
            className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-600 transition duration-300"
          >
            Create Festival Playlist
          </button>
        </div>
      </div>
    </div>
  );
}