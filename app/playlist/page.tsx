"use client";

import React, { useEffect, useState } from "react";
import {
  SavedTrack,
  GetProfile,
  CreatePlaylistLink,
  ArtistResult,
} from "@/lib/actions";
import { ExternalLink, Music } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const PlaylistPage: React.FC = () => {
  const [playlist, setPlaylist] = useState<SavedTrack[]>([]);
  const [festivalName, setFestivalName] = useState<string | null>(null);
  const [artistsImage, setArtistsImage] = useState<ArtistResult[]>([]);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedArtists = localStorage.getItem("festifaves_artists");
    const storedPlaylist = localStorage.getItem("festifaves_playlist");
    const storedFestivalName = localStorage.getItem("festifaves_festival_name");

    if (storedArtists) {
      const artists = JSON.parse(storedArtists);
      setArtistsImage(artists.slice(0, 8));
    }

    if (storedPlaylist) {
      setPlaylist(JSON.parse(storedPlaylist));
    }
    if (storedFestivalName) {
      setFestivalName(storedFestivalName);
    }
  }, []);

  const handleCreatePlaylist = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Get user's Spotify user ID from GetProfile function
      const userProfile = await GetProfile();

      if (!userProfile.id) {
        throw new Error("Failed to get user ID");
      }

      // Extract all the IDs from the playlist and store in an array
      const trackUris = playlist.map((track) => `spotify:track:${track.id}`);

      const playlistName = `My ${festivalName} Playlist`;
      const newPlaylistUrl = await CreatePlaylistLink(
        playlistName,
        trackUris,
        userProfile.id
      );

      if (!newPlaylistUrl) {
        throw new Error("Failed to create playlist");
      }

      // Show the link of playlist that it returns
      setPlaylistUrl(newPlaylistUrl);
    } catch (err) {
      console.error("Error creating playlist:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Your Customized&nbsp;
        <span className="underline">{festivalName}</span> Playlist
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[650px]">
        <div>
          {playlist.length > 0 ? (
            <ScrollArea className="h-[650px] w-full rounded-md border p-4">
              <ul className="space-y-4">
                {playlist.map((track, index) => (
                  <li
                    key={index}
                    className="flex items-center p-2 bg-accent rounded-lg"
                  >
                    <Music className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                    <div>
                      <h2 className="font-semibold">{track.name}</h2>
                      <p className="text-sm text-gray-600">
                        {track.artistName}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-gray-600">
              No tracks found in your playlist. Try generating a new playlist!
            </p>
          )}
        </div>
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {artistsImage.map((artist) => (
              <div
                className="w-[150px] h-[150px] flex items-center justify-center bg-gray-100"
                key={artist.id}
              >
                <Image
                  src={artist.imageUrl}
                  alt="Artist Image"
                  width={150}
                  height={150}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle>Create {festivalName} Playlist</CardTitle>
              <CardDescription>
                Turn your festival favorites into a Spotify playlist
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>
                Ready to take your festival vibes with you? Create a Spotify
                playlist with all these amazing tracks!
              </p>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardContent>
            <CardFooter>
              {playlistUrl ? (
                <div className="flex flex-col w-full items-center text-center">
                  <p className="text-sm font-medium text-green-600 mb-2">
                    Playlist created successfully!
                  </p>
                  <Button
                    className="w-48"
                    variant="outline"
                    onClick={() => window.open(playlistUrl, "_blank")}
                  >
                    Open in Spotify
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={isCreating || playlist.length === 0}
                >
                  {isCreating ? "Creating..." : "Create Playlist"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
