"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login";
import { ArtistResult, GetArtists } from "@/lib/actions";
import Image from "next/image";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const router = useRouter();

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

  return (
    <div className=" p-8">
      <header className="mb-12 flex justify-between items-center">
        <h1 className="text-3xl font-bold">FestiFaves</h1>
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className=" hover:text-purple-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </header>

      <main>
        <h2 className="text-2xl font-bold mb-6">Artists Found</h2>
        <p className="text-xl mb-12">
          Here are the artists we found in your festival lineup:
        </p>

        <Login />

        {isLoading && <p>Loading artists...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !error && (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artists.map((artist, index) => (
                <a
                  key={artist.id + index}
                  href={artist.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 relative mb-2">
                    <Image
                      src={artist.imageUrl}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 100px, 200px"
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
          </div>
        )}
      </main>
    </div>
  );
}
