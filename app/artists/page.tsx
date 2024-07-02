"use client";

import React, { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [festivalName, setFestivalName] = useState<string | null>(null);

  useEffect(() => {
    async function loadArtists() {
      const storedArtists = localStorage.getItem("festifaves_artists");
      const storedImageUrl = localStorage.getItem("festifaves_image_url");
      const storedFestivalName = localStorage.getItem(
        "festifaves_festival_name"
      );

      console.log(storedFestivalName);

      if (storedImageUrl) {
        setImageUrl(storedImageUrl);
      }

      if (storedFestivalName) {
        setFestivalName(storedFestivalName);
      }

      if (storedArtists) {
        try {
          const parsedArtists = JSON.parse(storedArtists) as string[];
          const fetchedArtists = await GetArtists(parsedArtists);
          console.log("Fetched Artists: ", fetchedArtists);
          setArtists(fetchedArtists);

          // Check if any artists weren't found
          const notFoundArtists = parsedArtists.filter(
            (artist) =>
              !fetchedArtists.some(
                (fetchedArtist) =>
                  fetchedArtist.name.toLowerCase() === artist.toLowerCase()
              )
          );
          if (notFoundArtists.length > 0) {
            console.warn("Some artists were not found:", notFoundArtists);
            // You could set these in state and display them to the user if you want
          }
        } catch (error) {
          console.error("Error fetching artists:", error);
          setError("Failed to fetch artists. Please try again.");
        }
      } else {
        setError(
          "No artist data found. Please upload a festival lineup image."
        );
      }
      setIsLoading(false);
    }

    loadArtists();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Artists Found for {festivalName || "Your Festival"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {isLoading ? (
            <p>Loading artists...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : artists.length > 0 ? (
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
                        fill
                        sizes="(max-width: 600px) 100vw, 50vw"
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
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                className="rounded-lg"
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>
                Generate {festivalName || "Festival"} Playlist
              </CardTitle>
              <CardDescription>
                Create a customized playlist of all your favorite artists from{" "}
                {festivalName || "the festival"}
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
