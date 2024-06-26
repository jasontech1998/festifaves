"use server";

import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import { cache } from "react";

export type ArtistResult = {
  name: string;
  id: string;
  genres?: string[];
  profileUrl: string;
  imageUrl: string;
};

type SpotifyArtist = {
  id: string;
  name: string;
  genres?: string[];
  external_urls: {
    spotify: string;
  };
  images: Array<{ url: string; height: number; width: number }>;
};

function findBestMatch(searchName: string, artists: SpotifyArtist[]): ArtistResult | null {
  const searchNameLower = searchName.toLowerCase();
  
  const exactMatch = artists.find(artist => artist.name.toLowerCase() === searchNameLower);
  if (exactMatch) {
    return transformArtist(exactMatch);
  }

  const partialMatch = artists.find(artist => 
    artist.name.toLowerCase().includes(searchNameLower) || 
    searchNameLower.includes(artist.name.toLowerCase())
  );
  if (partialMatch) {
    return transformArtist(partialMatch);
  }

  if (artists.length > 0) {
    return transformArtist(artists[0]);
  }

  return null;
}

function transformArtist(artist: SpotifyArtist): ArtistResult {
  return {
    name: artist.name,
    id: artist.id,
    genres: artist.genres,
    profileUrl: artist.external_urls.spotify,
    imageUrl: artist.images[0]?.url || '' // Use the first image if available, or an empty string
  };
}

export const GetArtists = cache(async (artists: string[]): Promise<ArtistResult[]> => {
  noStore();
  const session = await auth();

  if (!session?.token) {
    throw new Error("No valid Spotify session found");
  }

  const results = await Promise.all(
    artists.map(async (artistName) => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            artistName
          )}&type=artist&limit=3`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.artists.items.length > 0) {
          return findBestMatch(artistName, data.artists.items);
        } else {
          console.warn(`No Spotify artist found for: ${artistName}`);
          return null;
        }
      } catch (error) {
        console.error(`Error searching for artist ${artistName}:`, error);
        return null;
      }
    })
  );

  return results.filter((result): result is ArtistResult => result !== null);
});