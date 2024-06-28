"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArtistResult, GetArtists } from "@/lib/actions";
import Image from "next/image";
import GenerateSongsButton from "@/components/GenerateSongsButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchArtists = useCallback(async () => {
    if (hasFetched) return; // Prevent multiple fetches

    const storedArtists = localStorage.getItem("festifaves_artists");
    const storedImageUrl = localStorage.getItem("festifaves_image_url");

    if (storedImageUrl) {
      setImageUrl(storedImageUrl);
    }

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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Artists Found
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {!isLoading && !error && artists.length > 0 ? (
            <ScrollArea className="h-dvh w-full rounded-md border p-4">
              <ul className="space-y-4">
                {artists.map((artist, index) => (
                  <li
                    key={artist.id + index}
                    className="flex items-center p-2 bg-accent rounded-lg"
                  >
                    <div className="w-12 h-12 relative mr-3 flex-shrink-0">
                      <Image
                        src={artist.imageUrl}
                        alt={artist.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold">{artist.name}</h2>
                      <p className="text-sm text-gray-600">
                        {artist.genres && artist.genres.length > 0
                          ? artist.genres[0]
                          : "No genre"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-gray-600">
              No artists found. Please upload a festival lineup image.
            </p>
          )}
        </div>
        <div className="space-y-6">
          {imageUrl && (
            <div className="relative w-full h-64 md:h-80 lg:h-96">
              <Image
                src={imageUrl}
                alt="Festival lineup"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Generate Festival Playlist</CardTitle>
              <CardDescription>
                Create a playlist based on your favorite festival artists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Ready to bring your festival experience to life? Generate a
                playlist featuring tracks from these amazing artists!
              </p>
            </CardContent>
            <CardFooter>
              <GenerateSongsButton artists={artists} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
